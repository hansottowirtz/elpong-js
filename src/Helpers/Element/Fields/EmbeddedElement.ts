import { Element } from '../../../Element';
import { SchemeHelper } from '../../SchemeHelper';
import { EmbeddedElementFieldConfiguration } from '../../../Configuration';
import { ElpongError, ElpongErrorType } from '../../../Errors';
import { PreElement } from '../../../PreElement';

export namespace EmbeddedElement {
  export function handle(element: Element, pre_element: PreElement, field_key: string, field_config: EmbeddedElementFieldConfiguration): void {
    let embedded_element_collection;
    const embedded_pre_element = pre_element[field_key];
    if (!embedded_pre_element) { return; }
    const collection = element.collection();
    const scheme = collection.scheme();

    if (field_config.collection) {
      embedded_element_collection = scheme.select(field_config.collection);
    } else {
      embedded_element_collection = SchemeHelper.getCollectionBySingularName(scheme, field_key);
    }

    const embedded_element = embedded_element_collection.buildOrMerge(embedded_pre_element);

    const reference_field_key = field_config.reference_field || `${field_key}_${scheme.configuration().selector}`;

    const reference_field_config = collection.configuration().fields[reference_field_key]
    if(!reference_field_config) return;
    if(!reference_field_config.reference) return;

    const selector_value = embedded_element.selector();

    const reference_field_value = pre_element[reference_field_key];
    if (reference_field_value !== undefined && (reference_field_value != selector_value)) {
      throw new ElpongError(ElpongErrorType.ELEAFW, `${reference_field_value} != ${selector_value}`);
    }
    element.fields[reference_field_key] = selector_value;
  }
}
