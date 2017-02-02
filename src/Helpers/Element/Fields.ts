import { Element } from '../../Element';
import { Util } from '../../Util';
// import { SchemeHelper } from '../SchemeHelper';
import { FieldConfigurationMap, FieldConfiguration, EmbeddedElementFieldConfiguration, EmbeddedCollectionFieldConfiguration } from '../../Configuration';
import { PreElement } from '../../PreElement';
// import { CollectionHelper } from '../CollectionHelper';
import { Collection } from '../../Collection';
// import { Scheme } from '../../Scheme';
// import { ElpongError } from '../../Errors';
import { EmbeddedElement } from './Fields/EmbeddedElement';
import { EmbeddedCollection } from './Fields/EmbeddedCollection';

export namespace Fields {
  export function setup(element: Element, fields_config_map: FieldConfigurationMap, pre_element: PreElement): void {
    Util.forEach(fields_config_map, (field_config: FieldConfiguration, field_key: string) => {
      if (field_config.embedded_element) {
        EmbeddedElement.handle(element, pre_element, field_key, field_config as EmbeddedElementFieldConfiguration);
      } else if (field_config.embedded_collection) {
        EmbeddedCollection.handle(element, pre_element, field_key, field_config as EmbeddedCollectionFieldConfiguration);
      } else {
        if (!pre_element.hasOwnProperty(field_key)) { return; }
        let field_value = pre_element[field_key];
        element.fields[field_key] = field_value;
      }
    });
  }
}
