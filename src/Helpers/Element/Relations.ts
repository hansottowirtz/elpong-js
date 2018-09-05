import { BelongsToRelationConfiguration, HasManyRelationConfiguration, HasOneRelationConfiguration, RelationConfigurationMaps } from '../../Configuration';
import { Element } from '../../Element';
import { forEach } from '../../Util';
import { setup as belongsToSetup } from './Relations/BelongsTo';
import { setup as hasManySetup } from './Relations/HasMany';
import { setup as hasOneSetup } from './Relations/HasOne';

export function setup(element: Element, relationsConfigMaps: RelationConfigurationMaps) {
  forEach(relationsConfigMaps.has_many, (relationConfig: HasManyRelationConfiguration, relationCollectionName: string) => {
    hasManySetup(element, relationCollectionName, relationConfig);
  });

  forEach(relationsConfigMaps.has_one, (relationConfig: HasOneRelationConfiguration, relationCollectionSingularName: string) => {
    hasOneSetup(element, relationCollectionSingularName, relationConfig);
  });

  forEach(relationsConfigMaps.belongs_to, (relationConfig: BelongsToRelationConfiguration, relationCollectionSingularName: string) => {
    belongsToSetup(element, relationCollectionSingularName, relationConfig);
  });
}
