import { Element } from '../../Element';
import { Util } from '../../Util';
import { SchemeHelper } from '../SchemeHelper';
import { FieldConfigurationMap, FieldConfiguration, EmbeddedElementFieldConfiguration, EmbeddedCollectionFieldConfiguration } from '../../Configuration';
import { PreElement } from '../../PreElement';
import { CollectionHelper } from '../CollectionHelper';
import { Collection } from '../../Collection';
import { Scheme } from '../../Scheme';

export namespace Fields {
  export function setup(element: Element, fields_config_map: FieldConfigurationMap, pre_element: PreElement) {
    Util.forEach(fields_config_map, (field_config: FieldConfiguration, field_name: string) => {
      if (field_config.embedded_element) {
        return handleEmbeddedElement(element, pre_element, field_name, field_config as EmbeddedElementFieldConfiguration);
      } else if (field_config.embedded_collection) {
        return handleEmbeddedCollection(element, pre_element, field_name, field_config as EmbeddedCollectionFieldConfiguration);
      } else {
        let field_value = pre_element[field_name];
        return element.fields[field_name] = field_value;
      }
    });
  }

  export function handleEmbeddedElement(hpe: Element, pre_element: PreElement, field_name: string, field_config: EmbeddedElementFieldConfiguration) {
    let embedded_element_collection;
    let embedded_pre_element = pre_element[field_name];
    if (!embedded_pre_element) { return; }
    let collection = hpe.collection();
    let scheme = collection.scheme();
    if (field_config.collection) {
      embedded_element_collection = scheme.select(field_config.collection);
    } else {
      embedded_element_collection = SchemeHelper.getCollectionBySingularName(scheme, field_name);
    }

    let embedded_element = embedded_element_collection.buildOrMerge(embedded_pre_element);

    let associated_field_name = `${field_name}_${scheme.configuration().selector}`;
    return hpe.fields[associated_field_name] = embedded_element.selector()
  }

  export function handleEmbeddedCollection(hpe: Element, pre_element: PreElement, field_name: string, field_configuration: EmbeddedCollectionFieldConfiguration) {
    let embedded_pre_collection;

    if (!(embedded_pre_collection = pre_element[field_name])) { return; }
    let collection: Collection = hpe.collection();
    let scheme: Scheme = collection.scheme();
    let embedded_element_collection = scheme.select(field_name || field_configuration.collection);

    return Util.forEach(embedded_pre_collection, function(embedded_pre_element: PreElement) {
      let embedded_element = new Element(embedded_element_collection, embedded_pre_element);
      return CollectionHelper.addElement(embedded_element_collection, embedded_element);
    });
  }
}
