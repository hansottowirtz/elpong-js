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
