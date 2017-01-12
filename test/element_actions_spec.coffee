describe 'Element', ->
  describe 'actions', ->
    describe 'of pulser', ->
      httpBackend = null

      beforeEach ->
        @pre_scheme = window.__json__["test/fixtures/pulser/scheme"]
        @scheme = window.HTTPong.addScheme(@pre_scheme)

        httpBackend = new HttpBackend()

        @scheme.setApiUrl('/api')
        @controls = @scheme.select('controls')
        @devices = @scheme.select('devices')
        @plugs = @scheme.select('plugs')

      it 'should GET properly', (done) ->
        httpBackend.reply 'GET', '/api/controls/1', {id: 1, name: 'Button', plugs: [{id: 5, block_id: 1, block_collection: 'controls'}, {id: 6, block_id: 1, block_collection: 'controls'}]}

        @controls.actions.doGetOne(1).then (response) =>
          control = @controls.find(1)
          expect(control.getField('name')).toBe('Button')

          expect(control.relations.getPlugs()[0].getField('id')).toBe(5)
          expect(control.relations.getPlugs()[1].getField('id')).toBe(6)

          httpBackend.done(done)

        httpBackend.flush()

      it 'should PUT properly', ->
