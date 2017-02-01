import { Element, SelectorValue, isSelectorValue } from '../../../Element';
import { Collection } from '../../../Collection';
import { Util } from '../../../Util';
import { BelongsToRelationConfiguration } from '../../../Configuration';
import { SchemeHelper } from '../../SchemeHelper';

export namespace BelongsTo {
  export function setup(element: Element, relation_collection_singular_name: string, relation_config: BelongsToRelationConfiguration) {
    let field_key: string;
    let relation_collection: Collection;
    let collection = element.collection();

    // TODO should be reference
    if (relation_config.polymorphic) {
      let collection_field_key = relation_config.collection_field ||  `${relation_collection_singular_name}_collection`;
      field_key = relation_config.field;
      element.relations[Util.camelize(relation_collection_singular_name)] = () =>
        getPolymorphicBelongsToElement(element, field_key, collection_field_key, relation_collection_singular_name);
    } else { // normal
      let scheme = collection.scheme();
      if (relation_config.collection) {
        relation_collection = collection.scheme().select(relation_config.collection);
      } else {
        relation_collection = SchemeHelper.getCollectionBySingularName(scheme, relation_collection_singular_name);
      }
      field_key = relation_config.field || `${relation_collection_singular_name}_${scheme.configuration().selector}`;
      element.relations[Util.camelize(relation_collection_singular_name)] = () =>
        getBelongsToElement(element, relation_collection, field_key);
    }
  }

  let getBelongsToElement = (element: Element, relation_collection: Collection, field_key: string): Element|null|undefined => {
    let selector_value: SelectorValue = element.fields[field_key];
    if (isSelectorValue(selector_value)) {
      return relation_collection.find(selector_value) || null;
    } else {
      return undefined;
    }
  }

  // Gets the polymorphic belongs_to element
  //
  // @param {Element} hpe              The element to which the other element belongs
  // @param {string} field_key                The foreign key, e.g. parent_id.
  // @param {string} collection_field_key     The field name of the other collection, required, e.g. parent_collection.
  // @param {string} collection_selector_field The selector name of the other collection, if it was specified, e.g. id. (Will not be looked at if field_key is present)
  // @param {string} collection_singular_name  e.g. parent
  //
  // @return {Element|null}            The related element.
  let getPolymorphicBelongsToElement = (element: Element, field_key: string, collection_field_key: string, collection_singular_name: string) => {
    let relation_collection_name = element.fields[collection_field_key];
    let relation_collection = element.collection().scheme().select(relation_collection_name);
    if (!field_key) {
      let selector_key = element.collection().scheme().configuration().selector;
      field_key = `${collection_singular_name}_${selector_key}`;
    }
    let selector_value = element.fields[field_key];
    return relation_collection.find(selector_value) || null;
  }

}
