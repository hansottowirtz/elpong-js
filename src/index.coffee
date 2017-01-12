# A Javascript implementation of HTTPong
#
# @author Hans Otto Wirtz
# @version 0.3.8

HTTPong = HP = {}
HP.private = HPP = {
  log: ->
    console.log.apply(console, ['%c HTTPong ', 'background: #80CBC4; color: #fff'].concat(Array.from(arguments)))
  schemes: {}
  http_function: null
  isHpe: (e) ->
    e.constructor is HP.Element
  isHpc: (e) ->
    e.constructor is HP.Collection
  Helpers: {}
}

# Adds a scheme
#
# @param {Object} pre_scheme The object that will become a Scheme.
# @throw {Error} if a scheme with the given name already exists.
# @return {HP.Scheme} The scheme
HP.addScheme = (pre_scheme) ->
  scheme = new HP.Scheme(pre_scheme)
  if HPP.schemes[scheme.getName()]
    throw new Error("A scheme with name #{scheme.getName()} already exists")

  HPP.schemes[scheme.getName()] = scheme

# Gets a scheme by its name.
#
# @param {String} name The name of the scheme.
# @return {HP.Scheme, undefined} The scheme, or undefined if it does not exist.
HP.getScheme = (name) ->
  HPP.schemes[name]

# Bootstrap HTTPong
#
# @return {Object} HTTPong
HP.initialize = ->
  scheme_tags = document.querySelectorAll('meta[name=httpong-scheme]')
  if !scheme_tags.length and !Object.keys(HPP.schemes).length
    throw new Error('No scheme added or found')

  for scheme_tag in scheme_tags
    HP.addScheme(JSON.parse(scheme_tag.content))

  for scheme_name, scheme of HPP.schemes
    for collection_name, collection of scheme.collections
      collection.handlePreloadedElements()

  return HP

# Set the http function used for requests
# The function should accept one object with keys
# method, url, params, headers
# and return a promise-like object
# with then and catch
#
# @note Like $http or jQuery.ajax
# @param {Function} http_function The function.
# @return {Object} HP
HP.setHttpFunction = (fn, type) ->
  if type is 'jquery' or
  (typeof jQuery isnt 'undefined' and fn is jQuery.ajax)
    HPP.http_function = (url, object) ->
      deferred = jQuery.Deferred()
      ajax = fn(url, object)
      ajax.then (data, status, jqxhr) ->
        deferred.resolve({data: data, status: jqxhr.statusCode().status, headers: jqxhr.getAllResponseHeaders()})
      ajax.catch (data, status, jqxhr) ->
        deferred.reject({data: data, status: jqxhr.statusCode().status, headers: jqxhr.getAllResponseHeaders()})
      return deferred

  else if type is 'fetch' or
  (typeof window isnt 'undefined' and fn is window.fetch)
    HPP.http_function = (url, object) ->
      new Promise (resolve, reject) ->
        object.body = object.data
        http_promise = fn(url, object)
        http_promise.then (response) ->
          if response.headers.get('content-type') isnt 'application/json'
            resolve(response)
          else
            json_promise = response.json()
            json_promise.then (json) ->
              response.data = json
              resolve(response)
            json_promise.catch reject
        http_promise.catch reject

  else # angular or similar
    HPP.http_function = (url, object) ->
      fn(object)
  return
