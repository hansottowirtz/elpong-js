(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Elpong", [], factory);
	else if(typeof exports === 'object')
		exports["Elpong"] = factory();
	else
		root["Elpong"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 22);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.Util = {
    // BREAK: new Object(),
    // kebab: (string: string): string => {
    //   return string.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replace(/(é|ë)/g, 'e').split(' ').join('-');
    // },
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
    // arrayDiff: (array1: any[], array2: any[]): any[] => {
    //   return array1.filter(i => array2.indexOf(i) < 0);
    // },
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
    // copy: (obj: Object) => {
    //   if (typeof obj !== 'object') {
    //     return obj;
    //   }
    //   let copy = obj.constructor();
    //   for (let attr in obj) {
    //     if (obj.hasOwnProperty(attr)) {
    //       copy[attr] = obj[attr];
    //     }
    //   }
    //   return copy;
    // },
    // merge: (obj1: Object, obj2: Object): Object => {
    //   for (let attr in obj2) {
    //     obj1[attr] = obj2[attr];
    //   }
    //   return obj1;
    // },
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
    // reverseForEach: (obj: Object, f: (k: string, v: any) => void): void => {
    //   let arr: string[] = [];
    //   let _break = false;
    //   for (let key in obj) {
    //     // add hasOwnPropertyCheck if needed
    //     arr.push(key);
    //   }
    //   let i = arr.length - 1;
    //   while ((i >= 0) && !_break) {
    //     let v = f.call(obj, arr[i], obj[arr[i]]);
    //     if (v === Util.BREAK) { _break = true; }
    //     i--;
    //   }
    // },
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


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
if (typeof DEBUG === 'undefined') {
    var DEBUG = true;
}
if (DEBUG) {
    var error_text_map = {
        'schmnf': 'Scheme not found',
        'collnf': 'Collection not found',
        'collnf:s': 'Collection not found by singular name',
        'collex': 'Collection with name already exists in scheme',
        'elpgns': 'No schemes added or found',
        'confns': 'Configuration has no selector',
        'confnn': 'Configuration has no name',
        'elenew': 'Element is new',
        'elesna': 'Element has a selector value but is in new_elements array',
        'elense': 'Element has no selector value but is in elements object',
        'apinur': 'Api url has not yet been set',
        'fldnsa': 'Field should be an array of selectors',
        'elesch': 'Element selector changed',
        'elesnf': 'Snapshot not found',
        'elesti': 'Invalid snapshot identifier: must be number <= list.length, string or RegExp'
    };
}
var ElpongError = (function (_super) {
    __extends(ElpongError, _super);
    function ElpongError(message, argument) {
        var _this = this;
        var actual_message = DEBUG ? error_text_map[message] : message;
        if (argument) {
            _this = _super.call(this, actual_message + ": " + argument) || this;
        }
        else {
            _this = _super.call(this, actual_message) || this;
        }
        return _this;
    }
    return ElpongError;
}(Error));
exports.ElpongError = ElpongError;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var CollectionHelper;
(function (CollectionHelper) {
    function getConfiguration(collection) {
        return collection.scheme().configuration().collections[collection.name];
    }
    CollectionHelper.getConfiguration = getConfiguration;
    function getSingularName(collection) {
        return getConfiguration(collection).singular; // Last char cut in Configuration
    }
    CollectionHelper.getSingularName = getSingularName;
    function addElement(collection, element) {
        var selector_value;
        if (selector_value = element.selector()) {
            collection.elements[selector_value] = element;
        }
        else {
            collection.new_elements.push(element);
        }
    }
    CollectionHelper.addElement = addElement;
})(CollectionHelper = exports.CollectionHelper || (exports.CollectionHelper = {}));


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/// <reference path="../typings/index.d.ts"/>

var Ajax;
(function (Ajax) {
    var ajax_function;
    function executeRequest(url, method, data, headers) {
        if (!headers) {
            headers = {};
        }
        headers['Accept'] = headers['Content-Type'] = 'application/json';
        var options = {
            method: method,
            url: url,
            data: JSON.stringify(data === undefined ? {} : data),
            headers: headers,
            dataType: 'json',
            responseType: 'json'
        };
        options.type = options.method;
        options.body = options.data;
        return ajax_function(options.url, options);
    }
    Ajax.executeRequest = executeRequest;
    // Set the http function used for requests
    // The function should accept one object with keys
    // method, url, params, headers
    // and return a promise-like object
    // with then and catch
    //
    // @note Like $http or jQuery.ajax
    // @param {Function} fn The function.
    // @param {string} type The function.
    function setAjaxFunction(fn, type) {
        if (typeof type === 'undefined') {
            if ((typeof jQuery !== 'undefined') && (fn === jQuery.ajax))
                type = 'jquery';
            else if ((typeof fetch !== 'undefined') && (fn === fetch))
                type = 'fetch';
        }
        switch (type) {
            case 'jquery':
                ajax_function = function (url, instruction) {
                    var deferred = jQuery.Deferred();
                    var ajax = fn(url, instruction);
                    ajax.then(function (data, status, jqxhr) { return deferred.resolve({ data: data, status: jqxhr.statusCode().status, headers: jqxhr.getAllResponseHeaders() }); });
                    ajax.catch(function (data, status, jqxhr) { return deferred.reject({ data: data, status: jqxhr.statusCode().status, headers: jqxhr.getAllResponseHeaders() }); });
                    return deferred.promise();
                };
                break;
            case 'fetch':
                ajax_function = function (url, instruction) {
                    return new Promise(function (resolve, reject) {
                        instruction['body'] = instruction.data;
                        var http_promise = fn(url, instruction);
                        http_promise.then(function (response) {
                            if (response.headers.get('content-type') !== 'application/json') {
                                resolve(response);
                            }
                            else {
                                var json_promise = response.json();
                                json_promise.then(function (json) {
                                    response['data'] = json; // typescript ignores square brackets
                                    resolve(response);
                                });
                                json_promise.catch(reject);
                            }
                        });
                        http_promise.catch(reject);
                    });
                };
                break;
            default:
                ajax_function = function (url, instruction) { return fn(instruction); };
        }
    }
    Ajax.setAjaxFunction = setAjaxFunction;
})(Ajax = exports.Ajax || (exports.Ajax = {}));


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Util_1 = __webpack_require__(0);
var Fields_1 = __webpack_require__(15);
var Relations_1 = __webpack_require__(16);
var Actions_1 = __webpack_require__(14);
var Snapshots_1 = __webpack_require__(19);
var Errors_1 = __webpack_require__(1);
function isSelectorValue(v) {
    return (!!v || v === 0 || v === '') && (typeof v === 'string' || typeof v === 'number');
}
exports.isSelectorValue = isSelectorValue;
var Element = (function () {
    function Element(collection, pre_element) {
        this.fields = {};
        this.relations = {};
        this.actions = {};
        this.snapshots = {};
        this._collection = collection;
        var collection_config = collection.configuration();
        Fields_1.Fields.setup(this, collection_config.fields, pre_element);
        Relations_1.Relations.setup(this, collection_config.relations);
        Actions_1.Actions.setup(this, collection_config.actions);
        Snapshots_1.Snapshots.setup(this);
        this.snapshots.make('creation');
    }
    Element.prototype.collection = function () {
        return this._collection;
    };
    Element.prototype.selector = function () {
        return this.fields[this.collection().scheme().configuration().selector];
    };
    Element.prototype.remove = function () {
        var _this = this;
        var selector_value;
        if (selector_value = this.selector()) {
            return this.actions.delete().then(function () {
                var elements = _this.collection().elements;
                delete elements[selector_value];
            });
        }
        else {
            Util_1.Util.removeFromArray(this.collection().new_elements, this);
            return {
                then: function (fn) { return fn(); },
                catch: function () { }
            };
        }
    };
    Element.prototype.save = function () {
        if (this.isNew()) {
            return this.actions.post();
        }
        else {
            return this.actions.put();
        }
    };
    Element.prototype.isNew = function () {
        if (Util_1.Util.includes(this.collection().new_elements, this)) {
            if (this.selector()) {
                throw new Errors_1.ElpongError('elesna');
            }
            else {
                return true;
            }
        }
        else {
            if (!this.selector()) {
                throw new Errors_1.ElpongError('elense');
            }
            else {
                return false;
            }
        }
    };
    Element.prototype.merge = function (pre_element) {
        var _this = this;
        var collection_config = this.collection().configuration();
        Util_1.Util.forEach(collection_config.fields, function (field_config, field_key) {
            var field_value;
            if (field_value = pre_element[field_key]) {
                if (field_config.embedded_element) {
                    Fields_1.Fields.handleEmbeddedElement(_this, pre_element, field_key, field_config);
                }
                else if (field_config.embedded_collection) {
                    Fields_1.Fields.handleEmbeddedCollection(_this, pre_element, field_key, field_config);
                }
                else {
                    var selector_key = _this.collection().scheme().configuration().selector;
                    if (field_key === selector_key) {
                        var selector_value = _this.fields[field_key];
                        if ((selector_value !== field_value) && isSelectorValue(selector_value) && isSelectorValue(field_value)) {
                            throw new Errors_1.ElpongError('elesch', selector_value + " -> " + field_value);
                        }
                    }
                    _this.fields[field_key] = field_value;
                }
            }
        });
        return this;
    };
    return Element;
}());
exports.Element = Element;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Errors_1 = __webpack_require__(1);
var CollectionHelper_1 = __webpack_require__(2);
var SchemeHelper;
(function (SchemeHelper) {
    function getCollectionBySingularName(scheme, singular_name) {
        for (var collection_name in scheme._collections) {
            var collection = scheme.select(collection_name);
            if (CollectionHelper_1.CollectionHelper.getSingularName(collection) === singular_name) {
                return collection;
            }
        }
        throw new Errors_1.ElpongError('collnf:s', singular_name);
    }
    SchemeHelper.getCollectionBySingularName = getCollectionBySingularName;
})(SchemeHelper = exports.SchemeHelper || (exports.SchemeHelper = {}));


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Errors_1 = __webpack_require__(1);
var UrlHelper;
(function (UrlHelper) {
    function createForElement(action_name, action_configuration, element, url_options, no_selector) {
        var path, url;
        var collection = element.collection();
        var scheme = collection.scheme();
        var api_url = scheme.getApiUrl();
        if (!api_url) {
            throw new Errors_1.ElpongError('apinur');
        }
        if (url_options.path) {
            path = UrlHelper.trimSlashes(url_options.path);
            url = api_url + "/" + path;
        }
        else {
            url = api_url + "/" + collection.name;
            if (!action_configuration.no_selector && !no_selector) {
                url = url + "/" + element.selector();
            }
        }
        if (action_configuration.method) {
            url = url + "/" + (action_configuration.path || action_name);
        }
        if (url_options.suffix) {
            url = url + "/" + url_options.suffix;
        }
        return url;
    }
    UrlHelper.createForElement = createForElement;
    function createForCollection(action_name, collection, url_options) {
        var api_url = collection.scheme().getApiUrl();
        if (!api_url) {
            throw new Errors_1.ElpongError('apinur');
        }
        var url = api_url + "/" + collection.name; //HPP.Helpers.Url.createForCollection(, hpe, user_options) # (action_name, element, user_options = {}, suffix)
        if (url_options.suffix) {
            url = url + "/" + url_options.suffix;
        }
        return url;
    }
    UrlHelper.createForCollection = createForCollection;
    function trimSlashes(s) {
        return s.replace(/^\/|\/$/g, '');
    }
    UrlHelper.trimSlashes = trimSlashes;
    function isFqdn(s) {
        return /^https?:\/\//.test(s);
    }
    UrlHelper.isFqdn = isFqdn;
})(UrlHelper = exports.UrlHelper || (exports.UrlHelper = {}));


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var UrlHelper_1 = __webpack_require__(6);
exports.UrlHelper = UrlHelper_1.UrlHelper;
var CollectionHelper_1 = __webpack_require__(2);
exports.CollectionHelper = CollectionHelper_1.CollectionHelper;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var CollectionHelper_1 = __webpack_require__(2);
var Util_1 = __webpack_require__(0);
var Errors_1 = __webpack_require__(1);
var HasMany;
(function (HasMany) {
    function setup(element, relation_collection_name, relation_settings) {
        var collection = element.collection();
        var collection_config = collection.configuration();
        var relation_collection = collection.scheme().select(relation_settings.collection || relation_collection_name);
        var references_field_key = relation_settings.references_field || relation_collection_name + "_" + collection.scheme().configuration().selector + "s"; // dogs_ids, unless specified otherwise
        var relation_field_settings;
        if (relation_field_settings = collection_config.fields[references_field_key]) {
            // throw new Error("Field #{field_key} of collection #{collection.getName()} are not references") if !relation_field_settings.references
            return element.relations[Util_1.Util.camelize(relation_collection_name)] = function () {
                return getHasManyRelationArrayThroughReferencesField(element, relation_collection, references_field_key);
            };
        }
        else {
            return element.relations[Util_1.Util.camelize(relation_collection_name)] =
                getHasManyRelationFunction(element, collection, relation_settings, relation_collection);
        }
    }
    HasMany.setup = setup;
    function getHasManyRelationFunction(element, collection, relation_config, relation_collection, limit_to_one) {
        var has_many_field_key;
        var collection_singular_name = CollectionHelper_1.CollectionHelper.getSingularName(collection);
        var relation_collection_settings = relation_collection.configuration();
        var selector_key = collection.scheme().configuration().selector;
        if (relation_config.polymorphic) {
            has_many_field_key = relation_config.as + "_" + selector_key;
            var has_many_collection_field_key_1 = relation_config.as + "_collection";
            return function () { return getPolymorphicHasManyRelationArray(element, relation_collection, has_many_field_key, has_many_collection_field_key_1, limit_to_one); };
        }
        else {
            if (relation_config.field) {
                has_many_field_key = relation_config.field;
            }
            else if (relation_config.as) {
                has_many_field_key = relation_config.as + "_" + selector_key;
            }
            else {
                has_many_field_key = collection_singular_name + "_" + selector_key;
            }
            return function () { return getHasManyRelationArray(element, relation_collection, has_many_field_key, limit_to_one); };
        }
    }
    HasMany.getHasManyRelationFunction = getHasManyRelationFunction;
    function getHasManyRelationArray(element, relation_collection, has_many_field_key, limit_to_one) {
        var element2_arr = [];
        var selector_value = element.selector();
        for (var _i = 0, _a = relation_collection.array(); _i < _a.length; _i++) {
            var element2 = _a[_i];
            if (selector_value === element2.fields[has_many_field_key]) {
                element2_arr.push(element2);
                if (limit_to_one) {
                    return element2_arr;
                }
            }
        }
        return element2_arr;
    }
    function getPolymorphicHasManyRelationArray(element, relation_collection, has_many_field_key, has_many_collection_field_key, limit_to_one) {
        var element2_arr = [];
        var selector_value = element.selector();
        var collection_name = element.collection().name;
        for (var _i = 0, _a = relation_collection.array(); _i < _a.length; _i++) {
            var element2 = _a[_i];
            if (selector_value === element2.fields[has_many_field_key] && collection_name === element2.fields[has_many_collection_field_key]) {
                element2_arr.push(element2);
                if (limit_to_one) {
                    return element2_arr;
                }
            }
        }
        return element2_arr;
    }
    function getHasManyRelationArrayThroughReferencesField(element, relation_collection, field_key) {
        var selector_value_arr = element.fields[field_key];
        if (!Array.isArray(selector_value_arr)) {
            throw new Errors_1.ElpongError('fldnrf', field_key);
        }
        var element2_arr = [];
        for (var _i = 0, _a = relation_collection.array(); _i < _a.length; _i++) {
            var element2 = _a[_i];
            if (Util_1.Util.includes(selector_value_arr, element.selector())) {
                element2_arr.push(element2);
            }
        }
        return element2_arr;
    }
})(HasMany = exports.HasMany || (exports.HasMany = {}));


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Util_1 = __webpack_require__(0);
var ElementHelper;
(function (ElementHelper) {
    function toData(element, full_duplicate) {
        var collection = element.collection();
        var scheme = collection.scheme();
        var o = {};
        var object = scheme.configuration().collections[collection.name].fields;
        for (var field_key in object) {
            var field_settings = object[field_key];
            if (field_settings.no_send || field_settings.embedded_collection || field_settings.embedded_element) {
                continue;
            }
            var field_value = element.fields[field_key];
            if (full_duplicate && (typeof field_value === 'object')) {
                o[field_key] = Util_1.Util.copyJSON(field_value);
            }
            else {
                o[field_key] = field_value;
            }
        }
        return o;
    }
    ElementHelper.toData = toData;
})(ElementHelper = exports.ElementHelper || (exports.ElementHelper = {}));


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Scheme_1 = __webpack_require__(20);
var Errors_1 = __webpack_require__(1);
var Util_1 = __webpack_require__(0);
var Ajax_1 = __webpack_require__(3);
var schemes = {};
var Elpong;
(function (Elpong) {
    function add(scheme_config) {
        var scheme = new Scheme_1.Scheme(scheme_config);
        return schemes[scheme.name] = scheme;
    }
    Elpong.add = add;
    function get(name) {
        var scheme;
        if (scheme = schemes[name]) {
            return scheme;
        }
        throw new Errors_1.ElpongError('schmnf', name); // Scheme not found
    }
    Elpong.get = get;
    function load() {
        var scheme_tags = document.querySelectorAll('meta[name=elpong-scheme]');
        if (!scheme_tags.length && !Object.keys(schemes).length) {
            throw new Errors_1.ElpongError('elpgns');
        }
        for (var _i = 0, _a = Util_1.Util.arrayFromHTML(scheme_tags); _i < _a.length; _i++) {
            var scheme_tag = _a[_i];
            Elpong.add(JSON.parse(scheme_tag.content));
        }
        // TODO: load preloaded elements
    }
    Elpong.load = load;
    function setAjax(fn) {
        Ajax_1.Ajax.setAjaxFunction(fn);
    }
    Elpong.setAjax = setAjax;
})(Elpong = exports.Elpong || (exports.Elpong = {}));


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Helpers_1 = __webpack_require__(7);
var Element_1 = __webpack_require__(4);
var Util_1 = __webpack_require__(0);
var Actions_1 = __webpack_require__(13);
var Collection = (function () {
    function Collection(scheme, name) {
        var _this = this;
        this._scheme = scheme;
        this.name = name;
        this.elements = {};
        this.new_elements = [];
        this.default_pre_element = {};
        var config = Helpers_1.CollectionHelper.getConfiguration(this);
        for (var field_key in config.fields) {
            var field_config = config.fields[field_key];
            if (field_config.default) {
                this.default_pre_element[field_key] = field_config.default;
            }
        }
        // for collection_action_name, collection_action_settings of settings.collection_actions
        //   @actions[HP.Util.camelize(collection_action_name)] = ->
        //     # collection_action_options = {method: collection_action_settings.method.toUpperCase(), }
        //     # new_options = HP.Util.merge(HP.Util.merge({method: 'GET'}, {meth}), options)
        //     # HPP.http_function(new_options)
        this.actions = {
            getAll: function (action_options) {
                return Actions_1.Actions.executeGetAll(_this, action_options);
            },
            getOne: function (selector_value, action_options) {
                return Actions_1.Actions.executeGetOne(_this, selector_value, action_options);
            }
        };
        Util_1.Util.forEach(config.collection_actions, function (action_config, action_name) {
            _this.actions[Util_1.Util.camelize(action_name)] = function (action_options) {
                return Actions_1.Actions.executeCustom(_this, action_name, action_config, action_options);
            };
        });
    }
    Collection.prototype.scheme = function () {
        return this._scheme;
    };
    Collection.prototype.load = function () {
        var _this = this;
        var collection_tags = document.querySelectorAll("meta[name=elpong-collection][collection='" + this.name + "'][scheme='" + this.scheme().name + "']");
        var element_tags = document.querySelectorAll("meta[name=elpong-element][collection='" + this.name + "'][scheme='" + this.scheme().name + "']");
        for (var _i = 0, _a = Util_1.Util.arrayFromHTML(collection_tags); _i < _a.length; _i++) {
            var collection_tag = _a[_i];
            for (var _b = 0, _c = JSON.parse(collection_tag.content); _b < _c.length; _b++) {
                var pre_element = _c[_b];
                this.buildOrMerge(pre_element);
            }
        }
        return Util_1.Util.arrayFromHTML(element_tags).map(function (element_tag) {
            return _this.buildOrMerge(JSON.parse(element_tag.content));
        });
    };
    Collection.prototype.configuration = function () {
        return Helpers_1.CollectionHelper.getConfiguration(this);
    };
    // Get an array of all elements
    //
    // @return {Element[]} Array of elements
    Collection.prototype.array = function (options) {
        if (!options) {
            options = { no_new: false };
        }
        var arr = options.no_new ? [] : this.new_elements;
        return arr.concat(Util_1.Util.values(this.elements));
    };
    Collection.prototype.find = function (selector_value) {
        return this.elements[selector_value] || null;
    };
    Collection.prototype.findBy = function (fields_key_value_map, find_options) {
        if (!find_options) {
            find_options = {};
        }
        var is_correct;
        var arr = this.array(find_options);
        var response_arr = [];
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var element = arr_1[_i];
            is_correct = true;
            for (var field_key in fields_key_value_map) {
                var field_value = fields_key_value_map[field_key];
                if (element.fields[field_key] !== field_value) {
                    is_correct = false;
                    break;
                }
            }
            if (is_correct) {
                if (find_options.multiple) {
                    response_arr.push(element);
                }
                else {
                    return element;
                }
            }
        }
        if (find_options.multiple) {
            return response_arr;
        }
        else {
            return null;
        }
    };
    Collection.prototype.build = function (pre_element) {
        if (pre_element == null) {
            pre_element = this.default_pre_element;
        }
        var el = new Element_1.Element(this, pre_element);
        Helpers_1.CollectionHelper.addElement(this, el);
        return el;
    };
    Collection.prototype.buildOrMerge = function (pre_element) {
        var sv;
        if (sv = pre_element[this.scheme().configuration().selector]) {
            var el = void 0;
            if (el = this.find(sv)) {
                return el.merge(pre_element);
            }
            else {
                return this.build(pre_element);
            }
        }
        else {
            return this.build(pre_element);
        }
    };
    return Collection;
}());
exports.Collection = Collection;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Errors_1 = __webpack_require__(1);
if (typeof DEBUG === 'undefined') {
    var DEBUG = true;
}
var SchemeConfiguration = (function () {
    function SchemeConfiguration(preconf) {
        this.name = preconf.name;
        if (DEBUG && !this.name) {
            throw new Errors_1.ElpongError('confnn');
        }
        this.selector = preconf.selector;
        if (DEBUG && !this.selector) {
            throw new Errors_1.ElpongError('confns', preconf.name);
        }
        this.collections = {};
        for (var collection_name in preconf.collections) {
            var collection_preconf = preconf.collections[collection_name];
            var collection_configuration = this.collections[collection_name] = {
                singular: collection_preconf.singular || collection_name.slice(0, -1)
            };
            var props = ['fields', 'relations', 'actions', 'collection_actions'];
            var relation_types = ['has_many', 'has_one', 'belongs_to'];
            for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
                var prop = props_1[_i];
                collection_configuration[prop] = collection_preconf[prop] || {};
            }
            var relations_conf = void 0;
            if (relations_conf = collection_preconf.relations) {
                for (var _a = 0, relation_types_1 = relation_types; _a < relation_types_1.length; _a++) {
                    var relation_type = relation_types_1[_a];
                    relations_conf[relation_type] = collection_preconf.relations[relation_type] || {};
                }
            }
        }
    }
    return SchemeConfiguration;
}());
exports.SchemeConfiguration = SchemeConfiguration;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Ajax_1 = __webpack_require__(3);
var UrlHelper_1 = __webpack_require__(6);
var Actions;
(function (Actions) {
    function executeGetAll(collection, action_options) {
        if (!action_options) {
            action_options = {};
        }
        var data = action_options.data;
        var promise = Ajax_1.Ajax.executeRequest(UrlHelper_1.UrlHelper.createForCollection('GET', collection, action_options), 'GET', data, action_options.headers);
        promise.then(function (response) {
            response.data.map(function (pre_element) {
                collection.buildOrMerge(pre_element);
            });
        });
        return promise;
    }
    Actions.executeGetAll = executeGetAll;
    function executeGetOne(collection, selector_value, action_options) {
        if (!action_options) {
            action_options = {};
        }
        var data = action_options.data;
        var promise = Ajax_1.Ajax.executeRequest(UrlHelper_1.UrlHelper.createForCollection('GET', collection, { suffix: selector_value }), 'GET', data, action_options.headers);
        promise.then(function (response) {
            if (response.data) {
                return collection.buildOrMerge(response.data);
            }
        });
        return promise;
    }
    Actions.executeGetOne = executeGetOne;
    function executeCustom(collection, action_name, action_config, action_options) {
        if (!action_options) {
            action_options = {};
        }
        var data = action_options.data;
        var method = action_config.method.toUpperCase();
        return Ajax_1.Ajax.executeRequest(UrlHelper_1.UrlHelper.createForCollection('GET', collection, { suffix: action_config.path || action_name }), method, data, action_options.headers);
    }
    Actions.executeCustom = executeCustom;
})(Actions = exports.Actions || (exports.Actions = {}));


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Ajax_1 = __webpack_require__(3);
var Util_1 = __webpack_require__(0);
var Errors_1 = __webpack_require__(1);
var ElementHelper_1 = __webpack_require__(9);
var UrlHelper_1 = __webpack_require__(6);
var Actions;
(function (Actions) {
    function setup(element, actions_config) {
        var _loop_1 = function (method) {
            element.actions[method] = function (action_options) {
                return execute(element, method.toUpperCase(), action_options);
            };
        };
        for (var _i = 0, _a = ['get', 'post', 'put', 'delete']; _i < _a.length; _i++) {
            var method = _a[_i];
            _loop_1(method);
        }
        Util_1.Util.forEach(actions_config, function (action_config, action_name) {
            element.actions[Util_1.Util.camelize(action_name)] = function (action_options) {
                if (element.isNew() && !action_config.no_selector) {
                    throw new Errors_1.ElpongError('elenew');
                }
                return executeCustom(element, action_name, action_config, action_options);
            };
        });
    }
    Actions.setup = setup;
    function execute(element, method, action_options) {
        if (!action_options) {
            action_options = {};
        }
        element.snapshots.make("before_" + method.toLowerCase());
        var data;
        if (data = action_options.data) {
            data = action_options.data;
        }
        else if (method !== 'GET') {
            data = ElementHelper_1.ElementHelper.toData(element);
        }
        if (method === 'POST') {
            if (!element.isNew()) {
                throw new Error('Element is not new');
            }
        }
        else {
            if (element.isNew()) {
                throw new Error('Element is new');
            }
        }
        var promise = Ajax_1.Ajax.executeRequest(UrlHelper_1.UrlHelper.createForElement(method, {}, element, action_options, method === 'POST'), method, data, action_options.headers);
        promise.then(function (response) {
            if (response.data) {
                element.merge(response.data);
            }
            element.snapshots.make("after_" + method.toLowerCase());
            var collection = element.collection();
            if (Util_1.Util.includes(collection.new_elements, element)) {
                Util_1.Util.removeFromArray(collection.new_elements, element);
                collection.elements[element.selector()] = element;
            }
        });
        return promise;
    }
    Actions.execute = execute;
    function executeCustom(element, action_name, action_config, action_options) {
        if (!action_options) {
            action_options = {};
        }
        var method = action_config.method.toUpperCase();
        element.snapshots.make("before_" + action_name);
        var data;
        if (action_options.data) {
            data = action_options.data;
        }
        else if (!action_config.no_data) {
            data = ElementHelper_1.ElementHelper.toData(element);
        }
        var promise = Ajax_1.Ajax.executeRequest(UrlHelper_1.UrlHelper.createForElement(action_name, action_config, element, action_options), method, data, action_options.headers);
        promise.then(function (response) {
            var selector_value;
            if (!action_config.returns_other) {
                if (response.data) {
                    element.merge(response.data);
                }
                element.snapshots.make("after_" + method.toLowerCase());
            }
            var collection = element.collection();
            if ((selector_value = element.selector()) && Util_1.Util.includes(collection.new_elements, element)) {
                Util_1.Util.removeFromArray(collection.new_elements, element);
                return collection.elements[selector_value] = element;
            }
        });
        return promise;
    }
    Actions.executeCustom = executeCustom;
    ;
})(Actions = exports.Actions || (exports.Actions = {}));


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Element_1 = __webpack_require__(4);
var Util_1 = __webpack_require__(0);
var SchemeHelper_1 = __webpack_require__(5);
var CollectionHelper_1 = __webpack_require__(2);
var Fields;
(function (Fields) {
    function setup(element, fields_config_map, pre_element) {
        Util_1.Util.forEach(fields_config_map, function (field_config, field_key) {
            if (field_config.embedded_element) {
                handleEmbeddedElement(element, pre_element, field_key, field_config);
            }
            else if (field_config.embedded_collection) {
                handleEmbeddedCollection(element, pre_element, field_key, field_config);
            }
            else {
                if (!pre_element.hasOwnProperty(field_key)) {
                    return;
                }
                var field_value = pre_element[field_key];
                element.fields[field_key] = field_value;
            }
        });
    }
    Fields.setup = setup;
    function handleEmbeddedElement(element, pre_element, field_key, field_config) {
        var embedded_element_collection;
        var embedded_pre_element = pre_element[field_key];
        if (!embedded_pre_element) {
            return;
        }
        var collection = element.collection();
        var scheme = collection.scheme();
        if (field_config.collection) {
            embedded_element_collection = scheme.select(field_config.collection);
        }
        else {
            embedded_element_collection = SchemeHelper_1.SchemeHelper.getCollectionBySingularName(scheme, field_key);
        }
        var embedded_element = embedded_element_collection.buildOrMerge(embedded_pre_element);
        var associated_field_key = field_config.field || field_key + "_" + scheme.configuration().selector;
        element.fields[associated_field_key] = embedded_element.selector();
    }
    Fields.handleEmbeddedElement = handleEmbeddedElement;
    function handleEmbeddedCollection(element, pre_element, field_key, field_config) {
        var embedded_pre_collection;
        if (!(embedded_pre_collection = pre_element[field_key])) {
            return;
        }
        var collection = element.collection();
        var scheme = collection.scheme();
        var embedded_element_collection = scheme.select(field_key || field_config.collection);
        Util_1.Util.forEach(embedded_pre_collection, function (embedded_pre_element) {
            var embedded_element = new Element_1.Element(embedded_element_collection, embedded_pre_element);
            CollectionHelper_1.CollectionHelper.addElement(embedded_element_collection, embedded_element);
        });
    }
    Fields.handleEmbeddedCollection = handleEmbeddedCollection;
})(Fields = exports.Fields || (exports.Fields = {}));


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Util_1 = __webpack_require__(0);
var HasMany_1 = __webpack_require__(8);
var HasOne_1 = __webpack_require__(18);
var BelongsTo_1 = __webpack_require__(17);
var Relations;
(function (Relations) {
    function setup(element, relations_config_maps) {
        Util_1.Util.forEach(relations_config_maps.has_many, function (relation_config, relation_collection_name) {
            HasMany_1.HasMany.setup(element, relation_collection_name, relation_config);
        });
        Util_1.Util.forEach(relations_config_maps.has_one, function (relation_config, relation_collection_singular_name) {
            HasOne_1.HasOne.setup(element, relation_collection_singular_name, relation_config);
        });
        Util_1.Util.forEach(relations_config_maps.belongs_to, function (relation_config, relation_collection_singular_name) {
            BelongsTo_1.BelongsTo.setup(element, relation_collection_singular_name, relation_config);
        });
    }
    Relations.setup = setup;
})(Relations = exports.Relations || (exports.Relations = {}));


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Element_1 = __webpack_require__(4);
var Util_1 = __webpack_require__(0);
var SchemeHelper_1 = __webpack_require__(5);
var BelongsTo;
(function (BelongsTo) {
    function setup(element, relation_collection_singular_name, relation_config) {
        var field_key;
        var relation_collection;
        var collection = element.collection();
        // TODO should be reference
        if (relation_config.polymorphic) {
            var collection_field_key_1 = relation_config.collection_field || relation_collection_singular_name + "_collection";
            field_key = relation_config.field;
            element.relations[Util_1.Util.camelize(relation_collection_singular_name)] = function () {
                return getPolymorphicBelongsToElement(element, field_key, collection_field_key_1, relation_collection_singular_name);
            };
        }
        else {
            var scheme = collection.scheme();
            if (relation_config.collection) {
                relation_collection = collection.scheme().select(relation_config.collection);
            }
            else {
                relation_collection = SchemeHelper_1.SchemeHelper.getCollectionBySingularName(scheme, relation_collection_singular_name);
            }
            field_key = relation_config.field || relation_collection_singular_name + "_" + scheme.configuration().selector;
            element.relations[Util_1.Util.camelize(relation_collection_singular_name)] = function () {
                return getBelongsToElement(element, relation_collection, field_key);
            };
        }
    }
    BelongsTo.setup = setup;
    var getBelongsToElement = function (element, relation_collection, field_key) {
        var selector_value = element.fields[field_key];
        if (Element_1.isSelectorValue(selector_value)) {
            return relation_collection.find(selector_value) || null;
        }
        else {
            return undefined;
        }
    };
    // Gets the polymorphic belongs_to element
    //
    // @param {Element} hpe              The element to which the other element belongs
    // @param {string} field_key                The foreign key, e.g. parent_id.
    // @param {string} collection_field_key     The field name of the other collection, required, e.g. parent_collection.
    // @param {string} collection_selector_field The selector name of the other collection, if it was specified, e.g. id. (Will not be looked at if field_key is present)
    // @param {string} collection_singular_name  e.g. parent
    //
    // @return {Element|null}            The related element.
    var getPolymorphicBelongsToElement = function (element, field_key, collection_field_key, collection_singular_name) {
        var relation_collection_name = element.fields[collection_field_key];
        var relation_collection = element.collection().scheme().select(relation_collection_name);
        if (!field_key) {
            var selector_key = element.collection().scheme().configuration().selector;
            field_key = collection_singular_name + "_" + selector_key;
        }
        var selector_value = element.fields[field_key];
        return relation_collection.find(selector_value) || null;
    };
})(BelongsTo = exports.BelongsTo || (exports.BelongsTo = {}));


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var HasMany_1 = __webpack_require__(8);
var SchemeHelper_1 = __webpack_require__(5);
var Util_1 = __webpack_require__(0);
var HasOne;
(function (HasOne) {
    function setup(element, relation_collection_singular_name, relation_config) {
        var relation_collection;
        var collection = element.collection();
        var collection_config = element.collection().configuration();
        var scheme = collection.scheme();
        if (relation_config.collection) {
            relation_collection = scheme.select(relation_config.collection);
        }
        else {
            relation_collection = SchemeHelper_1.SchemeHelper.getCollectionBySingularName(scheme, relation_collection_singular_name);
        }
        return element.relations[Util_1.Util.camelize(relation_collection_singular_name)] = function () {
            return HasMany_1.HasMany.getHasManyRelationFunction(element, collection, relation_config, relation_collection, true)()[0];
        };
    }
    HasOne.setup = setup;
})(HasOne = exports.HasOne || (exports.HasOne = {}));


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Util_1 = __webpack_require__(0);
var Snapshot_1 = __webpack_require__(21);
var Errors_1 = __webpack_require__(1);
var Snapshots;
(function (Snapshots) {
    function setup(element) {
        var snapshots = element.snapshots;
        snapshots.list = [];
        snapshots.make = function (tag) {
            return new Snapshot_1.Snapshot(element, tag);
        };
        snapshots.lastPersisted = function () {
            if (element.isNew()) {
                return;
            }
            for (var i = snapshots.list.length - 1; i >= 0; i--) {
                var snapshot = snapshots.list[i];
                if (Util_1.Util.includes(['after_post', 'after_put', 'after_get', 'creation'], snapshot.tag)) {
                    return snapshot;
                }
            }
            // Util.reverseForEach(element.snapshots.list, function(k: string, v: Snapshot) {
            //   if ((v.tag === 'after_post') || (v.tag === 'after_put') || (v.tag === 'after_get') || (v.tag === 'creation')) {
            //     last_persisted_snapshot = v;
            //     return Util.BREAK;
            //   }
            // });
            // return last_persisted_snapshot;
        };
        snapshots.lastWithTag = function (tag) {
            var last_snapshot_with_tag;
            var list = element.snapshots.list;
            if (Util_1.Util.isRegExp(tag)) {
                for (var i = list.length - 1; i >= 0; i--) {
                    var snapshot = list[i];
                    if (snapshot.tag) {
                        if (tag.test(snapshot.tag)) {
                            return snapshot;
                        }
                    }
                }
            }
            else {
                for (var i = list.length - 1; i >= 0; i--) {
                    var snapshot = list[i];
                    if (tag === snapshot.tag) {
                        return snapshot;
                    }
                }
            }
            return last_snapshot_with_tag;
        };
        snapshots.last = function () {
            var list = element.snapshots.list;
            return list[list.length - 1];
        };
        snapshots.undo = function (id) {
            if (id == null) {
                id = 0;
            }
            if (Util_1.Util.isInteger(id)) {
                var list = element.snapshots.list;
                if (id < 0 || id > list.length) {
                    throw new Errors_1.ElpongError('elesti', "" + id);
                }
                else {
                    var snapshot = list[element.snapshots.current_index - id];
                    snapshot.revert();
                }
            }
            else {
                var snapshot = void 0;
                if (snapshot = snapshots.lastWithTag(id)) {
                    snapshot.revert();
                }
                else {
                    throw new Errors_1.ElpongError('elesnf', "" + id);
                }
            }
            return element;
        };
        snapshots.isPersisted = function () {
            var snapshot = snapshots.lastPersisted();
            if (!snapshot) {
                return false;
            }
            return Util_1.Util.equalsJSON(element.fields, snapshot.data);
        };
    }
    Snapshots.setup = setup;
})(Snapshots = exports.Snapshots || (exports.Snapshots = {}));
// import Element from '../../Element';
//
// const setupSnapshots = (element: Element) => {
//   element.snapshots = {
//     getLastPersisted() {
//       if (element.isNew()) { return null; }
//       let last_persisted_snapshot = null;
//       Util.reverseForEach(hpe.snapshots.list, function(k, v) {
//         if ((v.tag === 'after_post') || (v.tag === 'after_put') || (v.tag === 'after_get') || (v.tag === 'creation')) {
//           last_persisted_snapshot = v;
//           return Util.BREAK;
//         }
//       });
//
//       return last_persisted_snapshot;
//     },
//
//     getLastWithTag(tag) {
//       let last_snapshot_with_tag = null;
//       if (HP.Util.isRegex(tag)) {
//         HP.Util.reverseForEach(hpe.snapshots.list, function(k, v) {
//           if (tag.test(v.tag)) {
//             last_snapshot_with_tag = v;
//             return HP.Util.BREAK;
//           }
//         });
//       } else {
//         HP.Util.reverseForEach(hpe.snapshots.list, function(k, v) {
//           if (v.tag === tag) {
//             last_snapshot_with_tag = v;
//             return HP.Util.BREAK;
//           }
//         });
//       }
//       return last_snapshot_with_tag;
//     },
//
//     getLast() {
//       let last_snapshot = null;
//       HP.Util.reverseForEach(hpe.snapshots.list, function(k, v) {
//         last_snapshot = v;
//         return HP.Util.BREAK;
//       });
//       return last_snapshot;
//     },
//
//     make(tag) {
//       let date = Date.now();
//       let list = hpe.snapshots.list =
//         HPP.Helpers.Snapshot.removeAfter(hpe.last_snapshot_time, hpe.snapshots.list);
//       if (list[date]) {
//         return hpe.snapshots.make(tag); // loop until 1ms has passed
//       }
//       let s = list[date] = {
//         tag,
//         time: date,
//         data: HPP.Helpers.Element.getFields(hpe),
//         revert() {
//           return hpe.undo(date);
//         }
//       };
//       hpe.last_snapshot_time = date;
//       return s;
//     },
//
//     list: {}
//   };
// }


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Collection_1 = __webpack_require__(11);
var Configuration_1 = __webpack_require__(12);
var Errors_1 = __webpack_require__(1);
var Helpers_1 = __webpack_require__(7);
function isSchemeConfiguration(sc) {
    return sc instanceof Configuration_1.SchemeConfiguration;
}
var Scheme = (function () {
    function Scheme(sc) {
        var _sc;
        if (!isSchemeConfiguration(sc)) {
            _sc = new Configuration_1.SchemeConfiguration(sc);
        }
        else {
            _sc = sc;
        }
        this._configuration = _sc;
        this.name = _sc.name;
        this._collections = {};
        // Create collections
        for (var collection_name in _sc.collections) {
            var collection_settings = _sc.collections[collection_name];
            this._collections[collection_name] = new Collection_1.Collection(this, collection_name);
        }
    }
    Scheme.prototype.configuration = function () {
        return this._configuration;
    };
    Scheme.prototype.select = function (name) {
        var collection;
        if (collection = this._collections[name]) {
            return collection;
        }
        else {
            throw new Errors_1.ElpongError('collnf', name);
        }
    };
    Scheme.prototype.setApiUrl = function (url) {
        var api_url = this.api_url = Helpers_1.UrlHelper.trimSlashes(url);
        if (!Helpers_1.UrlHelper.isFqdn(api_url)) {
            return this.api_url = "/" + api_url;
        }
    };
    Scheme.prototype.getApiUrl = function () {
        return this.api_url;
    };
    return Scheme;
}());
exports.Scheme = Scheme;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ElementHelper_1 = __webpack_require__(9);
var Snapshot = (function () {
    function Snapshot(element, tag) {
        this.element = element;
        this.tag = tag;
        this.data = ElementHelper_1.ElementHelper.toData(element, true);
        this.undone = false;
        this.time = Date.now();
        this.index = element.snapshots.list.length;
        element.snapshots.list.push(this);
        element.snapshots.current_index = this.index;
    }
    Snapshot.prototype.revert = function () {
        var list = this.element.snapshots.list;
        this.element.merge(this.data);
        this.element.snapshots.current_index = this.index;
        this.undone = false;
        for (var i = this.index + 1, l = list.length; i < l; i++) {
            list[i].undone = true;
        }
    };
    return Snapshot;
}());
exports.Snapshot = Snapshot;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Elpong_1 = __webpack_require__(10);
module.exports = Elpong_1.Elpong;


/***/ })
/******/ ]);
});
//# sourceMappingURL=elpong.js.map