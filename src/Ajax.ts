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

export type AjaxFunction = (url: string, instruction: AjaxInstruction) => AjaxPromise;

export interface AjaxObject {
  data: Object;
}

export interface AjaxInstruction {
  data: Object;
  method: string;
  headers: Object;
  [prop: string]: any;
}

export interface AjaxData {
  [key: string]: any;
}

export interface AjaxHeaders {
  [name: string]: string;
}

export namespace Ajax {
  let ajax_function: AjaxFunction;

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
    return ajax_function(options.url, options);
  }

  // Set the http function used for requests
  // The function should accept one object with keys
  // method, url, params, headers
  // and return a promise-like object
  // with then and catch
  //
  // @note Like $http or jQuery.ajax
  // @param {Function} fn The function.
  // @param {string} type The function.
  export function setAjaxFunction(fn: Function, type?: string) {
    if (typeof type === 'undefined') {
      if ((typeof jQuery !== 'undefined') && (fn === jQuery.ajax))
        type = 'jquery';
      else if ((typeof fetch !== 'undefined') && (fn === fetch))
        type = 'fetch';
    }

    switch (type) {
      case 'jquery':
        ajax_function = function(url: string, instruction: AjaxInstruction) {
          let deferred = jQuery.Deferred();
          let ajax = fn(url, instruction);
          ajax.then((data: any, status: any, jqxhr: any) => deferred.resolve({data, status: jqxhr.statusCode().status, headers: jqxhr.getAllResponseHeaders()}));
          ajax.catch((data: any, status: any, jqxhr: any) => deferred.reject({data, status: jqxhr.statusCode().status, headers: jqxhr.getAllResponseHeaders()}));
          return deferred.promise();
        }
        break;
      case 'fetch':
        ajax_function = (url: string, instruction: AjaxInstruction) => {
          return new Promise(function(resolve, reject) {
            instruction['body'] = instruction.data;
            let http_promise = fn(url, instruction) as Promise<Response>;
            http_promise.then(function(response: Response) {
              if (response.headers.get('content-type') !== 'application/json') {
                resolve(response);
              } else {
                let json_promise = response.json();
                json_promise.then(function(json: string) {
                  response['data'] = json; // typescript ignores square brackets
                  resolve(response);
                });
                json_promise.catch(reject);
              }
            });
            http_promise.catch(reject);
          });
        }
        break;
      default:
        ajax_function = (url: string, instruction: AjaxInstruction) => fn(instruction);
    }
  }
}
