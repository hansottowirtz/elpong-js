Elpong = require('../src/Elpong').Elpong

describe 'Scheme', ->
  describe 'pulser', ->
    beforeAll ->
      @scheme = Elpong.add(require('./fixtures/pulser/scheme.json5'))

    it 'should be existing', ->
      expect(Elpong.get('pulser')).toBeDefined()

    it 'should have a data attribute, equal to the creation argument', ->
      expect(@scheme.data).toBe(@pre_scheme)

    it 'should have the right collections', ->
      expect(@scheme.select('controls')).toBeDefined()
      expect(@scheme.select('plugs')).toBeDefined()
      expect(@scheme.select('users')).toBeDefined()
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
