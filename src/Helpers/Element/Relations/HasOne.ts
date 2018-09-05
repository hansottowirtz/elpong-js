import { Collection } from '../../../Collection';
import { HasOneRelationConfiguration } from '../../../Configuration';
import { Element } from '../../../Element';
import { camelize } from '../../../Util';
import { getCollectionBySingularName } from '../../SchemeHelper';
import { getHasManyRelationFunction } from './HasMany';

export function setup(element: Element, relationCollectionSingularName: string, relationConfig: HasOneRelationConfiguration) {
  let relationCollection: Collection;
  const collection = element.collection();
  const collectionConfig = element.collection().configuration();

  const scheme = collection.scheme();

  if (relationConfig.collection) {
    relationCollection = scheme.select(relationConfig.collection);
  } else {
    relationCollection = getCollectionBySingularName(scheme, relationCollectionSingularName);
  }

  return element.relations[camelize(relationCollectionSingularName)] = () =>
    getHasManyRelationFunction(element, collection, relationConfig, relationCollection, true)()[0];
}
