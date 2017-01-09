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
      is_other_domain: parser.host and (parser.host isnt window.location.host)
      protocol: parser.protocol
      host: parser.host || window.location.host
      path: HPP.Helpers.Url.trimSlashes(parser.pathname)
    }

  getApiUrl: ->
    if @location.is_other_domain
      "#{@location.protocol}//#{@location.host}/#{@location.path}"
    else
      "/#{@location.path}"
