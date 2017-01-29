module Elpong {
  export namespace ElementHelper {
    export namespace Relations {
      export namespace BelongsTo {
        export function setup(element: Element, relation_collection_singular_name: string, relation_config: BelongsToRelationConfiguration) {
          let field_name, relation_collection;
          let collection = element.collection();

          // TODO should be reference
          if (relation_config.polymorphic) {
            let collection_field_name = relation_config.collection_field ||  `${relation_collection_singular_name}_collection`;
            field_name = relation_config.field;
            element.relations[Util.camelize(relation_collection_singular_name)] = () => {
              return getPolymorphicBelongsToElement(element, field_name, collection_field_name, relation_collection_singular_name);
            }
          } else { // normal
            relation_collection = collection.scheme().select(relation_config.collection || relation_collection_singular_name);
            field_name = relation_config.field || `${relation_collection_singular_name}_${relation_collection.selector_name}`;
            element.relations[Util.camelize(relation_collection_singular_name)] = () => {
              return getBelongsToElement(element, relation_collection, field_name);
            }
          }
        }

        let getBelongsToElement = (element: Element, relation_collection: Collection, field_name: string) => {
          let selector_value = element.fields[field_name];
          return relation_collection.find(selector_value) || null;
        }

        // Gets the polymorphic belongs_to element
        //
        // @param {Element} hpe              The element to which the other element belongs
        // @param {string} field_name                The foreign key, e.g. parent_id.
        // @param {string} collection_field_name     The field name of the other collection, required, e.g. parent_collection.
        // @param {string} collection_selector_field The selector name of the other collection, if it was specified, e.g. id. (Will not be looked at if field_name is present)
        // @param {string} collection_singular_name  e.g. parent
        //
        // @return {Element|null}            The related element.
        let getPolymorphicBelongsToElement = (element: Element, field_name: string, collection_field_name: string, collection_singular_name: string) => {
          // console.log hpe, collection_field_name, collection_selector_field
          let relation_collection_name = element.fields[collection_field_name];
          let relation_collection = element.collection().scheme().select(relation_collection_name);
          if (!field_name) {
            let selector_key = element.collection().scheme().configuration().selector;
            field_name = `${collection_singular_name}_${selector_key}`;
          }
          let selector_value = element.fields[field_name];
          return relation_collection.find(selector_value) || null;
        }

      }
    }
  }
}
