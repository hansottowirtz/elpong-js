describe 'Element', ->
  describe 'updating', ->
    httpBackend = null

    beforeEach ->
      httpBackend = new HttpBackend()

      @pre_scheme = window.__json__["test/fixtures/pulser/scheme.json5"]
      @scheme = window.HTTPong.addScheme(@pre_scheme)

      @scheme.setApiUrl('/api/v1')

      @controls = @scheme.select('controls')
      @plugs = @scheme.select('plugs')

    it 'embedded collections should be updated', (done) ->
      control = @controls.makeNewElement({name: 'Slider'})

      httpBackend.reply 'POST', '/api/v1/controls', {id: 8, name: 'Slider', plugs: []}
      httpBackend.reply 'GET', '/api/v1/controls/8', {id: 8, name: 'Slider', plugs: [{id: 3, block_id: 8, block_collection: 'controls', endplug_id: null}]}

      control.actions.doPost().then (response) =>
        expect(control.relations.getPlugs().length).toBe(0)
        control.actions.doGet().then (response) =>
          expect(control.relations.getPlugs().length).toBe(1)
          expect(control.relations.getPlugs()[0].fields.id).toBe(3)
          httpBackend.done(done)

      httpBackend.flush()

    it 'embedded element should be added', (done) ->
      pre_scheme = window.__json__["test/fixtures/stupid-farm/scheme.json5"]
      scheme = window.HTTPong.addScheme(pre_scheme)

      scheme.setApiUrl('/api/v1')

      apples = scheme.select('apples')
      apple_stems = scheme.select('apple_stems')

      apple = apples.makeNewElement({})

      httpBackend.reply 'POST', '/api/v1/apples', {id: 8, stem: {id: 3, color: 'brown'}}
      httpBackend.reply 'GET', '/api/v1/apples/8', {id: 8, stem: {id: 3, color: 'blue'}}

      apple.actions.doPost().then (response) =>
        expect(apple.relations.getStem().fields.color).toBe('brown')
        apple.actions.doGet().then (response) =>
          expect(apple.relations.getStem().fields.color).toBe('blue')
          httpBackend.done(done)

      httpBackend.flush()
