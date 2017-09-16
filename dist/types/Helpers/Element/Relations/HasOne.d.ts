import { Element } from '../../../Element';
import { HasOneRelationConfiguration } from '../../../Configuration';
export declare namespace HasOne {
    function setup(element: Element, relation_collection_singular_name: string, relation_config: HasOneRelationConfiguration): () => Element;
}
