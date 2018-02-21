import { Scheme } from '../Scheme';
import { ElpongError } from '../Errors';
import { CollectionHelper } from './CollectionHelper';
import { Collection } from '../Collection';

export namespace SchemeHelper {
  export function getCollectionBySingularName(scheme: Scheme, singular_name: string) {
    for (let collection of scheme.getCollectionMap().values()) {
      if (CollectionHelper.getSingularName(collection) === singular_name) { return collection; }
    }
    throw new ElpongError('collnf:s', singular_name);
  }
}
