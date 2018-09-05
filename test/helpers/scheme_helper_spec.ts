import elpong from '../../src/main';
import { getCollectionBySingularName } from '../../src/Helpers/SchemeHelper';

declare const require: (path: string) => any;

describe('SchemeHelper', () => {
  it('finds schemes by their singular names', () => {
    const scheme = elpong.add(require('../fixtures/stupid-farm/scheme.json5'));
    expect(getCollectionBySingularName(scheme, 'boss').name).toBe('bosses');
  });
});
