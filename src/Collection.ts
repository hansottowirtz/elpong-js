import { Elpong } from './Elpong';
import { Scheme } from './Scheme';
import { PreElement } from './PreElement';
import { CollectionHelper } from './Helpers';
import { Element, SelectorValue } from './Element';
import { Util } from './Util';
import { ActionConfiguration, CollectionConfiguration } from './Configuration';
import { Actions, CollectionActionOptions } from './Helpers/Collection/Actions';
import { AjaxPromise } from './Ajax';
import { ElpongError } from './Errors';

export interface ElementMap {
  [key: string]: Element;
}

export type CollectionActionFunction = (action_options?: CollectionActionOptions) => AjaxPromise;
export type GetOneCollectionActionFunction = (selector_value: SelectorValue, action_options?: CollectionActionOptions) => AjaxPromise;

export interface CollectionActions {
  // only CollectionActionFunction gives an error https://github.com/Microsoft/TypeScript/issues/10042
  [action_name: string]: CollectionActionFunction | GetOneCollectionActionFunction;
  getAll: CollectionActionFunction;
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
  readonly _scheme: Scheme;
  readonly name: string;
  private readonly default_pre_element: PreElement;
  readonly elements: ElementMap;
  readonly new_elements: Element[];
  readonly actions: CollectionActions;

  constructor(scheme: Scheme, name: string) {
    this._scheme = scheme;
    this.name = name;
    this.elements = {};
    this.new_elements = [];
    this.default_pre_element = {};

    let config = CollectionHelper.getConfiguration(this);

    for (let field_key in config.fields) {
      let field_config = config.fields[field_key];

      if (field_config.default) {
        this.default_pre_element[field_key] = field_config.default;
      }
    }

    // for collection_action_name, collection_action_settings of settings.collection_actions
    //   @actions[HP.Util.camelize(collection_action_name)] = ->
    //     # collection_action_options = {method: collection_action_settings.method.toUpperCase(), }
    //     # new_options = HP.Util.merge(HP.Util.merge({method: 'GET'}, {meth}), options)
    //     # HPP.http_function(new_options)

    this.actions = {
      getAll: (action_options?: CollectionActionOptions) => {
        return Actions.executeGetAll(this, action_options);
      },
      getOne: (selector_value: SelectorValue, action_options?: CollectionActionOptions) => {
        return Actions.executeGetOne(this, selector_value, action_options);
      }
    };

    Util.forEach(config.collection_actions, (action_config: ActionConfiguration, action_name: string) => {
      this.actions[Util.camelize(action_name)] = (action_options: CollectionActionOptions) =>
        Actions.executeCustom(this, action_name, action_config, action_options);
    });
  }

  scheme(): Scheme {
    return this._scheme;
  }

  load(ignore_empty: boolean): void {
    if (typeof document === 'undefined') return

    let collection_tags: NodeListOf<HTMLMetaElement> =
      document.querySelectorAll(`meta[name=elpong-collection][collection='${this.name}'][scheme='${this.scheme().name}']`) as NodeListOf<HTMLMetaElement>;
    let element_tags: NodeListOf<HTMLMetaElement> =
      document.querySelectorAll(`meta[name=elpong-element][collection='${this.name}'][scheme='${this.scheme().name}']`) as NodeListOf<HTMLMetaElement>;

    if (!ignore_empty && !collection_tags.length && !element_tags.length) {
      throw new ElpongError('elpnce');
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
    return arr.concat(Util.values(this.elements));
  }

  find(selector_value: SelectorValue): Element|null {
    return this.elements[selector_value] || null;
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
