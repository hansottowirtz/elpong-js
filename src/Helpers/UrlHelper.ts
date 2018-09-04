import { ActionConfiguration } from '../Configuration';
import { Element } from '../Element';
import { Collection } from '../Collection';
import { ElpongError, ElpongErrorType } from '../Errors';

export interface UrlHelperOptions extends UrlOptions {
  suffix?: string;
  params?: any;
}

export interface UrlHelperElementOptions extends UrlHelperOptions {
  no_selector?: boolean;
}

export interface UrlHelperCollectionOptions extends UrlHelperOptions {
}

export interface UrlOptions {
  params?: any;
}

export namespace UrlHelper {
  export function createForElement(element: Element, url_options: UrlHelperElementOptions): string {
    let path, url;
    let collection = element.collection();
    let scheme = collection.scheme();
    let api_url = scheme.getApiUrl();
    if (!api_url) { throw new ElpongError(ElpongErrorType.APINUR); }

    url = `${api_url}/${collection.name}`;
    if (!url_options.no_selector) {
      url = `${url}/${element.selector()}`;
    }

    if (url_options.suffix) { url = `${url}/${url_options.suffix}`; }
    if (url_options.params) { url = appendParamsToUrl(url, url_options.params); }
    return url;
  }

  export function createForCollection(collection: Collection, url_options: UrlHelperOptions): string {
    let api_url = collection.scheme().getApiUrl();
    if (!api_url) { throw new ElpongError(ElpongErrorType.APINUR); }

    let url = `${api_url}/${collection.name}`; //HPP.Helpers.Url.createForCollection(, hpe, user_options) # (action_name, element, user_options = {}, suffix)
    if (url_options.suffix) { url = `${url}/${url_options.suffix}`; }
    if (url_options.params) { url = appendParamsToUrl(url, url_options.params); }
    return url;
  }

  export function trimSlashes(s: string): string {
    return s.replace(/^\/|\/$/g, '');
  }

  export function isFqdn(s: string): boolean {
    return /^https?:\/\//.test(s);
  }

  export function appendParamsToUrl(url: string, params: any): string {
    url = `${url}?`;
    for(let k in params) {
      url = `${url}${k}=${encodeURIComponent(params[k])}&`;
    }
    url = url.slice(0, -1);
    return url;
  }
}
