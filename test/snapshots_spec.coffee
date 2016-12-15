describe 'Element', ->
  describe 'snapshots', ->
    $httpBackend = null

    beforeEach inject(($injector) ->
      $httpBackend = $injector.get('$httpBackend')

      $http = $injector.get('$http')

      HTTPong.setHttpFunction($http)

      @pre_scheme = window.__json__['test/fixtures/animal-farm/scheme']
      @scheme = window.HTTPong.addScheme(@pre_scheme)
      @scheme.setApiUrl('/api/v1')

      geeseHandler = $httpBackend.when('POST', '/api/v1/humans').respond({id: 1, name: 'Bob'})
    )

    afterEach ->
      HTTPong.private.schemes = {}
      $httpBackend.verifyNoOutstandingExpectation()
      $httpBackend.verifyNoOutstandingRequest()

    it 'should have the right fields', ->
      collection = @scheme.select('humans')
      bob = collection.makeNewElement()
      jef = collection.makeNewElement(name: 'Jef')
      expect(Object.keys(bob.snapshots.list).length).toBe(1)
      expect(bob.snapshots.getLastPersisted()).toBe(null)
      expect(bob.isPersisted()).toBe(false)
      expect(jef.snapshots.getLast().data.name).toBe('Jef')

      expect(bob.snapshots.getLastWithTag('creation').data.name).toBe(undefined)
      expect(bob.snapshots.getLastWithTag(/crea/).data.name).toBe(undefined)

      bob.actions.doPost().then (response) =>
        expect(bob.isNew()).toBe(false)
        expect(bob.isPersisted()).toBe(true)
        expect(bob.snapshots.getLastPersisted().data.name).toBe('Bob')
        expect(bob.snapshots.getLastPersisted().tag).toBe('after_post')
        expect(bob.snapshots.getLast().tag).toBe('after_post')
        expect(bob.snapshots.getLastWithTag('creation').tag).toBe('creation')
        expect(bob.snapshots.getLastWithTag(/crea/).tag).toBe('creation')
        expect(bob.snapshots.getLastWithTag('creation').data.name).toBe(undefined)
        expect(bob.snapshots.getLastWithTag(/crea/).data.name).toBe(undefined)
        bob.fields.name = 'Bob 2'
        expect(bob.isPersisted()).toBe(false)
        bob.snapshots.make('random_tag')
        expect(bob.isPersisted()).toBe(false)
        expect(bob.snapshots.getLast().data.name).toBe('Bob 2')
        expect(bob.snapshots.getLastPersisted().tag).toBe('after_post')
        expect(bob.snapshots.getLast().tag).toBe('random_tag')

      $httpBackend.flush()
