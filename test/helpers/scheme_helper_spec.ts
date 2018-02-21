/// <reference types="node"/>
/// <reference types="jasmine"/>

import { SchemeHelper } from '../../src/Helpers/SchemeHelper';
import { Elpong } from '../../src/Elpong';

declare const require: Function;

describe('SchemeHelper', () => {
  beforeEach(() => {
    this.scheme = Elpong.add(require('../fixtures/stupid-farm/scheme.json5'));
  });
  it('finds schemes by their singular names', () => {
    expect(SchemeHelper.getCollectionBySingularName(this.scheme, 'boss').name).toBe('bosses');
  });
});
