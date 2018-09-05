import { Collection } from '../../Collection';
import { Ajax, AjaxResponse, AjaxData, AjaxHeaders, AjaxPromise } from '../../Ajax';
import { UrlHelper, UrlHelperOptions } from '../UrlHelper';
import { SelectorValue } from '../../Element';
import { CollectionActionConfiguration } from '../../Configuration';
import { ElpongError, ElpongErrorType } from '../../Errors';
import { PreElement } from '../../PreElement';

export interface CollectionActionOptions {
  data?: AjaxData;
  headers?: AjaxHeaders;
  params?: any;
}

export namespace CollectionActions {
  export function executeGetAll(collection: Collection, action_options: CollectionActionOptions = {}): AjaxPromise {
    if (!action_options) { action_options = {}; }
    if (action_options.data) {
      throw new ElpongError(ElpongErrorType.AJXGDA);
    }

    let promise = Ajax.executeRequest(
      UrlHelper.createForCollection(collection, {params: action_options.params || {}}),
      'GET',
      undefined,
      action_options.headers
    );
    promise.then((response: AjaxResponse) => {
      response.data.map((pre_element: PreElement) => {
        collection.buildOrMerge(pre_element);
      });
    });
    return promise;
  }

  export function executeGetOne(collection: Collection, selector_value: SelectorValue, action_options: CollectionActionOptions = {}) {
    if (action_options.data) {
      throw new ElpongError(ElpongErrorType.AJXGDA);
    }

    const url_options: UrlHelperOptions = {
      suffix: selector_value as string,
      params: action_options.params || {}
    }

    let promise = Ajax.executeRequest(
      UrlHelper.createForCollection(collection, url_options),
      'GET',
      undefined,
      action_options.headers
    );
    promise.then((response: AjaxResponse) => {
      if (response.data) {
        let selector_key = collection.scheme().configuration().selector;
        if (response.data[selector_key] !== selector_value) {
          throw new ElpongError(ElpongErrorType.ELESNM, `${response.data[selector_key]} != ${selector_value}`)
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
      UrlHelper.createForCollection(collection, {suffix: action_config.path || action_name, params: action_options.params}),
      method,
      data,
      action_options.headers
    );
  }
}
