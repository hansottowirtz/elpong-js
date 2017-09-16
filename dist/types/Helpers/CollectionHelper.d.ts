import { Element } from '../Element';
import { Collection } from '../Collection';
import { CollectionConfiguration } from '../Configuration';
export declare namespace CollectionHelper {
    function getConfiguration(collection: Collection): CollectionConfiguration;
    function getSingularName(collection: Collection): string;
    function addElement(collection: Collection, element: Element): void;
}
