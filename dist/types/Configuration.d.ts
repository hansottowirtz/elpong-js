export declare class SchemeConfiguration {
    readonly name: string;
    readonly singular: string;
    readonly selector: string;
    readonly collections: CollectionConfigurationMap;
    constructor(preconf: any);
}
export interface CollectionConfigurationMap {
    [name: string]: CollectionConfiguration;
}
export interface CollectionConfiguration {
    readonly singular: string;
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
    readonly polymorphic: boolean;
    readonly as: string;
    readonly inline: boolean;
    readonly inline_field: string;
}
export interface HasOneRelationConfiguration extends RelationConfiguration {
    readonly field: string;
    readonly collection: string;
    readonly references_field: string;
    readonly polymorphic: boolean;
    readonly as: string;
}
export interface BelongsToRelationConfiguration extends RelationConfiguration {
    readonly collection: string;
    readonly polymorphic: boolean;
    readonly field: string;
    readonly collection_field: string;
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
