HPP.Helpers.Element.setupHasManyRelation = (hpe, relation_collection_name, relation_settings) ->
  collection = hpe.getCollection()
  collection_settings = HPP.Helpers.Collection.getSettings(hpe.getCollection())

  relation_collection = collection.getScheme().getCollection(relation_settings.collection || relation_collection_name)

  references_field_name = relation_settings.references_field || "#{relation_collection_name}_#{relation_collection.selector_name}s" # dogs_ids, unless specified otherwise

  if relation_field_settings = collection_settings.fields[references_field_name]
    # throw new Error("Field #{field_name} of collection #{collection.getName()} are not references") if !relation_field_settings.references
    hpe.relations["get#{HP.Util.upperCamelize(relation_collection_name)}"] = ->
      HPP.Helpers.Element.getHasManyRelationArrayThroughReferencesField(hpe, relation_collection, field_name)

  else # normal has_many relationship
    hpe.relations["get#{HP.Util.upperCamelize(relation_collection_name)}"] = HPP.Helpers.Element.getHasManyRelationFunction(hpe, collection, relation_settings, relation_collection)

HPP.Helpers.Element.getHasManyRelationFunction = (hpe, collection, relation_settings, relation_collection) ->
  collection_singular_name = collection.getSingularName()
  relation_collection_settings = HPP.Helpers.Collection.getSettings(relation_collection)

  if relation_settings.polymorphic
    has_many_field_name = "#{relation_settings.as}_#{collection.selector_name}"
    has_many_collection_field_name = "#{relation_settings.as}_collection"

    return -> HPP.Helpers.Element.getPolymorphicHasManyRelationArray(hpe, relation_collection, has_many_field_name, has_many_collection_field_name)
  else
    has_many_field_name = if relation_settings.field
      relation_settings.field
    else if relation_settings.as
      "#{relation_settings.as}_#{collection.selector_name}"
    else
      "#{collection_singular_name}_#{collection.selector_name}"

    return -> HPP.Helpers.Element.getHasManyRelationArray(hpe, relation_collection, has_many_field_name)

HPP.Helpers.Element.getHasManyRelationArray = (hpe, relation_collection, has_many_field_name) ->
  hpe2_arr = []
  selector_value = hpe.getSelectorValue()
  for hpe2 in relation_collection.getArray()
    hpe2_arr.push(hpe2) if selector_value is hpe2.getField(has_many_field_name, true, 'has_many')
  return hpe2_arr

HPP.Helpers.Element.getPolymorphicHasManyRelationArray = (hpe, relation_collection, has_many_field_name, has_many_collection_field_name) ->
  hpe2_arr = []
  selector_value = hpe.getSelectorValue()
  collection_name = hpe.getCollection().getName()
  for hpe2 in relation_collection.getArray()
    hpe2_arr.push(hpe2) if selector_value is hpe2.getField(has_many_field_name, true, 'has_many') and collection_name is hpe2.getField(has_many_collection_field_name, true, 'has_many_collection_name')
  return hpe2_arr

HPP.Helpers.Element.getHasManyRelationArrayThroughReferencesField = (hpe, relation_collection, field_name) ->
  selector_value_arr = hpe.getField(field_name, true, 'has_many_array')
  throw new Error("Field #{field_name} is not an array, but it should be an array of references to #{relation_collection.getName()}") if !Array.isArray(selector_value_arr)
  hpe2_arr = []
  for hpe2 in relation_collection.getArray()
    hpe2_arr.push(hpe2) if selector_value_arr.includes hpe.getSelectorValue()
  return hpe2_arr
