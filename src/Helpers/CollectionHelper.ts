import { Element } from '../Element';
import { Collection } from '../Collection';
import { CollectionConfiguration } from '../Configuration';

export namespace CollectionHelper {
  export function getConfiguration(collection: Collection): CollectionConfiguration {
    return collection.scheme().configuration().collections[collection.name];
  }
  export function getSingularName(collection: Collection): string {
    return getConfiguration(collection).singular; // Last char cut in Configuration
  }
  export function addElement(collection: Collection, element: Element): void {
    const selector_value = element.selector();
    if (selector_value !== undefined) {
      collection.elements.set(selector_value, element);
    } else {
      collection.new_elements.push(element);
    }
  }
}
