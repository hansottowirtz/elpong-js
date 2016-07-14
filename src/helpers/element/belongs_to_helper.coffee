HPP.Helpers.Element.setupBelongsToRelation = (hpe, relation_collection_singular_name, relation_settings) ->
  collection = hpe.getCollection()
  if !relation_settings.polymorphic
    if relation_settings.collection
      relation_collection = collection.getScheme().getCollection(relation_settings.collection)
    else
      relation_collection = collection.getScheme().getCollectionBySingularName(relation_collection_singular_name)

  field_name = relation_settings.field || "#{relation_collection_singular_name}_#{if relation_settings.polymorphic then relation_settings.collection_selector_field else relation_collection.selector_name}"
  # TODO should be reference
  if relation_settings.polymorphic
    collection_field_name = relation_settings.collection_field ||  "#{relation_collection_singular_name}_collection"
    hpe.relations["get#{HP.Util.upperCamelize(relation_collection_singular_name)}"] = ->
      HPP.Helpers.Element.getPolymorphicBelongsToElement(hpe, field_name, collection_field_name)
  else # normal
    hpe.relations["get#{HP.Util.upperCamelize(relation_collection_singular_name)}"] = ->
      HPP.Helpers.Element.getBelongsToElement(hpe, relation_collection, field_name)

HPP.Helpers.Element.getBelongsToElement = (hpe, relation_collection, field_name) ->
  selector_value = hpe.getField(field_name, true, 'belongs_to')
  relation_collection.find(selector_value) || null

HPP.Helpers.Element.getPolymorphicBelongsToElement = (hpe, field_name, collection_field_name) ->
  relation_collection_name = hpe.getField(collection_field_name, true, 'belongs_to_collection')
  selector_value = hpe.getField(field_name, true, 'belongs_to')
  hpe.getCollection().getScheme().getCollection(relation_collection_name).find(selector_value) || null
