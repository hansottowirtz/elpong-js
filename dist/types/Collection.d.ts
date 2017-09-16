import { Scheme } from './Scheme';
import { Element, SelectorValue, PreElement } from './Element';
import { CollectionConfiguration } from './Configuration';
import { CollectionActionOptions } from './Helpers/Collection/Actions';
import { AjaxPromise } from './Ajax';
export interface ElementMap {
    [key: string]: Element;
}
export declare type CollectionActionFunction = (action_options?: CollectionActionOptions) => AjaxPromise;
export declare type GetOneCollectionActionFunction = (selector_value: SelectorValue, action_options?: CollectionActionOptions) => AjaxPromise;
export interface CollectionActions {
    [action_name: string]: CollectionActionFunction | GetOneCollectionActionFunction;
    getAll: CollectionActionFunction;
    getOne: GetOneCollectionActionFunction;
}
export interface CollectionArrayOptions {
    no_new?: boolean;
}
export interface CollectionFindByOptions extends CollectionArrayOptions {
    multiple?: boolean;
}
export interface FieldsKeyValueMap {
    [key: string]: any;
}
export declare class Collection {
    readonly _scheme: Scheme;
    readonly name: string;
    private readonly default_pre_element;
    readonly elements: ElementMap;
    readonly new_elements: Element[];
    readonly actions: CollectionActions;
    constructor(scheme: Scheme, name: string);
    scheme(): Scheme;
    load(ignore_empty: boolean): void;
    configuration(): CollectionConfiguration;
    array(options?: CollectionArrayOptions): Element[];
    find(selector_value: SelectorValue): Element | null;
    findBy(fields_key_value_map: FieldsKeyValueMap, find_options: CollectionFindByOptions): Element | Element[] | null;
    build(pre_element: PreElement): Element;
    buildOrMerge(pre_element: PreElement): Element;
}
