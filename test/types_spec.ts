/// <reference types="node"/>
/// <reference types="jasmine"/>

import elpong, { Scheme, Element, Collection, SchemeConfiguration } from '../src/main';

describe('importing types from global', () => {
  it('compiles', () => {
    let scheme: Scheme;
    scheme = elpong.add({
      name: 'a',
      selector: 'id',
      collections: {
        lols: {
          fields: {
            id: {},
            a_id: { reference: true }
          },
          relations: {
            belongs_to: {
              a: { polymorphic: true, field: 'a_id' },
              b: { polymorphic: false }
            }
          },
          actions: {
            rofl: { method: 'PUT' }
          }
        },
        as: {
          fields: {
            id: {}
          }
        },
        bs: {
          fields: {
            id: {}
          }
        }
      }
    });
    expect(scheme.name).toBe('a');

    let collection: Collection;
    collection = scheme.select('lols');

    let element: Element;
    element = collection.build({a_id: 1});
  });
});
