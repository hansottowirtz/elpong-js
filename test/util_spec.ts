/// <reference path="../typings/globals/jasmine/index.d.ts" />

import { Util } from '../src/Util';

describe('Util', () =>
  it('should camelize right', () =>
    expect(Util.camelize('lol xp xd')).toBe('lolXpXd')
  )
)
