/// <reference types="jquery"/>
/// <reference types="angular"/>

import { ElpongError, ElpongErrorType } from './Errors';
import { isInteger } from './Util';

export type AjaxPromiseThenOnResolveFunction = (response: AjaxResponse) => void;
export type AjaxPromiseThenFunction = (resolveFn: AjaxPromiseThenOnResolveFunction) => any;

export type AjaxPromise = Promise<AjaxResponse>;

export interface AjaxResponse extends Response {
  data?: any;
}

export type AjaxExternalFunction = () => any | object;
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

export type AjaxData = any;

export interface AjaxHeaders {
  [name: string]: string;
}

export interface AjaxFunctionOptions {
  method: string;
  type: string;
  url: string;
  data: string;
  body: string;
  headers: AjaxHeaders;
  dataType: 'json';
  responseType: 'json';
}

export const enum AjaxAdapterType {
  AngularJS = 0,
  Fetch = 1,
  Angular = 2,
  JQuery = 3
}

export type AjaxAdapterTypeString = 'fetch' | 'angular' | 'angularjs' | 'jquery';

let ajaxFunction: AjaxFunction;

export function executeRequest(url: string, method: string, data?: AjaxData, headers?: AjaxHeaders) {
  if (!headers) { headers = {}; }
  headers.Accept = headers['Content-Type'] = 'application/json';
  const serializedData = JSON.stringify(data === undefined ? {} : data);
  const options: AjaxFunctionOptions = {
    body: serializedData,
    data: serializedData,
    dataType: 'json',
    headers,
    method,
    responseType: 'json',
    type: method,
    url
  };
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
export function setAjaxFunction(fn: AjaxExternalFunction, adapterType?: AjaxAdapterType | AjaxAdapterTypeString) {
  const type = convertAjaxAdapterTypeStringToType(adapterType);
  switch (type) {
    case AjaxAdapterType.JQuery:
      if ((window as any).jQuery) {
        ajaxFunction = (url: string, instruction: AjaxInstruction) => {
          const deferred = jQuery.Deferred();
          const ajax = (fn as (url: string, instruction: object) => any)(url, instruction);
          ajax.then((data: any, status: any, jqxhr: any) => deferred.resolve({data, status: jqxhr.statusCode().status, headers: jqxhr.getAllResponseHeaders()}));
          ajax.catch((data: any, status: any, jqxhr: any) => deferred.reject({data, status: jqxhr.statusCode().status, headers: jqxhr.getAllResponseHeaders()}));
          // Convert to Promise, as Typescript users are probably not using jQuery
          // and if so, they won't have a lot of trouble with the differences.
          return deferred.promise() as any as Promise<any>;
        };
      }
      break;
    case AjaxAdapterType.Fetch:
      ajaxFunction = (url: string, instruction: AjaxInstruction) => {
        return new Promise((resolve, reject) => {
          // Request with GET/HEAD method cannot have body
          (instruction as any).body = (instruction.method === 'GET') ? undefined : instruction.data;

          // TODO: check fn types
          const httpPromise = (fn as (url: string, instruction: object) => any)(url, instruction) as Promise<Response>;
          httpPromise.then((response: Response) => {
            if (response.status === 204) {
              resolve(response);
            } else {
              const contentType = response.headers.get('content-type');
              if (!contentType || contentType.indexOf('json') < 0) { throw new ElpongError(ElpongErrorType.AJXHCT); }
              const jsonPromise = response.json();
              jsonPromise.then((json: string) => {
                (response as any).data = json;
                resolve(response);
              });
              jsonPromise.catch(reject);
            }
          });
          httpPromise.catch(reject);
        });
      };
      break;
    case AjaxAdapterType.Angular:
      ajaxFunction = (url: string, instruction: AjaxInstruction) => {
        return new Promise<AjaxResponse>((resolve, reject) => {
          instruction.responseType = undefined;
          (fn as any).request.bind(fn)(url, instruction).subscribe((response: any) => {
            if (response.status === 204) {
              resolve(response);
            } else {
              const contentType = response.headers.get('content-type');
              if (!contentType || contentType.indexOf('json') < 0) { throw new ElpongError(ElpongErrorType.AJXHCT); }
              const json = response.json();
              (response as any).data = json;
              resolve(response);
            }
          }, (httpErrorResponse: any) => { reject(httpErrorResponse); });
        });
      };
      break;
    default:
      // Default is AngularJS behavior, a promise that resolves to a response
      // object with the payload in the data field.

      // TODO: check fn types
      ajaxFunction = (url: string, instruction: AjaxInstruction) => (fn as (instruction: object) => any)(instruction);
  }
}

export function convertAjaxAdapterTypeStringToType(type?: AjaxAdapterType | AjaxAdapterTypeString): AjaxAdapterType {
  if (isInteger(type) || !type) {
    return type || 0;
  } else {
    const i = ['angularjs', 'fetch', 'angular', 'jquery'].indexOf(type);
    return i > -1 ? i : 0;
  }
}
