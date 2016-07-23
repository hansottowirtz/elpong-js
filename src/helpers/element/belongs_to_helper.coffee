HPP.Helpers.Element.setupBelongsToRelation = (hpe, relation_collection_singular_name, relation_settings) ->
  collection = hpe.getCollection()
  if !relation_settings.polymorphic
    if relation_settings.collection
      relation_collection = collection.getScheme().getCollection(relation_settings.collection)
    else
      relation_collection = collection.getScheme().getCollectionBySingularName(relation_collection_singular_name)

  # TODO should be reference
  if relation_settings.polymorphic
    collection_field_name = relation_settings.collection_field ||  "#{relation_collection_singular_name}_collection"
    collection_selector_field = relation_settings.collection_selector_field
    field_name = relation_settings.field
    hpe.relations["get#{HP.Util.upperCamelize(relation_collection_singular_name)}"] = ->
      HPP.Helpers.Element.getPolymorphicBelongsToElement(hpe, field_name, collection_field_name, collection_selector_field, relation_collection_singular_name)
  else # normal
    field_name = relation_settings.field || "#{relation_collection_singular_name}_#{relation_collection.selector_name}"
    hpe.relations["get#{HP.Util.upperCamelize(relation_collection_singular_name)}"] = ->
      HPP.Helpers.Element.getBelongsToElement(hpe, relation_collection, field_name)

HPP.Helpers.Element.getBelongsToElement = (hpe, relation_collection, field_name) ->
  selector_value = hpe.getField(field_name, true, 'belongs_to')
  relation_collection.find(selector_value) || null

# Gets the polymorphic belongs_to element
#
# @param {HTTPong.Element} hpe              The element to which the other element belongs
# @param {String} field_name                The foreign key, e.g. parent_id.
# @param {String} collection_field_name     The field name of the other collection, required, e.g. parent_collection.
# @param {String} collection_selector_field The selector name of the other collection, if it was specified, e.g. id. (Will not be looked at if field_name is present)
# @param {String} collection_singular_name  e.g. parent
#
# @return {HTTPong.Element|null}            The related element.
HPP.Helpers.Element.getPolymorphicBelongsToElement = (hpe, field_name, collection_field_name, collection_selector_field, collection_singular_name) ->
  # console.log hpe, collection_field_name, collection_selector_field
  relation_collection_name = hpe.getField(collection_field_name, true, 'belongs_to_collection')
  relation_collection = hpe.getCollection().getScheme().getCollection(relation_collection_name)
  if !field_name
    collection_selector_field ||= relation_collection.selector_name
    field_name = "#{collection_singular_name}_#{collection_selector_field}"
  selector_value = hpe.getField(field_name, true, 'belongs_to')
  relation_collection.find(selector_value) || null
