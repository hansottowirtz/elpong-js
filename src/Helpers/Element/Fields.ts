import { EmbeddedCollectionFieldConfiguration, EmbeddedElementFieldConfiguration, FieldConfiguration, FieldConfigurationMap } from '../../Configuration';
import { Element } from '../../Element';
import { PreElement } from '../../PreElement';
import { forEach } from '../../Util';
import { handle as embeddedCollectionHandle } from './Fields/EmbeddedCollection';
import { handle as embeddedElementHandle } from './Fields/EmbeddedElement';

export function setup(element: Element, fieldsConfigMap: FieldConfigurationMap, preElement: PreElement): void {
  forEach(fieldsConfigMap, (fieldConfig: FieldConfiguration, fieldKey: string) => {
    if (fieldConfig.embedded_element) {
      embeddedElementHandle(element, preElement, fieldKey, fieldConfig as EmbeddedElementFieldConfiguration);
    } else if (fieldConfig.embedded_collection) {
      embeddedCollectionHandle(element, preElement, fieldKey, fieldConfig as EmbeddedCollectionFieldConfiguration);
    } else {
      if (!preElement.hasOwnProperty(fieldKey)) { return; }
      const fieldValue = preElement[fieldKey];
      element.fields[fieldKey] = fieldValue;
    }
  });
}
