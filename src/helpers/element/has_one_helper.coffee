HP.Helpers.Element.setupHasOneRelation = (hpe, relation_collection_name, relation_settings) ->
  console.warn 'Not yet implemented'
  # collection = hpe.getCollection()
  # collection_settings = HP.Helpers.Collection.getSettings(hpe.getCollection())
  #
  # relation_collection = collection.getScheme().getCollection(relation_settings.collection || relation_collection_name)
  #
  # reference_field_name = relation_settings.field || || "#{relation_collection_name}_#{relation_collection.selector_name}"
  #
  # hpe.relations["get#{HP.Util.upperCamelize(relation_collection_singular_name)}"] = ->
  #   HP.Helpers.Element.getHasOneElement(hpe, relation_collection, reference_field_name)

HP.Helpers.Element.getHasOneElement = (hpe, relation_collection, reference_field_name) ->
  # selector_value = hpe.getField(field_name, true, 'belongs_to')
  # for relation_element in relation_collection.getArray()
  #   return relation_element if relation_element.getField(reference_field_name, 'has_one')
