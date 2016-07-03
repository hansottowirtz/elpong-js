describe 'Scheme', ->
  describe 'pulser', ->
    beforeAll ->
      @pre_scheme = window.__json__["test/fixtures/pulser/scheme"]
      @scheme = window.HTTPong.addScheme(@pre_scheme)

    it 'should be existing', ->
      expect(HTTPong.getScheme('pulser')).toBeDefined()

    it 'should have a data attribute, equal to the creation argument', ->
      expect(@scheme.data).toBe(@pre_scheme)

    it 'should have the right collections', ->
      expect(@scheme.getCollection('controls')).toBeDefined()
      expect(@scheme.getCollection('plugs')).toBeDefined()
      expect(@scheme.getCollection('users')).toBeDefined()
      # expect(@scheme.getCollection('cats')).not.toBeDefined()

    it 'should have the right api url', ->
      @scheme.setApiUrl('http://pulser.io/api/v1')
      expect(@scheme.getApiUrl()).toBe('http://pulser.io/api/v1')
      @scheme.setApiUrl('https://pulser.io/api/v1/')
      expect(@scheme.getApiUrl()).toBe('https://pulser.io/api/v1')
      @scheme.setApiUrl('/api/v1/')
      expect(@scheme.getApiUrl()).toBe('/api/v1')
      @scheme.setApiUrl('api/v1/')
      expect(@scheme.getApiUrl()).toBe('/api/v1')
      @scheme.setApiUrl('api/v1')
      expect(@scheme.getApiUrl()).toBe('/api/v1')
      @scheme.setApiUrl('/api/v1')
      expect(@scheme.getApiUrl()).toBe('/api/v1')

    afterAll ->
      HTTPong.private.schemes = {}
