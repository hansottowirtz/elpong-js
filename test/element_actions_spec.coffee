Elpong = require('../src/Elpong').Elpong
HttpBackend = require('./spec_helper').HttpBackend

describe 'Element', ->
  describe 'actions', ->
    httpBackend = null

    beforeEach ->
      @scheme = Elpong.add(require('./fixtures/pulser/scheme.json5'))

      httpBackend = new HttpBackend()

      @scheme.setApiUrl('/api')
      @controls = @scheme.select('controls')
      @devices = @scheme.select('devices')
      @plugs = @scheme.select('plugs')

    it 'should GET properly', (done) ->
      httpBackend.reply 'GET', '/api/controls/1', {id: 1, name: 'Button', plugs: [{id: 5, block_id: 1, block_collection: 'controls'}, {id: 6, block_id: 1, block_collection: 'controls'}]}

      @controls.actions.getOne(1).then (response) =>
        control = @controls.find(1)
        expect(control.fields.name).toBe('Button')

        expect(control.relations.plugs()[0].fields.id).toBe(5)
        expect(control.relations.plugs()[1].fields.id).toBe(6)

        httpBackend.done(done)

      httpBackend.flush()

    it 'should PUT properly', ->
