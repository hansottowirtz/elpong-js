HP.Helpers.Collection.doGetAllAction = (hpc, user_options = {}) ->
  data = user_options.data

  url = HP.Helpers.Url.createForCollection('GET', hpc, user_options)

  options = {
    method: 'GET'
    url: url
    data: data
    headers: user_options.headers
    dataType: 'json'
    responseType: 'json'
  }
  promise = HPP.http_function(options)
  promise.then (response) ->
    for pre_element in response.data
      hpc.makeOrMerge(pre_element)
  return promise

HP.Helpers.Collection.doGetOneAction = (hpc, selector_value, user_options = {}) ->
  data = user_options.data

  url = HP.Helpers.Url.createForCollection('GET', hpc, {suffix: selector_value})

  options = {
    method: 'GET'
    url: url
    data: data
    headers: user_options.headers
    dataType: 'json'
    responseType: 'json'
  }
  promise = HPP.http_function(options)
  promise.then (response) ->
    hpc.makeOrMerge(response.data)
  return promise
#
# HP.Helpers.Element.doCustomAction = (hpe, method, action_settings, user_options = {}) ->
#   if user_options.data
#     data = user_options.data
#   # else if iets
#   else
#     if user_options.exclude_data? or user_options.include_data?
#       console
#     if method == 'GET'
#       data = user_options.data
#     else
#       data = user_options.data || HP.Helpers.Element.toData(@)
#
#   options = {
#     method: method
#     url: HP.Helpers.Url.create(method, hpe, user_options) # (action_name, element, user_options = {}, suffix)
#     data: data
#     headers: user_options.headers
#   }
#   promise = HPP.http_function(options)
#   promise.then (response) ->
#     hpe.mergeWith response.data
#   return promise
