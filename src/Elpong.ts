import { Scheme } from './Scheme';
import { Collection } from './Collection';
import { SchemeConfiguration, PreSchemeConfiguration } from './Configuration';
import { ElpongError, ElpongErrorType } from './Errors';
import { Util } from './Util';
import { Ajax, AjaxExternalFunction, AjaxAdapterType, AjaxAdapterTypeString } from './Ajax';

declare let DEBUG: boolean;

interface SchemeMap {
  [name: string]: Scheme;
}

interface CollectionMap {
  [name: string]: Collection;
}

let schemes: SchemeMap = {};
let autoload: boolean = false;

export namespace Elpong {
  export function add(scheme_config: PreSchemeConfiguration): Scheme {
    let scheme = new Scheme(scheme_config);
    return schemes[scheme.name] = scheme;
  }

  export function get(name: string): Scheme {
    let scheme: Scheme;
    if (scheme = schemes[name]) {
      return scheme;
    }
    throw new ElpongError(ElpongErrorType.SCHNFO, name); // Scheme not found
  }

  export function load(ignore_empty: boolean): void {
    if (typeof document === 'undefined') return;

    let scheme_tags: NodeListOf<HTMLMetaElement> =
      document.querySelectorAll('meta[name=elpong-scheme]') as NodeListOf<HTMLMetaElement>;

    if (!ignore_empty && !scheme_tags.length) {
      throw new ElpongError(ElpongErrorType.ELPNST);
    }

    for (let scheme_tag of Util.arrayFromHTML(scheme_tags) as HTMLMetaElement[]) {
      let scheme = Elpong.add(JSON.parse(scheme_tag.content));
    }
  }

  export function setAjax(fn: AjaxExternalFunction, type?: AjaxAdapterType|AjaxAdapterTypeString): void {
    Ajax.setAjaxFunction(fn, type);
  }

  export function enableAutoload(): void {
    autoload = true
    Elpong.load(true);
  }

  export function isAutoloadEnabled(): boolean {
    return autoload;
  }

  export function tearDown(): void {
    autoload = false;
    schemes = {};
  }
}
