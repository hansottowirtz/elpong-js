elpong = require('../src/main').default
HttpBackend = require('./spec_helper').HttpBackend

describe 'Element', ->
  describe 'snapshots', ->
    httpBackend = null

    beforeEach ->
      httpBackend = new HttpBackend()

      @scheme = elpong.add(require('./fixtures/animal-farm/scheme.json5'))
      @scheme.setApiUrl('/api/v1')

      httpBackend.reply 'POST', '/api/v1/humans', {id: 1, name: 'Bob'}

    it 'should have the right fields', (done) ->
      collection = @scheme.select('humans')
      bob = collection.build()
      jef = collection.build(name: 'Jef')
      expect(Object.keys(bob.snapshots.list).length).toBe(1)
      expect(bob.snapshots.lastPersisted()).not.toBeDefined()
      expect(bob.snapshots.isPersisted()).toBe(false)
      expect(jef.snapshots.last().data.name).toBe('Jef')

      expect(bob.snapshots.lastWithTag('creation').data.name).toBe(undefined)
      expect(bob.snapshots.lastWithTag(/crea/).data.name).toBe(undefined)

      bob.actions.post().then (response) =>
        expect(bob.isNew()).toBe(false)
        expect(bob.snapshots.isPersisted()).toBe(true)
        expect(bob.snapshots.lastPersisted().data.name).toBe('Bob')
        expect(bob.snapshots.lastPersisted().tag).toBe('after_post')
        expect(bob.snapshots.last().tag).toBe('after_post')
        expect(bob.snapshots.lastWithTag('creation').tag).toBe('creation')
        expect(bob.snapshots.lastWithTag(/crea/).tag).toBe('creation')
        expect(bob.snapshots.lastWithTag('creation').data.name).toBe(undefined)
        expect(bob.snapshots.lastWithTag(/crea/).data.name).toBe(undefined)
        bob.fields.name = 'Bob 2'
        expect(bob.snapshots.isPersisted()).toBe(false)
        bob.snapshots.make('random_tag')
        expect(bob.snapshots.isPersisted()).toBe(false)
        expect(bob.snapshots.last().data.name).toBe('Bob 2')
        expect(bob.snapshots.lastPersisted().tag).toBe('after_post')
        expect(bob.snapshots.last().tag).toBe('random_tag')
        httpBackend.done(done)

      httpBackend.flush()
