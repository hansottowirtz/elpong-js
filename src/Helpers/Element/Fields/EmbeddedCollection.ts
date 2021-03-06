import { Element } from '../../../Element';
import { EmbeddedCollectionFieldConfiguration } from '../../../Configuration';
import { Collection } from '../../../Collection';
import { Scheme } from '../../../Scheme';
import { Util } from '../../../Util';
import { CollectionHelper } from '../../CollectionHelper';
import { PreElement } from '../../../PreElement';

export namespace EmbeddedCollection {
  export function handle(element: Element, pre_element: PreElement, field_key: string, field_config: EmbeddedCollectionFieldConfiguration): void {
    let embedded_pre_collection;

    if (!(embedded_pre_collection = pre_element[field_key])) { return; }
    let collection: Collection = element.collection();
    let scheme: Scheme = collection.scheme();
    let embedded_element_collection = scheme.select(field_config.collection || field_key);

    Util.forEach(embedded_pre_collection, function(embedded_pre_element: PreElement) {
      let embedded_element = new Element(embedded_element_collection, embedded_pre_element);
      CollectionHelper.addElement(embedded_element_collection, embedded_element);
    });
  }
}
