HPP.Helpers = {
  Url: {
    # Creates the api url for an element
    #
    # @param {String} action_name           The action name, custom or 'GET', 'POST', 'PUT', 'DELETE'.
    # @param {HP.Element} element      The element.
    # @param {Object} user_options          The user_options, keys: suffix, path.
    #
    # @return undefined [Description]
    createForElement: (action_name, action_settings, element, user_options) ->
      collection = element.getCollection()
      scheme = collection.getScheme()
      api_url = scheme.getApiUrl()
      throw new Error('Api url has not yet been set') if !api_url

      if user_options.path
        path = HPP.Helpers.Url.trimSlashes(user_options.path)
        url = "#{api_url}/#{path}"
      else
        url = "#{api_url}/#{collection.getName()}"
        url = "#{url}/#{element.getSelectorValue()}" unless action_settings.without_selector or action_name is 'POST'

      if action_settings.method # is custom action
        url = "#{url}/#{action_settings.path || action_name}"

      url = "#{url}/#{user_options.suffix}" if user_options.suffix
      url

    createForCollection: (action_name, collection, user_options) ->
      url = "#{collection.getScheme().getApiUrl()}/#{collection.getName()}" #HPP.Helpers.Url.createForCollection(, hpe, user_options) # (action_name, element, user_options = {}, suffix)
      url = "#{url}/#{user_options.suffix}" if user_options.suffix
      url

    trimSlashes: (s) ->
      s.replace(/\/$/, '').replace(/^\//, '')

  }
  Element: {
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
        HPP.Helpers.Field.validateType(field_name, field_value, field_settings)
        o[field_name] = field_value
      o
  }
  Collection: {
    getSettings: (c) ->
      c.getScheme().data.collections[c.getName()]

    getSingularName: (c) ->
      HPP.Helpers.Collection.getSettings(c).singular
  }
  Field: {
    validateType: (field_name, field_value, field_settings) ->
      if field_value is undefined or field_value is null
        if field_value is undefined and (field_settings.not_undefined or field_settings.not_nothing)
          throw new Error("The value of field #{field_name} is undefined, and it should not be")

        if field_value is null and (field_settings.not_null or field_settings.not_nothing)
          throw new Error("The value of field #{field_name} is null, and it should not be")

      else
        if field_settings.type
          if !HP.Util.isOfType(field_settings.type, field_value)
            HPP.log 'Error value: ', field_value
            throw new Error("The value of field #{field_name} (value above) is not a #{field_settings.type}")

        else if field_settings.types
          is_any = false
          for type in field_settings.types
            if HPP.Helpers.Field.isOfType(type, field_value)
              is_any = true
              break
          HPP.log 'Error value: ', field_value
          throw new Error("The value of field #{field_name} (value above) is not of any of these: #{field_settings.types}") if !is_any
  }
}
