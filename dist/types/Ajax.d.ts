export declare type AjaxPromiseThenOnResolveFunction = (response: AjaxResponse) => void;
export declare type AjaxPromiseThenFunction = (resolve_fn: AjaxPromiseThenOnResolveFunction) => any;
export interface AjaxPromise {
    then: Function;
}
export interface AjaxResponse extends Response {
    data: any;
}
export declare type AjaxExternalFunction = Function | any;
export declare type AjaxFunction = (url: string, instruction: AjaxInstruction) => AjaxPromise;
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
export declare namespace Ajax {
    function executeRequest(url: string, method: string, data?: AjaxData, headers?: AjaxHeaders): AjaxPromise;
    function setAjaxFunction(fn: AjaxExternalFunction, type?: string): void;
}
