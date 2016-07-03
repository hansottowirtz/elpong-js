# HTTPong for Javascript

### If you don't understand the basics of HTTPong, please read the first lines of [the spec][spec].

### Although this is a draft, everything is tested and it should work in most modern browsers.

## Getting started

```javascript
HTTPong.setHttpFunction($http); // or $.ajax, or something like that
HTTPong.initialize();

var scheme = HTTPong.addScheme(object); // This is the animal-farm scheme, check the spec!
scheme.setApiUrl('/api');
var pigs = scheme.select('pigs'); // select the pigs collection

var promise = pigs.actions.doGetAll(); // sends a GET to /api/pigs
promise.then(function(response) {
  for (pig in pigs.getArray()) {
    alert('Received pig ' + pig.getField('name')); // or pig.fields.name
  }
})
```

## Schemes

You can create a scheme in two ways:

`new HTTPong.addScheme(scheme_object)`

or by creating a meta tag with `name=httpong-scheme` and `content=scheme_object`.

A scheme can be retrieved with `HTTPong.getScheme(scheme_name)`

## Collections

When a scheme is created, it immediately creates the defined collections.

They can be retrieved with `scheme.select(collection_name)`

You can get an array of the elements in a collection with `collection.getArray()`

Finding a specific object can be done with: `collection.find(id)` (if `id` is the selector),
or `collection.findBy('name', name)`

To load data into the collection, you can use `collection.actions.doGetAll()`,
or `collection.actions.doGetOne(id)`

To preload data, which is recommended, create a meta tag with
`name=httpong-collection`, `scheme=scheme_name` and `content=array`.<br/>
Array is the same data the API would return.

To make a new element, use `collection.makeNewElement({name: 'Bob'})`.<br/>
This element will be stored in the `new_elements` array, and when it is
`POST`ed, and thus gets a selector value (`id` gets a value), it will end
up in the `elements` object.

You shouldn't access the `new_elements` and `elements` attributes directly,
just use `getArray()` or `getArray({without_new: true})` for that.

#### Collection actions

You can do collection actions with the `actions` key.<br/>
The built in ones are `doGetOne` and `doGetAll`.

## Elements

#### Fields

Fields can be accessed through the `fields` key, or with `getField` and `setField`

Example:
```javascript
pig.fields.name;
pig.getField('name');
pig.setField('name', 'Snowball');
```

#### Actions

You can do actions on the `actions` key. There are four built in ones:

`doGet`: Sends a GET and updates the fields, overwriting the original fields.

`doPost`: Sends a POST to the collection url. Should only be called if the
element is new, because it assigns a selector to the element.
(The server should)

`doPut`: Sends a PUT with the new data, and expects the same data sent back,
or otherwise small updates.

`doDelete`: Sends a DELETE, which should remove the element from the server,
but does not delete the element from the collection on the client side.
Use `remove` to do that.

Example:
```javascript
var pig = pigs.makeNewElement();
pig.actions.doPost(); // saves the pig, pig gets an id
pig.actions.doGet();
pig.actions.doPut();
pig.actions.doDelete();

pig.actions.doOink(); // sends a PUT to /api/pigs/8/oink
```

#### Relations

You can find other elements on the `relations` key. These functions always start
with `get`.

Example:
```javascript
human.relations.getPigs();
pig.relations.getBoss();
```

#### Other functions

`remove`: Triggers a `doDelete` on the element and removes
it from the collection if it is saved. If it is new, it is just removed from
the collection on the client side.
In both cases, it returns a promise.

`getField`: Can be overridden, e.g. by [httpong-js-localization][js-localization]

`setField`: Can be overridden too.

#### Embedded collections and elements

Can be accessed through their relations.

#### Snapshots

`makeSnapshot(tag)`: Makes a snapshot of the fields and returns a snapshot object,
with a `tag`, `time`, `data` and `revert` key.
If you call `revert`, the element fields will revert themselves to that snapshot.

`undo(time_or_tag_or_number)`:
- When passed in a tag, will revert itself to the
last snapshot with that tag. The snapshot with tag `creation` is made after
`makeNewElement`. Snapshots with tags `before_{action}` and `after_{action}`
are made after those actions, like `before_get` and `after_put`.
- When passed in a time, it will revert itself to a snapshot of that time.
- When passed in a number, it will revert itself n steps.

You can loop through snapshots with the `snapshots` key.

#### Merging

If data is received in another way, like with WebSockets, it can be merged with
the other data using `mergeWith`.

### Examples

###### Animal Farm
[Scheme](../blob/master/test/fixtures/animal-farm/scheme.json)
[Usage](../blob/master/test/animal_farm_spec.coffee)

###### Pulser
[Scheme](../blob/master/test/fixtures/pulser/scheme.json)

[spec]: https://github.com/hansottowirtz/httpong/blob/master/SPEC.md
[js-localization]: https://github.com/hansottowirtz/httpong-js-localization
