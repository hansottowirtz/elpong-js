# coffeelint: disable=no_this

Object.values ||= `function values(obj) {
	var vals = [];
	for (var key in obj) {
		if (obj.hasOwnProperty(key) && obj.propertyIsEnumerable(key)) {
			vals.push(obj[key]);
		}
	}
	return vals;
}
`

Array.prototype.includes ||= (e) ->
  this.indexOf(e) > -1

String.prototype.includes ||= (e) ->
  this.indexOf(e) > -1

# coffeelint: enable=no_this
