describe 'HTTPong', ->
  beforeAll ->
    pre_scheme = window.__json__["test/fixtures/pulser/scheme"]
    @scheme = window.HTTPong.addScheme(pre_scheme)
    @users = @scheme.select('users')

  it 'should test right', ->
    expect(HTTPong.private.isHpe(@users.makeNewElement())).toBe(true)
    expect(HTTPong.private.isHpc(@users)).toBe(true)

  afterAll ->
    HTTPong.private.schemes = {}
