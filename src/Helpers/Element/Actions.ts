module Elpong {
  export namespace ElementHelper {
    export interface ActionOptions {
      data?: Object
      headers?: Object
    }
    export namespace Actions {
      export function setup(element: Element, actions_config: ActionConfigurationMap) {
        for (let method in ['get', 'post', 'put', 'delete']) {
          element.actions[method] = (action_options: ActionOptions) => {
            return execute(element, method.toUpperCase(), action_options);
          }
        }

        Util.forEach(actions_config, (action_config: ActionConfiguration, action_name: string) => {
          element.actions[Util.camelize(action_name)] = (user_options) => {
            if (element.isNew() && !action_config.no_selector) { throw new ElpongError('elenew'); }
            return executeCustom(element, action_name, action_config, user_options);
          }
        });
      }

      export function execute(element: Element, method: string, action_options: ActionOptions) {
        if (!action_options) { action_options = {}; }

        let data;

        // element.snapshots.make(`before_${method.toLowerCase()}`);

        if (action_options.data) {
          data = action_options;
        } else if (method !== 'GET') {
          data = ElementHelper.toData(element);
        }

        if (method === 'POST') {
          if (!element.isNew()) { throw new Error('Element is not new'); }
        } else {
          if (element.isNew()) { throw new Error('Element is new'); }
        }

        let promise = Ajax.executeRequest(
          UrlHelper.createForElement(method, {} as ActionConfiguration, element, action_options as UrlOptions),
          method,
          data,
          action_options.headers
        );
        promise.then((response: AjaxResponse) => {
          if (response.data) {
            element.merge(response.data);
          }
          // TODO element.snapshots.make(`after_${method.toLowerCase()}`);

          let collection = element.collection();

          if (Util.includes(collection.new_elements, element)) {
            Util.removeFromArray(collection.new_elements, element);
            return collection.elements[element.selector()] = element;
          }
        });

        return promise;
      }

      export function executeCustom(hpe, action_name, action_settings, user_options) {
        if (user_options == null) { user_options = {}; }
        let method = action_settings.method.toUpperCase();
        hpe.snapshots.make(`before_${method.toLowerCase()}`);

        let data;
        if (user_options.data) {
          data = user_options.data;
        } else if (!action_settings.without_data) {
          data = ElementHelper.toData(hpe);
        }

        let promise = Ajax.executeRequest(
          UrlHelper.createForElement(action_name, action_settings, hpe, user_options),
          method,
          data,
          user_options.headers
        );
        promise.then((response: AjaxResponse) => {
          let selector_value;
          if (!action_settings.returns_other) {
            if (response.data) {
              hpe.mergeWith(response.data);
            }
            hpe.snapshots.make(`after_${method.toLowerCase()}`);
          }

          let collection = hpe.getCollection();

          if ((selector_value = hpe.getSelectorValue()) && Util.includes(collection.new_elements, hpe)) {
            Util.removeFromArray(collection.new_elements, hpe);
            return collection.elements[selector_value] = hpe;
          }
        });

        return promise;
      };
    }
  }
}
