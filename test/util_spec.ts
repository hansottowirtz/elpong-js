/// <reference types="node"/>
/// <reference types="jasmine"/>

import { Util } from '../src/Util';

describe('Util', () =>
  it('should camelize right', () =>
    expect(Util.camelize('lol xp xd')).toBe('lolXpXd')
  )
)
