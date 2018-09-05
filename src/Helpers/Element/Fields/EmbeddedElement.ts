import { EmbeddedElementFieldConfiguration } from '../../../Configuration';
import { Element } from '../../../Element';
import { ElpongError, ElpongErrorType } from '../../../Errors';
import { PreElement } from '../../../PreElement';
import { getCollectionBySingularName } from '../../SchemeHelper';

export function handle(element: Element, preElement: PreElement, fieldKey: string, fieldConfig: EmbeddedElementFieldConfiguration): void {
  let embeddedElementCollection;
  const embeddedPreElement = preElement[fieldKey];
  if (!embeddedPreElement) { return; }
  const collection = element.collection();
  const scheme = collection.scheme();

  if (fieldConfig.collection) {
    embeddedElementCollection = scheme.select(fieldConfig.collection);
  } else {
    embeddedElementCollection = getCollectionBySingularName(scheme, fieldKey);
  }

  const embeddedElement = embeddedElementCollection.buildOrMerge(embeddedPreElement);

  const referenceFieldKey = fieldConfig.reference_field || `${fieldKey}_${scheme.configuration().selector}`;

  const referenceFieldConfig = collection.configuration().fields[referenceFieldKey];
  if (!referenceFieldConfig) return;
  if (!referenceFieldConfig.reference) return;

  const selectorValue = embeddedElement.selector();

  const referenceFieldValue = preElement[referenceFieldKey];
  if (referenceFieldValue !== undefined && (referenceFieldValue !== selectorValue)) {
    throw new ElpongError(ElpongErrorType.ELEAFW, `${referenceFieldValue} != ${selectorValue}`);
  }
  element.fields[referenceFieldKey] = selectorValue;
}
