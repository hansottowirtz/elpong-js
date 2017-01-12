HPP.Helpers.Collection = {
  getSettings: (c) ->
    c.getScheme().data.collections[c.getName()]

  getSingularName: (c) ->
    HPP.Helpers.Collection.getSettings(c).singular
}
