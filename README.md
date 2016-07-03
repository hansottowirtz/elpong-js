# HTTPong for Javascript

### If you don't understand the basics of HTTPong, please read the first lines of [the spec][spec].

## Schemes

You can create a scheme in two ways:

`new HTTPong.Scheme(scheme_object)`

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
`name=httpong-collection`, `scheme=scheme_name` and `content=array`
Array is the same data the API would return.

To make a new element, use `collection.makeNewElement({name: 'Bob'})`.
This element will be stored in the `new_elements` array, and when it is
POSTed, and thus gets a selector value (id gets a value), it will end
up in the `elements` object.

You shouldn't access the `new_elements` and `elements` attributes directly,
just use `getArray()` or `getArray({without_new: true})` for that.

#### Collection actions

You can do collection actions with the `actions` key. The built in ones are
`doGetOne` and `doGetAll`.

## Elements

#### Fields

Fields can be accessed through the `fields` key, or with `getField` and `setField`

e.g.
```javascript
element.fields.name;
element.getField('name');
element.setField('name', 'Bob');
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

e.g.
```javascript
element = collection.makeNewElement()
element.actions.doPost() // saves the element
element.actions.doGet()
element.actions.doPut()
element.actions.doDelete()
```

#### Relations

You can find other elements on the `relations` key. These functions always start
with `get`.

e.g.
```javascript
human.relations.getPigs()
pig.relations.getBoss()
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

#### Merging

If data is received in another way, like with WebSockets, it can be merged with
the other data using `mergeWith`

[spec]: https://github.com/hansottowirtz/httpong/blob/master/SPEC.md
[js-localization]: https://github.com/hansottowirtz/httpong-js-localization
