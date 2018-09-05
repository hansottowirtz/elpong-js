declare module 'elpong/Errors' {
	export const enum ElpongErrorType {
	    SCHNFO = 0,
	    COLNFO = 1,
	    COLNFS = 2,
	    COLEXI = 3,
	    ELPNST = 4,
	    ELPNCE = 5,
	    ELPNDC = 6,
	    CNFNSL = 7,
	    CNFNNA = 8,
	    ELENEW = 9,
	    ELENNW = 10,
	    ELESNA = 11,
	    ELESNE = 12,
	    APINUR = 13,
	    FLDNSA = 14,
	    ELESCH = 15,
	    ELESNF = 16,
	    ELESTI = 17,
	    ELEAFW = 18,
	    ELESNM = 19,
	    ELENOS = 20,
	    AJXHCT = 21,
	    AJXGDA = 22
	}
	export class ElpongError extends Error {
	    constructor(message: ElpongErrorType, argument?: string);
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
	    from<T>(arrayLike: ArrayLike<T>): T[];
	}

}
declare module 'elpong/Util' {
	export function capitalize(string: string): string;
	export function camelize(string: string): string;
	export function removeFromArray(array: any[], element: any): boolean;
	export function isInteger(value: any): value is number;
	export function isNumber(value: any): value is number;
	export function isString(value: any): value is string;
	export function isRegExp(value: any): value is RegExp;
	export function forEach(o: object, fn: (v: any, k: string) => void): void;
	export function endsWith(string: string, search: string): boolean;
	export function startsWith(string: string, search: string): boolean;
	export function arrayFromHTML(nodeList: NodeListOf<HTMLElement>): HTMLElement[];
	export function values(obj: object): any[];
	export function includes(a: any[], b: any): boolean;
	export function equalsJSON(a: any, b: any): boolean;
	export function copyJSON(o: any): any;

}
declare module 'elpong/Ajax' {
	export type AjaxPromiseThenOnResolveFunction = (response: AjaxResponse) => void;
	export type AjaxPromiseThenFunction = (resolveFn: AjaxPromiseThenOnResolveFunction) => any;
	export type AjaxPromise = Promise<AjaxResponse>;
	export interface AjaxResponse extends Response {
	    data?: any;
	}
	export type AjaxExternalFunction = (...args: any[]) => any | object;
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
	export function executeRequest(url: string, method: string, data?: AjaxData, headers?: AjaxHeaders): Promise<AjaxResponse>;
	export function setAjaxFunction(fn: AjaxExternalFunction, adapterType?: AjaxAdapterType | AjaxAdapterTypeString): void;
	export function convertAjaxAdapterTypeStringToType(type?: AjaxAdapterType | AjaxAdapterTypeString): AjaxAdapterType;

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
declare module 'elpong/Helpers/ElementHelper' {
	import { Element } from 'elpong/Element';
	export function toData(element: Element, fullDuplicate?: boolean): {};

}
declare module 'elpong/Helpers/UrlHelper' {
	import { Collection } from 'elpong/Collection';
	import { Element } from 'elpong/Element';
	export interface UrlHelperOptions extends UrlOptions {
	    suffix?: string;
	    params?: any;
	}
	export interface UrlHelperElementOptions extends UrlHelperOptions {
	    noSelector?: boolean;
	}
	export interface UrlHelperCollectionOptions extends UrlHelperOptions {
	}
	export interface UrlOptions {
	    params?: any;
	}
	export function createForElement(element: Element, urlOptions: UrlHelperElementOptions): string;
	export function createForCollection(collection: Collection, urlOptions: UrlHelperOptions): string;
	export function trimSlashes(s: string): string;
	export function isFqdn(s: string): boolean;
	export function appendParamsToUrl(url: string, params: any): string;

}
declare module 'elpong/Helpers/Element/Actions' {
	import { AjaxData, AjaxHeaders, AjaxPromise } from 'elpong/Ajax';
	import { ActionConfiguration, ActionConfigurationMap } from 'elpong/Configuration';
	import { Element } from 'elpong/Element';
	export interface ActionOptions {
	    data?: AjaxData;
	    headers?: AjaxHeaders;
	    params?: any;
	}
	export function setup(element: Element, actionsConfig: ActionConfigurationMap): void;
	export function execute(element: Element, method: string, actionOptions?: ActionOptions): AjaxPromise;
	export function executeCustom(element: Element, actionName: string, actionConfig: ActionConfiguration, actionOptions?: ActionOptions): AjaxPromise;

}
declare module 'elpong/PreElement' {
	export interface PreElement {
	    [prop: string]: any;
	}

}
declare module 'elpong/elpong' {
	import { AjaxAdapterType, AjaxExternalFunction } from 'elpong/Ajax';
	import { PreSchemeConfiguration } from 'elpong/Configuration';
	import { Scheme } from 'elpong/Scheme'; const elpong: {
	    add: (schemeConfig: PreSchemeConfiguration) => Scheme;
	    enableAutoload: () => void;
	    get: (name: string) => Scheme;
	    isAutoloadEnabled: () => boolean;
	    load: (ignoreEmpty: boolean) => void;
	    setAjax: (fn: AjaxExternalFunction, type?: AjaxAdapterType | "fetch" | "angular" | "angularjs" | "jquery" | undefined) => void;
	    tearDown: () => void;
	};
	export { elpong };

}
declare module 'elpong/Scheme' {
	import { Collection } from 'elpong/Collection';
	import { PreSchemeConfiguration, SchemeConfiguration } from 'elpong/Configuration';
	export interface CollectionMap {
	    [name: string]: Collection;
	}
	export class Scheme {
	    name: string;
	    private _configuration;
	    private _collections;
	    private apiUrl;
	    constructor(preSchemeConfiguration: PreSchemeConfiguration);
	    configuration(): SchemeConfiguration;
	    select(name: string): Collection;
	    setApiUrl(url: string): string;
	    getApiUrl(): string;
	    getCollections(): CollectionMap;
	}

}
declare module 'elpong/Helpers/CollectionHelper' {
	import { Collection } from 'elpong/Collection';
	import { CollectionConfiguration } from 'elpong/Configuration';
	import { Element } from 'elpong/Element';
	export function getConfiguration(collection: Collection): CollectionConfiguration;
	export function getSingularName(collection: Collection): string;
	export function addElement(collection: Collection, element: Element): void;

}
declare module 'elpong/Helpers/Element/Fields/EmbeddedCollection' {
	import { EmbeddedCollectionFieldConfiguration } from 'elpong/Configuration';
	import { Element } from 'elpong/Element';
	import { PreElement } from 'elpong/PreElement';
	export function handle(element: Element, preElement: PreElement, fieldKey: string, fieldConfig: EmbeddedCollectionFieldConfiguration): void;

}
declare module 'elpong/Helpers/SchemeHelper' {
	import { Collection } from 'elpong/Collection';
	import { Scheme } from 'elpong/Scheme';
	export function getCollectionBySingularName(scheme: Scheme, singularName: string): Collection;

}
declare module 'elpong/Helpers/Element/Fields/EmbeddedElement' {
	import { EmbeddedElementFieldConfiguration } from 'elpong/Configuration';
	import { Element } from 'elpong/Element';
	import { PreElement } from 'elpong/PreElement';
	export function handle(element: Element, preElement: PreElement, fieldKey: string, fieldConfig: EmbeddedElementFieldConfiguration): void;

}
declare module 'elpong/Helpers/Element/Fields' {
	import { FieldConfigurationMap } from 'elpong/Configuration';
	import { Element } from 'elpong/Element';
	import { PreElement } from 'elpong/PreElement';
	export function setup(element: Element, fieldsConfigMap: FieldConfigurationMap, preElement: PreElement): void;

}
declare module 'elpong/Helpers/Element/Relations/BelongsTo' {
	import { BelongsToRelationConfiguration } from 'elpong/Configuration';
	import { Element } from 'elpong/Element';
	export function setup(element: Element, relationCollectionSingularName: string, relationConfig: BelongsToRelationConfiguration): void;

}
declare module 'elpong/Helpers/Element/Relations/HasMany' {
	import { Collection } from 'elpong/Collection';
	import { HasManyRelationConfiguration, HasOneRelationConfiguration } from 'elpong/Configuration';
	import { Element } from 'elpong/Element';
	export type HasManyRelationFunction = () => Element[];
	export function setup(element: Element, relationCollectionName: string, relationSettings: HasManyRelationConfiguration): () => Element[];
	export function getHasManyRelationFunction(element: Element, collection: Collection, relationConfig: HasManyRelationConfiguration | HasOneRelationConfiguration, relationCollection: Collection, limitToOne?: boolean): HasManyRelationFunction;

}
declare module 'elpong/Helpers/Element/Relations/HasOne' {
	import { HasOneRelationConfiguration } from 'elpong/Configuration';
	import { Element } from 'elpong/Element';
	export function setup(element: Element, relationCollectionSingularName: string, relationConfig: HasOneRelationConfiguration): () => Element;

}
declare module 'elpong/Helpers/Element/Relations' {
	import { RelationConfigurationMaps } from 'elpong/Configuration';
	import { Element } from 'elpong/Element';
	export function setup(element: Element, relationsConfigMaps: RelationConfigurationMaps): void;

}
declare module 'elpong/Snapshot' {
	import { Element } from 'elpong/Element';
	export class Snapshot {
	    tag?: string;
	    time: number;
	    data: object;
	    element: Element;
	    undone: boolean;
	    index: number;
	    constructor(element: Element, tag?: string);
	    revert(): void;
	}

}
declare module 'elpong/Helpers/Element/Snapshots' {
	import { Element } from 'elpong/Element';
	export function setup(element: Element): void;

}
declare module 'elpong/Element' {
	import { AjaxPromise } from 'elpong/Ajax';
	import { Collection } from 'elpong/Collection';
	import { ActionOptions } from 'elpong/Helpers/Element/Actions';
	import { PreElement } from 'elpong/PreElement';
	import { Snapshot } from 'elpong/Snapshot';
	export type SelectorValue = string | number;
	export function isSelectorValue(v: any): v is SelectorValue;
	export interface Fields {
	    [fieldKey: string]: any;
	}
	export type RelationFunction = () => Element | Element[] | null | undefined;
	export interface Relations {
	    [relationFunctionName: string]: RelationFunction;
	}
	export type ActionFunction = (actionOptions?: ActionOptions) => AjaxPromise;
	export interface Actions {
	    get: ActionFunction;
	    post: ActionFunction;
	    put: ActionFunction;
	    delete: ActionFunction;
	    [actionName: string]: ActionFunction;
	}
	export interface Snapshots {
	    make: (tag?: string) => void;
	    list: Snapshot[];
	    currentIndex: number;
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
	    constructor(collection: Collection, preElement: PreElement);
	    collection(): Collection;
	    selector(): SelectorValue | undefined;
	    remove(): {
	        then(fn: () => any): any;
	        catch(): void;
	    };
	    save(): AjaxPromise;
	    isNew(): boolean;
	    merge(preElement: PreElement): this;
	}

}
declare module 'elpong/Helpers/Collection/CollectionActions' {
	import { AjaxData, AjaxHeaders, AjaxPromise, AjaxResponse } from 'elpong/Ajax';
	import { Collection } from 'elpong/Collection';
	import { CollectionActionConfiguration } from 'elpong/Configuration';
	import { SelectorValue } from 'elpong/Element';
	export interface CollectionActionOptions {
	    data?: AjaxData;
	    headers?: AjaxHeaders;
	    params?: any;
	}
	export function executeGetAll(collection: Collection, actionOptions?: CollectionActionOptions): AjaxPromise;
	export function executeGetOne(collection: Collection, selectorValue: SelectorValue, actionOptions?: CollectionActionOptions): Promise<AjaxResponse>;
	export function executeCustom(collection: Collection, actionName: string, actionConfig: CollectionActionConfiguration, actionOptions?: CollectionActionOptions): Promise<AjaxResponse>;

}
declare module 'elpong/Collection' {
	import { AjaxPromise } from 'elpong/Ajax';
	import { CollectionConfiguration } from 'elpong/Configuration';
	import { Element, SelectorValue } from 'elpong/Element';
	import { FakeMap } from 'elpong/FakeThings';
	import { CollectionActionOptions } from 'elpong/Helpers/Collection/CollectionActions';
	import { PreElement } from 'elpong/PreElement';
	import { Scheme } from 'elpong/Scheme';
	export type ElementMap = FakeMap;
	export type GetAllCollectionActionFunction = (actionOptions?: CollectionActionOptions) => AjaxPromise;
	export type GetOneCollectionActionFunction = (selectorValue?: SelectorValue, actionOptions?: CollectionActionOptions) => AjaxPromise;
	export type CustomCollectionActionFunction = (actionOptions?: CollectionActionOptions | SelectorValue) => AjaxPromise;
	export interface CollectionActions {
	    [actionName: string]: CustomCollectionActionFunction;
	    getAll: GetAllCollectionActionFunction;
	    getOne: GetOneCollectionActionFunction;
	}
	export interface CollectionArrayOptions {
	    noNew?: boolean;
	}
	export interface CollectionFindByOptions extends CollectionArrayOptions {
	    multiple?: boolean;
	}
	export interface FieldsKeyValueMap {
	    [key: string]: any;
	}
	export class Collection {
	    readonly name: string;
	    readonly elements: FakeMap;
	    readonly newElements: Element[];
	    readonly actions: CollectionActions;
	    private readonly _scheme;
	    private readonly _defaultPreElement;
	    constructor(scheme: Scheme, name: string);
	    scheme(): Scheme;
	    load(ignoreEmpty: boolean): void;
	    configuration(): CollectionConfiguration;
	    array(options?: CollectionArrayOptions): Element[];
	    find(selectorValue: SelectorValue): Element | null;
	    findBy(fieldsKeyValueMap: FieldsKeyValueMap, findOptions: CollectionFindByOptions): Element | Element[] | null;
	    build(preElement: PreElement): Element;
	    buildOrMerge(preElement: PreElement): Element;
	}

}
declare module 'elpong' {
	export { elpong as default } from 'elpong/elpong';
	export { Scheme, CollectionMap } from 'elpong/Scheme';
	export { Collection, CollectionActions, GetAllCollectionActionFunction, GetOneCollectionActionFunction, CustomCollectionActionFunction, CollectionArrayOptions, CollectionFindByOptions, FieldsKeyValueMap } from 'elpong/Collection';
	export { Element, SelectorValue, Fields, Relations, Actions, Snapshots, RelationFunction, ActionFunction } from 'elpong/Element';
	export { PreElement } from 'elpong/PreElement';
	export { ElpongError } from 'elpong/Errors';
	export { Snapshot } from 'elpong/Snapshot';
	export { SchemeConfiguration, PreSchemeConfiguration, CollectionConfiguration, CollectionConfigurationMap, CollectionActionConfiguration, CollectionActionConfigurationMap, CollectionConfigurationWithOptionals, CollectionConfigurationMapWithOptionals, FieldConfiguration, FieldConfigurationMap, RelationConfiguration, RelationConfigurationMaps, HasOneRelationConfiguration, HasManyRelationConfiguration, BelongsToRelationConfiguration, HasOneRelationConfigurationMap, HasManyRelationConfigurationMap, BelongsToRelationConfigurationMap, EmbeddedElementFieldConfiguration, BelongsToRelationConfigurationBase, EmbeddedCollectionFieldConfiguration, RelationConfigurationMapsWithOptionals, ActionConfiguration, ActionConfigurationMap, PolymorphicBelongsToRelationConfiguration, NonPolymorphicBelongsToRelationConfiguration } from 'elpong/Configuration';
	export { AjaxAdapterType } from 'elpong/Ajax';

}
