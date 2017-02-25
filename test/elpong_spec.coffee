Elpong = require('../src/Elpong').Elpong

describe 'Elpong', ->
  elements = []

  afterEach ->
    for e in elements
      e.parentNode.removeChild(e)
    elements = []
    Elpong.tearDown()

  it 'can have autoload enabled', ->
    Elpong.enableAutoload()
    expect(Elpong.isAutoload()).toBe(true)

  it 'autoloads schemes', ->
    return if !document?

    expect(-> Elpong.get('pulser')).toThrow()

    head = document.getElementsByTagName('head')[0]

    console.log('test shit')

    do ->
      meta = document.createElement('meta')
      meta.name = 'elpong-scheme'
      meta.scheme = 'pulser'
      meta.content = JSON.stringify(require('./fixtures/pulser/scheme.json5'))
      head.appendChild meta
      elements.push meta

    do ->
      meta = document.createElement('meta')
      meta.name = 'elpong-collection'
      meta.scheme = 'pulser'
      meta.setAttribute('collection', 'plugs')
      meta.content = JSON.stringify(require('./fixtures/pulser/plugs.json5'))
      head.appendChild meta
      elements.push meta

    Elpong.enableAutoload()

    scheme = null

    expect(-> scheme = Elpong.get('pulser')).not.toThrow()
    expect(scheme.select('plugs').array().length).toBe(1)

  it 'throws if no scheme tags found', ->
    expect(-> Elpong.load()).toThrow()

  it 'throws if no collection or element tags found', ->
    @scheme = Elpong.add(require('./fixtures/pulser/scheme.json5'))
    @users = @scheme.select('users')
    expect(-> @users.load()).toThrow()
