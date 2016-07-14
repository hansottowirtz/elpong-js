HPP.Helpers.Field.handleEmbeddedCollection = (hpe, pre_element, field_name, field_settings) ->
  collection = hpe.getCollection()
  scheme = collection.getScheme()
  embedded_element_collection = scheme.getCollection(field_name || field_settings.collection)

  HP.Util.forEach pre_element[field_name], (embedded_pre_element) ->
    embedded_element = new HP.Element(embedded_element_collection, embedded_pre_element)
    embedded_element_collection.addElement(embedded_element)
