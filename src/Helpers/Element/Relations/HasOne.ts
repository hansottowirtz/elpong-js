import { Element } from '../../../Element';
import { HasMany } from './HasMany';
import { HasOneRelationConfiguration } from '../../../Configuration';
import { SchemeHelper } from '../../SchemeHelper';
import { Util } from '../../../Util';

export namespace HasOne {
  export function setup(element: Element, relation_collection_singular_name: string, relation_config: HasOneRelationConfiguration) {
    let relation_collection;
    let collection = element.collection();
    let collection_config = element.collection().configuration();

    let scheme = collection.scheme();

    if (relation_config.collection) {
      relation_collection = scheme.select(relation_config.collection);
    } else {
      relation_collection = SchemeHelper.getCollectionBySingularName(scheme, relation_collection_singular_name);
    }

    return element.relations[Util.camelize(relation_collection_singular_name)] = () =>
      HasMany.getHasManyRelationFunction(element, collection, relation_config, relation_collection, true)()[0];
  }
}
