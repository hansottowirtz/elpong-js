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

  findBy: (field_name, field_value, options = {without_new: false, multiple: false}) ->
    if HP.Util.isString(field_name)
      arr = @getArray(options)
      if options.multiple
        response_arr = []
        for element in arr
          response_arr.push element if element.getField(field_name, true) == field_value
        return response_arr
      else
        for element in arr
          return element if element.getField(field_name, true) == field_value
    else
      props = field_name
      options = field_value || {without_new: false, multiple: false}
      arr = @getArray(options)
      if options.multiple
        response_arr = []
        for element in arr
          is_correct = true
          for field_name, field_value of props
            if element.getField(field_name, true) != field_value
              is_correct = false
              break
          response_arr.push element if is_correct
        return response_arr
      else
        for element in arr
          is_correct = true
          for field_name, field_value of props
            if element.getField(field_name, true) != field_value
              is_correct = false
              break
          return element if is_correct

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
