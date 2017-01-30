import { Element } from '../../../Element';
import { Collection } from '../../../Collection';
import { CollectionHelper } from '../../CollectionHelper';
import { Util } from '../../../Util';
import { HasManyRelationConfiguration, HasOneRelationConfiguration } from '../../../Configuration';

export namespace HasMany {
  export function setup(element: Element, relation_collection_name: string, relation_settings: HasManyRelationConfiguration) {
    let collection = element.collection();
    let collection_config = collection.configuration();

    let relation_collection = collection.scheme().select(relation_settings.collection || relation_collection_name);

    let references_field_name = relation_settings.references_field || `${relation_collection_name}_${collection.scheme().configuration().selector}s`; // dogs_ids, unless specified otherwise

    let relation_field_settings;
    if (relation_field_settings = collection_config.fields[references_field_name]) {
      // throw new Error("Field #{field_name} of collection #{collection.getName()} are not references") if !relation_field_settings.references
      return element.relations[Util.camelize(relation_collection_name)] = () => {
        return getHasManyRelationArrayThroughReferencesField(element, relation_collection, references_field_name);
      }

    } else { // normal has_many relationship
      return element.relations[Util.camelize(relation_collection_name)] =
        getHasManyRelationFunction(element, collection, relation_settings, relation_collection);
    }
  }

  export function getHasManyRelationFunction(element: Element, collection: Collection, relation_config: HasManyRelationConfiguration|HasOneRelationConfiguration, relation_collection: Collection) {
    let has_many_field_name;
    let collection_singular_name = CollectionHelper.getSingularName(collection);
    let relation_collection_settings = relation_collection.configuration();

    let selector_key = collection.scheme().configuration().selector;

    if (relation_config.polymorphic) {
      has_many_field_name = `${relation_config.as}_${selector_key}`;
      let has_many_collection_field_name = `${relation_config.as}_collection`;

      return () => getPolymorphicHasManyRelationArray(element, relation_collection, has_many_field_name, has_many_collection_field_name);
    } else {
      if (relation_config.field) {
        has_many_field_name = relation_config.field;
      } else if (relation_config.as) {
        has_many_field_name = `${relation_config.as}_${selector_key}`;
      } else {
        has_many_field_name = `${collection_singular_name}_${selector_key}`;
      }
      return () => getHasManyRelationArray(element, relation_collection, has_many_field_name);
    }
  }

  function getHasManyRelationArray(element: Element, relation_collection: Collection, has_many_field_name: string) {
    let element2_arr = [];
    let selector_value = element.selector();
    for (let element2 of relation_collection.array()) {
      if (selector_value === element.fields[has_many_field_name]) {
        element2_arr.push(element2);
      }
    }
    return element2_arr;
  }

  function getPolymorphicHasManyRelationArray(element: Element, relation_collection: Collection, has_many_field_name: string, has_many_collection_field_name: string) {
    let element2_arr = [];
    let selector_value = element.selector();
    let collection_name = element.collection().name;
    for (let element2 of relation_collection.array()) {
      if (selector_value === element2.fields[has_many_field_name] && collection_name === element2.fields[has_many_collection_field_name]) {
        element2_arr.push(element2);
      }
    }
    return element2_arr;
  }

  function getHasManyRelationArrayThroughReferencesField(element: Element, relation_collection: Collection, field_name: string) {
    let selector_value_arr = element.fields[field_name];
    if (!Array.isArray(selector_value_arr)) { throw new Error(`Field ${field_name} is not an array, but it should be an array of references to ${relation_collection.name}`); }
    let hpe2_arr = [];
    for (let hpe2 of relation_collection.array()) {
      if (Util.includes(selector_value_arr, element.selector())) { hpe2_arr.push(hpe2); }
    }
    return hpe2_arr;
  }
}
