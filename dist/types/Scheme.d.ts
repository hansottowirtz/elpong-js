import { Collection } from './Collection';
import { SchemeConfiguration } from './Configuration';
export interface CollectionMap {
    [name: string]: Collection;
}
export declare class Scheme {
    name: string;
    private _configuration;
    private _collections;
    private api_url;
    constructor(sc: SchemeConfiguration | Object);
    configuration(): SchemeConfiguration;
    select(name: string): Collection;
    setApiUrl(url: string): string | undefined;
    getApiUrl(): string;
    getCollections(): CollectionMap;
}
