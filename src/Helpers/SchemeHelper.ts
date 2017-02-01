import { Scheme } from '../Scheme';
import { ElpongError } from '../Errors';
import { CollectionHelper } from './CollectionHelper';

export namespace SchemeHelper {
  export function getCollectionBySingularName(scheme: Scheme, singular_name: string) {
    for (let collection_name in scheme._collections) {
      let collection = scheme.select(collection_name);
      if (CollectionHelper.getSingularName(collection) === singular_name) { return collection; }
    }
    throw new ElpongError('collnf:s', singular_name);
  }
}
