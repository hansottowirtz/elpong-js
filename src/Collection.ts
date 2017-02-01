import { Scheme } from './Scheme';
import { PreElement } from './PreElement';
import { CollectionHelper } from './Helpers';
import { Element, SelectorValue } from './Element';
import { Util } from './Util';
import { ActionConfiguration } from './Configuration';
import { Actions, CollectionActionOptions } from './Helpers/Collection/Actions';

interface ElementMap {
  [key: string]: Element;
}

interface CollectionActions {
  getAll: Function;
  getOne: Function;
  [action_name: string]: Function;
}

interface CollectionArrayOptions {
  no_new?: boolean;
}

export interface CollectionFindByOptions extends CollectionArrayOptions {
  multiple?: boolean;
}

interface FieldsKeyValueMap {
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
      getAll: (user_options: CollectionActionOptions) => {
        return Actions.executeGetAll(this, user_options);
      },
      getOne: (selector_value: SelectorValue, user_options: CollectionActionOptions) => {
        return Actions.executeGetOne(this, selector_value, user_options);
      }
    };

    Util.forEach(config.collection_actions, (action_config: ActionConfiguration, action_name: string) => {
      this.actions[Util.camelize(action_name)] = (action_options: CollectionActionOptions) => {
        Actions.executeCustom(this, action_name, action_config, action_options);
      }
    });
  }

  scheme() {
    return this._scheme;
  }

  load() {
    let collection_tags: NodeListOf<HTMLMetaElement> =
      document.querySelectorAll(`meta[name=elpong-collection][collection='${this.name}'][scheme='${this.scheme().name}']`) as NodeListOf<HTMLMetaElement>;
    let element_tags: NodeListOf<HTMLMetaElement> =
      document.querySelectorAll(`meta[name=elpong-element][collection='${this.name}'][scheme='${this.scheme().name}']`) as NodeListOf<HTMLMetaElement>;
    for (let collection_tag of Util.arrayFromHTML(collection_tags) as Array<HTMLMetaElement>) {
      for (let pre_element of JSON.parse(collection_tag.content) as Array<PreElement>) {
        this.buildOrMerge(pre_element);
      }
    }
    return Util.arrayFromHTML(element_tags).map((element_tag: HTMLMetaElement) =>
      this.buildOrMerge(JSON.parse(element_tag.content)));
  }

  configuration() {
    return CollectionHelper.getConfiguration(this);
  }

  // Get an array of all elements
  //
  // @return {Element[]} Array of elements
  array(options?: CollectionArrayOptions) {
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
        }
        else {
          return element;
        }
      }
    }
    if (find_options.multiple) {
      return response_arr;
    }
    else {
      return null;
    }
  }

  build(pre_element: PreElement) {
    if (pre_element == null) { pre_element = this.default_pre_element; }
    let el = new Element(this, pre_element);
    CollectionHelper.addElement(this, el);
    return el;
  }

  buildOrMerge(pre_element: PreElement) {
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
