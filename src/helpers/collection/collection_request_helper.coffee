HPP.Helpers.Collection.doGetAllAction = (hpc, user_options = {}) ->
  data = user_options.data

  promise = HPP.Helpers.Ajax.executeRequest(
    HPP.Helpers.Url.createForCollection('GET', hpc, user_options),
    'GET',
    data,
    user_options.headers
  )
  promise.then (response) ->
    for pre_element in response.data
      hpc.makeOrMerge(pre_element)
  return promise

HPP.Helpers.Collection.doGetOneAction = (hpc, selector_value, user_options = {}) ->
  data = user_options.data

  promise = HPP.Helpers.Ajax.executeRequest(
    HPP.Helpers.Url.createForCollection('GET', hpc, {suffix: selector_value}),
    'GET',
    data,
    user_options.headers
  )
  promise.then (response) ->
    hpc.makeOrMerge response.data if response.data
  return promise

HPP.Helpers.Collection.doCustomAction = (hpc, action_name, action_settings, user_options = {}) ->
  method = action_settings.method.toUpperCase()

  data = user_options.data

  HPP.Helpers.Ajax.executeRequest(
    HPP.Helpers.Url.createForCollection('GET', hpc, {suffix: action_settings.path || action_name})
    method,
    data,
    user_options.headers
  )
