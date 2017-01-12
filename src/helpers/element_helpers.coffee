HPP.Helpers.Element = {
  toData: (element) ->
    collection = element.getCollection()
    o = HPP.Helpers.Element.getFields(element)

    # data = {}
    # data[HPP.Helpers.Collection.getSingularName(collection)] = o
    # data

    data = o

  getFields: (element) ->
    collection = element.getCollection()
    scheme = collection.getScheme()
    o = {}
    for field_name, field_settings of scheme.data.collections[collection.getName()].fields
      continue if field_settings.only_receive or field_settings.embedded_collection or field_settings.embedded_element
      field_value = element.getField(field_name)
      o[field_name] = field_value
    o
}
