describe 'Stupid Farm', ->
  a = an = it

  beforeEach ->
    pre_scheme = window.__json__["test/fixtures/stupid-farm/scheme"] # loads the scheme
    @scheme = window.HTTPong.addScheme(pre_scheme) # adds the scheme

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

    it 'apple should have a stem', (done) ->
      httpBackend.reply('GET', '/api/apples',
        [
          {
            "id": 5,
            "kind": "Granny Smith",
            "stem": {
              "id": 3
            }
          }
        ]
      )

      @apples.actions.doGetAll().then =>
        apple = @apples.find(5)
        stem = apple.relations.getStem()
        expect(stem.getField('id')).toBe(3)
        expect(stem.relations.getApple()).toBe(apple)
        httpBackend.done(done)

      httpBackend.flush()
