declare module 'elpong/Errors' {
	export class ElpongError extends Error {
	    constructor(message: string, argument?: string);
	}

}
declare module 'elpong/Ajax' {
	export type AjaxPromiseThenOnResolveFunction = (response: AjaxResponse) => void;
	export type AjaxPromiseThenFunction = (resolve_fn: AjaxPromiseThenOnResolveFunction) => any;
	export interface AjaxPromise {
	    then: Function;
	}
	export interface AjaxResponse extends Response {
	    data: any;
	}
	export type AjaxExternalFunction = Function | any;
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
	    function executeRequest(url: string, method: string, data?: AjaxData, headers?: AjaxHeaders): AjaxPromise;
	    function setAjaxFunction(fn: AjaxExternalFunction, type?: string): void;
	}

}
declare module 'elpong/Configuration' {
	export class SchemeConfiguration {
	    readonly name: string;
	    readonly singular: string;
	    readonly selector: string;
	    readonly collections: CollectionConfigurationMap;
	    constructor(preconf: any);
	}
	export interface CollectionConfigurationMap {
	    [name: string]: CollectionConfiguration;
	}
	export interface CollectionConfiguration {
	    readonly singular: string;
	    readonly fields: FieldConfigurationMap;
	    readonly relations: RelationConfigurationMaps;
	    readonly actions: ActionConfigurationMap;
	    readonly collection_actions: CollectionActionConfigurationMap;
	}
	export interface FieldConfigurationMap {
	    readonly [name: string]: FieldConfiguration;
	}
	export interface FieldConfiguration {
	    readonly reference: boolean;
	    readonly default: any;
	    readonly embedded_element: boolean;
	    readonly embedded_collection: boolean;
	    readonly no_send: boolean;
	}
	export interface EmbeddedElementFieldConfiguration extends FieldConfiguration {
	    readonly field: string;
	    readonly collection: string;
	}
	export interface EmbeddedCollectionFieldConfiguration extends FieldConfiguration {
	    readonly collection: string;
	}
	export interface RelationConfigurationMaps {
	    readonly has_many: HasManyRelationConfigurationMap;
	    readonly has_one: HasOneRelationConfigurationMap;
	    readonly belongs_to: BelongsToRelationConfigurationMap;
	}
	export interface HasManyRelationConfigurationMap {
	    readonly [name: string]: HasManyRelationConfiguration;
	}
	export interface HasOneRelationConfigurationMap {
	    readonly [name: string]: HasOneRelationConfiguration;
	}
	export interface BelongsToRelationConfigurationMap {
	    readonly [name: string]: BelongsToRelationConfiguration;
	}
	export interface RelationConfiguration {
	}
	export interface HasManyRelationConfiguration extends RelationConfiguration {
	    readonly field: string;
	    readonly collection: string;
	    readonly references_field: string;
	    readonly polymorphic: boolean;
	    readonly as: string;
	    readonly inline: boolean;
	    readonly inline_field: string;
	}
	export interface HasOneRelationConfiguration extends RelationConfiguration {
	    readonly field: string;
	    readonly collection: string;
	    readonly references_field: string;
	    readonly polymorphic: boolean;
	    readonly as: string;
	}
	export interface BelongsToRelationConfiguration extends RelationConfiguration {
	    readonly collection: string;
	    readonly polymorphic: boolean;
	    readonly field: string;
	    readonly collection_field: string;
	}
	export interface ActionConfigurationMap {
	    readonly [name: string]: ActionConfiguration;
	}
	export interface CollectionActionConfigurationMap {
	    readonly [name: string]: CollectionActionConfiguration;
	}
	export interface CollectionActionConfiguration {
	    readonly method: string;
	    readonly path: string;
	}
	export interface ActionConfiguration {
	    readonly method: string;
	    readonly returns_other: boolean;
	    readonly no_data: boolean;
	    readonly no_selector: boolean;
	    readonly path: string;
	}

}
declare module 'elpong/Interfaces' {
	export interface FutureString {
	    startsWith(searchString: string, position?: number): boolean;
	    endsWith(searchString: string, endPosition?: number): boolean;
	}
	export interface FutureArrayConstructor {
	    from<T>(arrayLike: ArrayLike<T>): Array<T>;
	}

}
declare module 'elpong/Util' {
	export const Util: {
	    capitalize: (string: string) => string;
	    camelize: (string: string) => string;
	    removeFromArray: (array: any[], element: any) => boolean;
	    isInteger: (value: any) => value is number;
	    isNumber: (value: any) => value is number;
	    isString: (value: any) => value is string;
	    isRegExp: (value: any) => value is RegExp;
	    forEach: (o: Object, fn: (v: any, k: string) => void) => void;
	    endsWith: (string: string, search: string) => boolean;
	    startsWith: (string: string, search: string) => boolean;
	    arrayFromHTML: (node_list: NodeListOf<HTMLElement>) => HTMLElement[];
	    values: (obj: Object) => any[];
	    includes: (a: any[], b: any) => boolean;
	    equalsJSON: (a: any, b: any) => boolean;
	    copyJSON: (o: any) => any;
	};

}
declare module 'elpong/Helpers/ElementHelper' {
	import { Element } from 'elpong/Element';
	export namespace ElementHelper {
	    function toData(element: Element, full_duplicate?: boolean): {};
	}

}
declare module 'elpong/Snapshot' {
	import { Element } from 'elpong/Element';
	export class Snapshot {
	    tag?: string;
	    time: number;
	    data: Object;
	    element: Element;
	    undone: boolean;
	    index: number;
	    constructor(element: Element, tag?: string);
	    revert(): void;
	}

}
declare module 'elpong/Helpers/CollectionHelper' {
	import { Element } from 'elpong/Element';
	import { Collection } from 'elpong/Collection';
	import { CollectionConfiguration } from 'elpong/Configuration';
	export namespace CollectionHelper {
	    function getConfiguration(collection: Collection): CollectionConfiguration;
	    function getSingularName(collection: Collection): string;
	    function addElement(collection: Collection, element: Element): void;
	}

}
declare module 'elpong/Helpers/SchemeHelper' {
	import { Scheme } from 'elpong/Scheme';
	import { Collection } from 'elpong/Collection';
	export namespace SchemeHelper {
	    function getCollectionBySingularName(scheme: Scheme, singular_name: string): Collection;
	}

}
declare module 'elpong/Helpers/Element/Fields/EmbeddedElement' {
	import { Element, PreElement } from 'elpong/Element';
	import { EmbeddedElementFieldConfiguration } from 'elpong/Configuration';
	export namespace EmbeddedElement {
	    function handle(element: Element, pre_element: PreElement, field_key: string, field_config: EmbeddedElementFieldConfiguration): void;
	}

}
declare module 'elpong/Helpers/Element/Fields/EmbeddedCollection' {
	import { Element, PreElement } from 'elpong/Element';
	import { EmbeddedCollectionFieldConfiguration } from 'elpong/Configuration';
	export namespace EmbeddedCollection {
	    function handle(element: Element, pre_element: PreElement, field_key: string, field_config: EmbeddedCollectionFieldConfiguration): void;
	}

}
declare module 'elpong/Helpers/Element/Fields' {
	import { Element, PreElement } from 'elpong/Element';
	import { FieldConfigurationMap } from 'elpong/Configuration';
	export namespace Fields {
	    function setup(element: Element, fields_config_map: FieldConfigurationMap, pre_element: PreElement): void;
	}

}
declare module 'elpong/Helpers/Element/Relations/HasMany' {
	import { Element } from 'elpong/Element';
	import { Collection } from 'elpong/Collection';
	import { HasManyRelationConfiguration, HasOneRelationConfiguration } from 'elpong/Configuration';
	export type HasManyRelationFunction = () => Element[];
	export namespace HasMany {
	    function setup(element: Element, relation_collection_name: string, relation_settings: HasManyRelationConfiguration): () => Element[];
	    function getHasManyRelationFunction(element: Element, collection: Collection, relation_config: HasManyRelationConfiguration | HasOneRelationConfiguration, relation_collection: Collection, limit_to_one?: boolean): HasManyRelationFunction;
	}

}
declare module 'elpong/Helpers/Element/Relations/HasOne' {
	import { Element } from 'elpong/Element';
	import { HasOneRelationConfiguration } from 'elpong/Configuration';
	export namespace HasOne {
	    function setup(element: Element, relation_collection_singular_name: string, relation_config: HasOneRelationConfiguration): () => Element;
	}

}
declare module 'elpong/Helpers/Element/Relations/BelongsTo' {
	import { Element } from 'elpong/Element';
	import { BelongsToRelationConfiguration } from 'elpong/Configuration';
	export namespace BelongsTo {
	    function setup(element: Element, relation_collection_singular_name: string, relation_config: BelongsToRelationConfiguration): void;
	}

}
declare module 'elpong/Helpers/Element/Relations' {
	import { Element } from 'elpong/Element';
	import { RelationConfigurationMaps } from 'elpong/Configuration';
	export namespace Relations {
	    function setup(element: Element, relations_config_maps: RelationConfigurationMaps): void;
	}

}
declare module 'elpong/Helpers/Element/Actions' {
	import { AjaxData, AjaxHeaders, AjaxPromise } from 'elpong/Ajax';
	import { ActionConfigurationMap, ActionConfiguration } from 'elpong/Configuration';
	import { Element } from 'elpong/Element';
	import { UrlOptions } from 'elpong/Helpers/UrlHelper';
	export interface ActionOptions {
	    data?: AjaxData;
	    headers?: AjaxHeaders;
	    url_options?: UrlOptions;
	}
	export namespace Actions {
	    function setup(element: Element, actions_config: ActionConfigurationMap): void;
	    function execute(element: Element, method: string, action_options?: ActionOptions): AjaxPromise;
	    function executeCustom(element: Element, action_name: string, action_config: ActionConfiguration, action_options?: ActionOptions): AjaxPromise;
	}

}
declare module 'elpong/Helpers/Element/Snapshots' {
	import { Element } from 'elpong/Element';
	export namespace Snapshots {
	    function setup(element: Element): void;
	}

}
declare module 'elpong/Element' {
	import { Collection } from 'elpong/Collection';
	import { AjaxPromise } from 'elpong/Ajax';
	import { Snapshot } from 'elpong/Snapshot';
	import { ActionOptions } from 'elpong/Helpers/Element/Actions';
	export type SelectorValue = string | number;
	export function isSelectorValue(v: any): v is SelectorValue;
	export interface Fields {
	    [field_key: string]: any;
	}
	export type RelationFunction = () => Element | Element[] | null | undefined;
	export interface Relations {
	    [relation_function_name: string]: RelationFunction;
	}
	export type ActionFunction = (action_options?: ActionOptions) => AjaxPromise;
	export interface Actions {
	    get: ActionFunction;
	    post: ActionFunction;
	    put: ActionFunction;
	    delete: ActionFunction;
	    [action_name: string]: ActionFunction;
	}
	export interface Snapshots {
	    make: Function;
	    list: Snapshot[];
	    current_index: number;
	    undo: (identifier: number | string | RegExp) => Element;
	    lastPersisted: () => Snapshot | undefined;
	    lastWithTag: (tag: string | RegExp) => Snapshot | undefined;
	    last: () => Snapshot | undefined;
	    isPersisted: () => boolean;
	}
	export class Element {
	    readonly _collection: Collection;
	    readonly fields: Fields;
	    readonly relations: Relations;
	    readonly actions: Actions;
	    readonly snapshots: Snapshots;
	    constructor(collection: Collection, pre_element: PreElement);
	    collection(): Collection;
	    selector(): SelectorValue | undefined;
	    remove(): any;
	    save(): AjaxPromise;
	    isNew(): boolean;
	    merge(pre_element: PreElement): this;
	}
	export interface PreElement {
	    [prop: string]: any;
	}

}
declare module 'elpong/Helpers/UrlHelper' {
	import { ActionConfiguration } from 'elpong/Configuration';
	import { Element } from 'elpong/Element';
	import { Collection } from 'elpong/Collection';
	export interface UrlOptions {
	    path?: string;
	    suffix?: string;
	}
	export namespace UrlHelper {
	    function createForElement(action_name: string, action_configuration: ActionConfiguration, element: Element, url_options: UrlOptions, no_selector?: boolean): string;
	    function createForCollection(action_name: string, collection: Collection, url_options: UrlOptions): string;
	    function trimSlashes(s: string): string;
	    function isFqdn(s: string): boolean;
	}

}
declare module 'elpong/Helpers' {
	export { UrlHelper } from 'elpong/Helpers/UrlHelper';
	export { CollectionHelper } from 'elpong/Helpers/CollectionHelper';

}
declare module 'elpong/Scheme' {
	import { Collection } from 'elpong/Collection';
	import { SchemeConfiguration } from 'elpong/Configuration';
	export interface CollectionMap {
	    [name: string]: Collection;
	}
	export class Scheme {
	    name: string;
	    private _configuration;
	    private _collections;
	    private api_url;
	    constructor(sc: SchemeConfiguration | Object);
	    configuration(): SchemeConfiguration;
	    select(name: string): Collection;
	    setApiUrl(url: string): string | undefined;
	    getApiUrl(): string;
	    getCollections(): CollectionMap;
	}

}
declare module 'elpong/Elpong' {
	import { Scheme } from 'elpong/Scheme';
	import { Collection } from 'elpong/Collection';
	import { SchemeConfiguration } from 'elpong/Configuration';
	import { AjaxExternalFunction } from 'elpong/Ajax';
	import { Element } from 'elpong/Element';
	export namespace Elpong {
	    function add(scheme_config: SchemeConfiguration | Object): Scheme;
	    function get(name: string): Scheme;
	    function load(ignore_empty: boolean): void;
	    function setAjax(fn: AjaxExternalFunction, type?: string): void;
	    function enableAutoload(): void;
	    function isAutoload(): boolean;
	    function tearDown(): void;
	}
	export { Scheme, Element, Collection };

}
declare module 'elpong/Helpers/Collection/Actions' {
	import { Collection } from 'elpong/Collection';
	import { AjaxData, AjaxHeaders, AjaxPromise } from 'elpong/Ajax';
	import { SelectorValue } from 'elpong/Element';
	import { CollectionActionConfiguration } from 'elpong/Configuration';
	export interface CollectionActionOptions {
	    data?: AjaxData;
	    headers?: AjaxHeaders;
	}
	export namespace Actions {
	    function executeGetAll(collection: Collection, action_options?: CollectionActionOptions): AjaxPromise;
	    function executeGetOne(collection: Collection, selector_value: SelectorValue, action_options?: CollectionActionOptions): AjaxPromise;
	    function executeCustom(collection: Collection, action_name: string, action_config: CollectionActionConfiguration, action_options?: CollectionActionOptions): AjaxPromise;
	}

}
declare module 'elpong/Collection' {
	import { Scheme } from 'elpong/Scheme';
	import { Element, SelectorValue, PreElement } from 'elpong/Element';
	import { CollectionConfiguration } from 'elpong/Configuration';
	import { CollectionActionOptions } from 'elpong/Helpers/Collection/Actions';
	import { AjaxPromise } from 'elpong/Ajax';
	export interface ElementMap {
	    [key: string]: Element;
	}
	export type CollectionActionFunction = (action_options?: CollectionActionOptions) => AjaxPromise;
	export type GetOneCollectionActionFunction = (selector_value: SelectorValue, action_options?: CollectionActionOptions) => AjaxPromise;
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
	export class Collection {
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

}
declare module 'elpong/main' {
	import { Elpong } from 'elpong/Elpong';
	export = Elpong;

}
declare module 'elpong/PreElement' {
	export interface PreElement {
	    [prop: string]: any;
	}

}
declare module 'elpong' {
	import main = require('elpong/Elpong');
	export = main;
}
