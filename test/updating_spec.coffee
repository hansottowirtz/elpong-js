describe 'Element', ->
  describe 'updating', ->
    $httpBackend = null
    $http = null

    beforeEach inject(($injector) ->
      # Set up the mock http service responses
      $httpBackend = $injector.get('$httpBackend')

      $http = $injector.get('$http')

      @pre_scheme = window.__json__["test/fixtures/pulser/scheme"]
      @scheme = window.HTTPong.addScheme(@pre_scheme)

      HTTPong.setHttpFunction($http)
      @scheme.setApiUrl('/api/v1')

      @controls = @scheme.select('controls')
      @plugs = @scheme.select('plugs')
    )

    afterEach ->
      HTTPong.private.schemes = {}
      $httpBackend.verifyNoOutstandingExpectation()
      $httpBackend.verifyNoOutstandingRequest()

    reply = (method, url, data, status) ->
      $httpBackend.when(method, url).respond ->
        [(status || 200), JSON.stringify(data), {'Content-Type': 'application/json'}]

    it 'embedded collections should be updated', ->
      control = @controls.makeNewElement({name: 'Slider'})

      reply 'POST', '/api/v1/controls', {id: 8, name: 'Slider', plugs: []}
      reply 'GET', '/api/v1/controls/8', {id: 8, name: 'Slider', plugs: [{id: 3, block_id: 8, block_collection: 'controls', endplug_id: null}]}

      control.actions.doPost().then (response) =>
        expect(control.relations.getPlugs().length).toBe(0)
        control.actions.doGet().then (response) =>
          expect(control.relations.getPlugs().length).toBe(1)
          expect(control.relations.getPlugs()[0].fields.id).toBe(3)

      $httpBackend.flush()

    it 'embedded element should be added', ->
      pre_scheme = window.__json__["test/fixtures/stupid-farm/scheme"]
      scheme = window.HTTPong.addScheme(pre_scheme)

      HTTPong.setHttpFunction($http)
      scheme.setApiUrl('/api/v1')

      apples = scheme.select('apples')
      apple_stems = scheme.select('apple_stems')

      apple = apples.makeNewElement({})

      reply 'POST', '/api/v1/apples', {id: 8, stem: {id: 3, color: 'brown'}}
      reply 'GET', '/api/v1/apples/8', {id: 8, stem: {id: 3, color: 'blue'}}

      apple.actions.doPost().then (response) =>
        expect(apple.relations.getStem().fields.color).toBe('brown')
        apple.actions.doGet().then (response) =>
          expect(apple.relations.getStem().fields.color).toBe('blue')

      $httpBackend.flush()
