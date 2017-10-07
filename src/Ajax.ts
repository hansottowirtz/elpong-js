import { ElpongError } from './Errors';

// export interface AjaxPromise extends Promise<any> {
// }

export type AjaxPromiseThenOnResolveFunction = (response: AjaxResponse) => void;
export type AjaxPromiseThenFunction = (resolve_fn: AjaxPromiseThenOnResolveFunction) => any;

export interface AjaxPromise {
  then: Function;
} //Promise<any> //|JQueryPromise<{}>;

export interface AjaxResponse extends Response {
  data: any;
}

export type AjaxExternalFunction = Function | any;
export type AjaxFunction = (url: string, instruction: AjaxInstruction) => AjaxPromise;

export interface AjaxObject {
  data: {};
}

export interface AjaxInstruction {
  data: {};
  method: string;
  headers: {};
  [prop: string]: any;
}

export interface AjaxData {
  [key: string]: any;
}

export interface AjaxHeaders {
  [name: string]: string;
}

export namespace Ajax {
  let ajaxFunction: AjaxFunction;

  interface AjaxFunctionOptions {
    method: string;
    type: string;
    url: string;
    data: string;
    body: string;
    headers: AjaxHeaders;
    dataType: 'json';
    responseType: 'json';
  }

  export function executeRequest(url: string, method: string, data?: AjaxData, headers?: AjaxHeaders) {
    if (!headers) { headers = {}; }
    headers['Accept'] = headers['Content-Type'] = 'application/json';
    let options: AjaxFunctionOptions = {
      method: method,
      url: url,
      data: JSON.stringify(data === undefined ? {} : data),
      headers: headers,
      dataType: 'json',
      responseType: 'json'
    } as AjaxFunctionOptions;
    options.type = options.method;
    options.body = options.data;
    return ajaxFunction(options.url, options);
  }

  // Set the http function used for requests
  // The function should accept one object with keys
  // method, url, params, headers
  // and return a promise-like object
  // with then and catch
  //
  // @note Like $http or jQuery.ajax or http.request or fetch
  // @param {Function} fn The function.
  // @param {string} type The function.
  export function setAjaxFunction(fn: AjaxExternalFunction, type?: string) {
    if (typeof type === 'undefined') {
      if ((typeof jQuery !== 'undefined') && (fn === jQuery.ajax))
        type = 'jquery';
      else if ((typeof fetch !== 'undefined') && (fn === fetch))
        type = 'fetch';
    }

    switch (type) {
      case 'jquery':
        ajaxFunction = (url: string, instruction: AjaxInstruction) => {
          let deferred = jQuery.Deferred();
          let ajax = (<Function>fn)(url, instruction);
          ajax.then((data: any, status: any, jqxhr: any) => deferred.resolve({data, status: jqxhr.statusCode().status, headers: jqxhr.getAllResponseHeaders()}));
          ajax.catch((data: any, status: any, jqxhr: any) => deferred.reject({data, status: jqxhr.statusCode().status, headers: jqxhr.getAllResponseHeaders()}));
          return <AjaxPromise>deferred.promise();
        }
        break;
      case 'fetch':
        ajaxFunction = (url: string, instruction: AjaxInstruction) => {
          return new Promise((resolve, reject) => {
            // Request with GET/HEAD method cannot have body
            (instruction as any).body = (instruction.method === 'GET') ? undefined : instruction.data;
            let http_promise = (<Function>fn)(url, instruction) as Promise<Response>;
            http_promise.then((response: Response) => {
              if (response.status === 204) {
                resolve(response)
              } else {
                const contentType = response.headers.get('content-type');
                if (!contentType || contentType.indexOf('json') < 0) throw new ElpongError('ajahct');
                let json_promise = response.json();
                json_promise.then((json: string) => {
                  (response as any).data = json; // typescript ignores square brackets
                  resolve(response);
                });
                json_promise.catch(reject);
              }
            });
            http_promise.catch(reject);
          });
        }
        break;
      case 'angular2':
        ajaxFunction = (url: string, instruction: AjaxInstruction) => {
          return new Promise((resolve, reject) => {
            instruction.responseType = undefined;
            (<any>fn).request.bind(fn)(url, instruction).subscribe((response: any) => {
              if (response.status === 204) {
                resolve(response)
              } else {
                (response as any).data = response.json();
                const contentType = response.headers.get('content-type');
                if (!contentType || contentType.indexOf('json') < 0) throw new Error('ajahct');
                resolve(response);
              }
            });
          });
        }
        break;
      default:
        ajaxFunction = (url: string, instruction: AjaxInstruction) => (<Function>fn)(instruction);
    }
  }
}
