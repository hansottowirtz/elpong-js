describe 'Collection', ->
  describe 'pulser', ->
    beforeAll ->
      pre_scheme = window.__json__["test/fixtures/pulser/scheme"]
      @scheme = window.HTTPong.addScheme(pre_scheme)
      @users = @scheme.select('users')
      @plugs = @scheme.select('plugs')

    it 'should have the right name', ->
      expect(@users.getName()).toBe('users')
      expect(@plugs.getName()).toBe('plugs')
      expect(@users.getPluralName()).toBe('users')
      expect(@plugs.getPluralName()).toBe('plugs')

    it 'should have the right singular name', ->
      expect(@users.getSingularName()).toBe('user')
      expect(@plugs.getSingularName()).toBe('plug')

    afterAll ->
      HTTPong.private.schemes = {}

  describe 'stupid farm', ->
    beforeAll ->
      pre_scheme = window.__json__["test/fixtures/stupid-farm/scheme"]
      @scheme = window.HTTPong.addScheme(pre_scheme)
      @geese = @scheme.getCollection('geese')

    it 'should have the right name', ->
      expect(@geese.getName()).toBe('geese')

    it 'should have the right singular name', ->
      expect(@geese.getSingularName()).toBe('goose')

    it 'should have the right default element', ->
      expect(@geese.default_pre_element).toEqual({name: 'Bob'})

    afterAll ->
      HTTPong.private.schemes = {}
