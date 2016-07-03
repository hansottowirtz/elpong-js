class HP.Collection
  constructor: (@scheme, @name) ->
    hpc = @
    @elements = {}
    @new_elements = []
    @default_pre_element = {}
    @selector_name = null

    settings = HP.Helpers.Collection.getSettings(@)

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
        HP.Helpers.Collection.doGetAllAction(hpc, user_options)
      doGetOne: (selector_value, user_options) ->
        HP.Helpers.Collection.doGetOneAction(hpc, selector_value, user_options)
    }

    # ((hpc) ->
    #   doGetAll =
    #
    #   hpc.actions.doGetAll = (user_options) -> doGetAll(hpc, user_options)
    # )(@)

  getName: ->
    @name

  getPluralName: @::getName

  getSingularName: ->
    HP.Helpers.Collection.getSingularName(@)

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
        el.ergeWith pre_element
      else
        @makeNewElement pre_element
    else
      @makeNewElement pre_element
