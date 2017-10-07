UrlHelper = require('../src/Helpers/UrlHelper').UrlHelper
Elpong = require('../src/Elpong').Elpong

describe 'UrlHelper', ->
  it 'can add params to url', ->
    u = UrlHelper.appendParamsToUrl('http://x.com', {a: 'b', txt: 'lol xp'})
    expect(u).toBe('http://x.com?a=b&txt=lol%20xp')

  it 'can create appropriate urls for elements', ->
    @scheme = Elpong.add(require('./fixtures/animal-farm/scheme.json5'))
    @scheme.setApiUrl('/api')
    pigs = @scheme.select('pigs')
    bob = pigs.build({id: 1, name: 'Bob'})
    expect(UrlHelper.createForElement(bob, {})).toBe('/api/pigs/1')
    expect(UrlHelper.createForElement(bob, {no_selector: true})).toBe('/api/pigs')
    expect(UrlHelper.createForElement(bob, {params: {a: 'x'}})).toBe('/api/pigs/1?a=x')
    expect(UrlHelper.createForElement(bob, {no_selector: true, params: {a: 'x'}})).toBe('/api/pigs?a=x')


   it 'can create appropriate urls for collections', ->
    @scheme = Elpong.add(require('./fixtures/animal-farm/scheme.json5'))
    @scheme.setApiUrl('/api')
    pigs = @scheme.select('pigs')

    expect(UrlHelper.createForCollection(pigs, {suffix: 'me'})).toBe('/api/pigs/me')
    expect(UrlHelper.createForCollection(pigs, {suffix: 'me', params: {lol: true}})).toBe('/api/pigs/me?lol=true')
