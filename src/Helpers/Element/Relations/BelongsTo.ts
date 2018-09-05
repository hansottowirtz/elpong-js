import { Collection } from '../../../Collection';
import { BelongsToRelationConfiguration } from '../../../Configuration';
import { Element, isSelectorValue, SelectorValue } from '../../../Element';
import { camelize } from '../../../Util';
import { getCollectionBySingularName } from '../../SchemeHelper';

export function setup(element: Element, relationCollectionSingularName: string, relationConfig: BelongsToRelationConfiguration) {
  let fieldKey: string;
  let relationCollection: Collection;
  const collection = element.collection();

  // TODO should be reference
  if (relationConfig.polymorphic) {
    const collectionFieldKey = relationConfig.collection_field ||  `${relationCollectionSingularName}_collection`;
    fieldKey = relationConfig.field;
    element.relations[camelize(relationCollectionSingularName)] = () =>
      getPolymorphicBelongsToElement(element, fieldKey, collectionFieldKey, relationCollectionSingularName);
  } else { // normal
    const scheme = collection.scheme();
    if (relationConfig.collection) {
      relationCollection = collection.scheme().select(relationConfig.collection);
    } else {
      relationCollection = getCollectionBySingularName(scheme, relationCollectionSingularName);
    }
    fieldKey = relationConfig.field || `${relationCollectionSingularName}_${scheme.configuration().selector}`;
    element.relations[camelize(relationCollectionSingularName)] = () =>
      getBelongsToElement(element, relationCollection, fieldKey);
  }
}

const getBelongsToElement = (element: Element, relationCollection: Collection, fieldKey: string): Element | null | undefined => {
  const selectorValue: SelectorValue = element.fields[fieldKey];
  if (isSelectorValue(selectorValue)) {
    return relationCollection.find(selectorValue) || null;
  } else {
    return undefined;
  }
};

// Gets the polymorphic belongs_to element
//
// @param {Element} hpe                    The element to which the other element belongs
// @param {string} fieldKey                The foreign key, e.g. parent_id.
// @param {string} collectionFieldKey      The field name of the other collection, required, e.g. parent_collection.
// @param {string} collectionSelectorField The selector name of the other collection, if it was specified, e.g. id. (Will not be looked at if fieldKey is present)
// @param {string} collectionSingularName  e.g. parent
//
// @return {Element|null}            The related element.
const getPolymorphicBelongsToElement = (element: Element, fieldKey: string, collectionFieldKey: string, collectionSingularName: string) => {
  const relationCollectionName = element.fields[collectionFieldKey];
  const relationCollection = element.collection().scheme().select(relationCollectionName);
  if (!fieldKey) {
    const selectorKey = element.collection().scheme().configuration().selector;
    fieldKey = `${collectionSingularName}_${selectorKey}`;
  }
  const selectorValue = element.fields[fieldKey];
  return relationCollection.find(selectorValue) || null;
};
