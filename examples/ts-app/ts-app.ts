import elpong, { AjaxAdapterType, Collection } from 'elpong';

elpong.enableAutoload();
elpong.setAjax(window.fetch, AjaxAdapterType.Fetch);
const pig = elpong.get('test-app').select('pigs').find(3);
document.write(pig.fields.name);
