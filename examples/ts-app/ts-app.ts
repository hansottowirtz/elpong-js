/// <reference types="elpong"/>

import elpong, { Collection, AjaxAdapterType } from 'elpong';
console.log(Collection);

elpong.enableAutoload();
elpong.setAjax(window.fetch, AjaxAdapterType.Fetch);
const pig = elpong.get('test-app').select('pigs').find(3);
document.write(pig.fields.name);
