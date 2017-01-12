describe 'Animal Farm', ->
  a = it

  beforeEach ->
    @pre_scheme = window.__json__["test/fixtures/animal-farm/scheme"] # loads the scheme
    @scheme = window.HTTPong.addScheme(@pre_scheme) # adds the scheme

    @pigs = @scheme.select('pigs')
    @humans = @scheme.select('humans')

  describe 'relations', ->
    beforeEach ->
      @napoleon = @pigs.makeNewElement {id: 1, name: 'Napoleon', boss_id: null}
      @snowball = @pigs.makeNewElement {id: 2, name: 'Snowball', boss_id: 9}

      @jones = @humans.makeNewElement {id: 9, name: 'Mr. Jones'}

    a 'pig should sometimes have a boss', ->
      expect(@napoleon.relations.getBoss()).toBe(null)
      expect(@snowball.relations.getBoss()).toBe(@jones)

    a 'human should have his pigs', ->
      pigs = @jones.relations.getPigs()
      expect(pigs[0]).toBe(@snowball)
      expect(pigs[1]).not.toBeDefined()

  describe 'actions', ->
    httpBackend = new HttpBackend()

    beforeEach ->
      @scheme.setApiUrl('/api')

      @napoleon = @pigs.makeNewElement {id: 1, name: 'Napoleon', boss_id: null}

    a 'pig should be able to oink', (done) ->
      httpBackend.reply 'PUT', '/api/pigs/1/oink', undefined, 204

      @napoleon.actions.doOink().then (response) =>
        debugger
        console.log response
        expect(@napoleon.getField('name')).toBe('Napoleon')
        httpBackend.done(done)

      httpBackend.flush()
