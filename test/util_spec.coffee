describe 'Util', ->
  it 'should camelize right', ->
    o =
      'get me': 'getMe'
      get_me: 'getMe'
      'get_me_too': 'getMeToo'

    for k, v of o
      expect(HTTPong.Util.camelize(k)).toBe(v)

  it 'should upperCamelize right', ->
    o =
      'get me': 'GetMe'
      get_me: 'GetMe'
      'get_me_too': 'GetMeToo'

    for k, v of o
      expect(HTTPong.Util.upperCamelize(k)).toBe(v)

  it 'should loop right', ->
    last = null
    HP.Util.forEach [1, 2, 3, 4], (v) ->
      last = v
      return HP.Util.BREAK
    expect(last).toBe(1)

  it 'should reverse loop right', ->
    last = null
    HP.Util.reverseForIn {'1': 1, '2': 2, '3': 3, '4': 4}, (k, v) ->
      last = v
      return HP.Util.BREAK
    expect(last).toBe(4)
    last = null
    HP.Util.reverseForIn {'1': 1, '2': 2, '3': 3, '4': 4}, (k, v) ->
      last = v
    expect(last).toBe(1)
