import { Scheme } from '../Scheme';
import { ElpongError, ElpongErrorType } from '../Errors';
import { CollectionHelper } from './CollectionHelper';
import { Collection } from '../Collection';

export namespace SchemeHelper {
  export function getCollectionBySingularName(scheme: Scheme, singular_name: string) {
    for (let collection_name in scheme.getCollections()) {
      let collection = scheme.select(collection_name);
      if (CollectionHelper.getSingularName(collection) === singular_name) { return collection; }
    }
    throw new ElpongError(ElpongErrorType.COLNFS, singular_name);
  }
}
