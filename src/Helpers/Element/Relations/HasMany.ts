import { Collection } from '../../../Collection';
import { HasManyRelationConfiguration, HasOneRelationConfiguration } from '../../../Configuration';
import { Element } from '../../../Element';
import { ElpongError, ElpongErrorType } from '../../../Errors';
import { camelize, includes } from '../../../Util';
import { getSingularName } from '../../CollectionHelper';

export type HasManyRelationFunction = () => Element[];

export function setup(element: Element, relationCollectionName: string, relationSettings: HasManyRelationConfiguration) {
  const collection = element.collection();
  const collectionConfig = collection.configuration();

  const relationCollection = collection.scheme().select(relationSettings.collection || relationCollectionName);

  // let relation_field_settings: FieldConfiguration;
  // if (relation_field_settings = collection_config.fields[references_field_key]) {
  //   // throw new Error("Field #{field_key} of collection #{collection.getName()} are not references") if !relation_field_settings.references
  //   return element.relations[Util.camelize(relation_collection_name)] = (): Element[] =>
  //     getHasManyRelationArrayThroughReferencesField(element, relation_collection, references_field_key);
  //
  // }

  if (relationSettings.inline) {
    const referencesFieldKey = relationSettings.inline_field || `${relationCollectionName}_${collection.scheme().configuration().selector}s`; // dogs_ids, unless specified otherwise

    return element.relations[camelize(relationCollectionName)] = (): Element[] =>
      getHasManyRelationArrayInline(element, relationCollection, referencesFieldKey);
  } else { // normal has_many relationship
    return element.relations[camelize(relationCollectionName)] =
      getHasManyRelationFunction(element, collection, relationSettings, relationCollection);
  }
}

export function getHasManyRelationFunction(element: Element, collection: Collection, relationConfig: HasManyRelationConfiguration | HasOneRelationConfiguration, relationCollection: Collection, limitToOne?: boolean): HasManyRelationFunction {
  let hasManyFieldKey: string;
  const collectionSingularName = getSingularName(collection);
  const relationCollectionSettings = relationCollection.configuration();

  const selectorKey = collection.scheme().configuration().selector;

  if (relationConfig.polymorphic) {
    hasManyFieldKey = `${relationConfig.as}_${selectorKey}`;
    const hasManyCollectionFieldKey = `${relationConfig.as}_collection`;

    return (): Element[] => getPolymorphicHasManyRelationArray(element, relationCollection, hasManyFieldKey, hasManyCollectionFieldKey, limitToOne);
  } else {
    if (relationConfig.field) {
      hasManyFieldKey = relationConfig.field;
    } else if (relationConfig.as) {
      hasManyFieldKey = `${relationConfig.as}_${selectorKey}`;
    } else {
      hasManyFieldKey = `${collectionSingularName}_${selectorKey}`;
    }
    return (): Element[] => getHasManyRelationArray(element, relationCollection, hasManyFieldKey, limitToOne);
  }
}

function getHasManyRelationArray(element: Element, relationCollection: Collection, hasManyFieldKey: string, limitToOne?: boolean): Element[] {
  const element2Arr: Element[] = [];
  const selectorValue = element.selector();

  for (const element2 of relationCollection.array()) {
    if (selectorValue === element2.fields[hasManyFieldKey]) {
      element2Arr.push(element2);
      if (limitToOne) {
        return element2Arr;
      }
    }
  }

  return element2Arr;
}

function getPolymorphicHasManyRelationArray(element: Element, relationCollection: Collection, hasManyFieldKey: string, hasManyCollectionFieldKey: string, limitToOne?: boolean): Element[] {
  const element2Arr: Element[] = [];
  const selectorValue = element.selector();
  const collectionName = element.collection().name;

  for (const element2 of relationCollection.array()) {
    if (selectorValue === element2.fields[hasManyFieldKey] && collectionName === element2.fields[hasManyCollectionFieldKey]) {
      element2Arr.push(element2);
      if (limitToOne) {
        return element2Arr;
      }
    }
  }

  return element2Arr;
}

function getHasManyRelationArrayInline(element: Element, relationCollection: Collection, fieldKey: string): Element[] {
  const selectorValueArr = element.fields[fieldKey];
  if (!Array.isArray(selectorValueArr)) { throw new ElpongError(ElpongErrorType.FLDNSA, fieldKey); }
  const element2Arr: Element[] = [];
  for (const element2 of relationCollection.array()) {
    if (includes(selectorValueArr, element2.selector())) { element2Arr.push(element2); }
  }
  return element2Arr;
}
