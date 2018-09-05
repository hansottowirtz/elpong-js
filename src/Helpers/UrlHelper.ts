import { Collection } from '../Collection';
import { Element } from '../Element';
import { ElpongError, ElpongErrorType } from '../Errors';

export interface UrlHelperOptions extends UrlOptions {
  suffix?: string;
  params?: any;
}

export interface UrlHelperElementOptions extends UrlHelperOptions {
  noSelector?: boolean;
}

export interface UrlHelperCollectionOptions extends UrlHelperOptions {
}

export interface UrlOptions {
  params?: any;
}

export function createForElement(element: Element, urlOptions: UrlHelperElementOptions): string {
  let url;
  const collection = element.collection();
  const scheme = collection.scheme();
  const apiUrl = scheme.getApiUrl();
  if (!apiUrl) { throw new ElpongError(ElpongErrorType.APINUR); }

  url = `${apiUrl}/${collection.name}`;
  if (!urlOptions.noSelector) {
    url = `${url}/${element.selector()}`;
  }

  if (urlOptions.suffix) { url = `${url}/${urlOptions.suffix}`; }
  if (urlOptions.params) { url = appendParamsToUrl(url, urlOptions.params); }
  return url;
}

export function createForCollection(collection: Collection, urlOptions: UrlHelperOptions): string {
  const apiUrl = collection.scheme().getApiUrl();
  if (!apiUrl) { throw new ElpongError(ElpongErrorType.APINUR); }

  let url = `${apiUrl}/${collection.name}`; // HPP.Helpers.Url.createForCollection(, hpe, userOptions) # (action_name, element, user_options = {}, suffix)
  if (urlOptions.suffix) { url = `${url}/${urlOptions.suffix}`; }
  if (urlOptions.params) { url = appendParamsToUrl(url, urlOptions.params); }
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
  for (const k in params) {
    url = `${url}${k}=${encodeURIComponent(params[k])}&`;
  }
  url = url.slice(0, -1);
  return url;
}
