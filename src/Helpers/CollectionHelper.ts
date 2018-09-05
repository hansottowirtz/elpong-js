import { Collection } from '../Collection';
import { CollectionConfiguration } from '../Configuration';
import { Element } from '../Element';

export function getConfiguration(collection: Collection): CollectionConfiguration {
  return collection.scheme().configuration().collections[collection.name];
}

export function getSingularName(collection: Collection): string {
  return getConfiguration(collection).singular; // Last char cut in Configuration
}

export function addElement(collection: Collection, element: Element): void {
  const selectorValue = element.selector();
  if (selectorValue !== undefined) {
    collection.elements.set(selectorValue, element);
  } else {
    collection.newElements.push(element);
  }
}
