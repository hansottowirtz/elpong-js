# A Javascript implementation of HTTPong
#
# @author Hans Otto Wirtz
# @version 0.3.5

HTTPong = window.HTTPong = HP = {}
HP.private = HPP = {
  log: -> console.log.apply(console, ['%c HTTPong ', 'background: #80CBC4; color: #fff'].concat(Array.from(arguments)))
  schemes: {}
  http_function: null
  isHpe: (e) ->
    e.constructor is HP.Element
  isHpc: (e) ->
    e.constructor is HP.Collection
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
HP.setHttpFunction = (http_function) ->
  HPP.http_function = http_function
