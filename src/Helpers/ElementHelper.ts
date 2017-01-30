import { Element } from '../Element';

export namespace ElementHelper {
  export function toData(element: Element) {
    let collection = element.collection();
    let scheme = collection.scheme();
    let o = {};
    let object = scheme.configuration().collections[collection.name].fields;
    for (let field_name in object) {
      let field_settings = object[field_name];
      if (field_settings.no_send || field_settings.embedded_collection || field_settings.embedded_element) {
        continue;
      }
      let field_value = element.fields[field_name];
      o[field_name] = field_value;
    }
    return o;
  }
}
