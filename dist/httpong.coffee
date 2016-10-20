# A Javascript implementation of HTTPong
#
# @author Hans Otto Wirtz
# @version 0.3.4

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

class HP.Scheme
  constructor: (pre_scheme, options = {no_normalize: false, no_create_collections: false}) ->
    @data = pre_scheme
    @collections = {}
    @location = null
    @normalize() unless options.no_normalize
    @createCollections() unless options.no_create_collections

  getName: ->
    @data.name

  normalize: ->
    @data.name = @data.name.toLowerCase()
    for collection_name, collection_settings of @data.collections
      collection_settings.singular ||= collection_name.slice(0, -1)
      collection_settings.actions ||= {}
      collection_settings.collection_actions ||= {}
      collection_settings.relations ||= {}
      collection_settings.relations.has_one ||= {}
      collection_settings.relations.has_many ||= {}
      collection_settings.relations.belongs_to ||= {}

  createCollections: ->
    for collection_name, collection_settings of @data.collections
      if @collections[collection_name]
        HPP.log "Collection with name #{collection_name} already exists in scheme"
        continue
      collection = new HP.Collection(@, collection_name)
      @collections[collection_name] = collection

  getCollection: (name) ->
    if !@collections[name]
      throw new Error("Collection #{name} does not exist")
    else
      @collections[name]

  getCollectionBySingularName: (singular_name) ->
    for collection_name, collection of @collections
      return collection if collection.getSingularName() is singular_name
    throw new Error("Collection #{singular_name} does not exist")

  select: @::getCollection

  setApiUrl: (url) ->
    parser = document.createElement('a')
    parser.href = url
    @location = {
      is_other_domain: parser.host isnt window.location.host
      protocol: parser.protocol
      host: parser.host
      path: HPP.Helpers.Url.trimSlashes(parser.pathname)
    }

  getApiUrl: ->
    if @location.is_other_domain
      "#{@location.protocol}//#{@location.host}/#{@location.path}"
    else
      "/#{@location.path}"

