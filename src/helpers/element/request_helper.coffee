HPP.Helpers.Element.doAction = (hpe, method, user_options = {}) ->
  hpe.snapshots.make("before_#{method.toLowerCase()}")
  if user_options.data
    data = user_options.data
  else if method isnt 'GET'
    data = HPP.Helpers.Element.toData(hpe)

  if method is 'POST'
    throw new Error('Element is not new') if !hpe.isNew()
  else
    throw new Error('Element is new') if hpe.isNew()

  promise = HPP.Helpers.Ajax.executeRequest(
    HPP.Helpers.Url.createForElement(method, {}, hpe, user_options),
    method,
    data,
    user_options.headers
  )
  promise.then (response) ->
    hpe.mergeWith response.data if response.data
    hpe.snapshots.make("after_#{method.toLowerCase()}")

    collection = hpe.getCollection()

    if collection.new_elements.includes(hpe)
      HP.Util.removeFromArray(collection.new_elements, hpe)
      collection.elements[hpe.getSelectorValue()] = hpe

  return promise

HPP.Helpers.Element.doCustomAction = (hpe, action_name, action_settings, user_options = {}) ->
  method = action_settings.method.toUpperCase()
  hpe.snapshots.make("before_#{method.toLowerCase()}")

  if user_options.data
    data = user_options.data
  else if not action_settings.without_data
    data = HPP.Helpers.Element.toData(hpe)

  promise = HPP.Helpers.Ajax.executeRequest(
    HPP.Helpers.Url.createForElement(action_name, action_settings, hpe, user_options)
    method,
    data,
    user_options.headers
  )
  promise.then (response) ->
    if !action_settings.returns_other
      hpe.mergeWith response.data if response.data
      hpe.snapshots.make("after_#{method.toLowerCase()}")

    collection = hpe.getCollection()

    if (selector_value = hpe.getSelectorValue()) and collection.new_elements.includes(hpe)
      HP.Util.removeFromArray(collection.new_elements, hpe)
      collection.elements[selector_value] = hpe

  return promise
