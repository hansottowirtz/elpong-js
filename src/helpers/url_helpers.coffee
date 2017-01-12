HPP.Helpers.Url = {
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
