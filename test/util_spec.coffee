Util = require('../src/Util').Util

describe 'Util', ->
  it 'camelizes strings', ->
    o = {
      'say oink': 'sayOink'
      say_oink: 'sayOink'
      'say_oink again': 'sayOinkAgain'
    }

    for k, v of o
      expect(Util.camelize(k)).toBe(v)

  it 'does for each loops', ->
    last = null
    Util.forEach [1, 2, 3, 4], (v) ->
      last = v
    expect(last).toBe(4)

  it 'checks if objects are equal, limited to JSON data types', ->
    expect(Util.equalsJSON(
      {a: 1, b: {c: 'd', e: 'f'}},
      {b: {e: 'f', c: 'd'}, a: 1}
    )).toBe(true)
    expect(Util.equalsJSON(
      {a: 1, b: {c: 'd', e: 'f'}},
      {b: {e: 'g', c: 'd'}, a: 1}
    )).toBe(false)
