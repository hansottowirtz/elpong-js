import { Collection } from './Collection';
import { PreElement } from './PreElement';
import { Util } from './Util';

import { Fields } from './Helpers/Element/Fields';
import { Relations } from './Helpers/Element/Relations';
import { Actions } from './Helpers/Element/Actions';

import { ElpongError } from './Errors';

export type SelectorValue = string|number;

interface Fields {
  [field_name: string]: any;
}

interface Relations {
  [relation_function_name: string]: Function;
}

interface Actions {
  get: Function;
  post: Function;
  put: Function;
  delete: Function;
  [action_name: string]: Function;
}

export class Element {
  readonly _collection: Collection;
  readonly fields: Fields = {} as Fields;
  readonly relations: Relations = {} as Relations;
  readonly actions: Actions = {} as Actions;
  private last_snapshot_time: number;

  constructor(collection: Collection, pre_element: PreElement) {
    this._collection = collection;

    let collection_config = collection.configuration();

    Fields.setup(this, collection_config.fields, pre_element);
    Relations.setup(this, collection_config.relations);
    Actions.setup(this, collection_config.actions);
    // Helpers.ElementHelper.setupSnapshots(epe);

    this.last_snapshot_time = null;
    // this.snapshots.make('creation');

    // TODO: snapshots
  }

  collection() {
    return this._collection;
  }

  selector(): SelectorValue|undefined {
    return this.fields[this.collection().scheme().configuration().selector];
  }

  remove() {
    let element = this;
    if (this.isNew()) {
      Util.removeFromArray(this.collection().new_elements, this);
      return {then(fn) { return fn(); }, catch() {}};
    } else {
      return this.actions.delete().then(() => {
        let elements = this.collection().elements;
        return delete elements[this.selector()];
      });
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

  // undo(n) {
  //   if (n == null) { n = 0; }
  //   if (Util.isInteger(n)) {
  //     if (n > 1000000) {
  //       if (this.snapshots.list[n]) {
  //         this.merge(this.snapshots.list[n].data);
  //         return this.last_snapshot_time = n;
  //       } else {
  //         throw new Error(`Diff at time ${n} does not exist`);
  //       }
  //     } else if (n < 0) {
  //       throw new Error(`${n} is smaller than 0`);
  //     } else {
  //       let ds = SnapshotHelper.getSortedArray(this.snapshots.list);
  //       let { length } = ds;
  //       let index = ds.indexOf(this.snapshots.list[this.last_snapshot_time]);
  //       // index = 0 if index < 0
  //       let d = ds[index - n];
  //       this.merge(d.data);
  //       return this.last_snapshot_time = d.time;
  //     }
  //   } else if (HP.Util.isString(n)) {
  //     let a = null;
  //     for (let v of Array.from(HPP.Helpers.Snapshot.getSortedArray(this.snapshots.list))) {
  //       if (v.tag === n) {
  //         if (!a) { a = v; }
  //       }
  //     }
  //     if (a) {
  //       return this.merge(a.data);
  //     } else {
  //       throw new Error(`No snapshot found with tag ${n}`);
  //     }
  //   } else {
  //     throw new TypeError(`Don't know what to do with ${n}`);
  //   }
  // }

  merge(pre_element) {
    let collection_settings = this.collection().configuration();
    Util.forEach(collection_settings.fields, (field_settings, field_name) => {
      let field_value;
      if (field_value = pre_element[field_name]) {
        if (field_settings.embedded_element) {
          Fields.handleEmbeddedElement(this, pre_element, field_name, field_settings);
        } else if (field_settings.embedded_collection) {
          Fields.handleEmbeddedCollection(this, pre_element, field_name, field_settings);
        } else {
          let sv_1 = this.fields[field_name];
          if (field_settings.selector && (sv_1 !== field_value) && sv_1 && field_value) {
            throw new Error(`Selector has changed from ${sv_1} to ${field_value}`);
          }
          this.fields[field_name] = field_value;
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
