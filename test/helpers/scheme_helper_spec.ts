import { SchemeHelper } from '../../src/Helpers/SchemeHelper';
import elpong from '../../src/main';

declare const require: Function;

describe('SchemeHelper', () => {
  beforeEach(() => {
    this.scheme = elpong.add(require('../fixtures/stupid-farm/scheme.json5'));
  });
  it('finds schemes by their singular names', () => {
    expect(SchemeHelper.getCollectionBySingularName(this.scheme, 'boss').name).toBe('bosses');
  });
});
