describe 'Pulser', ->
  beforeEach ->
    @pre_scheme = window.__json__["test/fixtures/pulser/scheme"] # loads the scheme
    @scheme = window.HTTPong.addScheme(@pre_scheme) # adds the scheme

    @users = @scheme.select('users')

  afterEach ->
    HTTPong.private.schemes = {}

  describe 'user', ->
    beforeEach ->
      @otto = @users.makeNewElement {email: 'hansottowirtz@gmail.com'}
      @example = @users.makeNewElement {email: 'example@example.com'}

    describe 'actions', ->
      a = it
      $httpBackend = null

      beforeEach inject ($injector) ->
        $httpBackend = $injector.get('$httpBackend')
        $http = $injector.get('$http')
        HTTPong.setHttpFunction($http)
        @scheme.setApiUrl('/api')

      afterEach ->
        $httpBackend.verifyNoOutstandingExpectation()
        $httpBackend.verifyNoOutstandingRequest()

      reply = (method, url, data, status, fn) ->
        $httpBackend.expect(method, url).respond (r_method, r_url, r_data, r_headers, r_params) ->
          fn(r_data) if fn
          [(status || 200), JSON.stringify(data), {'Content-Type': 'application/json'}]

      a 'user should be able to register', ->
        reply 'POST', '/api/users/register', {id: 1, email: 'hansottowirtz@gmail.com'}, 200, (data) ->
          expect(JSON.parse(data)).toEqual({email: 'hansottowirtz@gmail.com', password: 'abcdefgh'})
        reply 'GET', '/api/users/me', {id: 1, email: 'wirtzhansotto@gmail.com'}, 200, (data) ->
          expect(JSON.parse(data)).toEqual({})

        @otto.setField('password', 'abcdefgh')
        @otto.actions.doRegister().then =>
          expect(@otto.getField('id')).toBe(1)
          @users.actions.doGetMe().then (response) =>
            expect(response.data.email).toBe('wirtzhansotto@gmail.com')
            @otto.mergeWith(response.data)
            expect(@otto.getField('email')).toBe('wirtzhansotto@gmail.com')
        $httpBackend.flush()