class HP.Element
  constructor: (@collection, pre_element) ->
    hpe = @
    @fields = {}
    @relations = {}
    @snapshots = {}
    @last_snapshot_time = null

    collection_settings = HPP.Helpers.Collection.getSettings(@collection)

    HP.Util.forEach collection_settings.fields, (field_settings, field_name) ->
      if field_settings.embedded_element
        HPP.Helpers.Field.handleEmbeddedElement(hpe, pre_element, field_name, field_settings)
      else if field_settings.embedded_collection
        HPP.Helpers.Field.handleEmbeddedCollection(hpe, pre_element, field_name, field_settings)
      else
        return if field_settings.only_send
        field_value = pre_element[field_name]
        hpe.setField(field_name, field_value, true)

    HP.Util.forEach collection_settings.relations.has_many, (relation_settings, relation_collection_name) ->
      HPP.Helpers.Element.setupHasManyRelation(hpe, relation_collection_name, relation_settings)

    HP.Util.forEach collection_settings.relations.has_one, (relation_settings, relation_collection_singular_name) ->
      HPP.Helpers.Element.setupHasOneRelation(hpe, relation_collection_singular_name, relation_settings)

    HP.Util.forEach collection_settings.relations.belongs_to, (relation_settings, relation_collection_singular_name) ->
      HPP.Helpers.Element.setupBelongsToRelation(hpe, relation_collection_singular_name, relation_settings)

    @actions = {
      doGet: (user_options) ->
        HPP.Helpers.Element.doAction(hpe, 'GET', user_options)

      doPost: (user_options) ->
        HPP.Helpers.Element.doAction(hpe, 'POST', user_options)

      doPut: (user_options) ->
        HPP.Helpers.Element.doAction(hpe, 'PUT', user_options)

      doDelete: (user_options) ->
        HPP.Helpers.Element.doAction(hpe, 'DELETE', user_options)
    }

    HP.Util.forEach collection_settings.actions, (action_settings, action_name) ->
      hpe.actions["do#{HP.Util.upperCamelize(action_name)}"] = (user_options) ->
        throw new Error('Element is new') if hpe.isNew() and !action_settings.without_selector
        HPP.Helpers.Element.doCustomAction(hpe, action_name, action_settings, user_options)

    @makeSnapshot('creation')

  getCollection: ->
    @collection

  getCollectionName: ->
    @collection.getName()

  getSelectorValue: ->
    @fields[@collection.selector_name]

  makeSnapshot: (tag) ->
    date = Date.now()
    hpe = @
    @snapshots = HPP.Helpers.Snapshot.removeAfter(@last_snapshot_time, @snapshots)
    if @snapshots[date]
      return @makeSnapshot(tag) # loop until 1ms has passed
    s = @snapshots[date] = {
      tag: tag
      time: date
      data: HPP.Helpers.Element.getFields(@)
      revert: ->
        hpe.undo(date)
    }
    @last_snapshot_time = date
    return s

  getField: (field_name) ->
    @fields[field_name]

  setField: (field_name, field_value) ->
    @fields[field_name] = field_value
    return @

  remove: ->
    hpe = @
    if @isNew()
      HP.Util.removeFromArray(@getCollection().new_elements, @)
      return {then: ((fn) -> fn()), catch: ->}
    else
      return @actions.doDelete().then ->
        elements = hpe.getCollection().elements
        delete elements[hpe.getSelectorValue()]

  save: ->
    if @isNew()
      @actions.doPost()
    else
      @actions.doPut()

  isNew: ->
    if @getCollection().new_elements.includes(@)
      if @getSelectorValue()
        throw new Error('Element has a selector value but is in new_elements array')
      else
        return true
    else
      if !@getSelectorValue()
        throw new Error('Element has no selector value but is in elements object')
      else
        return false

  undo: (n = 0) ->
    if HP.Util.isInteger(n)
      if n > 1000000
        if @snapshots[n]
          @mergeWith @snapshots[n].data
          @last_snapshot_time = n
        else
          throw new Error("Diff at time #{n} does not exist")
      else if n < 0
        throw new Error("#{n} is smaller than 0")
      else
        ds = HPP.Helpers.Snapshot.getSortedArray(@snapshots)
        length = ds.length
        index = ds.indexOf(@snapshots[@last_snapshot_time])
        # index = 0 if index < 0
        d = ds[index - n]
        @mergeWith d.data
        @last_snapshot_time = d.time
    else if HP.Util.isString(n)
      a = null
      for v in HPP.Helpers.Snapshot.getSortedArray(@snapshots)
        if v.tag is n
          a ||= v
      if a
        @mergeWith a.data
      else
        throw new Error("No snapshot found with tag #{n}")
    else
      throw new TypeError("Don't know what to do with #{n}")

  mergeWith: (pre_element) ->
    hpe = @
    collection_settings = HPP.Helpers.Collection.getSettings(@collection)
    HP.Util.forEach collection_settings.fields, (field_settings, field_name) ->
      if field_value = pre_element[field_name]
        if field_settings.embedded_element
          HPP.Helpers.Field.handleEmbeddedElement(hpe, pre_element, field_name, field_settings)
        else if field_settings.embedded_collection
          HPP.Helpers.Field.handleEmbeddedCollection(hpe, pre_element, field_name, field_settings)
        else
          sv_1 = hpe.fields[field_name]
          if field_settings.selector and sv_1 isnt field_value and sv_1 and field_value
            throw new Error("Selector has changed from #{sv_1} to #{field_value}")
          hpe.setField(field_name, field_value, true)
    return @

  isPersisted: ->
    return false if @isNew()
    last_saved_snapshot = null
    HP.Util.reverseForIn @snapshots, (k, v) ->
      return if last_saved_snapshot
      last_saved_snapshot = v if v.tag is 'after_post' or v.tag is 'after_put' or v.tag is 'after_get' or v.tag is 'creation'
    data = last_saved_snapshot.data
    for k, v of HPP.Helpers.Element.getFields(@)
      return false if data[k] isnt v
    return true

