import { Collection } from './Collection';
import { SchemeConfiguration } from './Configuration';
import { ElpongError } from './Errors';
import { UrlHelper } from './Helpers';
import { Elpong } from './Elpong';

interface CollectionMap {
  [name: string]: Collection;
}

interface SchemeOptions {
  no_normalize: boolean;
  no_create_collections: boolean;
}

function isSchemeConfiguration(sc: SchemeConfiguration | Object): sc is SchemeConfiguration {
   return (sc as SchemeConfiguration) instanceof SchemeConfiguration;
}

export class Scheme {
  name: string;
  private _configuration: SchemeConfiguration;
  _collections: CollectionMap;
  private api_url: string;

  constructor(sc: SchemeConfiguration | Object) {
    let _sc: SchemeConfiguration;
    if (!isSchemeConfiguration(sc)) {
      _sc = new SchemeConfiguration(sc);
    } else {
      _sc = sc;
    }
    this._configuration = _sc;
    this.name = _sc.name;
    this._collections = {};

    // Create collections
    for (let collection_name in _sc.collections) {
      let collection_settings = _sc.collections[collection_name];
      let collection = new Collection(this, collection_name);
      this._collections[collection_name] = collection;
      if (Elpong.isAutoload())
        collection.load(true);
    }
  }

  configuration() {
    return this._configuration;
  }

  select(name: string) {
    let collection;
    if (collection = this._collections[name]) {
      return collection;
    } else {
      throw new ElpongError('collnf', name);
    }
  }

  setApiUrl(url: string) {
    let api_url = this.api_url = UrlHelper.trimSlashes(url);
    if (!UrlHelper.isFqdn(api_url)) {
      return this.api_url = `/${api_url}`;
    }
  }

  getApiUrl() {
    return this.api_url;
  }
}
