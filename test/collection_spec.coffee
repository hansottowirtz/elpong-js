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
      expect(@geese._defaultPreElement).toEqual({name: 'Bob'})

  describe 'arrayfication', ->
    beforeEach ->
      @scheme = elpong.add(require('./fixtures/stupid-farm/scheme.json5'))
      @geese = @scheme.select('geese')
      @geese.build(name: 'Bob')
      @geese.build(name: 'Jef')
      @geese.build(id: 3, name: 'Bart')

    it 'should arrayify with new elements', ->
      expect(@geese.array().length).toBe(3)

    it 'should arrayify without new elements when told to', ->
      arr = @geese.array(noNew: true)
      expect(arr.length).toBe(1)
      expect(arr[0].fields.id).toBe(3)