class HP.Collection
  constructor: (@scheme, @name) ->
    hpc = @
    @elements = {}
    @new_elements = []
    @default_pre_element = {}
    @selector_name = null

    settings = HPP.Helpers.Collection.getSettings(@)

    for field_name, field_settings of settings.fields
      if field_settings.selector
        @selector_name = field_name

      if field_settings.default
        @default_pre_element[field_name] = field_settings.default

    # for collection_action_name, collection_action_settings of settings.collection_actions
    #   @actions[HP.Util.camelize(collection_action_name)] = ->
    #     # collection_action_options = {method: collection_action_settings.method.toUpperCase(), }
    #     # new_options = HP.Util.merge(HP.Util.merge({method: 'GET'}, {meth}), options)
    #     # HPP.http_function(new_options)

    @actions = {
      doGetAll: (user_options) ->
        HPP.Helpers.Collection.doGetAllAction(hpc, user_options)
      doGetOne: (selector_value, user_options) ->
        HPP.Helpers.Collection.doGetOneAction(hpc, selector_value, user_options)
    }

    HP.Util.forEach settings.collection_actions, (action_settings, action_name) ->
      hpc.actions["do#{HP.Util.upperCamelize(action_name)}"] = (user_options) ->
        HPP.Helpers.Collection.doCustomAction(hpc, action_name, action_settings, user_options)

  handlePreloadedElements: ->
    collection_tags = document.querySelectorAll("meta[name=httpong-collection][collection=\"#{@name}\"][scheme=\"#{@scheme.getName()}\"]")
    element_tags = document.querySelectorAll("meta[name=httpong-element][collection=\"#{@name}\"][scheme=\"#{@scheme.getName()}\"]")
    for collection_tag in collection_tags
      for pre_element in JSON.parse(collection_tag.content)
        @makeOrMerge pre_element
    for element_tag in element_tags
      @makeOrMerge JSON.parse(element_tag.content)

  getName: ->
    @name

  getPluralName: @::getName

  getSingularName: ->
    HPP.Helpers.Collection.getSingularName(@)

  getScheme: ->
    @scheme

  # Get an array of all elements
  #
  # @param {Boolean} without_new Skip new elements.
  #
  # @return {Array} Array of {HP.Element}s
  getArray: (options = {without_new: false}) ->
    arr = if options.without_new then [] else @new_elements
    arr.concat(Object.values(@elements))

  find: (selector_value) ->
    @elements[selector_value]

  findBy: (field_name, field_value, options = {without_new: false}) ->
    arr = @getArray(options)
    for element in arr
      return element if element.getField(field_name, true) == field_value

  makeNewElement: (pre_element = @default_pre_element) ->
    el = new HP.Element(@, pre_element)
    @addElement(el)
    return el

  addElement: (el) ->
    if el.getSelectorValue()
      @elements[el.getSelectorValue()] = el
    else
      @new_elements.push(el)

  makeOrMerge: (pre_element) ->
    if sv = pre_element[@selector_name]
      if el = @find(sv)
        el.mergeWith pre_element
      else
        @makeNewElement pre_element
    else
      @makeNewElement pre_element

# coffeelint: disable=no_this

Object.values ||= `function values(obj) {
	var vals = [];
	for (var key in obj) {
		if (obj.hasOwnProperty(key) && obj.propertyIsEnumerable(key)) {
			vals.push(obj[key]);
		}
	}
	return vals;
}
`

String.prototype.endsWith ||= `function(suffix) {
  return this.indexOf(suffix, this.length - suffix.length) !== -1;
}`

Array.prototype.includes ||= (e) ->
  this.indexOf(e) > -1

String.prototype.includes ||= (e) ->
  this.indexOf(e) > -1

# coffeelint: enable=no_this

HP.Util = {
  kebab: (string) ->
    string.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replace(/(é|ë)/g, 'e').split(' ').join('-')
  unkebab: (string) ->
    string.split('-').join(' ')
  unsnake: (string) ->
    string.split('_').join(' ')
  capitalize: (string) ->
    string.charAt(0).toUpperCase() + string.slice(1)
  camelize: (str) ->
    str.replace('_', ' ').replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) ->
      if index == 0 then letter.toLowerCase() else letter.toUpperCase()
    ).replace /\s+/g, ''
  upperCamelize: (str) ->
    str.replace('_', ' ').replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) ->
      letter.toUpperCase()
    ).replace /\s+/g, ''
  arrayDiff: (array1, array2) ->
    array1.filter(
      (i) -> array2.indexOf(i) < 0
    )
  removeFromArray: (array, element) ->
    i = array.indexOf(element)
    if i == -1
      return false
    else
      array.splice(i, i + 1)
      return true

  copy: (obj) ->
    if null == obj or 'object' != typeof obj
      return obj
    copy = obj.constructor()
    for attr of obj
      if obj.hasOwnProperty(attr)
        copy[attr] = obj[attr]
    copy

  merge: (obj1, obj2) ->
    for attr of obj2
      obj1[attr] = obj2[attr]

  isInteger: (value) ->
    value is parseInt(value, 10)

  isNumber: (value) ->
    isFinite(value) and !isNaN(parseFloat(value))

  isString: (value) ->
    typeof value == 'string'

  forEach: (o, f) ->
    for k, v of o
      continue if !o.hasOwnProperty(k)
      f(v, k)

  reverseForIn: (obj, f) ->
    arr = []
    for key of obj
      # add hasOwnPropertyCheck if needed
      arr.push key
    i = arr.length - 1
    while i >= 0
      f.call obj, arr[i], obj[arr[i]]
      i--
    return
}

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
        o[field_name] = field_value
      o
  }
  Collection: {
    getSettings: (c) ->
      c.getScheme().data.collections[c.getName()]

    getSingularName: (c) ->
      HPP.Helpers.Collection.getSettings(c).singular
  }
  Field: {}
}

