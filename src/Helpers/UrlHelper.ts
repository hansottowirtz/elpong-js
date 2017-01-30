import { ActionConfiguration } from '../Configuration';
import { Element } from '../Element';
import { Collection } from '../Collection';
import { ElpongError } from '../Errors';

export interface UrlOptions {
  path?: string;
  suffix?: string;
}

export namespace UrlHelper {
  // Creates the api url for an element
  //
  // @param {String} action_name           The action name, custom or 'GET', 'POST', 'PUT', 'DELETE'.
  // @param {HP.Element} element      The element.
  // @param {Object} user_options          The user_options, keys: suffix, path.
  //
  // @return undefined [Description]
  export function createForElement(action_name: string, action_configuration: ActionConfiguration, element: Element, url_options: UrlOptions) {
    let path, url;
    let collection = element.collection();
    let scheme = collection.scheme();
    let api_url = scheme.getApiUrl();
    if (!api_url) { throw new ElpongError('apinur'); }

    if (url_options.path) {
      path = UrlHelper.trimSlashes(url_options.path);
      url = `${api_url}/${path}`;
    } else {
      url = `${api_url}/${collection.name}`;
      if (!action_configuration.no_selector && (action_name !== 'POST')) { url = `${url}/${element.selector()}`; }
    }

    if (action_configuration.method) { // is custom action
      url = `${url}/${action_configuration.path || action_name}`;
    }

    if (url_options.suffix) { url = `${url}/${url_options.suffix}`; }
    return url;
  }

  export function createForCollection(action_name: string, collection: Collection, url_options: UrlOptions) {
    let url = `${collection.scheme().getApiUrl()}/${collection.name}`; //HPP.Helpers.Url.createForCollection(, hpe, user_options) # (action_name, element, user_options = {}, suffix)
    if (url_options.suffix) { url = `${url}/${url_options.suffix}`; }
    return url;
  }

  export function trimSlashes(s: string) {
    return s.replace(/\/$/, '').replace(/^\//, '');
  }

  export function isFqdn(s: string) {
    return (/^https?:\/\//).test(s);
  }
}
