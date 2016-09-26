HPP.Helpers.Field.handleEmbeddedElement = (hpe, pre_element, field_name, field_settings) ->
  embedded_pre_element = pre_element[field_name]
  return if !embedded_pre_element and !field_settings.required
  collection = hpe.getCollection()
  scheme = collection.getScheme()
  if field_settings.collection
    embedded_element_collection = scheme.getCollection(field_settings.collection)
  else
    embedded_element_collection = scheme.getCollectionBySingularName(field_name)

  embedded_element = embedded_element_collection.makeOrMerge(embedded_pre_element)

  associated_field_name = field_settings.associated_field || "#{field_name}_#{embedded_element_collection.selector_name}"
  hpe.setField(associated_field_name, embedded_element.getSelectorValue())
