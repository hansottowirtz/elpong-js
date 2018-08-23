/// <reference types="elpong"/>

import elpong, { Collection } from 'elpong';
console.log(Collection);

elpong.enableAutoload();
const pig = elpong.get('test-app').select('pigs').find(3);
document.write(pig.fields.name);
