describe 'Util', ->
  it 'should camelize right', ->
    o =
      'get me': 'getMe'
      get_me: 'getMe'

    for k, v of o
      expect(HTTPong.Util.camelize(k)).toBe(v)

  it 'should upperCamelize right', ->
    o =
      'get me': 'GetMe'
      get_me: 'GetMe'

    for k, v of o
      expect(HTTPong.Util.upperCamelize(k)).toBe(v)

  it 'should recognize types right', ->
    iot = HTTPong.Util.isOfType
    expect(iot('Array', [1, 2, 3])).toBe(true)
    expect(iot('String', 'lol')).toBe(true)
    expect(iot('Number', 3.141)).toBe(true)
    expect(iot('Integer', 4)).toBe(true)
    expect(iot('Integer', 3.141)).toBe(false)
