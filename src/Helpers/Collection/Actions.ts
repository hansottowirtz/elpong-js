import { Collection } from '../../Collection';
import { Ajax, AjaxResponse, AjaxData, AjaxHeaders } from '../../Ajax';
import { UrlHelper, UrlOptions } from '../UrlHelper';
import { SelectorValue } from '../../Element';
import { CollectionActionConfiguration } from '../../Configuration';
import { PreElement } from '../../PreElement';
import { ElpongError } from '../../Errors';

export interface CollectionActionOptions {
  data?: AjaxData;
  headers?: AjaxHeaders;
}

export namespace Actions {
  export function executeGetAll(collection: Collection, action_options?: CollectionActionOptions) {
    if (!action_options) { action_options = {}; }
    let data = action_options.data;

    let promise = Ajax.executeRequest(
      UrlHelper.createForCollection('GET', collection, action_options as UrlOptions),
      'GET',
      data,
      action_options.headers
    );
    promise.then((response: AjaxResponse) => {
      response.data.map((pre_element: PreElement) => {
        collection.buildOrMerge(pre_element);
      });
    });
    return promise;
  }

  export function executeGetOne(collection: Collection, selector_value: SelectorValue, action_options?: CollectionActionOptions) {
    if (!action_options) { action_options = {}; }
    let data = action_options.data;

    let promise = Ajax.executeRequest(
      UrlHelper.createForCollection('GET', collection, {suffix: selector_value as string}),
      'GET',
      data,
      action_options.headers
    );
    promise.then((response: AjaxResponse) => {
      if (response.data) {
        let selector_key = collection.scheme().configuration().selector;
        if (response.data[selector_key] !== selector_value) {
          throw new ElpongError('elesnm', `${response.data[selector_key]} != ${selector_value}`)
        }
        collection.buildOrMerge(response.data);
      }
    });
    return promise;
  }

  export function executeCustom(collection: Collection, action_name: string, action_config: CollectionActionConfiguration, action_options?: CollectionActionOptions) {
    if (!action_options) { action_options = {}; }
    let data = action_options.data;

    let method = action_config.method.toUpperCase();

    return Ajax.executeRequest(
      UrlHelper.createForCollection('GET', collection, {suffix: action_config.path || action_name}),
      method,
      data,
      action_options.headers
    );
  }
}
