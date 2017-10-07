# Elpong for Javascript

[![Build Status](https://travis-ci.org/hansottowirtz/elpong-js.svg?branch=master)](https://travis-ci.org/hansottowirtz/elpong-js)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/hansottowirtz.svg)](https://saucelabs.com/u/hansottowirtz)

### If you don't understand the basics of Elpong, please read the first lines of [the spec][spec].

### Although this is a draft, everything is tested and it should work in most modern browsers.

## Getting started

```bash
npm install elpong --save
```
```bash
bower install elpong --save
```
or download it [here](https://github.com/hansottowirtz/elpong-js/archive/master.zip)
```html
<script src="/scripts/elpong/dist/elpong.js"></script>
<!-- or -->
<script src="/scripts/elpong/dist/elpong.min.js"></script>
```

```javascript
// Choose one of these:
Elpong.setAjax(window.fetch, 'fetch') // built-in in modern browsers
Elpong.setAjax($http, 'angular') // if you use AngularJS
Elpong.setAjax($.ajax, 'jquery') // if you use jQuery
Elpong.setAjax(http, 'angular2') // if you use Angular, http: instance of Http or HttpClient

Elpong.enableAutoload(); // when using preloading
// or
var scheme = Elpong.add(scheme_config); // if you have the scheme in javascript

scheme.setApiUrl('/api');
var pigs = scheme.select('pigs'); // select the pigs collection

var promise = pigs.actions.getAll(); // sends a GET to /api/pigs
promise.then(function(response) {
  for (pig in pigs.array()) {
    alert('Received pig ' + pig.fields.name);
  }
})
```

If you use Typescript or ES6 modules:
```javascript
import { Elpong, Scheme, Element, Collection } from 'elpong';
```

## Schemes

You can create a scheme in two ways:

`Elpong.add(scheme_config)`

or by preloading it, see [Preloading](#preloading)

A scheme can be retrieved with `Elpong.get(scheme_name)`

## Collections

When a scheme is created, it immediately creates the defined collections.

They can be retrieved with `scheme.select(collection_name)`

You can get an array of the elements in a collection with `collection.array()`

Finding a specific object can be done with: `collection.find(id)` (if `id` is the selector),
or `collection.findBy({name: name})`.
If you want to search for multiple elements with that name,
use `collection.findBy({name: name}, {multiple: true})`.

To load data into the collection, you can use `collection.actions.getAll()`,
or `collection.actions.getOne(id)`. To preload it, see [Preloading](#preloading)

If you are using Rails, check out [this library][rails].

To make a new element, use `collection.build({name: 'Bob'})`.<br/>
This element will be stored in the `new_elements` array, and when it is
`POST`ed, and thus gets a selector value (`id` gets a value), it will end
up in the `elements` object.

You shouldn't access the `new_elements` and `elements` attributes directly,
just use `array()` or `array({without_new: true})` for that.

#### Collection actions

You can execute collection actions with the `actions` key.<br/>
The built in ones are `getOne` and `getAll`.

## Elements

#### Fields

Fields can be accessed through the `fields` key.

Example:
```javascript
pig.fields.name;
```

#### Actions

You can execute actions on the `actions` key. There are four built in ones:

`get`: Sends a GET and updates the fields, overwriting the original fields.

`post`: Sends a POST to the collection url. Should only be called if the
element is new, because it assigns a selector to the element.
(The server should save it in some database, and thus it gets an id)

`put`: Sends a PUT with the new data, and expects the same data sent back,
or otherwise small updates.

`delete`: Sends a DELETE, which should remove the element from the server,
but does not delete the element from the collection on the client side.
Use `remove` to do that.

All actions accept params to be passed in the url.

Example:
```javascript
var pig = pigs.build();
pig.actions.post(); // saves the pig, pig gets an id
pig.actions.get();
pig.actions.put();
pig.actions.delete();

pig.actions.oink(); // sends a PUT to /api/pigs/8/oink
pig.actions.oink({params: {loud: true}}); // sends a PUT to /api/pigs/8/oink?load=true
```

Actions and collection actions (e.g. `getAll()`) return a promise that returns
the response object.

#### Relations

You can find other elements on the `relations` key. These functions always start
with `get`.

Example:
```javascript
human.relations.pigs();
pig.relations.boss();
```

#### Other functions

`remove`: Triggers a `delete` on the element and removes it from the collection if it is saved.
If it is new, it is just removed from the collection on the client side.
In both cases, it returns a promise.

`isNew`: Checks if the element has a selector value.

#### Embedded collections and elements

Can be accessed through their relations.

#### Snapshots

Under the `snapshots` key:

`make(tag)`: Makes a snapshot of the fields and returns a snapshot object,
with a `tag`, `time`, `data` and `revert` key.
If you call `revert`, the element fields will revert themselves to that snapshot.

`undo(tag_or_steps)`:
- When passed in a tag, will revert itself to the
last snapshot with that tag. The snapshot with tag `creation` is made after
`build`. Snapshots with tags <code>before_<i>action</i></code> and <code>after_<i>action</i></code>
are made after those actions, like `before_get` and `after_put`.
- When passed in a number, it will revert itself *n* steps. No argument equals 0 steps, which
reverts itself to the last snapshot.

`isPersisted()`: Compares fields with the `lastPersisted()`.
Note: when one of the fields is an object, it will
return `true` when changing the keys of that object, because the object reference
is the same. The fields are compared with `===`. Returns `false` if the element
is new.

`lastPersisted()`: Gets last snapshot where the tag is `after_get`, `after_post`
,`after_put` or `creation`.

`last()`: Gets last snapshot

`lastWithTag(tag)`: Gets last snapshot where the tag matches the tag string
or regex.

You can loop through snapshots with the `list` key.

```javascript
element.lastPersisted().revert() // reverts the fields to the last persisted snapshot
```

#### Merging

If data is received in another way, like with WebSockets, it can be merged with
the other data using `merge`.

### Preloading

To preload a scheme, create a meta tag with
`name="elpong-scheme"`, <code>scheme=<i>scheme_name</i></code> and <code>content=<i>scheme</i></code>.<br/>
*scheme* is the JSON scheme.

To preload data, create a meta tag with
`name="elpong-collection"`, <code>scheme=<i>scheme_name</i></code>, <code>content=<i>elements</i></code> and <code>collection=<i>collection_name</i></code>.<br/>
*elements* is the same JSON data the API would return.

To preload a single element, create a meta tag with
`name="elpong-element"`, <code>scheme=<i>scheme_name</i></code>, <code>content=<i>element</i></code> and <code>collection=<i>collection_name</i></code>.

Then you can use `Elpong.load()` and `collection.load()` to load schemes and
collections, respectively, or you can use `Elpong.enableAutoload()` and it will take
care of it when it reads the scheme. Make sure to put the `meta` tags *above*
the `script` tags when you do this. `Elpong.enableAutoload()` might give some problems
because it is synchronous.

### Examples

###### Animal Farm
[Scheme](../master/test/fixtures/animal-farm/scheme.json5)
[Usage](../master/test/animal_farm_spec.coffee)

###### Pulser
[Scheme](../master/test/fixtures/pulser/scheme.json5)
[Usage](../master/test/pulser_spec.coffee)

### Setting an ajax function

The ajax function expects one argument object with `url`, `method`, `data` and
`headers` keys.<br/>
It should return a Promise-like object that catches when the response status is
not between 200 and 299, and on other network errors.<br/>
The `then` and `catch` functions should return a response object with a
`data` key, that holds the parsed JSON object.
`$http`, `Http`, and `jQuery.ajax` are supported out of the box.<br/>
If you don't work with AngularJS, Angular, or jQuery, you can use [window.fetch](fetch).

```javascript
Elpong.setAjax(window.fetch, 'fetch') // built-in in modern browsers
Elpong.setAjax($http, 'angular') // if you use AngularJS
Elpong.setAjax($.ajax, 'jquery') // if you use jQuery
Elpong.setAjax(http, 'angular2') // if you use Angular, http: instance of Http or HttpClient
```

### Contributing

Yes please!

Fork it, then do something like this:
```bash
git clone https://github.com/<you>/elpong-js
cd elpong-js
git checkout -b add-a-feature
npm install -g gulp-cli coffee-script typescript
npm install
gulp test
```
Check the `gulpfile.js` for other tasks.<br/>
Make pull requests when you think your feature should be merged or
when you want feedback. Issues are very welcome too!

[spec]: https://github.com/hansottowirtz/elpong/blob/master/SPEC.md
[angularjs]: https://github.com/hansottowirtz/elpong-angularjs
[jquery]: https://github.com/hansottowirtz/elpong-jquery
[rails]: https://github.com/hansottowirtz/elpong-rails
