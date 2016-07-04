getOptions = (method, url, data, headers = {}) ->
  headers.Accept = headers['Content-Type'] = 'application/json'
  {
    method: method
    url: url
    data: JSON.stringify(data || null)
    headers: headers
    dataType: 'json'
    responseType: 'json'
  }

HP.Helpers.Element.doAction = (hpe, method, user_options = {}) ->
  hpe.makeSnapshot("before_#{method.toLowerCase()}")
  if user_options.data
    data = user_options.data
  else if method isnt 'GET'
    data = HP.Helpers.Element.toData(hpe)

  if method is 'POST'
    throw new Error('Element is not new') if !hpe.isNew()
  else
    throw new Error('Element is new') if hpe.isNew()

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
  else if not action_settings.without_data
    data = HP.Helpers.Element.toData(hpe)

  options = getOptions(
    method,
    HP.Helpers.Url.createForElement(action_name, action_settings, hpe, user_options)
    data,
    user_options.headers
  )

  promise = HPP.http_function(options)
  promise.then (response) ->
    hpe.mergeWith response.data if response.data and !action_settings.returns_other
    hpe.makeSnapshot("after_#{method.toLowerCase()}")
  return promise
