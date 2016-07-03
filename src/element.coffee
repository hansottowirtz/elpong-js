class HP.Element
  constructor: (@collection, pre_element) ->
    hpe = @
    @fields = {}
    @relations = {}
    @snapshots = {}
    @last_snapshot_time = null

    collection_settings = HP.Helpers.Collection.getSettings(@collection)

    HP.Util.forEach collection_settings.fields, (field_settings, field_name) ->
      if field_settings.embedded_element
        HP.Helpers.Field.handleEmbeddedElement(hpe, pre_element, field_name, field_settings)
      else if field_settings.embedded_collection
        HP.Helpers.Field.handleEmbeddedCollection(hpe, pre_element, field_name, field_settings)
      else
        return if field_settings.only_send
        field_value = pre_element[field_name]
        HP.Helpers.Field.validateType(field_name, field_value, field_settings)
        hpe.setField(field_name, field_value, true)

    HP.Util.forEach collection_settings.relations.has_many, (relation_settings, relation_collection_name) ->
      HP.Helpers.Element.setupHasManyRelation(hpe, relation_collection_name, relation_settings)

    HP.Util.forEach collection_settings.relations.has_one, (relation_settings, relation_collection_singular_name) ->
      HP.Helpers.Element.setupHasOneRelation(hpe, relation_collection_singular_name, relation_settings)

    HP.Util.forEach collection_settings.relations.belongs_to, (relation_settings, relation_collection_singular_name) ->
      HP.Helpers.Element.setupBelongsToRelation(hpe, relation_collection_singular_name, relation_settings)

    @actions = {
      doGet: (user_options) ->
        HP.Helpers.Element.doAction(hpe, 'GET', user_options)

      doPost: (user_options) ->
        HP.Helpers.Element.doAction(hpe, 'POST', user_options)

      doPut: (user_options) ->
        HP.Helpers.Element.doAction(hpe, 'PUT', user_options)

      doDelete: (user_options) ->
        HP.Helpers.Element.doAction(hpe, 'DELETE', user_options)
    }

    HP.Util.forEach collection_settings.actions, (action_settings, action_name) ->
      hpe.actions["do#{HP.Util.upperCamelize(action_name)}"] = (user_options) ->
        throw new Error('Element is new') if hpe.isNew()
        HP.Helpers.Element.doCustomAction(hpe, action_name, action_settings, user_options)

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
    @snapshots = HP.Helpers.Snapshot.removeAfter(@last_snapshot_time, @snapshots)
    if @snapshots[date]
      return @makeSnapshot(tag) # loop until 1ms has passed
    s = @snapshots[date] = {
      tag: tag
      time: date
      data: HP.Helpers.Element.getFields(@)
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
      HPP.Util.removeFromArray(@getCollection().new_elements, @)
      return {then: ((fn) -> fn()), catch: ->}
    else
      return @actions.doDelete().then ->
        elements = hpe.getCollection().elements
        delete elements[hpe.getSelectorValue()]

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
        ds = HP.Helpers.Snapshot.getSortedArray(@snapshots)
        length = ds.length
        index = ds.indexOf(@snapshots[@last_snapshot_time])
        # index = 0 if index < 0
        d = ds[index - n]
        @mergeWith d.data
        @last_snapshot_time = d.time
    else if HP.Util.isString(n)
      a = null
      HP.Util.reverseForIn @snapshots, (k, v) ->
        return if k == 'last'
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
    collection_settings = HP.Helpers.Collection.getSettings(@collection)
    HP.Util.forEach collection_settings.fields, (field_settings, field_name) ->
      if field_value = pre_element[field_name]
        if field_settings.embedded_element
          # HP.Helpers.Field.handleEmbeddedElement(hpe, pre_element, field_name, field_settings)
        else if field_settings.embedded_collection
          # HP.Helpers.Field.handleEmbeddedCollection(hpe, pre_element, field_name, field_settings)
        else
          sv_1 = hpe.fields[field_name]
          if field_settings.selector and sv_1 isnt field_value and sv_1 and field_value
            throw new Error("Selector has changed from #{sv_1} to #{field_value}")
          HP.Helpers.Field.validateType(field_name, field_value, field_settings)
          hpe.setField(field_name, field_value, true)
