import { Element } from '../../../Element';
import { Collection, CollectionFindByOptions } from '../../../Collection';
import { CollectionHelper } from '../../CollectionHelper';
import { Util } from '../../../Util';
import { HasManyRelationConfiguration, HasOneRelationConfiguration, FieldConfiguration } from '../../../Configuration';
import { ElpongError, ElpongErrorType } from '../../../Errors';

export type HasManyRelationFunction = () => Element[];

export namespace HasMany {
  export function setup(element: Element, relation_collection_name: string, relation_settings: HasManyRelationConfiguration) {
    let collection = element.collection();
    let collection_config = collection.configuration();

    let relation_collection = collection.scheme().select(relation_settings.collection || relation_collection_name);

    // let relation_field_settings: FieldConfiguration;
    // if (relation_field_settings = collection_config.fields[references_field_key]) {
    //   // throw new Error("Field #{field_key} of collection #{collection.getName()} are not references") if !relation_field_settings.references
    //   return element.relations[Util.camelize(relation_collection_name)] = (): Element[] =>
    //     getHasManyRelationArrayThroughReferencesField(element, relation_collection, references_field_key);
    //
    // }

    if (relation_settings.inline) {
      let references_field_key = relation_settings.inline_field || `${relation_collection_name}_${collection.scheme().configuration().selector}s`; // dogs_ids, unless specified otherwise

      return element.relations[Util.camelize(relation_collection_name)] = (): Element[] =>
        getHasManyRelationArrayInline(element, relation_collection, references_field_key);
    } else { // normal has_many relationship
      return element.relations[Util.camelize(relation_collection_name)] =
        getHasManyRelationFunction(element, collection, relation_settings, relation_collection);
    }
  }

  export function getHasManyRelationFunction(element: Element, collection: Collection, relation_config: HasManyRelationConfiguration|HasOneRelationConfiguration, relation_collection: Collection, limit_to_one?: boolean): HasManyRelationFunction {
    let has_many_field_key: string;
    let collection_singular_name = CollectionHelper.getSingularName(collection);
    let relation_collection_settings = relation_collection.configuration();

    let selector_key = collection.scheme().configuration().selector;

    if (relation_config.polymorphic) {
      has_many_field_key = `${relation_config.as}_${selector_key}`;
      let has_many_collection_field_key = `${relation_config.as}_collection`;

      return (): Element[] => getPolymorphicHasManyRelationArray(element, relation_collection, has_many_field_key, has_many_collection_field_key, limit_to_one);
    } else {
      if (relation_config.field) {
        has_many_field_key = relation_config.field;
      } else if (relation_config.as) {
        has_many_field_key = `${relation_config.as}_${selector_key}`;
      } else {
        has_many_field_key = `${collection_singular_name}_${selector_key}`;
      }
      return (): Element[] => getHasManyRelationArray(element, relation_collection, has_many_field_key, limit_to_one);
    }
  }

  function getHasManyRelationArray(element: Element, relation_collection: Collection, has_many_field_key: string, limit_to_one?: boolean): Element[] {
    let element2_arr: Element[] = [];
    let selector_value = element.selector();

    for (let element2 of relation_collection.array()) {
      if (selector_value === element2.fields[has_many_field_key]) {
        element2_arr.push(element2);
        if (limit_to_one) {
          return element2_arr;
        }
      }
    }

    return element2_arr;
  }

  function getPolymorphicHasManyRelationArray(element: Element, relation_collection: Collection, has_many_field_key: string, has_many_collection_field_key: string, limit_to_one?: boolean): Element[] {
    let element2_arr: Element[] = [];
    let selector_value = element.selector();
    let collection_name = element.collection().name;

    for (let element2 of relation_collection.array()) {
      if (selector_value === element2.fields[has_many_field_key] && collection_name === element2.fields[has_many_collection_field_key]) {
        element2_arr.push(element2);
        if (limit_to_one) {
          return element2_arr;
        }
      }
    }

    return element2_arr;
  }

  function getHasManyRelationArrayInline(element: Element, relation_collection: Collection, field_key: string): Element[] {
    let selector_value_arr = element.fields[field_key];
    if (!Array.isArray(selector_value_arr)) { throw new ElpongError(ElpongErrorType.FLDNSA, field_key); }
    let element2_arr: Element[] = [];
    for (let element2 of relation_collection.array()) {
      if (Util.includes(selector_value_arr, element2.selector())) { element2_arr.push(element2); }
    }
    return element2_arr;
  }
}
