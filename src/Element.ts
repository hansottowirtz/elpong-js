import { Collection } from './Collection';
import { PreElement } from './PreElement';
import { Util } from './Util';
import { AjaxPromise } from './Ajax';
import { Snapshot } from './Snapshot';

import { Fields } from './Helpers/Element/Fields';
import { Relations } from './Helpers/Element/Relations';
import { Actions, ActionOptions } from './Helpers/Element/Actions';
import { Snapshots } from './Helpers/Element/Snapshots';

import { EmbeddedElement } from './Helpers/Element/Fields/EmbeddedElement';
import { EmbeddedCollection } from './Helpers/Element/Fields/EmbeddedCollection';

import { ElpongError } from './Errors';
import { FieldConfiguration, EmbeddedElementFieldConfiguration, EmbeddedCollectionFieldConfiguration } from './Configuration';

export type SelectorValue = string|number;

export function isSelectorValue(v: any): v is SelectorValue {
  return (!!v || v === 0 || v === '') && (typeof v === 'string' || typeof v === 'number');
}

interface Fields {
  [field_key: string]: any;
}

type RelationFunction = () => Element|Element[]|null|undefined;

interface Relations {
  [relation_function_name: string]: RelationFunction;
}

type ActionFunction = (action_options?: ActionOptions) => AjaxPromise;

interface Actions {
  get: ActionFunction;
  post: ActionFunction;
  put: ActionFunction;
  delete: ActionFunction;
  [action_name: string]: ActionFunction;
}

interface Snapshots {
  make: Function;
  list: Snapshot[];
  current_index: number;
  undo: (identifier: number|string|RegExp) => Element;
  lastPersisted: () => Snapshot|undefined;
  lastWithTag: (tag: string|RegExp) => Snapshot|undefined;
  last: () => Snapshot|undefined;
  isPersisted: () => boolean;
}

export class Element {
  readonly _collection: Collection;
  readonly fields: Fields = {} as Fields;
  readonly relations: Relations = {} as Relations;
  readonly actions: Actions = {} as Actions;
  readonly snapshots: Snapshots = {} as Snapshots;

  constructor(collection: Collection, pre_element: PreElement) {
    this._collection = collection;

    let collection_config = collection.configuration();

    Fields.setup(this, collection_config.fields, pre_element);
    Relations.setup(this, collection_config.relations);
    Actions.setup(this, collection_config.actions);
    Snapshots.setup(this);

    this.snapshots.make('creation');
  }

  collection() {
    return this._collection;
  }

  selector(): SelectorValue|undefined {
    return this.fields[this.collection().scheme().configuration().selector];
  }

  remove() {
    let selector_value: SelectorValue|undefined;
    if (selector_value = this.selector()) {
      return this.actions.delete().then(() => {
        let elements = this.collection().elements;
        delete elements[selector_value as SelectorValue];
      });
    } else {
      Util.removeFromArray(this.collection().new_elements, this);
      return {
        then: function(fn: Function) { return fn(); },
        catch: function() {}
      };
    }
  }

  save() {
    if (this.isNew()) {
      return this.actions.post();
    } else {
      return this.actions.put();
    }
  }

  isNew() {
    if (Util.includes(this.collection().new_elements, this)) {
      if (this.selector()) {
        throw new ElpongError('elesna');
      } else {
        return true;
      }
    } else {
      if (!this.selector()) {
        throw new ElpongError('elense');
      } else {
        return false;
      }
    }
  }

  merge(pre_element: PreElement) {
    let collection_config = this.collection().configuration();
    let selector_key = this.collection().scheme().configuration().selector;
    Util.forEach(collection_config.fields, (field_config: FieldConfiguration, field_key: string) => {
      let field_value;
      if (field_value = pre_element[field_key]) {
        if (field_config.embedded_element) {
          EmbeddedElement.handle(this, pre_element, field_key, field_config as EmbeddedElementFieldConfiguration);
        } else if (field_config.embedded_collection) {
          EmbeddedCollection.handle(this, pre_element, field_key, field_config as EmbeddedCollectionFieldConfiguration);
        } else if (field_key === selector_key) {
          let selector_value = this.fields[field_key];
          if ((selector_value !== field_value) && isSelectorValue(selector_value) && isSelectorValue(field_value)) {
            throw new ElpongError('elesch', `${selector_value} -> ${field_value}`);
          }
          this.fields[field_key] = field_value;
        } else {
          this.fields[field_key] = field_value;
        }
      }
    });
    return this;
  }

  // isPersisted() {
  //   if (this.isNew()) { return false; }
  //   let { data } = this.snapshots.getLastPersisted();
  //   let object = HPP.Helpers.Element.getFields(this);
  //   for (let k in object) {
  //     let v = object[k];
  //     if (data[k] !== v) { return false; }
  //   }
  //   return true;
  // }
}
