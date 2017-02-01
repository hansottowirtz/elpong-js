Elpong = require('../src/Elpong').Elpong
HttpBackend = require('./spec_helper').HttpBackend

describe 'Pulser', ->
  beforeEach ->
    @scheme = Elpong.add(require('./fixtures/pulser/scheme.json5'))

    @users = @scheme.select('users')

  describe 'user', ->
    beforeEach ->
      @otto = @users.build {email: 'hansottowirtz@gmail.com'}
      @example = @users.build {email: 'example@example.com'}

    describe 'actions', ->
      httpBackend = null

      beforeEach ->
        httpBackend = new HttpBackend()
        @scheme.setApiUrl('/api')

      describe 'user', ->

        it 'can register', (done) ->
          httpBackend.expect 'POST', '/api/users/register', {id: 1, email: 'hansottowirtz@gmail.com'}, 200, (data) ->
            expect(data).toEqual({email: 'hansottowirtz@gmail.com', password: 'abcdefgh'})
          httpBackend.expect 'GET', '/api/users/me', {id: 1, email: 'wirtzhansotto@gmail.com'}, 200, (data) ->
            expect(data).toEqual({})

          @otto.fields.password = 'abcdefgh'
          @otto.actions.register().then =>
            expect(@otto.fields.id).toBe(1)
            @users.actions.getMe().then (response) =>
              expect(response.data.email).toBe('wirtzhansotto@gmail.com')
              @otto.merge(response.data)
              expect(@otto.fields.email).toBe('wirtzhansotto@gmail.com')
              httpBackend.done(done)
          httpBackend.flush()
