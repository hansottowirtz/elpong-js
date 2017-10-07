import { Scheme } from './Scheme';
import { Collection } from './Collection';
import { SchemeConfiguration } from './Configuration';
import { AjaxExternalFunction } from './Ajax';
import { Element } from './Element';
export declare namespace Elpong {
    function add(scheme_config: SchemeConfiguration | Object): Scheme;
    function get(name: string): Scheme;
    function load(ignore_empty: boolean): void;
    function setAjax(fn: AjaxExternalFunction, type?: string): void;
    function enableAutoload(): void;
    function isAutoload(): boolean;
    function tearDown(): void;
}
export { Scheme, Element, Collection };
