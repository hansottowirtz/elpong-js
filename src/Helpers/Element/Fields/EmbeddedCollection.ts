import { Collection } from '../../../Collection';
import { EmbeddedCollectionFieldConfiguration } from '../../../Configuration';
import { Element } from '../../../Element';
import { PreElement } from '../../../PreElement';
import { Scheme } from '../../../Scheme';
import { forEach } from '../../../Util';
import { addElement } from '../../CollectionHelper';

export function handle(element: Element, preElement: PreElement, fieldKey: string, fieldConfig: EmbeddedCollectionFieldConfiguration): void {
  const embeddedPreCollection = preElement[fieldKey];

  if (!embeddedPreCollection) return;

  const collection: Collection = element.collection();
  const scheme: Scheme = collection.scheme();
  const embeddedElementCollection = scheme.select(fieldConfig.collection || fieldKey);

  forEach(embeddedPreCollection, (embeddedPreElement: PreElement) => {
    const embeddedElement = new Element(embeddedElementCollection, embeddedPreElement);
    addElement(embeddedElementCollection, embeddedElement);
  });
}
