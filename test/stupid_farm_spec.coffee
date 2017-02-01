Elpong = require('../src/Elpong').Elpong
HttpBackend = require('./spec_helper').HttpBackend

describe 'Stupid Farm', ->
  beforeEach ->
    @scheme = Elpong.add(require('./fixtures/stupid-farm/scheme.json5'))

    @apples = @scheme.select('apples')
    @apple_stems = @scheme.select('apple_stems')

  describe 'relations', ->
    beforeEach ->

    afterEach ->

  describe 'actions', ->
    httpBackend = null

    beforeEach ->
      httpBackend = new HttpBackend()
      @scheme.setApiUrl('/api')

    describe 'apples', ->
      it 'have a stem', (done) ->
        httpBackend.reply('GET', '/api/apples',
          [
            {
              id: 5,
              kind: 'Granny Smith',
              stem: {
                id: 3
              }
            }
          ]
        )

        @apples.actions.getAll().then =>
          apple = @apples.find(5)
          stem = apple.relations.stem()
          expect(stem.selector()).toBe(3)
          expect(stem.relations.apple()).toBe(apple)
          httpBackend.done(done)

        httpBackend.flush()
