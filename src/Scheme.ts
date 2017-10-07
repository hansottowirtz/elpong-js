import { Collection } from './Collection';
import { SchemeConfiguration, PreSchemeConfiguration } from './Configuration';
import { ElpongError } from './Errors';
import { UrlHelper } from './Helpers';
import { Elpong } from './Elpong';

export interface CollectionMap {
  [name: string]: Collection;
}

export class Scheme {
  name: string;
  private _configuration: SchemeConfiguration;
  private _collections: CollectionMap;
  private api_url: string;

  constructor(preSchemeConfiguration: PreSchemeConfiguration) {
    const sc = new SchemeConfiguration(preSchemeConfiguration);
    this._configuration = sc;
    this.name = sc.name;
    this._collections = {};

    // Create collections
    for (let collection_name in sc.collections) {
      let collection_settings = sc.collections[collection_name];
      let collection = new Collection(this, collection_name);
      this._collections[collection_name] = collection;
    }

    if (Elpong.isAutoloadEnabled()) {
      for (let collection_name in sc.collections) {
        this._collections[collection_name].load(true);
      }
    }
  }

  configuration(): SchemeConfiguration {
    return this._configuration;
  }

  select(name: string): Collection {
    let collection;
    if (collection = this._collections[name]) {
      return collection;
    } else {
      throw new ElpongError('collnf', name);
    }
  }

  setApiUrl(url: string): string {
    const trimmed_url = UrlHelper.trimSlashes(url);
    return this.api_url = UrlHelper.isFqdn(trimmed_url) ? trimmed_url : `/${trimmed_url}`;
  }

  getApiUrl(): string {
    return this.api_url;
  }

  getCollections(): CollectionMap {
    return this._collections;
  }
}
