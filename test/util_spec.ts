import { Util } from '../src/Util';
import {} from 'jasmine';

describe('Util', () =>
  it('should camelize right', () =>
    expect(Util.camelize('lol xp xd')).toBe('lolXpXd')
  )
)
