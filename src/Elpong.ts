import { Scheme } from './Scheme';
import { Collection } from './Collection';
import { SchemeConfiguration } from './Configuration';
import { ElpongError } from './Errors';
import { Util } from './Util';
import { Ajax } from './Ajax';

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
  export function add(scheme_config: SchemeConfiguration | Object): Scheme {
    let scheme = new Scheme(scheme_config);
    return schemes[scheme.name] = scheme;
  }

  export function get(name: string): Scheme {
    let scheme: Scheme;
    if (scheme = schemes[name]) {
      return scheme;
    }
    throw new ElpongError('schmnf', name); // Scheme not found
  }

  export function load(ignore_empty: boolean): void {
    if (typeof document === 'undefined') return

    let scheme_tags: NodeListOf<HTMLMetaElement> =
      document.querySelectorAll('meta[name=elpong-scheme]') as NodeListOf<HTMLMetaElement>;

    if (!ignore_empty && !scheme_tags.length) {
      throw new ElpongError('elpgns');
    }

    for (let scheme_tag of Util.arrayFromHTML(scheme_tags) as HTMLMetaElement[]) {
      let scheme = Elpong.add(JSON.parse(scheme_tag.content));
    }
  }

  export function setAjax(fn: Function): void {
    Ajax.setAjaxFunction(fn);
  }

  export function enableAutoload(): void {
    autoload = true
    Elpong.load(true);
  }

  export function isAutoload(): boolean {
    return autoload;
  }

  export function tearDown(): void {
    autoload = false;
    schemes = {};
  }
}
