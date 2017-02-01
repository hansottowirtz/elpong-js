import { Element } from '../Element';
import { Util } from '../Util';

export namespace ElementHelper {
  export function toData(element: Element, full_duplicate?: boolean) {
    let collection = element.collection();
    let scheme = collection.scheme();
    let o = {};
    let object = scheme.configuration().collections[collection.name].fields;
    for (let field_key in object) {
      let field_settings = object[field_key];
      if (field_settings.no_send || field_settings.embedded_collection || field_settings.embedded_element) {
        continue;
      }
      let field_value = element.fields[field_key];
      if (full_duplicate && (typeof field_value === 'object')) {
        o[field_key] = Util.copyJSON(field_value);
      } else {
        o[field_key] = field_value;
      }
    }
    return o;
  }
}
