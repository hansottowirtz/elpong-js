module Elpong {
  export namespace SchemeHelper {
    export function getCollectionBySingularName(scheme: Scheme, singular_name: string) {
      for (let collection_name in scheme.collections) {
        let collection = scheme.collections[collection_name];
        if (CollectionHelper.getSingularName(collection) === singular_name) { return collection; }
      }
      throw new ElpongError('collnf:s', singular_name);
    }
  }
}
