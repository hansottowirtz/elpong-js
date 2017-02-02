import { Element } from '../../../Element';
import { SchemeHelper } from '../../SchemeHelper';
import { EmbeddedElementFieldConfiguration } from '../../../Configuration';
import { PreElement } from '../../../PreElement';
import { ElpongError } from '../../../Errors';

export namespace EmbeddedElement {
  export function handle(element: Element, pre_element: PreElement, field_key: string, field_config: EmbeddedElementFieldConfiguration): void {
    let embedded_element_collection;
    let embedded_pre_element = pre_element[field_key];
    if (!embedded_pre_element) { return; }
    let collection = element.collection();
    let scheme = collection.scheme();

    if (field_config.collection) {
      embedded_element_collection = scheme.select(field_config.collection);
    } else {
      embedded_element_collection = SchemeHelper.getCollectionBySingularName(scheme, field_key);
    }

    let embedded_element = embedded_element_collection.buildOrMerge(embedded_pre_element);

    let associated_field_key = field_config.field || `${field_key}_${scheme.configuration().selector}`;

    let selector_value = embedded_element.selector();

    let associated_field_value = pre_element[associated_field_key];
    if (associated_field_value && (associated_field_value != selector_value)) {
      throw new ElpongError('eleafw', `${associated_field_value} != ${selector_value}`);
    }
    element.fields[associated_field_key] = selector_value;
  }
}
