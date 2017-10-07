/// <reference types="node"/>
/// <reference types="jasmine"/>

import { Elpong, Scheme, Element, Collection, SchemeConfiguration } from '../src/main';
const HttpBackend = require('./spec_helper').HttpBackend;

describe('Abstract', () => {
  it('can have collection names on embedded collections', (done) => {
    const scheme = Elpong.add(require('./fixtures/abstract/scheme.json5'));
    scheme.setApiUrl('/api');

    const httpBackend = new HttpBackend();

    httpBackend.reply('GET', '/api/xs', [
      {
        id: 1,
        cs: [{id: 1}],
        ds: [{id: 2}]
      }
    ]);

    const xs = scheme.select('xs');
    const bs = scheme.select('bs');

    xs.actions.getAll().then((r) => {
      console.log(r.data);
      expect(bs.array().length).toBe(2);
      httpBackend.done(done);
    });

    httpBackend.flush();
  });
});
