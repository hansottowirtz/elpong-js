const elpong = require('elpong').default;

const obj = {"name": "test-app", "selector": "id", "collections": {"pigs": {"fields": {"id": {}, "name": {}}}}};

const scheme = elpong.add(obj);
scheme.select('pigs').build({id: 3, name: 'Bob'});

const pig = elpong.get('test-app').select('pigs').find(3);

console.log(pig.fields.name);

