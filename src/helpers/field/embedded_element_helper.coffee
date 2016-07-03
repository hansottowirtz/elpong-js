HP.Helpers.Field.handleEmbeddedElement = (hpe, pre_element, field_name, field_settings) ->
  collection = hpe.getCollection()
  scheme = collection.getScheme()
  if field_settings.collection
    embedded_element_collection = scheme.getCollection(field_settings.collection)
  else
    embedded_element_collection = scheme.getCollectionBySingularName(field_name)

  embedded_element = new HP.Element(embedded_element_collection, pre_element[field_name])
  embedded_element_collection.addElement(embedded_element)

  associated_field_name = field_settings.associated_field || "#{field_name}_#{embedded_element_collection.selector_name}"
  hpe.setField(associated_field_name, embedded_element.getSelectorValue())
