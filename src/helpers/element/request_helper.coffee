getOptions = (method, url, data, headers) ->
  {
    method: method
    url: url
    data: data
    headers: headers
    dataType: 'json'
    responseType: 'json'
  }

HP.Helpers.Element.doAction = (hpe, method, user_options = {}) ->
  hpe.makeSnapshot("before_#{method.toLowerCase()}")
  if user_options.data
    data = user_options.data
  else if method != 'GET'
    data = HP.Helpers.Element.toData(hpe)

  options = getOptions(
    method,
    HP.Helpers.Url.createForElement(method, {}, hpe, user_options),
    data,
    user_options.headers
  )

  promise = HPP.http_function(options)
  promise.then (response) ->
    hpe.mergeWith response.data if response.data
    hpe.makeSnapshot("after_#{method.toLowerCase()}")
  return promise

HP.Helpers.Element.doCustomAction = (hpe, action_name, action_settings, user_options = {}) ->
  method = action_settings.method.toUpperCase()
  hpe.makeSnapshot("before_#{method.toLowerCase()}")

  if user_options.data
    data = user_options.data
  else if not (user_options.exclude_data or action_settings.exclude_data)
    data = HP.Helpers.Element.toData(hpe)

  options = getOptions(
    method,
    HP.Helpers.Url.createForElement(action_name, action_settings, hpe, user_options)
    data,
    user_options.headers
  )

  promise = HPP.http_function(options)
  promise.then (response) ->
    hpe.mergeWith response.data if response.data
    hpe.makeSnapshot("after_#{method.toLowerCase()}")
  return promise
