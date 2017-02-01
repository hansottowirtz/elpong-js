import { ActionConfiguration } from '../Configuration';
import { Element } from '../Element';
import { Collection } from '../Collection';
import { ElpongError } from '../Errors';

export interface UrlOptions {
  path?: string;
  suffix?: string;
}

export namespace UrlHelper {
  export function createForElement(action_name: string, action_configuration: ActionConfiguration, element: Element, url_options: UrlOptions, no_selector?: boolean): string {
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
      if (!action_configuration.no_selector && !no_selector) {
        url = `${url}/${element.selector()}`;
      }
    }

    if (action_configuration.method) { // is custom action
      url = `${url}/${action_configuration.path || action_name}`;
    }

    if (url_options.suffix) { url = `${url}/${url_options.suffix}`; }
    return url;
  }

  export function createForCollection(action_name: string, collection: Collection, url_options: UrlOptions): string {
    let api_url = collection.scheme().getApiUrl();
    if (!api_url) { throw new ElpongError('apinur'); }

    let url = `${api_url}/${collection.name}`; //HPP.Helpers.Url.createForCollection(, hpe, user_options) # (action_name, element, user_options = {}, suffix)
    if (url_options.suffix) { url = `${url}/${url_options.suffix}`; }
    return url;
  }

  export function trimSlashes(s: string): string {
    return s.replace(/^\/|\/$/, '');
  }

  export function isFqdn(s: string): boolean {
    return /^https?:\/\//.test(s);
  }
}
