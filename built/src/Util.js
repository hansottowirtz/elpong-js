"use strict";
exports.Util = {
    capitalize: function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    camelize: function (string) {
        return string.replace(/_/g, ' ').replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
            if (index === 0) {
                return letter.toLowerCase();
            }
            else {
                return letter.toUpperCase();
            }
        }).replace(/\s+/g, '');
    },
    removeFromArray: function (array, element) {
        var i = array.indexOf(element);
        if (i === -1) {
            return false;
        }
        else {
            array.splice(i, i + 1);
            return true;
        }
    },
    isInteger: function (value) {
        return value === parseInt(value, 10);
    },
    isNumber: function (value) {
        return isFinite(value) && !isNaN(parseFloat(value));
    },
    isString: function (value) {
        return typeof value === 'string';
    },
    isRegExp: function (value) {
        return Object.prototype.toString.call(value) == '[object RegExp]';
    },
    forEach: function (o, fn) {
        for (var k in o) {
            if (!o.hasOwnProperty(k)) {
                continue;
            }
            var v = o[k];
            fn(v, k);
        }
    },
    endsWith: function (string, search) {
        if (string.endsWith) {
            return string.endsWith(search);
        }
        else {
            return string.substr(-search.length) === search;
        }
    },
    startsWith: function (string, search) {
        if (string.startsWith) {
            return string.startsWith(search);
        }
        else {
            return string.substr(0, search.length) === search;
        }
    },
    arrayFromHTML: function (node_list) {
        if (Array.from) {
            return Array.from(node_list);
        }
        else {
            return [].slice.call(node_list);
        }
    },
    values: function (obj) {
        var vals = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key) && obj.propertyIsEnumerable(key)) {
                vals.push(obj[key]);
            }
        }
        return vals;
    },
    includes: function (a, b) {
        return a.indexOf(b) > -1;
    },
    equalsJSON: function (a, b) {
        for (var k in a) {
            var v1 = a[k];
            var v2 = b[k];
            if (typeof v1 === 'object') {
                if (!exports.Util.equalsJSON(v1, v2)) {
                    return false;
                }
            }
            else {
                if (v1 !== v2) {
                    return false;
                }
            }
        }
        return true;
    },
    copyJSON: function (o) {
        return JSON.parse(JSON.stringify(o));
    }
};
