HPP.Helpers.Element.setupHasOneRelation = (hpe, relation_collection_singular_name, relation_settings) ->
  collection = hpe.getCollection()
  collection_settings = HPP.Helpers.Collection.getSettings(hpe.getCollection())

  scheme = collection.getScheme()

  if relation_settings.collection
    relation_collection = scheme.getCollection(relation_settings.collection)
  else
    relation_collection = scheme.getCollectionBySingularName(relation_collection_singular_name)

  hpe.relations["get#{HP.Util.upperCamelize(relation_collection_singular_name)}"] = -> HPP.Helpers.Element.getHasManyRelationFunction(hpe, collection, relation_settings, relation_collection)()[0]
