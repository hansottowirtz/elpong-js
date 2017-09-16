import { Collection } from './Collection';
import { AjaxPromise } from './Ajax';
import { Snapshot } from './Snapshot';
import { ActionOptions } from './Helpers/Element/Actions';
export declare type SelectorValue = string | number;
export declare function isSelectorValue(v: any): v is SelectorValue;
export interface Fields {
    [field_key: string]: any;
}
export declare type RelationFunction = () => Element | Element[] | null | undefined;
export interface Relations {
    [relation_function_name: string]: RelationFunction;
}
export declare type ActionFunction = (action_options?: ActionOptions) => AjaxPromise;
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
export declare class Element {
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
