elpong = require('../src/main').default
HttpBackend = require('./spec_helper').HttpBackend

describe 'Animal Farm', ->
  beforeEach ->
    @scheme = elpong.add(require('./fixtures/animal-farm/scheme.json5'))

    @pigs = @scheme.select('pigs')
    @humans = @scheme.select('humans')

  describe 'relations', ->
    beforeEach ->
      @napoleon = @pigs.build {id: 1, name: 'Napoleon', boss_id: null}
      @snowball = @pigs.build {id: 2, name: 'Snowball', boss_id: 9}

      @jones = @humans.build {id: 9, name: 'Mr. Jones'}

    describe 'pigs', ->
      it 'should sometimes have a boss', ->
        expect(@napoleon.relations.boss()).not.toBeDefined()
        @napoleon.fields.boss_id = 1337
        expect(@napoleon.relations.boss()).toBe(null)
        expect(@snowball.relations.boss()).toBe(@jones)

    describe 'humans', ->
      it 'should have his pigs', ->
        pigs = @jones.relations.pigs()
        expect(pigs[0]).toBe(@snowball)
        expect(pigs[1]).not.toBeDefined()

  describe 'pigs', ->
    httpBackend = new HttpBackend()

    beforeEach ->
      @scheme.setApiUrl('/api')

      @napoleon = @pigs.build {id: 1, name: 'Napoleon', boss_id: null}

    it 'should be able to oink', (done) ->
      httpBackend.reply 'PUT', '/api/pigs/1/oink', undefined, 204

      @napoleon.actions.oink().then (response) =>
        expect(@napoleon.fields.name).toBe('Napoleon')
        httpBackend.done(done)

      httpBackend.flush()
