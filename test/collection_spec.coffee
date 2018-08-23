elpong = require('../src/main').default

describe 'Collection', ->
  describe 'pulser', ->
    beforeEach ->
      @scheme = elpong.add(require('./fixtures/pulser/scheme.json5'))
      @users = @scheme.select('users')
      @plugs = @scheme.select('plugs')

    it 'should have the right name', ->
      expect(@users.name).toBe('users')
      expect(@plugs.name).toBe('plugs')

  describe 'stupid farm', ->
    beforeEach ->
      @scheme = elpong.add(require('./fixtures/stupid-farm/scheme.json5'))
      @geese = @scheme.select('geese')

    it 'should have the right name', ->
      expect(@geese.name).toBe('geese')

    it 'should have the right default element', ->
      expect(@geese.default_pre_element).toEqual({name: 'Bob'})
