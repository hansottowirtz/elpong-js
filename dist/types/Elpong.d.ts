import { Scheme } from './Scheme';
import { SchemeConfiguration } from './Configuration';
import { AjaxExternalFunction } from './Ajax';
export declare namespace Elpong {
    function add(scheme_config: SchemeConfiguration | Object): Scheme;
    function get(name: string): Scheme;
    function load(ignore_empty: boolean): void;
    function setAjax(fn: AjaxExternalFunction, type?: string): void;
    function enableAutoload(): void;
    function isAutoload(): boolean;
    function tearDown(): void;
}
