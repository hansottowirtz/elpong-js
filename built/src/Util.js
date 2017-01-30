"use strict";
exports.Util = {
    BREAK: new Object(),
    kebab: function (string) {
        return string.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replace(/(é|ë)/g, 'e').split(' ').join('-');
    },
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
    arrayDiff: function (array1, array2) {
        return array1.filter(function (i) { return array2.indexOf(i) < 0; });
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
    copy: function (obj) {
        if (typeof obj !== 'object') {
            return obj;
        }
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                copy[attr] = obj[attr];
            }
        }
        return copy;
    },
    merge: function (obj1, obj2) {
        for (var attr in obj2) {
            obj1[attr] = obj2[attr];
        }
        return obj1;
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
    isRegex: function (value) {
        return value instanceof RegExp;
    },
    forEach: function (o, f) {
        for (var k in o) {
            var v = o[k];
            if (!o.hasOwnProperty(k)) {
                continue;
            }
            if (f(v, k) === exports.Util.BREAK) {
                break;
            }
        }
    },
    reverseForIn: function (obj, f) {
        var arr = [];
        var _break = false;
        for (var key in obj) {
            arr.push(key);
        }
        var i = arr.length - 1;
        while ((i >= 0) && !_break) {
            var v = f.call(obj, arr[i], obj[arr[i]]);
            if (v === exports.Util.BREAK) {
                _break = true;
            }
            i--;
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
    }
};
