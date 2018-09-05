import { Ajax, AjaxResponse, AjaxData, AjaxHeaders, AjaxPromise } from '../../Ajax';
import { ActionConfigurationMap, ActionConfiguration } from '../../Configuration';
import { Element, SelectorValue } from '../../Element';
import { Util } from '../../Util';
import { ElpongError, ElpongErrorType } from '../../Errors';
import { ElementHelper } from '../ElementHelper';
import { UrlHelper, UrlHelperElementOptions } from '../UrlHelper';

export interface ActionOptions {
  data?: AjaxData;
  headers?: AjaxHeaders;
  params?: any;
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
        if (element.isNew() && !action_config.no_selector) { throw new ElpongError(ElpongErrorType.ELENEW); }
        return executeCustom(element, action_name, action_config, action_options);
      }
    });
  }

  export function execute(element: Element, method: string, action_options: ActionOptions = {}): AjaxPromise {
    element.snapshots.make(`before_${method.toLowerCase()}`);

    let data;
    if (action_options.data) {
      if (method !== 'GET') {
        data = action_options.data;
      } else {
        throw new ElpongError(ElpongErrorType.AJXGDA);
      }
    } else if (method !== 'GET') {
      data = ElementHelper.toData(element);
    }

    if (method === 'POST') {
      if (!element.isNew()) { throw new ElpongError(ElpongErrorType.ELENNW); }
    } else {
      if (element.isNew()) { throw new ElpongError(ElpongErrorType.ELENEW); }
    }

    const url_options: UrlHelperElementOptions = {
      no_selector: method === 'POST',
      params: action_options.params || {}
    }

    let promise = Ajax.executeRequest(
      UrlHelper.createForElement(element, url_options),
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

  export function executeCustom(element: Element, action_name: string, action_config: ActionConfiguration, action_options: ActionOptions = {}): AjaxPromise {
    const method = action_config.method.toUpperCase();
    element.snapshots.make(`before_${action_name}`);

    let data;
    if (action_options.data) {
      if (method !== 'GET') {
        data = action_options.data;
      } else {
        throw new ElpongError(ElpongErrorType.AJXGDA);
      }
    } else if (!action_config.no_data) {
      data = ElementHelper.toData(element);
    }

    const url_options: UrlHelperElementOptions = {
      suffix: action_config.path || action_name,
      params: action_options.params || {}
    };
    url_options.no_selector = action_config.no_selector;

    const promise = Ajax.executeRequest(
      UrlHelper.createForElement(element, url_options),
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
  }
}
