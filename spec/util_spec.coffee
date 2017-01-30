Util = require('../src/Util').Util

describe 'Util', ->
  it 'should camelize right', ->
    o =
      'say oink': 'sayOink'
      say_oink: 'sayOink'
      'say_oink again': 'sayOinkAgain'

    for k, v of o
      expect(Util.camelize(k)).toBe(v)

  it 'should loop right', ->
    last = null
    Util.forEach [1, 2, 3, 4], (v) ->
      last = v
      return Util.BREAK
    expect(last).toBe(1)

  it 'should reverse loop right', ->
    last = null
    Util.reverseForIn {'1': 1, '2': 2, '3': 3, '4': 4}, (k, v) ->
      last = v
      return Util.BREAK
    expect(last).toBe(4)
    last = null
    Util.reverseForIn {'1': 1, '2': 2, '3': 3, '4': 4}, (k, v) ->
      last = v
    expect(last).toBe(1)
