declare module 'elpong/Errors' {
	export class ElpongError extends Error {
	    constructor(message: string, argument?: string);
	}

}
declare module 'elpong/Ajax' {
	export type AjaxPromiseThenOnResolveFunction = (response: AjaxResponse) => void;
	export type AjaxPromiseThenFunction = (resolve_fn: AjaxPromiseThenOnResolveFunction) => any;
	export type AjaxPromise = Promise<AjaxResponse>;
	export interface AjaxResponse extends Response {
	    data?: any;
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
	export type AjaxData = any;
	export interface AjaxHeaders {
	    [name: string]: string;
	}
	export namespace Ajax {
	    function executeRequest(url: string, method: string, data?: AjaxData, headers?: AjaxHeaders): Promise<AjaxResponse>;
	    function setAjaxFunction(fn: AjaxExternalFunction, type?: string): void;
	}

}
declare module 'elpong/Configuration' {
	export class SchemeConfiguration implements PreSchemeConfiguration {
	    readonly name: string;
	    readonly selector: string;
	    readonly collections: CollectionConfigurationMap;
	    constructor(preconf: PreSchemeConfiguration);
	}
	export interface PreSchemeConfiguration {
	    name: string;
	    selector: string;
	    collections: CollectionConfigurationMapWithOptionals;
	}
	export interface SchemeConfiguration {
	    readonly name: string;
	    readonly selector: string;
	    readonly collections: CollectionConfigurationMap;
	}
	export interface CollectionConfigurationMapWithOptionals {
	    [name: string]: CollectionConfigurationWithOptionals;
	}
	export interface CollectionConfigurationMap extends CollectionConfigurationMapWithOptionals {
	    [name: string]: CollectionConfiguration;
	}
	export interface CollectionConfigurationWithOptionals {
	    readonly singular?: string;
	    readonly fields: FieldConfigurationMap;
	    readonly relations?: RelationConfigurationMapsWithOptionals;
	    readonly actions?: ActionConfigurationMap;
	    readonly collection_actions?: CollectionActionConfigurationMap;
	}
	export interface CollectionConfiguration extends CollectionConfigurationWithOptionals {
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
	    readonly reference?: boolean;
	    readonly default?: any;
	    readonly embedded_element?: boolean;
	    readonly embedded_collection?: boolean;
	    readonly no_send?: boolean;
	}
	export interface EmbeddedElementFieldConfiguration extends FieldConfiguration {
	    readonly reference_field?: string;
	    readonly collection?: string;
	}
	export interface EmbeddedCollectionFieldConfiguration extends FieldConfiguration {
	    readonly collection?: string;
	}
	export interface RelationConfigurationMapsWithOptionals {
	    readonly has_many?: HasManyRelationConfigurationMap;
	    readonly has_one?: HasOneRelationConfigurationMap;
	    readonly belongs_to?: BelongsToRelationConfigurationMap;
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
	    readonly field?: string;
	    readonly collection?: string;
	    readonly references_field?: string;
	    readonly polymorphic?: boolean;
	    readonly as?: string;
	    readonly inline?: boolean;
	    readonly inline_field?: string;
	}
	export interface HasOneRelationConfiguration extends RelationConfiguration {
	    readonly field?: string;
	    readonly collection?: string;
	    readonly references_field?: string;
	    readonly polymorphic?: boolean;
	    readonly as?: string;
	}
	export interface BelongsToRelationConfigurationBase extends RelationConfiguration {
	    readonly collection?: string;
	    readonly polymorphic?: boolean;
	    readonly field?: string;
	    readonly collection_field?: string;
	}
	export interface NonPolymorphicBelongsToRelationConfiguration extends BelongsToRelationConfigurationBase {
	    readonly polymorphic?: false;
	}
	export interface PolymorphicBelongsToRelationConfiguration extends BelongsToRelationConfigurationBase {
	    readonly polymorphic: true;
	    readonly field: string;
	}
	export type BelongsToRelationConfiguration = NonPolymorphicBelongsToRelationConfiguration | PolymorphicBelongsToRelationConfiguration;
	export interface ActionConfigurationMap {
	    readonly [name: string]: ActionConfiguration;
	}
	export interface CollectionActionConfigurationMap {
	    readonly [name: string]: CollectionActionConfiguration;
	}
	export interface CollectionActionConfiguration {
	    readonly method: string;
	    readonly path?: string;
	}
	export interface ActionConfiguration {
	    readonly method: string;
	    readonly returns_other?: boolean;
	    readonly no_data?: boolean;
	    readonly no_selector?: boolean;
	    readonly path?: string;
	}

}
declare module 'elpong/FakeThings' {
	export type FakeMapKey = string | number;
	export class FakeMap {
	    readonly hasRealMap: boolean;
	    readonly map: any;
	    constructor();
	    get(k: FakeMapKey): any;
	    set(k: FakeMapKey, v: any): this;
	    has(k: FakeMapKey): boolean;
	    values(): any[];
	    delete(k: FakeMapKey): void;
	}
	export interface FakeString {
	    startsWith(searchString: string, position?: number): boolean;
	    endsWith(searchString: string, endPosition?: number): boolean;
	}
	export interface FakeArrayConstructor {
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
	export interface ActionOptions {
	    data?: AjaxData;
	    headers?: AjaxHeaders;
	    params?: any;
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
	    remove(): Promise<void> | {
	        then: (fn: Function) => any;
	        catch: () => void;
	    };
	    save(): AjaxPromise;
	    isNew(): boolean;
	    merge(pre_element: PreElement): this;
	}
	export interface PreElement {
	    [prop: string]: any;
	}

}
declare module 'elpong/Helpers/UrlHelper' {
	import { Element } from 'elpong/Element';
	import { Collection } from 'elpong/Collection';
	export interface UrlHelperOptions extends UrlOptions {
	    suffix?: string;
	    params?: any;
	}
	export interface UrlHelperElementOptions extends UrlHelperOptions {
	    no_selector?: boolean;
	}
	export interface UrlHelperCollectionOptions extends UrlHelperOptions {
	}
	export interface UrlOptions {
	    params?: any;
	}
	export namespace UrlHelper {
	    function createForElement(element: Element, url_options: UrlHelperElementOptions): string;
	    function createForCollection(collection: Collection, url_options: UrlHelperOptions): string;
	    function trimSlashes(s: string): string;
	    function isFqdn(s: string): boolean;
	    function appendParamsToUrl(url: string, params: any): string;
	}

}
declare module 'elpong/Helpers' {
	export { UrlHelper } from 'elpong/Helpers/UrlHelper';
	export { CollectionHelper } from 'elpong/Helpers/CollectionHelper';

}
declare module 'elpong/Scheme' {
	import { Collection } from 'elpong/Collection';
	import { SchemeConfiguration, PreSchemeConfiguration } from 'elpong/Configuration';
	export interface CollectionMap {
	    [name: string]: Collection;
	}
	export class Scheme {
	    name: string;
	    private _configuration;
	    private _collections;
	    private api_url;
	    constructor(preSchemeConfiguration: PreSchemeConfiguration);
	    configuration(): SchemeConfiguration;
	    select(name: string): Collection;
	    setApiUrl(url: string): string;
	    getApiUrl(): string;
	    getCollections(): CollectionMap;
	}

}
declare module 'elpong/Elpong' {
	import { Scheme } from 'elpong/Scheme';
	import { PreSchemeConfiguration } from 'elpong/Configuration';
	import { AjaxExternalFunction } from 'elpong/Ajax';
	export namespace Elpong {
	    function add(scheme_config: PreSchemeConfiguration): Scheme;
	    function get(name: string): Scheme;
	    function load(ignore_empty: boolean): void;
	    function setAjax(fn: AjaxExternalFunction, type?: string): void;
	    function enableAutoload(): void;
	    function isAutoloadEnabled(): boolean;
	    function tearDown(): void;
	}

}
declare module 'elpong/Helpers/Collection/CollectionActions' {
	import { Collection } from 'elpong/Collection';
	import { AjaxResponse, AjaxData, AjaxHeaders, AjaxPromise } from 'elpong/Ajax';
	import { SelectorValue } from 'elpong/Element';
	import { CollectionActionConfiguration } from 'elpong/Configuration';
	export interface CollectionActionOptions {
	    data?: AjaxData;
	    headers?: AjaxHeaders;
	    params?: any;
	}
	export namespace CollectionActions {
	    function executeGetAll(collection: Collection, action_options?: CollectionActionOptions): AjaxPromise;
	    function executeGetOne(collection: Collection, selector_value: SelectorValue, action_options?: CollectionActionOptions): Promise<AjaxResponse>;
	    function executeCustom(collection: Collection, action_name: string, action_config: CollectionActionConfiguration, action_options?: CollectionActionOptions): Promise<AjaxResponse>;
	}

}
declare module 'elpong/Collection' {
	import { Scheme } from 'elpong/Scheme';
	import { Element, SelectorValue, PreElement } from 'elpong/Element';
	import { CollectionConfiguration } from 'elpong/Configuration';
	import { CollectionActionOptions } from 'elpong/Helpers/Collection/CollectionActions';
	import { AjaxPromise } from 'elpong/Ajax';
	import { FakeMap } from 'elpong/FakeThings';
	export type ElementMap = FakeMap;
	export type GetAllCollectionActionFunction = (action_options?: CollectionActionOptions) => AjaxPromise;
	export type GetOneCollectionActionFunction = (selector_value?: SelectorValue, action_options?: CollectionActionOptions) => AjaxPromise;
	export type CustomCollectionActionFunction = (action_options?: CollectionActionOptions | SelectorValue) => AjaxPromise;
	export interface CollectionActions {
	    [action_name: string]: CustomCollectionActionFunction;
	    getAll: GetAllCollectionActionFunction;
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
	    private readonly _scheme;
	    readonly name: string;
	    private readonly default_pre_element;
	    readonly elements: FakeMap;
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
declare module 'elpong/PreElement' {
	export interface PreElement {
	    [prop: string]: any;
	}

}
declare module 'elpong/entry' {
	import { Elpong } from 'elpong/Elpong';
	export = Elpong;

}
declare module 'elpong/main' {
	export { Elpong } from 'elpong/Elpong';
	export { Scheme, CollectionMap } from 'elpong/Scheme';
	export { Collection, CollectionActions, GetAllCollectionActionFunction, GetOneCollectionActionFunction, CustomCollectionActionFunction, CollectionArrayOptions, CollectionFindByOptions, FieldsKeyValueMap } from 'elpong/Collection';
	export { Element, PreElement, SelectorValue, Fields, Relations, Actions, Snapshots, RelationFunction, ActionFunction } from 'elpong/Element';
	export { ElpongError } from 'elpong/Errors';
	export { Snapshot } from 'elpong/Snapshot';
	export { Util } from 'elpong/Util';
	export { SchemeConfiguration, PreSchemeConfiguration, CollectionConfiguration, CollectionConfigurationMap, CollectionActionConfiguration, CollectionActionConfigurationMap, CollectionConfigurationWithOptionals, CollectionConfigurationMapWithOptionals, FieldConfiguration, FieldConfigurationMap, RelationConfiguration, RelationConfigurationMaps, HasOneRelationConfiguration, HasManyRelationConfiguration, BelongsToRelationConfiguration, HasOneRelationConfigurationMap, HasManyRelationConfigurationMap, BelongsToRelationConfigurationMap, EmbeddedElementFieldConfiguration, BelongsToRelationConfigurationBase, EmbeddedCollectionFieldConfiguration, RelationConfigurationMapsWithOptionals, ActionConfiguration, ActionConfigurationMap, PolymorphicBelongsToRelationConfiguration, NonPolymorphicBelongsToRelationConfiguration } from 'elpong/Configuration';

}
declare module 'elpong' {
	import main = require('elpong/main');
	export = main;
}