HPP.Helpers.Snapshot = {
  getSortedArray: (snapshots) ->
    arr = Object.values(snapshots)
    arr.sort (a, b) -> a.time - b.time
    arr

  removeAfter: (time, snapshots) ->
    arr = HPP.Helpers.Snapshot.getSortedArray(snapshots)
    snapshots_2 = {}
    for v in arr
      snapshots_2[v.time] = v if v.time <= time
    snapshots_2
}

HPP.Helpers.Collection.doGetAllAction = (hpc, user_options = {}) ->
  data = user_options.data

  options = getOptions(
    'GET',
    HPP.Helpers.Url.createForCollection('GET', hpc, user_options),
    data,
    user_options.headers
  )

  promise = HPP.http_function(options)
  promise.then (response) ->
    for pre_element in response.data
      hpc.makeOrMerge(pre_element)
  return promise

HPP.Helpers.Collection.doGetOneAction = (hpc, selector_value, user_options = {}) ->
  data = user_options.data

  options = getOptions(
    'GET',
    HPP.Helpers.Url.createForCollection('GET', hpc, {suffix: selector_value}),
    data,
    user_options.headers
  )
  promise = HPP.http_function(options)
  promise.then (response) ->
    hpc.makeOrMerge(response.data)
  return promise

HPP.Helpers.Collection.doCustomAction = (hpc, action_name, action_settings, user_options = {}) ->
  method = action_settings.method.toUpperCase()

  data = user_options.data

  options = getOptions(
    method,
    HPP.Helpers.Url.createForCollection('GET', hpc, {suffix: action_settings.path || action_name})
    data,
    user_options.headers
  )

  HPP.http_function(options)

HPP.Helpers.Element.setupBelongsToRelation = (hpe, relation_collection_singular_name, relation_settings) ->
  collection = hpe.getCollection()
  if !relation_settings.polymorphic
    if relation_settings.collection
      relation_collection = collection.getScheme().getCollection(relation_settings.collection)
    else
      relation_collection = collection.getScheme().getCollectionBySingularName(relation_collection_singular_name)

  # TODO should be reference
  if relation_settings.polymorphic
    collection_field_name = relation_settings.collection_field ||  "#{relation_collection_singular_name}_collection"
    collection_selector_field = relation_settings.collection_selector_field
    field_name = relation_settings.field
    hpe.relations["get#{HP.Util.upperCamelize(relation_collection_singular_name)}"] = ->
      HPP.Helpers.Element.getPolymorphicBelongsToElement(hpe, field_name, collection_field_name, collection_selector_field, relation_collection_singular_name)
  else # normal
    field_name = relation_settings.field || "#{relation_collection_singular_name}_#{relation_collection.selector_name}"
    hpe.relations["get#{HP.Util.upperCamelize(relation_collection_singular_name)}"] = ->
      HPP.Helpers.Element.getBelongsToElement(hpe, relation_collection, field_name)

HPP.Helpers.Element.getBelongsToElement = (hpe, relation_collection, field_name) ->
  selector_value = hpe.getField(field_name, true, 'belongs_to')
  relation_collection.find(selector_value) || null

