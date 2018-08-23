elpong = require('../src/main').default
HttpBackend = require('./spec_helper').HttpBackend

describe 'Element', ->
  describe 'updating', ->
    httpBackend = null

    beforeEach ->
      httpBackend = new HttpBackend()

      @scheme = elpong.add(require('./fixtures/pulser/scheme.json5'))

      @scheme.setApiUrl('/api/v1')

      @controls = @scheme.select('controls')
      @plugs = @scheme.select('plugs')

    it 'embedded collections should be updated', (done) ->
      control = @controls.build({name: 'Slider'})

      httpBackend.reply 'POST', '/api/v1/controls', {id: 8, name: 'Slider', plugs: []}
      httpBackend.reply 'GET', '/api/v1/controls/8', {id: 8, name: 'Slider', plugs: [{id: 3, block_id: 8, block_collection: 'controls', endplug_id: null}]}

      control.actions.post().then (response) =>
        expect(control.relations.plugs().length).toBe(0)
        control.actions.get().then (response) =>
          expect(control.relations.plugs().length).toBe(1)
          expect(control.relations.plugs()[0].fields.id).toBe(3)
          httpBackend.done(done)

      httpBackend.flush()

    it 'embedded element should be added', (done) ->
      scheme = elpong.add(require('./fixtures/stupid-farm/scheme.json5'))

      scheme.setApiUrl('/api/v1')

      apples = scheme.select('apples')
      apple_stems = scheme.select('apple_stems')

      apple = apples.build({})

      httpBackend.reply 'POST', '/api/v1/apples', {id: 8, stem: {id: 3, color: 'brown'}}
      httpBackend.reply 'GET', '/api/v1/apples/8', {id: 8, stem: {id: 3, color: 'blue'}}

      apple.actions.post().then (response) =>
        expect(apple.relations.stem().fields.color).toBe('brown')
        apple.actions.get().then (response) =>
          expect(apple.relations.stem().fields.color).toBe('blue')
          httpBackend.done(done)

      httpBackend.flush()
