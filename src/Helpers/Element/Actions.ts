import { AjaxData, AjaxHeaders, AjaxPromise, AjaxResponse, executeRequest } from '../../Ajax';
import { ActionConfiguration, ActionConfigurationMap } from '../../Configuration';
import { Element, SelectorValue } from '../../Element';
import { ElpongError, ElpongErrorType } from '../../Errors';
import { camelize, forEach, includes, removeFromArray } from '../../Util';
import { toData } from '../ElementHelper';
import { createForElement, UrlHelperElementOptions } from '../UrlHelper';

export interface ActionOptions {
  data?: AjaxData;
  headers?: AjaxHeaders;
  params?: any;
}

export function setup(element: Element, actionsConfig: ActionConfigurationMap) {
  for (const method of ['get', 'post', 'put', 'delete']) {
    element.actions[method] = (actionOptions: ActionOptions) => {
      return execute(element, method.toUpperCase(), actionOptions);
    };
  }

  forEach(actionsConfig, (actionConfig: ActionConfiguration, actionName: string) => {
    element.actions[camelize(actionName)] = (actionOptions: ActionOptions) => {
      if (element.isNew() && !actionConfig.no_selector) { throw new ElpongError(ElpongErrorType.ELENEW); }
      return executeCustom(element, actionName, actionConfig, actionOptions);
    };
  });
}

export function execute(element: Element, method: string, actionOptions: ActionOptions = {}): AjaxPromise {
  element.snapshots.make(`before_${method.toLowerCase()}`);

  let data;
  if (actionOptions.data) {
    if (method !== 'GET') {
      data = actionOptions.data;
    } else {
      throw new ElpongError(ElpongErrorType.AJXGDA);
    }
  } else if (method !== 'GET') {
    data = toData(element);
  }

  if (method === 'POST') {
    if (!element.isNew()) { throw new ElpongError(ElpongErrorType.ELENNW); }
  } else {
    if (element.isNew()) { throw new ElpongError(ElpongErrorType.ELENEW); }
  }

  const urlOptions: UrlHelperElementOptions = {
    noSelector: method === 'POST',
    params: actionOptions.params || {}
  };

  const promise = executeRequest(
    createForElement(element, urlOptions),
    method,
    data,
    actionOptions.headers
  );
  promise.then((response: AjaxResponse): void => {
    if (response.data) {
      element.merge(response.data);
    }
    element.snapshots.make(`after_${method.toLowerCase()}`);

    const collection = element.collection();

    if (includes(collection.newElements, element)) {
      removeFromArray(collection.newElements, element);
      collection.elements.set(element.selector() as SelectorValue, element);
    }
  });

  return promise;
}

export function executeCustom(element: Element, actionName: string, actionConfig: ActionConfiguration, actionOptions: ActionOptions = {}): AjaxPromise {
  const method = actionConfig.method.toUpperCase();
  element.snapshots.make(`before_${actionName}`);

  let data;
  if (actionOptions.data) {
    if (method !== 'GET') {
      data = actionOptions.data;
    } else {
      throw new ElpongError(ElpongErrorType.AJXGDA);
    }
  } else if (!actionConfig.no_data) {
    data = toData(element);
  }

  const urlOptions: UrlHelperElementOptions = {
    params: actionOptions.params || {},
    suffix: actionConfig.path || actionName
  };
  urlOptions.noSelector = actionConfig.no_selector;

  const promise = executeRequest(
    createForElement(element, urlOptions),
    method,
    data,
    actionOptions.headers
  );
  promise.then((response: AjaxResponse) => {
    if (!actionConfig.returns_other) {
      if (response.data) {
        element.merge(response.data);
      }
      element.snapshots.make(`after_${method.toLowerCase()}`);
    }

    const collection = element.collection();
    const selectorValue = element.selector();
    if (selectorValue && includes(collection.newElements, element)) {
      removeFromArray(collection.newElements, element);
      collection.elements.set(selectorValue, element);
    }
  });

  return promise;
}
