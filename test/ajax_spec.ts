import { Ajax, AjaxAdapterType } from "../src/Ajax"

describe('Ajax', () => {
    it('converts adapter types correctly', () => {
        expect(Ajax.convertAjaxAdapterTypeStringToType('fetch')).toBe(0);
        expect(Ajax.convertAjaxAdapterTypeStringToType('angular')).toBe(1);
        expect(Ajax.convertAjaxAdapterTypeStringToType('angularjs')).toBe(2);
        expect(Ajax.convertAjaxAdapterTypeStringToType('jquery')).toBe(3);
        expect(Ajax.convertAjaxAdapterTypeStringToType('eh' as any as AjaxAdapterType)).toBe(0);
    })
})

