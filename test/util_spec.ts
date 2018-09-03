/// <reference types="node"/>
/// <reference types="jasmine"/>

import { Util } from '../src/Util';

describe('Util', () => {
  it('should camelize right', () =>
    expect(Util.camelize('lol xp xd')).toBe('lolXpXd')
  )
  
  it('camelizes strings', () => {
    const o = {
      'say oink': 'sayOink',
      say_oink: 'sayOink',
      'say_oink again': 'sayOinkAgain'
    };

    for (let k in o) {
      const v = o[k]
      expect(Util.camelize(k)).toBe(v)
    }
  })
  
  it('checks if objects are equal, limited to JSON data types', () => {
    expect(Util.equalsJSON(
      {a: 1, b: {c: 'd', e: 'f'}},
      {b: {e: 'f', c: 'd'}, a: 1}
    )).toBe(true)
    expect(Util.equalsJSON(
      {a: 1, b: {c: 'd', e: 'f'}},
      {b: {e: 'g', c: 'd'}, a: 1}
    )).toBe(false)
  })

  it('does for each loops', () => {
    let last: number = 0;
    const a = [1, 2, 3, 4]
    Util.forEach(a, (v) => last = v)
    expect(last).toBe(4)
  })
})