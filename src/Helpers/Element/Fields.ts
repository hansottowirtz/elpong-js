import { Element } from '../../Element';
import { Util } from '../../Util';
import { SchemeHelper } from '../SchemeHelper';
import { FieldConfigurationMap, FieldConfiguration, EmbeddedElementFieldConfiguration, EmbeddedCollectionFieldConfiguration } from '../../Configuration';
import { PreElement } from '../../PreElement';
import { CollectionHelper } from '../CollectionHelper';
import { Collection } from '../../Collection';
import { Scheme } from '../../Scheme';

export namespace Fields {
  export function setup(element: Element, fields_config_map: FieldConfigurationMap, pre_element: PreElement): void {
    Util.forEach(fields_config_map, (field_config: FieldConfiguration, field_key: string) => {
      if (field_config.embedded_element) {
        handleEmbeddedElement(element, pre_element, field_key, field_config as EmbeddedElementFieldConfiguration);
      } else if (field_config.embedded_collection) {
        handleEmbeddedCollection(element, pre_element, field_key, field_config as EmbeddedCollectionFieldConfiguration);
      } else {
        if (!pre_element.hasOwnProperty(field_key)) { return; }
        let field_value = pre_element[field_key];
        element.fields[field_key] = field_value;
      }
    });
  }

  export function handleEmbeddedElement(element: Element, pre_element: PreElement, field_key: string, field_config: EmbeddedElementFieldConfiguration): void {
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
    console.log('setting up embedded element', element, embedded_element);
    element.fields[associated_field_key] = embedded_element.selector();
    console.log(`The field ${associated_field_key} of element with id ${element.selector()} of collection ${element.collection().name} should be ${embedded_element.selector()} and is ${element.fields[associated_field_key]}`)
    setTimeout(() => {
      console.log(`The field ${associated_field_key} of element with id ${element.selector()} of collection ${element.collection().name} should be ${embedded_element.selector()} and is ${element.fields[associated_field_key]}`)
    }, 10)
  }

  export function handleEmbeddedCollection(element: Element, pre_element: PreElement, field_key: string, field_config: EmbeddedCollectionFieldConfiguration): void {
    let embedded_pre_collection;

    if (!(embedded_pre_collection = pre_element[field_key])) { return; }
    let collection: Collection = element.collection();
    let scheme: Scheme = collection.scheme();
    let embedded_element_collection = scheme.select(field_key || field_config.collection);

    Util.forEach(embedded_pre_collection, function(embedded_pre_element: PreElement) {
      let embedded_element = new Element(embedded_element_collection, embedded_pre_element);
      CollectionHelper.addElement(embedded_element_collection, embedded_element);
    });
  }
}
