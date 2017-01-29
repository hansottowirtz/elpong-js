module Elpong {
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
    singular_name: string;
    private _configuration: SchemeConfiguration;
    collections: CollectionMap;
    private api_url: string;
    selector_name: string;

    constructor(sc: SchemeConfiguration | Object) {
      let _sc: SchemeConfiguration;
      if (!isSchemeConfiguration(sc))
        _sc = new SchemeConfiguration(sc);
      else
        _sc = sc as SchemeConfiguration;
      this._configuration = _sc;
      this.name = _sc.name;
      this.singular_name = _sc.singular;
      this.collections = {};
      this.api_url = null;
      this.selector_name = _sc.selector;

      // Create collections
      for (let collection_name in _sc.collections) {
        let collection_settings = _sc.collections[collection_name];
        this.collections[collection_name] = new Collection(this, collection_name);
      }
    }

    configuration() {
      return this._configuration;
    }

    select(name: string) {
      if (!this.collections[name]) {
        throw new ElpongError('collnf', name);
      } else {
        return this.collections[name];
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
}
