import { Element } from '../Element';
import { copyJSON } from '../Util';

export function toData(element: Element, fullDuplicate?: boolean) {
  const collection = element.collection();
  const scheme = collection.scheme();
  const o = {};
  const object = scheme.configuration().collections[collection.name].fields;
  for (const fieldKey in object) {
    const fieldSettings = object[fieldKey];
    if (fieldSettings.no_send || fieldSettings.embedded_collection || fieldSettings.embedded_element) {
      continue;
    }
    const fieldValue = element.fields[fieldKey];
    if (fullDuplicate && (typeof fieldValue === 'object')) {
      o[fieldKey] = copyJSON(fieldValue);
    } else {
      o[fieldKey] = fieldValue;
    }
  }
  return o;
}
