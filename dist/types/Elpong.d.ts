import { Scheme } from './Scheme';
import { SchemeConfiguration } from './Configuration';
export declare namespace Elpong {
    function add(scheme_config: SchemeConfiguration | Object): Scheme;
    function get(name: string): Scheme;
    function load(ignore_empty: boolean): void;
    function setAjax(fn: Function): void;
    function enableAutoload(): void;
    function isAutoload(): boolean;
    function tearDown(): void;
}
