import { AjaxData, AjaxHeaders, AjaxPromise, AjaxResponse, executeRequest } from '../../Ajax';
import { Collection } from '../../Collection';
import { CollectionActionConfiguration } from '../../Configuration';
import { SelectorValue } from '../../Element';
import { ElpongError, ElpongErrorType } from '../../Errors';
import { PreElement } from '../../PreElement';
import { createForCollection, UrlHelperOptions } from '../UrlHelper';

export interface CollectionActionOptions {
  data?: AjaxData;
  headers?: AjaxHeaders;
  params?: any;
}

export function executeGetAll(collection: Collection, actionOptions: CollectionActionOptions = {}): AjaxPromise {
  if (!actionOptions) actionOptions = {};
  if (actionOptions.data) {
    throw new ElpongError(ElpongErrorType.AJXGDA);
  }

  const promise = executeRequest(
    createForCollection(collection, {params: actionOptions.params || {}}),
    'GET',
    undefined,
    actionOptions.headers
  );
  promise.then((response: AjaxResponse) => {
    response.data.map((preElement: PreElement) => {
      collection.buildOrMerge(preElement);
    });
  });
  return promise;
}

export function executeGetOne(collection: Collection, selectorValue: SelectorValue, actionOptions: CollectionActionOptions = {}) {
  if (actionOptions.data) {
    throw new ElpongError(ElpongErrorType.AJXGDA);
  }

  const urlOptions: UrlHelperOptions = {
    params: actionOptions.params || {},
    suffix: selectorValue as string
  };

  const promise = executeRequest(
    createForCollection(collection, urlOptions),
    'GET',
    undefined,
    actionOptions.headers
  );
  promise.then((response: AjaxResponse) => {
    if (response.data) {
      const selectorKey = collection.scheme().configuration().selector;
      if (response.data[selectorKey] !== selectorValue) {
        throw new ElpongError(ElpongErrorType.ELESNM, `${response.data[selectorKey]} != ${selectorValue}`);
      }
      collection.buildOrMerge(response.data);
    }
  });
  return promise;
}

export function executeCustom(collection: Collection, actionName: string, actionConfig: CollectionActionConfiguration, actionOptions?: CollectionActionOptions) {
  if (!actionOptions) { actionOptions = {}; }
  const data = actionOptions.data;

  const method = actionConfig.method.toUpperCase();

  return executeRequest(
    createForCollection(collection, {suffix: actionConfig.path || actionName, params: actionOptions.params}),
    method,
    data,
    actionOptions.headers
  );
}
