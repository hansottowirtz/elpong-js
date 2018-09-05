import { AjaxPromise } from './Ajax';
import { ActionConfiguration, CollectionConfiguration } from './Configuration';
import { Element, SelectorValue } from './Element';
import { ElpongError, ElpongErrorType } from './Errors';
import { FakeMap } from './FakeThings';
import { CollectionActionOptions, executeCustom, executeGetAll, executeGetOne } from './Helpers/Collection/CollectionActions';
import { addElement, getConfiguration } from './Helpers/CollectionHelper';
import { PreElement } from './PreElement';
import { Scheme } from './Scheme';
import { arrayFromHTML, camelize, forEach } from './Util';

export type ElementMap = FakeMap;

export type GetAllCollectionActionFunction = (actionOptions?: CollectionActionOptions) => AjaxPromise;
export type GetOneCollectionActionFunction = (selectorValue?: SelectorValue, actionOptions?: CollectionActionOptions) => AjaxPromise;
// SelectorValue needs to be an argument type because of https://github.com/Microsoft/TypeScript/issues/10042
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
  private readonly _scheme: Scheme;
  private readonly _defaultPreElement: PreElement;

  constructor(scheme: Scheme, name: string) {
    this._scheme = scheme;
    this.name = name;
    this.elements = new FakeMap();
    this.newElements = [];
    this._defaultPreElement = {};

    const config = getConfiguration(this);

    for (const fieldKey in config.fields) {
      const fieldConfig = config.fields[fieldKey];

      if (fieldConfig.default) {
        this._defaultPreElement[fieldKey] = fieldConfig.default;
      }
    }

    this.actions = {
      getAll: (actionOptions?: CollectionActionOptions) => {
        return executeGetAll(this, actionOptions);
      },
      getOne: (selectorValue?: SelectorValue, actionOptions?: CollectionActionOptions) => {
        if (selectorValue === undefined) { throw new ElpongError(ElpongErrorType.ELENOS); }
        return executeGetOne(this, selectorValue, actionOptions);
      }
    };
    forEach(config.collection_actions, (actionConfig: ActionConfiguration, actionName: string) => {
      this.actions[camelize(actionName)] = (actionOptions: CollectionActionOptions = {}) =>
        executeCustom(this, actionName, actionConfig, actionOptions);
    });
  }

  scheme(): Scheme {
    return this._scheme;
  }

  load(ignoreEmpty: boolean): void {
    if (typeof document === 'undefined') { throw new ElpongError(ElpongErrorType.ELPNDC); }

    const collectionTags: NodeListOf<HTMLMetaElement> =
      document.querySelectorAll(`meta[name=elpong-collection][collection='${this.name}'][scheme='${this.scheme().name}']`) as NodeListOf<HTMLMetaElement>;
    const elementTags: NodeListOf<HTMLMetaElement> =
      document.querySelectorAll(`meta[name=elpong-element][collection='${this.name}'][scheme='${this.scheme().name}']`) as NodeListOf<HTMLMetaElement>;

    if (!ignoreEmpty && !collectionTags.length && !elementTags.length) {
      throw new ElpongError(ElpongErrorType.ELPNCE);
    }

    for (const collectionTag of arrayFromHTML(collectionTags) as HTMLMetaElement[]) {
      for (const preElement of JSON.parse(collectionTag.content) as PreElement[]) {
        this.buildOrMerge(preElement);
      }
    }
    arrayFromHTML(elementTags).map((elementTag: HTMLMetaElement) =>
      this.buildOrMerge(JSON.parse(elementTag.content)));
  }

  configuration(): CollectionConfiguration {
    return getConfiguration(this);
  }

  // Get an array of all elements
  //
  // @return {Element[]} Array of elements
  array(options?: CollectionArrayOptions): Element[] {
    if (!options) { options = {noNew: false}; }
    const arr = options.noNew ? [] : this.newElements;
    return arr.concat(this.elements.values());
  }

  find(selectorValue: SelectorValue): Element | null {
    return this.elements.get(selectorValue) || null;
  }

  findBy(fieldsKeyValueMap: FieldsKeyValueMap, findOptions: CollectionFindByOptions): Element | Element[] | null {
    if (!findOptions) { findOptions = {}; }

    let isCorrect;
    const arr = this.array(findOptions);
    const responseArr: Element[] = [];

    for (const element of arr) {
      isCorrect = true;
      for (const fieldKey in fieldsKeyValueMap) {
        const fieldValue = fieldsKeyValueMap[fieldKey];
        if (element.fields[fieldKey] !== fieldValue) {
          isCorrect = false;
          break;
        }
      }
      if (isCorrect) {
        if (findOptions.multiple) {
          responseArr.push(element);
        } else {
          return element;
        }
      }
    }
    if (findOptions.multiple) {
      return responseArr;
    } else {
      return null;
    }
  }

  build(preElement: PreElement): Element {
    if (!preElement) { preElement = this._defaultPreElement; }
    const el = new Element(this, preElement);
    addElement(this, el);
    return el;
  }

  buildOrMerge(preElement: PreElement): Element {
    const sv = preElement[this.scheme().configuration().selector];
    if (sv) {
      const el = this.find(sv);
      if (el) {
        return el.merge(preElement);
      } else {
        return this.build(preElement);
      }
    } else {
      return this.build(preElement);
    }
  }
}