# Gets the polymorphic belongs_to element
#
# @param {HTTPong.Element} hpe              The element to which the other element belongs
# @param {String} field_name                The foreign key, e.g. parent_id.
# @param {String} collection_field_name     The field name of the other collection, required, e.g. parent_collection.
# @param {String} collection_selector_field The selector name of the other collection, if it was specified, e.g. id. (Will not be looked at if field_name is present)
# @param {String} collection_singular_name  e.g. parent
#
# @return {HTTPong.Element|null}            The related element.
HPP.Helpers.Element.getPolymorphicBelongsToElement = (hpe, field_name, collection_field_name, collection_selector_field, collection_singular_name) ->
  # console.log hpe, collection_field_name, collection_selector_field
  relation_collection_name = hpe.getField(collection_field_name, true, 'belongs_to_collection')
  relation_collection = hpe.getCollection().getScheme().getCollection(relation_collection_name)
  if !field_name
    collection_selector_field ||= relation_collection.selector_name
    field_name = "#{collection_singular_name}_#{collection_selector_field}"
  selector_value = hpe.getField(field_name, true, 'belongs_to')
  relation_collection.find(selector_value) || null

HPP.Helpers.Element.setupHasManyRelation = (hpe, relation_collection_name, relation_settings) ->
  collection = hpe.getCollection()
  collection_settings = HPP.Helpers.Collection.getSettings(hpe.getCollection())

  relation_collection = collection.getScheme().getCollection(relation_settings.collection || relation_collection_name)

  references_field_name = relation_settings.references_field || "#{relation_collection_name}_#{relation_collection.selector_name}s" # dogs_ids, unless specified otherwise

  if relation_field_settings = collection_settings.fields[references_field_name]
    # throw new Error("Field #{field_name} of collection #{collection.getName()} are not references") if !relation_field_settings.references
    hpe.relations["get#{HP.Util.upperCamelize(relation_collection_name)}"] = ->
      HPP.Helpers.Element.getHasManyRelationArrayThroughReferencesField(hpe, relation_collection, field_name)

  else # normal has_many relationship
    hpe.relations["get#{HP.Util.upperCamelize(relation_collection_name)}"] = HPP.Helpers.Element.getHasManyRelationFunction(hpe, collection, relation_settings, relation_collection)

HPP.Helpers.Element.getHasManyRelationFunction = (hpe, collection, relation_settings, relation_collection) ->
  collection_singular_name = collection.getSingularName()
  relation_collection_settings = HPP.Helpers.Collection.getSettings(relation_collection)

  if relation_settings.polymorphic
    has_many_field_name = "#{relation_settings.as}_#{collection.selector_name}"
    has_many_collection_field_name = "#{relation_settings.as}_collection"

    return -> HPP.Helpers.Element.getPolymorphicHasManyRelationArray(hpe, relation_collection, has_many_field_name, has_many_collection_field_name)
  else
    has_many_field_name = if relation_settings.field
      relation_settings.field
    else if relation_settings.as
      "#{relation_settings.as}_#{collection.selector_name}"
    else
      "#{collection_singular_name}_#{collection.selector_name}"

    return -> HPP.Helpers.Element.getHasManyRelationArray(hpe, relation_collection, has_many_field_name)

HPP.Helpers.Element.getHasManyRelationArray = (hpe, relation_collection, has_many_field_name) ->
  hpe2_arr = []
  selector_value = hpe.getSelectorValue()
  for hpe2 in relation_collection.getArray()
    hpe2_arr.push(hpe2) if selector_value is hpe2.getField(has_many_field_name, true, 'has_many')
  return hpe2_arr

HPP.Helpers.Element.getPolymorphicHasManyRelationArray = (hpe, relation_collection, has_many_field_name, has_many_collection_field_name) ->
  hpe2_arr = []
  selector_value = hpe.getSelectorValue()
  collection_name = hpe.getCollection().getName()
  for hpe2 in relation_collection.getArray()
    hpe2_arr.push(hpe2) if selector_value is hpe2.getField(has_many_field_name, true, 'has_many') and collection_name is hpe2.getField(has_many_collection_field_name, true, 'has_many_collection_name')
  return hpe2_arr

HPP.Helpers.Element.getHasManyRelationArrayThroughReferencesField = (hpe, relation_collection, field_name) ->
  selector_value_arr = hpe.getField(field_name, true, 'has_many_array')
  throw new Error("Field #{field_name} is not an array, but it should be an array of references to #{relation_collection.getName()}") if !Array.isArray(selector_value_arr)
  hpe2_arr = []
  for hpe2 in relation_collection.getArray()
    hpe2_arr.push(hpe2) if selector_value_arr.includes hpe.getSelectorValue()
  return hpe2_arr

