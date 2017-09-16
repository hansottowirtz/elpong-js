import { Element } from '../../../Element';
import { Collection } from '../../../Collection';
import { HasManyRelationConfiguration, HasOneRelationConfiguration } from '../../../Configuration';
export declare type HasManyRelationFunction = () => Element[];
export declare namespace HasMany {
    function setup(element: Element, relation_collection_name: string, relation_settings: HasManyRelationConfiguration): () => Element[];
    function getHasManyRelationFunction(element: Element, collection: Collection, relation_config: HasManyRelationConfiguration | HasOneRelationConfiguration, relation_collection: Collection, limit_to_one?: boolean): HasManyRelationFunction;
}
