/// <reference types="node"/>
/// <reference types="jasmine"/>

import Elpong, { Scheme, Element, Collection, SchemeConfiguration } from '../src/main';
const HttpBackend = require('./spec_helper').HttpBackend;

describe('Abstract', () => {
  it('can have collection names on embedded collections', (done) => {
    const scheme = Elpong.add(require('./fixtures/abstract/scheme.json5'));
    scheme.setApiUrl('/api');

    const httpBackend = new HttpBackend();

    httpBackend.reply('GET', '/api/xs?c=true', [
      {
        id: 1,
        cs: [{id: 1}]
      }
    ]);
    httpBackend.reply('GET', '/api/xs', [
      {
        id: 1,
        cs: [{id: 1}],
        ds: [{id: 2}]
      }
    ]);

    const xs = scheme.select('xs');
    const bs = scheme.select('bs');

    xs.actions.getAll({params: {c: true}}).then((r) => {
      expect(bs.array().length).toBe(1);

      xs.actions.getAll().then((r) => {
        expect(bs.array().length).toBe(2);
        httpBackend.done(done);
      });
    });

    httpBackend.flush();
  });

  it('can pass ajax data to actions', (done) => {
    const scheme = Elpong.add(require('./fixtures/abstract/scheme.json5'));
    scheme.setApiUrl('/api');

    const httpBackend = new HttpBackend();

    httpBackend.reply('POST', '/api/xs', {id: 1}, 200, (data: any) => { expect(data).toBe('lol') });
    httpBackend.reply('DELETE', '/api/xs/1/f', null, 204, (data: any) => { expect(data).toBe('lol') });
    httpBackend.reply('DELETE', '/api/xs/g', null, 204, (data: any) => { expect(data).toBe('lol') });

    const xs = scheme.select('xs');

    const x = xs.build({});

    x.actions.post({data: 'lol'}).then((r) => {
      x.fields.id = 1;
      x.actions.f({data: 'lol'}).then((r) => {
        xs.actions.g({data: 'lol'}).then((r) => {
          httpBackend.done(done);
        });
      });
    });


    httpBackend.flush();
  });
});
