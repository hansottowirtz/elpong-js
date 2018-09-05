import { Scheme } from './Scheme';
import { CollectionHelper } from './Helpers';
import { Element, SelectorValue } from './Element';
import { Util } from './Util';
import { ActionConfiguration, CollectionConfiguration } from './Configuration';
import { CollectionActions, CollectionActionOptions } from './Helpers/Collection/CollectionActions';
import { AjaxPromise } from './Ajax';
import { ElpongError, ElpongErrorType } from './Errors';
import { FakeMap } from './FakeThings';
import { PreElement } from './PreElement';

export type ElementMap = FakeMap;

export type GetAllCollectionActionFunction = (action_options?: CollectionActionOptions) => AjaxPromise;
export type GetOneCollectionActionFunction = (selector_value?: SelectorValue, action_options?: CollectionActionOptions) => AjaxPromise;
// SelectorValue needs to be an argument type because of https://github.com/Microsoft/TypeScript/issues/10042
export type CustomCollectionActionFunction = (action_options?: CollectionActionOptions|SelectorValue) => AjaxPromise;

export interface CollectionActions {
  [action_name: string]: CustomCollectionActionFunction;
  getAll: GetAllCollectionActionFunction;
  getOne: GetOneCollectionActionFunction;
}

export interface CollectionArrayOptions {
  no_new?: boolean;
}

export interface CollectionFindByOptions extends CollectionArrayOptions {
  multiple?: boolean;
}

export interface FieldsKeyValueMap {
  [key: string]: any;
}

export class Collection {
  private readonly _scheme: Scheme;
  readonly name: string;
  private readonly default_pre_element: PreElement;
  readonly elements: FakeMap;
  readonly new_elements: Element[];
  readonly actions: CollectionActions;

  constructor(scheme: Scheme, name: string) {
    this._scheme = scheme;
    this.name = name;
    this.elements = new FakeMap();
    this.new_elements = [];
    this.default_pre_element = {};

    let config = CollectionHelper.getConfiguration(this);

    for (let field_key in config.fields) {
      let field_config = config.fields[field_key];

      if (field_config.default) {
        this.default_pre_element[field_key] = field_config.default;
      }
    }

    this.actions = {
      getAll: (action_options?: CollectionActionOptions) => {
        return CollectionActions.executeGetAll(this, action_options);
      },
      getOne: (selector_value?: SelectorValue, action_options?: CollectionActionOptions) => {
        if (selector_value === undefined) { throw new ElpongError(ElpongErrorType.ELENOS); }
        return CollectionActions.executeGetOne(this, selector_value, action_options);
      }
    };
    Util.forEach(config.collection_actions, (action_config: ActionConfiguration, action_name: string) => {
      this.actions[Util.camelize(action_name)] = (action_options: CollectionActionOptions = {}) =>
        CollectionActions.executeCustom(this, action_name, action_config, action_options);
    });
  }

  scheme(): Scheme {
    return this._scheme;
  }

  load(ignore_empty: boolean): void {
    if (typeof document === 'undefined') throw new ElpongError(ElpongErrorType.ELPNDC);

    let collection_tags: NodeListOf<HTMLMetaElement> =
      document.querySelectorAll(`meta[name=elpong-collection][collection='${this.name}'][scheme='${this.scheme().name}']`) as NodeListOf<HTMLMetaElement>;
    let element_tags: NodeListOf<HTMLMetaElement> =
      document.querySelectorAll(`meta[name=elpong-element][collection='${this.name}'][scheme='${this.scheme().name}']`) as NodeListOf<HTMLMetaElement>;

    if (!ignore_empty && !collection_tags.length && !element_tags.length) {
      throw new ElpongError(ElpongErrorType.ELPNCE);
    }

    for (let collection_tag of Util.arrayFromHTML(collection_tags) as HTMLMetaElement[]) {
      for (let pre_element of JSON.parse(collection_tag.content) as PreElement[]) {
        this.buildOrMerge(pre_element);
      }
    }
    Util.arrayFromHTML(element_tags).map((element_tag: HTMLMetaElement) =>
      this.buildOrMerge(JSON.parse(element_tag.content)));
  }

  configuration(): CollectionConfiguration {
    return CollectionHelper.getConfiguration(this);
  }

  // Get an array of all elements
  //
  // @return {Element[]} Array of elements
  array(options?: CollectionArrayOptions): Element[] {
    if (!options) { options = {no_new: false}; }
    let arr = options.no_new ? [] : this.new_elements;
    return arr.concat(this.elements.values());
  }

  find(selector_value: SelectorValue): Element|null {
    return this.elements.get(selector_value) || null;
  }

  findBy(fields_key_value_map: FieldsKeyValueMap, find_options: CollectionFindByOptions): Element|Element[]|null {
    if (!find_options) { find_options = {}; }

    let is_correct;
    let arr = this.array(find_options);
    let response_arr: Element[] = [];

    for (let element of arr) {
      is_correct = true;
      for (let field_key in fields_key_value_map) {
        let field_value = fields_key_value_map[field_key];
        if (element.fields[field_key] !== field_value) {
          is_correct = false;
          break;
        }
      }
      if (is_correct) {
        if (find_options.multiple) {
          response_arr.push(element);
        } else {
          return element;
        }
      }
    }
    if (find_options.multiple) {
      return response_arr;
    } else {
      return null;
    }
  }

  build(pre_element: PreElement): Element {
    if (!pre_element) { pre_element = this.default_pre_element; }
    let el = new Element(this, pre_element);
    CollectionHelper.addElement(this, el);
    return el;
  }

  buildOrMerge(pre_element: PreElement): Element {
    let sv;
    if (sv = pre_element[this.scheme().configuration().selector]) {
      let el;
      if (el = this.find(sv)) {
        return el.merge(pre_element);
      } else {
        return this.build(pre_element);
      }
    } else {
      return this.build(pre_element);
    }
  }
}
