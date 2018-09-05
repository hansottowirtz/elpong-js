import { AjaxAdapterType, AjaxAdapterTypeString, AjaxExternalFunction, setAjaxFunction } from './Ajax';
import { Collection } from './Collection';
import { PreSchemeConfiguration } from './Configuration';
import { ElpongError, ElpongErrorType } from './Errors';
import { Scheme } from './Scheme';
import { arrayFromHTML } from './Util';

interface SchemeMap {
  [name: string]: Scheme;
}

interface CollectionMap {
  [name: string]: Collection;
}

let schemes: SchemeMap = {};
let autoload: boolean = false;

const elpong = {
  add: (schemeConfig: PreSchemeConfiguration): Scheme => {
    const scheme = new Scheme(schemeConfig);
    return schemes[scheme.name] = scheme;
  },
  enableAutoload: (): void => {
    autoload = true;
    elpong.load(true);
  },
  get: (name: string): Scheme => {
    const scheme = schemes[name];
    if (scheme) return scheme;
    throw new ElpongError(ElpongErrorType.SCHNFO, name); // Scheme not found
  },
  isAutoloadEnabled: (): boolean => {
    return autoload;
  },
  load: (ignoreEmpty: boolean): void => {
    if (typeof document === 'undefined') return;

    const schemeTags: NodeListOf<HTMLMetaElement> = document.querySelectorAll('meta[name=elpong-scheme]') as NodeListOf<HTMLMetaElement>;

    if (!ignoreEmpty && !schemeTags.length) {
      throw new ElpongError(ElpongErrorType.ELPNST);
    }

    for (const schemeTag of arrayFromHTML(schemeTags) as HTMLMetaElement[]) {
      const scheme = elpong.add(JSON.parse(schemeTag.content));
    }
  },
  setAjax: (fn: AjaxExternalFunction, type?: AjaxAdapterType | AjaxAdapterTypeString): void => {
    setAjaxFunction(fn, type);
  },
  tearDown: (): void => {
    autoload = false;
    schemes = {};
  }
};

export { elpong };
