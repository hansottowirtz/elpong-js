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

  fit 'autoloads schemes', ->
    return if !document?

    expect(-> Elpong.get('pulser')).toThrow()

    head = document.getElementsByTagName('head')[0]

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
      meta.setAttribute('collection', 'devices')
      meta.content = JSON.stringify(require('./fixtures/pulser/devices.json5'))
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

    device = scheme.select('devices').find(1)
    plug2 = scheme.select('plugs').find(2)
    plug3 = scheme.select('plugs').find(3)

    expect(plug3.relations.endplug()).toBe(plug2)
    expect(plug2.relations.block()).toBe(device)

  it 'throws if no scheme tags found', ->
    expect(-> Elpong.load()).toThrow()

  it 'throws if no collection or element tags found', ->
    @scheme = Elpong.add(require('./fixtures/pulser/scheme.json5'))
    @users = @scheme.select('users')
    expect(-> @users.load()).toThrow()
