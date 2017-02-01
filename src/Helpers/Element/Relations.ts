import { Util } from '../../Util';
import { HasMany } from './Relations/HasMany';
import { HasOne } from './Relations/HasOne';
import { Element } from '../../Element';
import { RelationConfigurationMaps, HasManyRelationConfiguration, HasOneRelationConfiguration, BelongsToRelationConfiguration } from '../../Configuration';
import { BelongsTo } from './Relations/BelongsTo';

export namespace Relations {
  export function setup(element: Element, relations_config_maps: RelationConfigurationMaps) {
    Util.forEach(relations_config_maps.has_many, (relation_config: HasManyRelationConfiguration, relation_collection_name: string) => {
      HasMany.setup(element, relation_collection_name, relation_config);
    });

    Util.forEach(relations_config_maps.has_one, (relation_config: HasOneRelationConfiguration, relation_collection_singular_name: string) => {
      HasOne.setup(element, relation_collection_singular_name, relation_config);
    });

    Util.forEach(relations_config_maps.belongs_to, (relation_config: BelongsToRelationConfiguration, relation_collection_singular_name: string) => {
      BelongsTo.setup(element, relation_collection_singular_name, relation_config);
    });
  }
}
