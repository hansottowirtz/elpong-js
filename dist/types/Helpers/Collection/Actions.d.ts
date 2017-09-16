import { Collection } from '../../Collection';
import { AjaxData, AjaxHeaders, AjaxPromise } from '../../Ajax';
import { SelectorValue } from '../../Element';
import { CollectionActionConfiguration } from '../../Configuration';
export interface CollectionActionOptions {
    data?: AjaxData;
    headers?: AjaxHeaders;
}
export declare namespace Actions {
    function executeGetAll(collection: Collection, action_options?: CollectionActionOptions): AjaxPromise;
    function executeGetOne(collection: Collection, selector_value: SelectorValue, action_options?: CollectionActionOptions): AjaxPromise;
    function executeCustom(collection: Collection, action_name: string, action_config: CollectionActionConfiguration, action_options?: CollectionActionOptions): AjaxPromise;
}
