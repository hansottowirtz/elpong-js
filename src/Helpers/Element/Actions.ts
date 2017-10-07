import { Ajax, AjaxResponse, AjaxData, AjaxHeaders, AjaxPromise } from '../../Ajax';
import { ActionConfigurationMap, ActionConfiguration } from '../../Configuration';
import { Element, SelectorValue } from '../../Element';
import { Util } from '../../Util';
import { ElpongError } from '../../Errors';
import { ElementHelper } from '../ElementHelper';
import { UrlHelper, UrlOptions } from '../UrlHelper';

export interface ActionOptions {
  data?: AjaxData;
  headers?: AjaxHeaders;
  url_options?: UrlOptions;
}

export namespace Actions {
  export function setup(element: Element, actions_config: ActionConfigurationMap) {
    for (let method of ['get', 'post', 'put', 'delete']) {
      element.actions[method] = (action_options: ActionOptions) => {
        return execute(element, method.toUpperCase(), action_options);
      }
    }

    Util.forEach(actions_config, (action_config: ActionConfiguration, action_name: string) => {
      element.actions[Util.camelize(action_name)] = (action_options: ActionOptions) => {
        if (element.isNew() && !action_config.no_selector) { throw new ElpongError('elenew'); }
        return executeCustom(element, action_name, action_config, action_options);
      }
    });
  }

  export function execute(element: Element, method: string, action_options?: ActionOptions): AjaxPromise {
    if (!action_options) { action_options = {}; }

    element.snapshots.make(`before_${method.toLowerCase()}`);

    let data;
    if (data = action_options.data) {
      data = action_options.data;
    } else if (method !== 'GET') {
      data = ElementHelper.toData(element);
    }

    if (method === 'POST') {
      if (!element.isNew()) { throw new Error('Element is not new'); }
    } else {
      if (element.isNew()) { throw new Error('Element is new'); }
    }

    let promise = Ajax.executeRequest(
      UrlHelper.createForElement(method, {} as ActionConfiguration, element, action_options.url_options || {}, method === 'POST'),
      method,
      data,
      action_options.headers
    );
    promise.then((response: AjaxResponse): void => {
      if (response.data) {
        element.merge(response.data);
      }
      element.snapshots.make(`after_${method.toLowerCase()}`);

      let collection = element.collection();

      if (Util.includes(collection.new_elements, element)) {
        Util.removeFromArray(collection.new_elements, element);
        collection.elements.set(element.selector() as SelectorValue, element);
      }
    });

    return promise;
  }

  export function executeCustom(element: Element, action_name: string, action_config: ActionConfiguration, action_options?: ActionOptions): AjaxPromise {
    if (!action_options) { action_options = {}; }

    const method = action_config.method.toUpperCase();
    element.snapshots.make(`before_${action_name}`);

    let data;
    if (action_options.data) {
      data = action_options.data;
    } else if (!action_config.no_data) {
      data = ElementHelper.toData(element);
    }

    const promise = Ajax.executeRequest(
      UrlHelper.createForElement(action_name, action_config, element, action_options.url_options || {}),
      method,
      data,
      action_options.headers
    );
    promise.then((response: AjaxResponse) => {
      let selector_value;
      if (!action_config.returns_other) {
        if (response.data) {
          element.merge(response.data);
        }
        element.snapshots.make(`after_${method.toLowerCase()}`);
      }

      const collection = element.collection();

      if ((selector_value = element.selector()) && Util.includes(collection.new_elements, element)) {
        Util.removeFromArray(collection.new_elements, element);
        return collection.elements.set(selector_value, element);
      }
    });

    return promise;
  };
}
