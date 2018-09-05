import { Collection } from '../Collection';
import { ElpongError, ElpongErrorType } from '../Errors';
import { Scheme } from '../Scheme';
import { getSingularName } from './CollectionHelper';

export function getCollectionBySingularName(scheme: Scheme, singularName: string): Collection {
  for (const collectionName in scheme.getCollections()) {
    const collection = scheme.select(collectionName);
    if (getSingularName(collection) === singularName) { return collection; }
  }
  throw new ElpongError(ElpongErrorType.COLNFS, singularName);
}