HPP.Helpers.Element.setupHasOneRelation = (hpe, relation_collection_singular_name, relation_settings) ->
  collection = hpe.getCollection()
  collection_settings = HPP.Helpers.Collection.getSettings(hpe.getCollection())

  scheme = collection.getScheme()

  if relation_settings.collection
    relation_collection = scheme.getCollection(relation_settings.collection)
  else
    relation_collection = scheme.getCollectionBySingularName(relation_collection_singular_name)

  hpe.relations["get#{HP.Util.upperCamelize(relation_collection_singular_name)}"] = -> HPP.Helpers.Element.getHasManyRelationFunction(hpe, collection, relation_settings, relation_collection)()[0]

getOptions = (method, url, data, headers = {}) ->
  headers.Accept = headers['Content-Type'] = 'application/json'
  {
    method: method
    url: url
    data: JSON.stringify(data || {})
    headers: headers
    dataType: 'json'
    responseType: 'json'
  }

HPP.Helpers.Element.doAction = (hpe, method, user_options = {}) ->
  hpe.makeSnapshot("before_#{method.toLowerCase()}")
  if user_options.data
    data = user_options.data
  else if method isnt 'GET'
    data = HPP.Helpers.Element.toData(hpe)

  if method is 'POST'
    throw new Error('Element is not new') if !hpe.isNew()
  else
    throw new Error('Element is new') if hpe.isNew()

  options = getOptions(
    method,
    HPP.Helpers.Url.createForElement(method, {}, hpe, user_options),
    data,
    user_options.headers
  )

  promise = HPP.http_function(options)
  promise.then (response) ->
    hpe.mergeWith response.data if response.data
    hpe.makeSnapshot("after_#{method.toLowerCase()}")

    collection = hpe.getCollection()

    if collection.new_elements.includes(hpe)
      HP.Util.removeFromArray(collection.new_elements, hpe)
      collection.elements[hpe.getSelectorValue()] = hpe

  return promise

HPP.Helpers.Element.doCustomAction = (hpe, action_name, action_settings, user_options = {}) ->
  method = action_settings.method.toUpperCase()
  hpe.makeSnapshot("before_#{method.toLowerCase()}")

  if user_options.data
    data = user_options.data
  else if not action_settings.without_data
    data = HPP.Helpers.Element.toData(hpe)

  options = getOptions(
    method,
    HPP.Helpers.Url.createForElement(action_name, action_settings, hpe, user_options)
    data,
    user_options.headers
  )

  promise = HPP.http_function(options)
  promise.then (response) ->
    if !action_settings.returns_other
      hpe.mergeWith response.data if response.data
      hpe.makeSnapshot("after_#{method.toLowerCase()}")

    collection = hpe.getCollection()

    if (selector_value = hpe.getSelectorValue()) and collection.new_elements.includes(hpe)
      HP.Util.removeFromArray(collection.new_elements, hpe)
      collection.elements[selector_value] = hpe

  return promise

HPP.Helpers.Field.handleEmbeddedCollection = (hpe, pre_element, field_name, field_settings) ->
  embedded_pre_collection = pre_element[field_name]
  return if !embedded_pre_collection and !field_settings.required
  collection = hpe.getCollection()
  scheme = collection.getScheme()
  embedded_element_collection = scheme.getCollection(field_name || field_settings.collection)

  HP.Util.forEach embedded_pre_collection, (embedded_pre_element) ->
    embedded_element = new HP.Element(embedded_element_collection, embedded_pre_element)
    embedded_element_collection.addElement(embedded_element)

HPP.Helpers.Field.handleEmbeddedElement = (hpe, pre_element, field_name, field_settings) ->
  embedded_pre_element = pre_element[field_name]
  return if !embedded_pre_element and !field_settings.required
  collection = hpe.getCollection()
  scheme = collection.getScheme()
  if field_settings.collection
    embedded_element_collection = scheme.getCollection(field_settings.collection)
  else
    embedded_element_collection = scheme.getCollectionBySingularName(field_name)

  embedded_element = embedded_element_collection.makeOrMerge(embedded_pre_element)

  associated_field_name = field_settings.associated_field || "#{field_name}_#{embedded_element_collection.selector_name}"
  hpe.setField(associated_field_name, embedded_element.getSelectorValue())
