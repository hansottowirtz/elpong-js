import { Elpong, Scheme, Element, Collection } from '../src/Elpong';
// import {} from 'jasmine';

describe('importing types', () => {
  it('compiles', () => {
    let s: Scheme;
    Elpong.add(require('./fixtures/stupid-farm/scheme.json5'));
    s = Elpong.get('stupid-farm');
    expect(s.name).toBe('stupid-farm');
  });
});
