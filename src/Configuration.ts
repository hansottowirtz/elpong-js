import { ElpongError } from './Errors'

declare var DEBUG: boolean;
if (typeof DEBUG === 'undefined') {
  var DEBUG = true;
}

export class SchemeConfiguration {
  readonly name: string;
  readonly singular: string;
  readonly selector: string;
  readonly collections: CollectionConfigurationMap;

  constructor(preconf: any) {
    this.name = preconf.name;
    if (DEBUG && !this.name) {
      throw new ElpongError('confnn');
    }
    this.selector = preconf.selector;
    if (DEBUG && !this.selector) {
      throw new ElpongError('confns', preconf.name);
    }
    this.collections = {};

    for (let collection_name in preconf.collections) {
      let collection_preconf = preconf.collections[collection_name];

      let collection_configuration: CollectionConfiguration = this.collections[collection_name] = {
        singular: collection_preconf.singular || collection_name.slice(0, -1)
      } as CollectionConfiguration;

      let props = ['fields', 'relations', 'actions', 'collection_actions'];
      let relation_types = ['has_many', 'has_one', 'belongs_to'];

      for (let prop of props) {
        collection_configuration[prop] = collection_preconf[prop] || {};
      }
      let relations_conf;
      if (relations_conf = collection_preconf.relations) {
        for (let relation_type of relation_types) {
          relations_conf[relation_type] = collection_preconf.relations[relation_type] || {};
        }
      }
    }
  }
}
export interface CollectionConfigurationMap {
  [name: string]: CollectionConfiguration;
}
export interface CollectionConfiguration {
  readonly singular: string
  readonly fields: FieldConfigurationMap;
  readonly relations: RelationConfigurationMaps;
  readonly actions: ActionConfigurationMap;
  readonly collection_actions: CollectionActionConfigurationMap;
}
export interface FieldConfigurationMap {
  readonly [name: string]: FieldConfiguration;
}
export interface FieldConfiguration {
  readonly reference: boolean;
  readonly default: any;
  readonly embedded_element: boolean;
  readonly embedded_collection: boolean;
  readonly no_send: boolean;
}
export interface EmbeddedElementFieldConfiguration extends FieldConfiguration {
  readonly field: string;
  readonly collection: string;
}
export interface EmbeddedCollectionFieldConfiguration extends FieldConfiguration {
  readonly collection: string;
}
export interface RelationConfigurationMaps {
  readonly has_many: HasManyRelationConfigurationMap;
  readonly has_one: HasOneRelationConfigurationMap;
  readonly belongs_to: BelongsToRelationConfigurationMap;
}
export interface HasManyRelationConfigurationMap {
  readonly [name: string]: HasManyRelationConfiguration;
}
export interface HasOneRelationConfigurationMap {
  readonly [name: string]: HasOneRelationConfiguration;
}
export interface BelongsToRelationConfigurationMap {
  readonly [name: string]: BelongsToRelationConfiguration;
}
export interface RelationConfiguration {

}
export interface HasManyRelationConfiguration extends RelationConfiguration {
  readonly field: string;
  readonly collection: string;
  readonly references_field: string;
  // Polymorphism
  readonly polymorphic: boolean;
  readonly as: string; // block
}
export interface HasOneRelationConfiguration extends RelationConfiguration {
  readonly field: string;
  readonly collection: string;
  readonly references_field: string;
  // Polymorphism
  readonly polymorphic: boolean;
  readonly as: string; // block
}
export interface BelongsToRelationConfiguration extends RelationConfiguration {
  readonly collection: string;
  // Polymorphism
  readonly polymorphic: boolean;
  readonly field: string; // block_id
  readonly collection_field: string; // block_collection
}
export interface ActionConfigurationMap {
  readonly [name: string]: ActionConfiguration;
}
export interface CollectionActionConfigurationMap {
  readonly [name: string]: CollectionActionConfiguration;
}
export interface CollectionActionConfiguration {
  readonly method: string;
  readonly path: string;
}
export interface ActionConfiguration {
  readonly method: string;
  readonly returns_other: boolean;
  readonly no_data: boolean;
  readonly no_selector: boolean;
  readonly path: string;
}
