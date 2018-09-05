import { AjaxPromise } from './Ajax';
import { Collection } from './Collection';
import { EmbeddedCollectionFieldConfiguration, EmbeddedElementFieldConfiguration, FieldConfiguration } from './Configuration';
import { ElpongError, ElpongErrorType } from './Errors';
import { ActionOptions, setup as actionsSetup } from './Helpers/Element/Actions';
import { setup as fieldsSetup } from './Helpers/Element/Fields';
import { handle as embeddedCollectionHandle } from './Helpers/Element/Fields/EmbeddedCollection';
import { handle as embeddedElementHandle } from './Helpers/Element/Fields/EmbeddedElement';
import { setup as relationsSetup } from './Helpers/Element/Relations';
import { setup as snapshotsSetup } from './Helpers/Element/Snapshots';
import { PreElement } from './PreElement';
import { Snapshot } from './Snapshot';
import { forEach, includes, removeFromArray } from './Util';

export type SelectorValue = string | number;

export function isSelectorValue(v: any): v is SelectorValue {
  return (!!v || v === 0 || v === '') && (typeof v === 'string' || typeof v === 'number');
}

export interface Fields {
  [fieldKey: string]: any;
}

export type RelationFunction = () => Element | Element[] | null | undefined;

export interface Relations {
  [relationFunctionName: string]: RelationFunction;
}

export type ActionFunction = (actionOptions?: ActionOptions) => AjaxPromise;

export interface Actions {
  get: ActionFunction;
  post: ActionFunction;
  put: ActionFunction;
  delete: ActionFunction;
  [actionName: string]: ActionFunction;
}

export interface Snapshots {
  make: (tag?: string) => void;
  list: Snapshot[];
  currentIndex: number;
  undo: (identifier: number | string | RegExp) => Element;
  lastPersisted: () => Snapshot | undefined;
  lastWithTag: (tag: string | RegExp) => Snapshot | undefined;
  last: () => Snapshot | undefined;
  isPersisted: () => boolean;
}

export class Element {
  readonly _collection: Collection;
  readonly fields: Fields = {} as Fields;
  readonly relations: Relations = {} as Relations;
  readonly actions: Actions = {} as Actions;
  readonly snapshots: Snapshots = {} as Snapshots;

  constructor(collection: Collection, preElement: PreElement) {
    this._collection = collection;

    const collectionConfig = collection.configuration();

    fieldsSetup(this, collectionConfig.fields, preElement);
    relationsSetup(this, collectionConfig.relations);
    actionsSetup(this, collectionConfig.actions);
    snapshotsSetup(this);

    this.snapshots.make('creation');
  }

  collection(): Collection {
    return this._collection;
  }

  selector(): SelectorValue | undefined {
    return this.fields[this.collection().scheme().configuration().selector];
  }

  remove() {
    const selectorValue: SelectorValue | undefined = this.selector();
    if (selectorValue !== undefined) {
      return this.actions.delete().then(() => {
        const elements = this.collection().elements;
        elements.delete(selectorValue);
      });
    } else {
      removeFromArray(this.collection().newElements, this);
      return {
        then(fn: () => any) { return fn(); },
        catch() { return; }
      };
    }
  }

  save(): AjaxPromise {
    if (this.isNew()) {
      return this.actions.post();
    } else {
      return this.actions.put();
    }
  }

  isNew(): boolean {
    if (includes(this.collection().newElements, this)) {
      if (this.selector()) {
        throw new ElpongError(ElpongErrorType.ELESNA);
      } else {
        return true;
      }
    } else {
      if (!this.selector()) {
        throw new ElpongError(ElpongErrorType.ELESNE);
      } else {
        return false;
      }
    }
  }

  merge(preElement: PreElement): this {
    const collectionConfig = this.collection().configuration();
    const selectorKey = this.collection().scheme().configuration().selector;
    forEach(collectionConfig.fields, (fieldConfig: FieldConfiguration, fieldKey: string) => {
      const fieldValue = preElement[fieldKey] ;
      if (fieldValue) {
        if (fieldConfig.embedded_element) {
          embeddedElementHandle(this, preElement, fieldKey, fieldConfig as EmbeddedElementFieldConfiguration);
        } else if (fieldConfig.embedded_collection) {
          embeddedCollectionHandle(this, preElement, fieldKey, fieldConfig as EmbeddedCollectionFieldConfiguration);
        } else if (fieldKey === selectorKey) {
          const selectorValue = this.fields[fieldKey];
          if ((selectorValue !== fieldValue) && isSelectorValue(selectorValue) && isSelectorValue(fieldValue)) {
            throw new ElpongError(ElpongErrorType.ELESCH, `${selectorValue} -> ${fieldValue}`);
          }
          this.fields[fieldKey] = fieldValue;
        } else {
          this.fields[fieldKey] = fieldValue;
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
