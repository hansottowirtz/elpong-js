module Elpong {
  export namespace ElementHelper {
    export function toData(element: Element) {
      let collection = element.collection();
      let scheme = collection.scheme();
      let o = {};
      let object = scheme.configuration().collections[collection.name].fields;
      for (let field_name in object) {
        let field_settings = object[field_name];
        if (field_settings.no_send || field_settings.embedded_collection || field_settings.embedded_element) { continue; }
        let field_value = element.fields[field_name];
        o[field_name] = field_value;
      }
      return o;
    }

    // export function setupActions(element: Element, actions_config: ActionConfigurationMap) {
    //   for (let method in ['get', 'post', 'put', 'delete']) {
    //     element.actions[method] = (action_options: ElementHelperParts.ActionOptions) => {
    //       return ElementHelperParts.Actions.execute(element, method.toUpperCase(), action_options);
    //     }
    //   }
    //
    //   Util.forEach(actions_config, (action_config: ActionConfiguration, action_name: string) => {
    //     element.actions[Util.camelize(action_name)] = (user_options) => {
    //       if (element.isNew() && !action_config.no_selector) { throw new ElpongError('elenew'); }
    //       return ElementHelperParts.Actions.executeCustom(element, action_name, action_config, user_options);
    //     }
    //   });
    // }
  }
}
