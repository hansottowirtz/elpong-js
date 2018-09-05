import { Collection } from './Collection';
import { PreSchemeConfiguration, SchemeConfiguration } from './Configuration';
import { elpong } from './elpong';
import { ElpongError, ElpongErrorType } from './Errors';
import { isFqdn, trimSlashes } from './Helpers/UrlHelper';

export interface CollectionMap {
  [name: string]: Collection;
}

export class Scheme {
  name: string;
  private _configuration: SchemeConfiguration;
  private _collections: CollectionMap;
  private apiUrl: string;

  constructor(preSchemeConfiguration: PreSchemeConfiguration) {
    const sc = new SchemeConfiguration(preSchemeConfiguration);
    this._configuration = sc;
    this.name = sc.name;
    this._collections = {};

    // Create collections
    for (const collectionName in sc.collections) {
      const collectionSettings = sc.collections[collectionName];
      const collection = new Collection(this, collectionName);
      this._collections[collectionName] = collection;
    }

    if (elpong.isAutoloadEnabled()) {
      for (const collectionName in sc.collections) {
        this._collections[collectionName].load(true);
      }
    }
  }

  configuration(): SchemeConfiguration {
    return this._configuration;
  }

  select(name: string): Collection {
    const collection = this._collections[name];
    if (collection) {
      return collection;
    } else {
      throw new ElpongError(ElpongErrorType.COLNFO, name);
    }
  }

  setApiUrl(url: string): string {
    const trimmedUrl = trimSlashes(url);
    return this.apiUrl = isFqdn(trimmedUrl) ? trimmedUrl : `/${trimmedUrl}`;
  }

  getApiUrl(): string {
    return this.apiUrl;
  }

  getCollections(): CollectionMap {
    return this._collections;
  }
}
