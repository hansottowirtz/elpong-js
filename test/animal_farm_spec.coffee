describe 'Animal Farm', ->
  a = it

  beforeEach ->
    @pre_scheme = window.__json__["test/fixtures/animal-farm/scheme"] # loads the scheme
    @scheme = window.HTTPong.addScheme(@pre_scheme) # adds the scheme

    @pigs = @scheme.select('pigs')
    @humans = @scheme.select('humans')

  afterEach ->
    HTTPong.private.schemes = {}

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
    $httpBackend = null

    beforeEach inject ($injector) ->
      $httpBackend = $injector.get('$httpBackend')
      $http = $injector.get('$http')
      HTTPong.setHttpFunction($http)
      @scheme.setApiUrl('/api')

      @napoleon = @pigs.makeNewElement {id: 1, name: 'Napoleon', boss_id: null}

    afterEach ->
      $httpBackend.verifyNoOutstandingExpectation()
      $httpBackend.verifyNoOutstandingRequest()

    reply = (method, url, data, status) ->
      $httpBackend.expect(method, url).respond ->
        [(status || 200), JSON.stringify(data), {'Content-Type': 'application/json'}]

    a 'pig should be able to oink', ->
      reply 'PUT', '/api/pigs/1/oink', null

      @napoleon.actions.doOink().then =>
        expect(@napoleon.getField('name')).toBe('Napoleon')
      $httpBackend.flush()
