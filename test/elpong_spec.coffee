Elpong = require('../src/Elpong').Elpong

describe 'Elpong', ->
  beforeEach ->
    @scheme = Elpong.add(require('./fixtures/pulser/scheme.json5'))
    @users = @scheme.select('users')
