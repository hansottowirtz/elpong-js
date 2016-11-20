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
    str.replace(/_/g, ' ').replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) ->
      if index == 0 then letter.toLowerCase() else letter.toUpperCase()
    ).replace /\s+/g, ''
  upperCamelize: (str) ->
    str.replace(/_/g, ' ').replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) ->
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
