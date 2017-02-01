describe 'Pulser', ->
  beforeEach ->
    @scheme = Elpong.add(require('./fixtures/pulser/scheme.json5'))

    @users = @scheme.select('users')

  describe 'user', ->
    beforeEach ->
      @otto = @users.makeNewElement {email: 'hansottowirtz@gmail.com'}
      @example = @users.makeNewElement {email: 'example@example.com'}

    describe 'actions', ->
      a = it
      httpBackend = null

      beforeEach ->
        httpBackend = new HttpBackend()
        @scheme.setApiUrl('/api')

      a 'user should be able to register', (done) ->
        httpBackend.expect 'POST', '/api/users/register', {id: 1, email: 'hansottowirtz@gmail.com'}, 200, (data) ->
          expect(data).toEqual({email: 'hansottowirtz@gmail.com', password: 'abcdefgh'})
        httpBackend.expect 'GET', '/api/users/me', {id: 1, email: 'wirtzhansotto@gmail.com'}, 200, (data) ->
          expect(data).toEqual({})

        @otto.setField('password', 'abcdefgh')
        @otto.actions.doRegister().then =>
          expect(@otto.getField('id')).toBe(1)
          @users.actions.doGetMe().then (response) =>
            expect(response.data.email).toBe('wirtzhansotto@gmail.com')
            @otto.mergeWith(response.data)
            expect(@otto.getField('email')).toBe('wirtzhansotto@gmail.com')
            httpBackend.done(done)
        httpBackend.flush()
