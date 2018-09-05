import { AjaxAdapterType, convertAjaxAdapterTypeStringToType } from '../src/Ajax';

describe('Ajax', () => {
  it('converts adapter types correctly', () => {
    expect(convertAjaxAdapterTypeStringToType('fetch')).toBe(1);
    expect(convertAjaxAdapterTypeStringToType('angular')).toBe(2);
    expect(convertAjaxAdapterTypeStringToType('angularjs')).toBe(0);
    expect(convertAjaxAdapterTypeStringToType('jquery')).toBe(3);
    expect(convertAjaxAdapterTypeStringToType('eh' as any as AjaxAdapterType)).toBe(0);
  });
});
