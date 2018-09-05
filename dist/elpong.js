(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("elpong", [], factory);
	else if(typeof exports === 'object')
		exports["elpong"] = factory();
	else
		root["elpong"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _a;
/* tslint:disable */
if (typeof DEBUG === 'undefined') {
    var DEBUG = true;
}
var errorTextMap;
if (DEBUG) {
    errorTextMap = (_a = {},
        _a[0 /* SCHNFO */] = 'Scheme not found',
        _a[1 /* COLNFO */] = 'Collection not found',
        _a[2 /* COLNFS */] = 'Collection not found by singular name',
        _a[3 /* COLEXI */] = 'Collection with name already exists in scheme',
        _a[4 /* ELPNST */] = 'No scheme tags found',
        _a[5 /* ELPNCE */] = 'No collection or element tags found',
        _a[6 /* ELPNDC */] = 'No document',
        _a[7 /* CNFNSL */] = 'Configuration has no selector',
        _a[8 /* CNFNNA */] = 'Configuration has no name',
        _a[9 /* ELENEW */] = 'Element is new',
        _a[10 /* ELENNW */] = 'Element is not new',
        _a[11 /* ELESNA */] = 'Element has a selector value but is in new_elements array',
        _a[2 /* COLNFS */] = 'Element has no selector value but is in elements object',
        _a[13 /* APINUR */] = 'Api url has not yet been set',
        _a[14 /* FLDNSA */] = 'Field should be an array of selectors',
        _a[15 /* ELESCH */] = 'Element selector changed',
        _a[16 /* ELESNF */] = 'Snapshot not found',
        _a[17 /* ELESTI */] = 'Invalid snapshot identifier: must be number <= list.length, string or RegExp',
        _a[18 /* ELEAFW */] = 'Pre element has an reference field that does not match the embedded element selector',
        _a[19 /* ELESNM */] = 'Selector is not matching get one request selector',
        _a[20 /* ELENOS */] = 'No selector value given in getOne action',
        _a[21 /* AJXHCT */] = 'Content-Type header not set to application/json',
        _a[22 /* AJXGDA */] = 'GET request can\'t have data. Use params',
        _a);
}
var ElpongError = /** @class */ (function (_super) {
    __extends(ElpongError, _super);
    function ElpongError(message, argument) {
        var _this = this;
        var actualMessage = errorTextMap[message] ? errorTextMap[message] : "Error code " + message;
        if (argument) {
            _this = _super.call(this, actualMessage + ": " + argument) || this;
        }
        else {
            _this = _super.call(this, actualMessage) || this;
        }
        return _this;
    }
    return ElpongError;
}(Error));
exports.ElpongError = ElpongError;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// BREAK: new Object(),
// kebab: (string: string): string => {
//   return string.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replace(/(é|ë)/g, 'e').split(' ').join('-');
// },
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
exports.capitalize = capitalize;
function camelize(string) {
    return string.replace(/_/g, ' ').replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
        if (index === 0) {
            return letter.toLowerCase();
        }
        else {
            return letter.toUpperCase();
        }
    }).replace(/\s+/g, '');
}
exports.camelize = camelize;
// arrayDiff: (array1: any[], array2: any[]): any[] => {
//   return array1.filter(i => array2.indexOf(i) < 0);
// },
function removeFromArray(array, element) {
    var i = array.indexOf(element);
    if (i === -1) {
        return false;
    }
    else {
        array.splice(i, 1);
        return true;
    }
}
exports.removeFromArray = removeFromArray;
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
function isInteger(value) {
    return value === parseInt(value, 10);
}
exports.isInteger = isInteger;
function isNumber(value) {
    return isFinite(value) && !isNaN(parseFloat(value));
}
exports.isNumber = isNumber;
function isString(value) {
    return typeof value === 'string';
}
exports.isString = isString;
function isRegExp(value) {
    return Object.prototype.toString.call(value) === '[object RegExp]';
}
exports.isRegExp = isRegExp;
function forEach(o, fn) {
    for (var k in o) {
        if (!o.hasOwnProperty(k))
            continue;
        var v = o[k];
        fn(v, k);
        // if (f(v, k) === Util.BREAK) {
        //   break;
        // }
    }
}
exports.forEach = forEach;
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
function endsWith(string, search) {
    if (string.endsWith) {
        return string.endsWith(search);
    }
    else {
        return string.substr(-search.length) === search;
    }
}
exports.endsWith = endsWith;
function startsWith(string, search) {
    if (string.startsWith) {
        return string.startsWith(search);
    }
    else {
        return string.substr(0, search.length) === search;
    }
}
exports.startsWith = startsWith;
function arrayFromHTML(nodeList) {
    if (Array.from) {
        return Array.from(nodeList);
    }
    else {
        return [].slice.call(nodeList);
    }
}
exports.arrayFromHTML = arrayFromHTML;
function values(obj) {
    var vals = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key) && obj.propertyIsEnumerable(key)) {
            vals.push(obj[key]);
        }
    }
    return vals;
}
exports.values = values;
function includes(a, b) {
    return a.indexOf(b) > -1;
}
exports.includes = includes;
function equalsJSON(a, b) {
    for (var k in a) {
        var v1 = a[k];
        var v2 = b[k];
        if (typeof v1 === 'object') {
            if (!equalsJSON(v1, v2)) {
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
}
exports.equalsJSON = equalsJSON;
function copyJSON(o) {
    return JSON.parse(JSON.stringify(o));
}
exports.copyJSON = copyJSON;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Errors_1 = __webpack_require__(0);
var Actions_1 = __webpack_require__(17);
var Fields_1 = __webpack_require__(18);
var EmbeddedCollection_1 = __webpack_require__(11);
var EmbeddedElement_1 = __webpack_require__(12);
var Relations_1 = __webpack_require__(19);
var Snapshots_1 = __webpack_require__(22);
var Util_1 = __webpack_require__(1);
function isSelectorValue(v) {
    return (!!v || v === 0 || v === '') && (typeof v === 'string' || typeof v === 'number');
}
exports.isSelectorValue = isSelectorValue;
var Element = /** @class */ (function () {
    /* tslint:enable:no-object-literal-type-assertion */
    function Element(collection, preElement) {
        this.fields = {};
        this.relations = {};
        /* tslint:disable:no-object-literal-type-assertion */
        this.actions = {};
        this.snapshots = {};
        this._collection = collection;
        var collectionConfig = collection.configuration();
        Fields_1.setup(this, collectionConfig.fields, preElement);
        Relations_1.setup(this, collectionConfig.relations);
        Actions_1.setup(this, collectionConfig.actions);
        Snapshots_1.setup(this);
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
        var selectorValue = this.selector();
        if (selectorValue !== undefined) {
            return this.actions.delete().then(function () {
                var elements = _this.collection().elements;
                elements.delete(selectorValue);
            });
        }
        else {
            Util_1.removeFromArray(this.collection().newElements, this);
            return {
                then: function (fn) { return fn(); },
                catch: function () { return; }
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
        if (Util_1.includes(this.collection().newElements, this)) {
            if (this.selector()) {
                throw new Errors_1.ElpongError(11 /* ELESNA */);
            }
            else {
                return true;
            }
        }
        else {
            if (!this.selector()) {
                throw new Errors_1.ElpongError(12 /* ELESNE */);
            }
            else {
                return false;
            }
        }
    };
    Element.prototype.merge = function (preElement) {
        var _this = this;
        var collectionConfig = this.collection().configuration();
        var selectorKey = this.collection().scheme().configuration().selector;
        Util_1.forEach(collectionConfig.fields, function (fieldConfig, fieldKey) {
            var fieldValue = preElement[fieldKey];
            if (fieldValue) {
                if (fieldConfig.embedded_element) {
                    EmbeddedElement_1.handle(_this, preElement, fieldKey, fieldConfig);
                }
                else if (fieldConfig.embedded_collection) {
                    EmbeddedCollection_1.handle(_this, preElement, fieldKey, fieldConfig);
                }
                else if (fieldKey === selectorKey) {
                    var selectorValue = _this.fields[fieldKey];
                    if ((selectorValue !== fieldValue) && isSelectorValue(selectorValue) && isSelectorValue(fieldValue)) {
                        throw new Errors_1.ElpongError(15 /* ELESCH */, selectorValue + " -> " + fieldValue);
                    }
                    _this.fields[fieldKey] = fieldValue;
                }
                else {
                    _this.fields[fieldKey] = fieldValue;
                }
            }
        });
        return this;
    };
    return Element;
}());
exports.Element = Element;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getConfiguration(collection) {
    return collection.scheme().configuration().collections[collection.name];
}
exports.getConfiguration = getConfiguration;
function getSingularName(collection) {
    return getConfiguration(collection).singular; // Last char cut in Configuration
}
exports.getSingularName = getSingularName;
function addElement(collection, element) {
    var selectorValue = element.selector();
    if (selectorValue !== undefined) {
        collection.elements.set(selectorValue, element);
    }
    else {
        collection.newElements.push(element);
    }
}
exports.addElement = addElement;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference types="jquery"/>
/// <reference types="angular"/>
Object.defineProperty(exports, "__esModule", { value: true });
var Errors_1 = __webpack_require__(0);
var Util_1 = __webpack_require__(1);
var ajaxFunction;
function executeRequest(url, method, data, headers) {
    if (!headers) {
        headers = {};
    }
    headers.Accept = headers['Content-Type'] = 'application/json';
    var serializedData = JSON.stringify(data === undefined ? {} : data);
    var options = {
        body: serializedData,
        data: serializedData,
        dataType: 'json',
        headers: headers,
        method: method,
        responseType: 'json',
        type: method,
        url: url
    };
    return ajaxFunction(options.url, options);
}
exports.executeRequest = executeRequest;
// Set the http function used for requests
// The function should accept one object with keys
// method, url, params, headers
// and return a promise-like object
// with then and catch
//
// @note Like $http or jQuery.ajax or HttpClient or fetch
// @param {Function} fn               The function.
// @param {adapterType} [adapterType] The type of the function.
function setAjaxFunction(fn, adapterType) {
    var type = convertAjaxAdapterTypeStringToType(adapterType);
    switch (type) {
        case 3 /* JQuery */:
            if (window.jQuery) {
                ajaxFunction = function (url, instruction) {
                    var deferred = jQuery.Deferred();
                    var ajax = fn(url, instruction);
                    ajax.then(function (data, status, jqxhr) { return deferred.resolve({ data: data, status: jqxhr.statusCode().status, headers: jqxhr.getAllResponseHeaders() }); });
                    ajax.catch(function (data, status, jqxhr) { return deferred.reject({ data: data, status: jqxhr.statusCode().status, headers: jqxhr.getAllResponseHeaders() }); });
                    // Convert to Promise, as Typescript users are probably not using jQuery
                    // and if so, they won't have a lot of trouble with the differences.
                    return deferred.promise();
                };
            }
            break;
        case 1 /* Fetch */:
            ajaxFunction = function (url, instruction) {
                return new Promise(function (resolve, reject) {
                    // Request with GET/HEAD method cannot have body
                    instruction.body = (instruction.method === 'GET') ? undefined : instruction.data;
                    var httpPromise = fn(url, instruction);
                    httpPromise.then(function (response) {
                        if (response.status === 204) {
                            resolve(response);
                        }
                        else {
                            var contentType = response.headers.get('content-type');
                            if (!contentType || contentType.indexOf('json') < 0) {
                                throw new Errors_1.ElpongError(21 /* AJXHCT */);
                            }
                            var jsonPromise = response.json();
                            jsonPromise.then(function (json) {
                                response.data = json;
                                resolve(response);
                            });
                            jsonPromise.catch(reject);
                        }
                    });
                    httpPromise.catch(reject);
                });
            };
            break;
        case 2 /* Angular */:
            ajaxFunction = function (url, instruction) {
                return new Promise(function (resolve, reject) {
                    instruction.responseType = undefined;
                    fn.request.bind(fn)(url, instruction).subscribe(function (response) {
                        if (response.status === 204) {
                            resolve(response);
                        }
                        else {
                            var contentType = response.headers.get('content-type');
                            if (!contentType || contentType.indexOf('json') < 0) {
                                throw new Errors_1.ElpongError(21 /* AJXHCT */);
                            }
                            var json = response.json();
                            response.data = json;
                            resolve(response);
                        }
                    }, function (httpErrorResponse) { reject(httpErrorResponse); });
                });
            };
            break;
        default:
            // Default is AngularJS behavior, a promise that resolves to a response
            // object with the payload in the data field.
            ajaxFunction = function (url, instruction) { return fn(instruction); };
    }
}
exports.setAjaxFunction = setAjaxFunction;
function convertAjaxAdapterTypeStringToType(type) {
    if (Util_1.isInteger(type) || !type) {
        return type || 0;
    }
    else {
        var i = ['angularjs', 'fetch', 'angular', 'jquery'].indexOf(type);
        return i > -1 ? i : 0;
    }
}
exports.convertAjaxAdapterTypeStringToType = convertAjaxAdapterTypeStringToType;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Errors_1 = __webpack_require__(0);
function createForElement(element, urlOptions) {
    var url;
    var collection = element.collection();
    var scheme = collection.scheme();
    var apiUrl = scheme.getApiUrl();
    if (!apiUrl) {
        throw new Errors_1.ElpongError(13 /* APINUR */);
    }
    url = apiUrl + "/" + collection.name;
    if (!urlOptions.noSelector) {
        url = url + "/" + element.selector();
    }
    if (urlOptions.suffix) {
        url = url + "/" + urlOptions.suffix;
    }
    if (urlOptions.params) {
        url = appendParamsToUrl(url, urlOptions.params);
    }
    return url;
}
exports.createForElement = createForElement;
function createForCollection(collection, urlOptions) {
    var apiUrl = collection.scheme().getApiUrl();
    if (!apiUrl) {
        throw new Errors_1.ElpongError(13 /* APINUR */);
    }
    var url = apiUrl + "/" + collection.name; // HPP.Helpers.Url.createForCollection(, hpe, userOptions) # (action_name, element, user_options = {}, suffix)
    if (urlOptions.suffix) {
        url = url + "/" + urlOptions.suffix;
    }
    if (urlOptions.params) {
        url = appendParamsToUrl(url, urlOptions.params);
    }
    return url;
}
exports.createForCollection = createForCollection;
function trimSlashes(s) {
    return s.replace(/^\/|\/$/g, '');
}
exports.trimSlashes = trimSlashes;
function isFqdn(s) {
    return /^https?:\/\//.test(s);
}
exports.isFqdn = isFqdn;
function appendParamsToUrl(url, params) {
    url = url + "?";
    for (var k in params) {
        url = "" + url + k + "=" + encodeURIComponent(params[k]) + "&";
    }
    url = url.slice(0, -1);
    return url;
}
exports.appendParamsToUrl = appendParamsToUrl;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Errors_1 = __webpack_require__(0);
var CollectionHelper_1 = __webpack_require__(3);
function getCollectionBySingularName(scheme, singularName) {
    for (var collectionName in scheme.getCollections()) {
        var collection = scheme.select(collectionName);
        if (CollectionHelper_1.getSingularName(collection) === singularName) {
            return collection;
        }
    }
    throw new Errors_1.ElpongError(2 /* COLNFS */, singularName);
}
exports.getCollectionBySingularName = getCollectionBySingularName;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Ajax_1 = __webpack_require__(4);
var Errors_1 = __webpack_require__(0);
var Scheme_1 = __webpack_require__(8);
var Util_1 = __webpack_require__(1);
var schemes = {};
var autoload = false;
var elpong = {
    add: function (schemeConfig) {
        var scheme = new Scheme_1.Scheme(schemeConfig);
        return schemes[scheme.name] = scheme;
    },
    enableAutoload: function () {
        autoload = true;
        elpong.load(true);
    },
    get: function (name) {
        var scheme = schemes[name];
        if (scheme)
            return scheme;
        throw new Errors_1.ElpongError(0 /* SCHNFO */, name); // Scheme not found
    },
    isAutoloadEnabled: function () {
        return autoload;
    },
    load: function (ignoreEmpty) {
        if (typeof document === 'undefined')
            return;
        var schemeTags = document.querySelectorAll('meta[name=elpong-scheme]');
        if (!ignoreEmpty && !schemeTags.length) {
            throw new Errors_1.ElpongError(4 /* ELPNST */);
        }
        for (var _i = 0, _a = Util_1.arrayFromHTML(schemeTags); _i < _a.length; _i++) {
            var schemeTag = _a[_i];
            var scheme = elpong.add(JSON.parse(schemeTag.content));
        }
    },
    setAjax: function (fn, type) {
        Ajax_1.setAjaxFunction(fn, type);
    },
    tearDown: function () {
        autoload = false;
        schemes = {};
    }
};
exports.elpong = elpong;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Collection_1 = __webpack_require__(9);
var Configuration_1 = __webpack_require__(15);
var elpong_1 = __webpack_require__(7);
var Errors_1 = __webpack_require__(0);
var UrlHelper_1 = __webpack_require__(5);
var Scheme = /** @class */ (function () {
    function Scheme(preSchemeConfiguration) {
        var sc = new Configuration_1.SchemeConfiguration(preSchemeConfiguration);
        this._configuration = sc;
        this.name = sc.name;
        this._collections = {};
        // Create collections
        for (var collectionName in sc.collections) {
            var collectionSettings = sc.collections[collectionName];
            var collection = new Collection_1.Collection(this, collectionName);
            this._collections[collectionName] = collection;
        }
        if (elpong_1.elpong.isAutoloadEnabled()) {
            for (var collectionName in sc.collections) {
                this._collections[collectionName].load(true);
            }
        }
    }
    Scheme.prototype.configuration = function () {
        return this._configuration;
    };
    Scheme.prototype.select = function (name) {
        var collection = this._collections[name];
        if (collection) {
            return collection;
        }
        else {
            throw new Errors_1.ElpongError(1 /* COLNFO */, name);
        }
    };
    Scheme.prototype.setApiUrl = function (url) {
        var trimmedUrl = UrlHelper_1.trimSlashes(url);
        return this.apiUrl = UrlHelper_1.isFqdn(trimmedUrl) ? trimmedUrl : "/" + trimmedUrl;
    };
    Scheme.prototype.getApiUrl = function () {
        return this.apiUrl;
    };
    Scheme.prototype.getCollections = function () {
        return this._collections;
    };
    return Scheme;
}());
exports.Scheme = Scheme;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Element_1 = __webpack_require__(2);
var Errors_1 = __webpack_require__(0);
var FakeThings_1 = __webpack_require__(23);
var CollectionActions_1 = __webpack_require__(24);
var CollectionHelper_1 = __webpack_require__(3);
var Util_1 = __webpack_require__(1);
var Collection = /** @class */ (function () {
    function Collection(scheme, name) {
        var _this = this;
        this._scheme = scheme;
        this.name = name;
        this.elements = new FakeThings_1.FakeMap();
        this.newElements = [];
        this._defaultPreElement = {};
        var config = CollectionHelper_1.getConfiguration(this);
        for (var fieldKey in config.fields) {
            var fieldConfig = config.fields[fieldKey];
            if (fieldConfig.default) {
                this._defaultPreElement[fieldKey] = fieldConfig.default;
            }
        }
        this.actions = {
            getAll: function (actionOptions) {
                return CollectionActions_1.executeGetAll(_this, actionOptions);
            },
            getOne: function (selectorValue, actionOptions) {
                if (selectorValue === undefined) {
                    throw new Errors_1.ElpongError(20 /* ELENOS */);
                }
                return CollectionActions_1.executeGetOne(_this, selectorValue, actionOptions);
            }
        };
        Util_1.forEach(config.collection_actions, function (actionConfig, actionName) {
            _this.actions[Util_1.camelize(actionName)] = function (actionOptions) {
                if (actionOptions === void 0) { actionOptions = {}; }
                return CollectionActions_1.executeCustom(_this, actionName, actionConfig, actionOptions);
            };
        });
    }
    Collection.prototype.scheme = function () {
        return this._scheme;
    };
    Collection.prototype.load = function (ignoreEmpty) {
        var _this = this;
        if (typeof document === 'undefined') {
            throw new Errors_1.ElpongError(6 /* ELPNDC */);
        }
        var collectionTags = document.querySelectorAll("meta[name=elpong-collection][collection='" + this.name + "'][scheme='" + this.scheme().name + "']");
        var elementTags = document.querySelectorAll("meta[name=elpong-element][collection='" + this.name + "'][scheme='" + this.scheme().name + "']");
        if (!ignoreEmpty && !collectionTags.length && !elementTags.length) {
            throw new Errors_1.ElpongError(5 /* ELPNCE */);
        }
        for (var _i = 0, _a = Util_1.arrayFromHTML(collectionTags); _i < _a.length; _i++) {
            var collectionTag = _a[_i];
            for (var _b = 0, _c = JSON.parse(collectionTag.content); _b < _c.length; _b++) {
                var preElement = _c[_b];
                this.buildOrMerge(preElement);
            }
        }
        Util_1.arrayFromHTML(elementTags).map(function (elementTag) {
            return _this.buildOrMerge(JSON.parse(elementTag.content));
        });
    };
    Collection.prototype.configuration = function () {
        return CollectionHelper_1.getConfiguration(this);
    };
    // Get an array of all elements
    //
    // @return {Element[]} Array of elements
    Collection.prototype.array = function (options) {
        if (!options) {
            options = { noNew: false };
        }
        var arr = options.noNew ? [] : this.newElements;
        return arr.concat(this.elements.values());
    };
    Collection.prototype.find = function (selectorValue) {
        return this.elements.get(selectorValue) || null;
    };
    Collection.prototype.findBy = function (fieldsKeyValueMap, findOptions) {
        if (!findOptions) {
            findOptions = {};
        }
        var isCorrect;
        var arr = this.array(findOptions);
        var responseArr = [];
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var element = arr_1[_i];
            isCorrect = true;
            for (var fieldKey in fieldsKeyValueMap) {
                var fieldValue = fieldsKeyValueMap[fieldKey];
                if (element.fields[fieldKey] !== fieldValue) {
                    isCorrect = false;
                    break;
                }
            }
            if (isCorrect) {
                if (findOptions.multiple) {
                    responseArr.push(element);
                }
                else {
                    return element;
                }
            }
        }
        if (findOptions.multiple) {
            return responseArr;
        }
        else {
            return null;
        }
    };
    Collection.prototype.build = function (preElement) {
        if (!preElement) {
            preElement = this._defaultPreElement;
        }
        var el = new Element_1.Element(this, preElement);
        CollectionHelper_1.addElement(this, el);
        return el;
    };
    Collection.prototype.buildOrMerge = function (preElement) {
        var sv = preElement[this.scheme().configuration().selector];
        if (sv) {
            var el = this.find(sv);
            if (el) {
                return el.merge(preElement);
            }
            else {
                return this.build(preElement);
            }
        }
        else {
            return this.build(preElement);
        }
    };
    return Collection;
}());
exports.Collection = Collection;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = __webpack_require__(1);
function toData(element, fullDuplicate) {
    var collection = element.collection();
    var scheme = collection.scheme();
    var o = {};
    var object = scheme.configuration().collections[collection.name].fields;
    for (var fieldKey in object) {
        var fieldSettings = object[fieldKey];
        if (fieldSettings.no_send || fieldSettings.embedded_collection || fieldSettings.embedded_element) {
            continue;
        }
        var fieldValue = element.fields[fieldKey];
        if (fullDuplicate && (typeof fieldValue === 'object')) {
            o[fieldKey] = Util_1.copyJSON(fieldValue);
        }
        else {
            o[fieldKey] = fieldValue;
        }
    }
    return o;
}
exports.toData = toData;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Element_1 = __webpack_require__(2);
var Util_1 = __webpack_require__(1);
var CollectionHelper_1 = __webpack_require__(3);
function handle(element, preElement, fieldKey, fieldConfig) {
    var embeddedPreCollection = preElement[fieldKey];
    if (!embeddedPreCollection)
        return;
    var collection = element.collection();
    var scheme = collection.scheme();
    var embeddedElementCollection = scheme.select(fieldConfig.collection || fieldKey);
    Util_1.forEach(embeddedPreCollection, function (embeddedPreElement) {
        var embeddedElement = new Element_1.Element(embeddedElementCollection, embeddedPreElement);
        CollectionHelper_1.addElement(embeddedElementCollection, embeddedElement);
    });
}
exports.handle = handle;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Errors_1 = __webpack_require__(0);
var SchemeHelper_1 = __webpack_require__(6);
function handle(element, preElement, fieldKey, fieldConfig) {
    var embeddedElementCollection;
    var embeddedPreElement = preElement[fieldKey];
    if (!embeddedPreElement) {
        return;
    }
    var collection = element.collection();
    var scheme = collection.scheme();
    if (fieldConfig.collection) {
        embeddedElementCollection = scheme.select(fieldConfig.collection);
    }
    else {
        embeddedElementCollection = SchemeHelper_1.getCollectionBySingularName(scheme, fieldKey);
    }
    var embeddedElement = embeddedElementCollection.buildOrMerge(embeddedPreElement);
    var referenceFieldKey = fieldConfig.reference_field || fieldKey + "_" + scheme.configuration().selector;
    var referenceFieldConfig = collection.configuration().fields[referenceFieldKey];
    if (!referenceFieldConfig)
        return;
    if (!referenceFieldConfig.reference)
        return;
    var selectorValue = embeddedElement.selector();
    var referenceFieldValue = preElement[referenceFieldKey];
    if (referenceFieldValue !== undefined && (referenceFieldValue !== selectorValue)) {
        throw new Errors_1.ElpongError(18 /* ELEAFW */, referenceFieldValue + " != " + selectorValue);
    }
    element.fields[referenceFieldKey] = selectorValue;
}
exports.handle = handle;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Errors_1 = __webpack_require__(0);
var Util_1 = __webpack_require__(1);
var CollectionHelper_1 = __webpack_require__(3);
function setup(element, relationCollectionName, relationSettings) {
    var collection = element.collection();
    var collectionConfig = collection.configuration();
    var relationCollection = collection.scheme().select(relationSettings.collection || relationCollectionName);
    // let relation_field_settings: FieldConfiguration;
    // if (relation_field_settings = collection_config.fields[references_field_key]) {
    //   // throw new Error("Field #{field_key} of collection #{collection.getName()} are not references") if !relation_field_settings.references
    //   return element.relations[Util.camelize(relation_collection_name)] = (): Element[] =>
    //     getHasManyRelationArrayThroughReferencesField(element, relation_collection, references_field_key);
    //
    // }
    if (relationSettings.inline) {
        var referencesFieldKey_1 = relationSettings.inline_field || relationCollectionName + "_" + collection.scheme().configuration().selector + "s"; // dogs_ids, unless specified otherwise
        return element.relations[Util_1.camelize(relationCollectionName)] = function () {
            return getHasManyRelationArrayInline(element, relationCollection, referencesFieldKey_1);
        };
    }
    else { // normal has_many relationship
        return element.relations[Util_1.camelize(relationCollectionName)] =
            getHasManyRelationFunction(element, collection, relationSettings, relationCollection);
    }
}
exports.setup = setup;
function getHasManyRelationFunction(element, collection, relationConfig, relationCollection, limitToOne) {
    var hasManyFieldKey;
    var collectionSingularName = CollectionHelper_1.getSingularName(collection);
    var relationCollectionSettings = relationCollection.configuration();
    var selectorKey = collection.scheme().configuration().selector;
    if (relationConfig.polymorphic) {
        hasManyFieldKey = relationConfig.as + "_" + selectorKey;
        var hasManyCollectionFieldKey_1 = relationConfig.as + "_collection";
        return function () { return getPolymorphicHasManyRelationArray(element, relationCollection, hasManyFieldKey, hasManyCollectionFieldKey_1, limitToOne); };
    }
    else {
        if (relationConfig.field) {
            hasManyFieldKey = relationConfig.field;
        }
        else if (relationConfig.as) {
            hasManyFieldKey = relationConfig.as + "_" + selectorKey;
        }
        else {
            hasManyFieldKey = collectionSingularName + "_" + selectorKey;
        }
        return function () { return getHasManyRelationArray(element, relationCollection, hasManyFieldKey, limitToOne); };
    }
}
exports.getHasManyRelationFunction = getHasManyRelationFunction;
function getHasManyRelationArray(element, relationCollection, hasManyFieldKey, limitToOne) {
    var element2Arr = [];
    var selectorValue = element.selector();
    for (var _i = 0, _a = relationCollection.array(); _i < _a.length; _i++) {
        var element2 = _a[_i];
        if (selectorValue === element2.fields[hasManyFieldKey]) {
            element2Arr.push(element2);
            if (limitToOne) {
                return element2Arr;
            }
        }
    }
    return element2Arr;
}
function getPolymorphicHasManyRelationArray(element, relationCollection, hasManyFieldKey, hasManyCollectionFieldKey, limitToOne) {
    var element2Arr = [];
    var selectorValue = element.selector();
    var collectionName = element.collection().name;
    for (var _i = 0, _a = relationCollection.array(); _i < _a.length; _i++) {
        var element2 = _a[_i];
        if (selectorValue === element2.fields[hasManyFieldKey] && collectionName === element2.fields[hasManyCollectionFieldKey]) {
            element2Arr.push(element2);
            if (limitToOne) {
                return element2Arr;
            }
        }
    }
    return element2Arr;
}
function getHasManyRelationArrayInline(element, relationCollection, fieldKey) {
    var selectorValueArr = element.fields[fieldKey];
    if (!Array.isArray(selectorValueArr)) {
        throw new Errors_1.ElpongError(14 /* FLDNSA */, fieldKey);
    }
    var element2Arr = [];
    for (var _i = 0, _a = relationCollection.array(); _i < _a.length; _i++) {
        var element2 = _a[_i];
        if (Util_1.includes(selectorValueArr, element2.selector())) {
            element2Arr.push(element2);
        }
    }
    return element2Arr;
}


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ElementHelper_1 = __webpack_require__(10);
var Snapshot = /** @class */ (function () {
    function Snapshot(element, tag) {
        this.element = element;
        this.tag = tag;
        this.data = ElementHelper_1.toData(element, true);
        this.undone = false;
        this.time = Date.now();
        this.index = element.snapshots.list.length;
        element.snapshots.list.push(this);
        element.snapshots.currentIndex = this.index;
    }
    Snapshot.prototype.revert = function () {
        var list = this.element.snapshots.list;
        this.element.merge(this.data);
        this.element.snapshots.currentIndex = this.index;
        this.undone = false;
        for (var i = this.index + 1, l = list.length; i < l; i++) {
            list[i].undone = true;
        }
    };
    return Snapshot;
}());
exports.Snapshot = Snapshot;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Errors_1 = __webpack_require__(0);
var SchemeConfiguration = /** @class */ (function () {
    function SchemeConfiguration(preconf) {
        this.name = preconf.name;
        if (!this.name) {
            throw new Errors_1.ElpongError(8 /* CNFNNA */);
        }
        this.selector = preconf.selector;
        if (!this.selector) {
            throw new Errors_1.ElpongError(7 /* CNFNSL */, preconf.name);
        }
        this.collections = {};
        for (var collectionName in preconf.collections) {
            var collectionPreconf = preconf.collections[collectionName];
            /* tslint:disable-next-line:no-object-literal-type-assertion */
            var collectionConfiguration = this.collections[collectionName] = {
                singular: collectionPreconf.singular || collectionName.slice(0, -1)
            };
            var props = ['fields', 'relations', 'actions', 'collection_actions'];
            var relationTypes = ['has_many', 'has_one', 'belongs_to'];
            for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
                var prop = props_1[_i];
                collectionConfiguration[prop] = collectionPreconf[prop] || {};
            }
            var relationsConf = collectionPreconf.relations;
            if (relationsConf) {
                for (var _a = 0, relationTypes_1 = relationTypes; _a < relationTypes_1.length; _a++) {
                    var relationType = relationTypes_1[_a];
                    relationsConf[relationType] =
                        collectionPreconf.relations[relationType] || {};
                }
            }
        }
    }
    return SchemeConfiguration;
}());
exports.SchemeConfiguration = SchemeConfiguration;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var elpong_1 = __webpack_require__(7);
exports.default = elpong_1.elpong;
var Scheme_1 = __webpack_require__(8);
exports.Scheme = Scheme_1.Scheme;
var Collection_1 = __webpack_require__(9);
exports.Collection = Collection_1.Collection;
var Element_1 = __webpack_require__(2);
exports.Element = Element_1.Element;
var Errors_1 = __webpack_require__(0);
exports.ElpongError = Errors_1.ElpongError;
var Snapshot_1 = __webpack_require__(14);
exports.Snapshot = Snapshot_1.Snapshot;
var Configuration_1 = __webpack_require__(15);
exports.SchemeConfiguration = Configuration_1.SchemeConfiguration;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Ajax_1 = __webpack_require__(4);
var Errors_1 = __webpack_require__(0);
var Util_1 = __webpack_require__(1);
var ElementHelper_1 = __webpack_require__(10);
var UrlHelper_1 = __webpack_require__(5);
function setup(element, actionsConfig) {
    var _loop_1 = function (method) {
        element.actions[method] = function (actionOptions) {
            return execute(element, method.toUpperCase(), actionOptions);
        };
    };
    for (var _i = 0, _a = ['get', 'post', 'put', 'delete']; _i < _a.length; _i++) {
        var method = _a[_i];
        _loop_1(method);
    }
    Util_1.forEach(actionsConfig, function (actionConfig, actionName) {
        element.actions[Util_1.camelize(actionName)] = function (actionOptions) {
            if (element.isNew() && !actionConfig.no_selector) {
                throw new Errors_1.ElpongError(9 /* ELENEW */);
            }
            return executeCustom(element, actionName, actionConfig, actionOptions);
        };
    });
}
exports.setup = setup;
function execute(element, method, actionOptions) {
    if (actionOptions === void 0) { actionOptions = {}; }
    element.snapshots.make("before_" + method.toLowerCase());
    var data;
    if (actionOptions.data) {
        if (method !== 'GET') {
            data = actionOptions.data;
        }
        else {
            throw new Errors_1.ElpongError(22 /* AJXGDA */);
        }
    }
    else if (method !== 'GET') {
        data = ElementHelper_1.toData(element);
    }
    if (method === 'POST') {
        if (!element.isNew()) {
            throw new Errors_1.ElpongError(10 /* ELENNW */);
        }
    }
    else {
        if (element.isNew()) {
            throw new Errors_1.ElpongError(9 /* ELENEW */);
        }
    }
    var urlOptions = {
        noSelector: method === 'POST',
        params: actionOptions.params || {}
    };
    var promise = Ajax_1.executeRequest(UrlHelper_1.createForElement(element, urlOptions), method, data, actionOptions.headers);
    promise.then(function (response) {
        if (response.data) {
            element.merge(response.data);
        }
        element.snapshots.make("after_" + method.toLowerCase());
        var collection = element.collection();
        if (Util_1.includes(collection.newElements, element)) {
            Util_1.removeFromArray(collection.newElements, element);
            collection.elements.set(element.selector(), element);
        }
    });
    return promise;
}
exports.execute = execute;
function executeCustom(element, actionName, actionConfig, actionOptions) {
    if (actionOptions === void 0) { actionOptions = {}; }
    var method = actionConfig.method.toUpperCase();
    element.snapshots.make("before_" + actionName);
    var data;
    if (actionOptions.data) {
        if (method !== 'GET') {
            data = actionOptions.data;
        }
        else {
            throw new Errors_1.ElpongError(22 /* AJXGDA */);
        }
    }
    else if (!actionConfig.no_data) {
        data = ElementHelper_1.toData(element);
    }
    var urlOptions = {
        params: actionOptions.params || {},
        suffix: actionConfig.path || actionName
    };
    urlOptions.noSelector = actionConfig.no_selector;
    var promise = Ajax_1.executeRequest(UrlHelper_1.createForElement(element, urlOptions), method, data, actionOptions.headers);
    promise.then(function (response) {
        if (!actionConfig.returns_other) {
            if (response.data) {
                element.merge(response.data);
            }
            element.snapshots.make("after_" + method.toLowerCase());
        }
        var collection = element.collection();
        var selectorValue = element.selector();
        if (selectorValue && Util_1.includes(collection.newElements, element)) {
            Util_1.removeFromArray(collection.newElements, element);
            collection.elements.set(selectorValue, element);
        }
    });
    return promise;
}
exports.executeCustom = executeCustom;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = __webpack_require__(1);
var EmbeddedCollection_1 = __webpack_require__(11);
var EmbeddedElement_1 = __webpack_require__(12);
function setup(element, fieldsConfigMap, preElement) {
    Util_1.forEach(fieldsConfigMap, function (fieldConfig, fieldKey) {
        if (fieldConfig.embedded_element) {
            EmbeddedElement_1.handle(element, preElement, fieldKey, fieldConfig);
        }
        else if (fieldConfig.embedded_collection) {
            EmbeddedCollection_1.handle(element, preElement, fieldKey, fieldConfig);
        }
        else {
            if (!preElement.hasOwnProperty(fieldKey)) {
                return;
            }
            var fieldValue = preElement[fieldKey];
            element.fields[fieldKey] = fieldValue;
        }
    });
}
exports.setup = setup;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = __webpack_require__(1);
var BelongsTo_1 = __webpack_require__(20);
var HasMany_1 = __webpack_require__(13);
var HasOne_1 = __webpack_require__(21);
function setup(element, relationsConfigMaps) {
    Util_1.forEach(relationsConfigMaps.has_many, function (relationConfig, relationCollectionName) {
        HasMany_1.setup(element, relationCollectionName, relationConfig);
    });
    Util_1.forEach(relationsConfigMaps.has_one, function (relationConfig, relationCollectionSingularName) {
        HasOne_1.setup(element, relationCollectionSingularName, relationConfig);
    });
    Util_1.forEach(relationsConfigMaps.belongs_to, function (relationConfig, relationCollectionSingularName) {
        BelongsTo_1.setup(element, relationCollectionSingularName, relationConfig);
    });
}
exports.setup = setup;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Element_1 = __webpack_require__(2);
var Util_1 = __webpack_require__(1);
var SchemeHelper_1 = __webpack_require__(6);
function setup(element, relationCollectionSingularName, relationConfig) {
    var fieldKey;
    var relationCollection;
    var collection = element.collection();
    // TODO should be reference
    if (relationConfig.polymorphic) {
        var collectionFieldKey_1 = relationConfig.collection_field || relationCollectionSingularName + "_collection";
        fieldKey = relationConfig.field;
        element.relations[Util_1.camelize(relationCollectionSingularName)] = function () {
            return getPolymorphicBelongsToElement(element, fieldKey, collectionFieldKey_1, relationCollectionSingularName);
        };
    }
    else { // normal
        var scheme = collection.scheme();
        if (relationConfig.collection) {
            relationCollection = collection.scheme().select(relationConfig.collection);
        }
        else {
            relationCollection = SchemeHelper_1.getCollectionBySingularName(scheme, relationCollectionSingularName);
        }
        fieldKey = relationConfig.field || relationCollectionSingularName + "_" + scheme.configuration().selector;
        element.relations[Util_1.camelize(relationCollectionSingularName)] = function () {
            return getBelongsToElement(element, relationCollection, fieldKey);
        };
    }
}
exports.setup = setup;
var getBelongsToElement = function (element, relationCollection, fieldKey) {
    var selectorValue = element.fields[fieldKey];
    if (Element_1.isSelectorValue(selectorValue)) {
        return relationCollection.find(selectorValue) || null;
    }
    else {
        return undefined;
    }
};
// Gets the polymorphic belongs_to element
//
// @param {Element} hpe                    The element to which the other element belongs
// @param {string} fieldKey                The foreign key, e.g. parent_id.
// @param {string} collectionFieldKey      The field name of the other collection, required, e.g. parent_collection.
// @param {string} collectionSelectorField The selector name of the other collection, if it was specified, e.g. id. (Will not be looked at if fieldKey is present)
// @param {string} collectionSingularName  e.g. parent
//
// @return {Element|null}            The related element.
var getPolymorphicBelongsToElement = function (element, fieldKey, collectionFieldKey, collectionSingularName) {
    var relationCollectionName = element.fields[collectionFieldKey];
    var relationCollection = element.collection().scheme().select(relationCollectionName);
    if (!fieldKey) {
        var selectorKey = element.collection().scheme().configuration().selector;
        fieldKey = collectionSingularName + "_" + selectorKey;
    }
    var selectorValue = element.fields[fieldKey];
    return relationCollection.find(selectorValue) || null;
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = __webpack_require__(1);
var SchemeHelper_1 = __webpack_require__(6);
var HasMany_1 = __webpack_require__(13);
function setup(element, relationCollectionSingularName, relationConfig) {
    var relationCollection;
    var collection = element.collection();
    var collectionConfig = element.collection().configuration();
    var scheme = collection.scheme();
    if (relationConfig.collection) {
        relationCollection = scheme.select(relationConfig.collection);
    }
    else {
        relationCollection = SchemeHelper_1.getCollectionBySingularName(scheme, relationCollectionSingularName);
    }
    return element.relations[Util_1.camelize(relationCollectionSingularName)] = function () {
        return HasMany_1.getHasManyRelationFunction(element, collection, relationConfig, relationCollection, true)()[0];
    };
}
exports.setup = setup;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Errors_1 = __webpack_require__(0);
var Snapshot_1 = __webpack_require__(14);
var Util_1 = __webpack_require__(1);
function setup(element) {
    var snapshots = element.snapshots;
    snapshots.list = [];
    snapshots.make = function (tag) {
        return new Snapshot_1.Snapshot(element, tag);
    };
    snapshots.lastPersisted = function () {
        if (element.isNew())
            return;
        for (var i = snapshots.list.length - 1; i >= 0; i--) {
            var snapshot = snapshots.list[i];
            if (Util_1.includes(['after_post', 'after_put', 'after_get', 'creation'], snapshot.tag)) {
                return snapshot;
            }
        }
        return;
        // Util.reverseForEach(element.snapshots.list, function(k: string, v: Snapshot) {
        //   if ((v.tag === 'after_post') || (v.tag === 'after_put') || (v.tag === 'after_get') || (v.tag === 'creation')) {
        //     last_persisted_snapshot = v;
        //     return Util.BREAK;
        //   }
        // });
        // return last_persisted_snapshot;
    };
    snapshots.lastWithTag = function (tag) {
        var list = element.snapshots.list;
        if (Util_1.isRegExp(tag)) {
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
        return;
    };
    snapshots.last = function () {
        var list = element.snapshots.list;
        return list[list.length - 1];
    };
    snapshots.undo = function (id) {
        if (id == null) {
            id = 0;
        }
        if (Util_1.isInteger(id)) {
            var list = element.snapshots.list;
            if (id < 0 || id > list.length) {
                throw new Errors_1.ElpongError(17 /* ELESTI */, "" + id);
            }
            else {
                var snapshot = list[element.snapshots.currentIndex - id];
                snapshot.revert();
            }
        }
        else {
            var snapshot = snapshots.lastWithTag(id);
            if (snapshot) {
                snapshot.revert();
            }
            else {
                throw new Errors_1.ElpongError(16 /* ELESNF */, "" + id);
            }
        }
        return element;
    };
    snapshots.isPersisted = function () {
        var snapshot = snapshots.lastPersisted();
        if (!snapshot) {
            return false;
        }
        return Util_1.equalsJSON(element.fields, snapshot.data);
    };
}
exports.setup = setup;
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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = __webpack_require__(1);
var supportsMap = typeof Map !== 'undefined' && (new Map()).values;
var FakeMap = /** @class */ (function () {
    function FakeMap() {
        // in IE 11, Map#values doesn't exist. Don't bother about that.
        this.hasRealMap = supportsMap;
        this.map = supportsMap ? new Map() : {};
    }
    FakeMap.prototype.get = function (k) {
        return supportsMap ? this.map.get(k) : this.map[k];
    };
    FakeMap.prototype.set = function (k, v) {
        if (supportsMap) {
            this.map.set(k, v);
        }
        else {
            this.map[k] = v;
        }
        return this;
    };
    FakeMap.prototype.has = function (k) {
        return supportsMap ? this.map.has(k) : !!this.map[k];
    };
    FakeMap.prototype.values = function () {
        // if Map is there, Array.from should also be there
        return supportsMap ? Array.from(this.map.values()) : Util_1.values(this.map);
    };
    FakeMap.prototype.delete = function (k) {
        if (supportsMap) {
            this.map.delete(k);
        }
        else {
            delete this.map[k];
        }
    };
    return FakeMap;
}());
exports.FakeMap = FakeMap;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Ajax_1 = __webpack_require__(4);
var Errors_1 = __webpack_require__(0);
var UrlHelper_1 = __webpack_require__(5);
function executeGetAll(collection, actionOptions) {
    if (actionOptions === void 0) { actionOptions = {}; }
    if (!actionOptions)
        actionOptions = {};
    if (actionOptions.data) {
        throw new Errors_1.ElpongError(22 /* AJXGDA */);
    }
    var promise = Ajax_1.executeRequest(UrlHelper_1.createForCollection(collection, { params: actionOptions.params || {} }), 'GET', undefined, actionOptions.headers);
    promise.then(function (response) {
        response.data.map(function (preElement) {
            collection.buildOrMerge(preElement);
        });
    });
    return promise;
}
exports.executeGetAll = executeGetAll;
function executeGetOne(collection, selectorValue, actionOptions) {
    if (actionOptions === void 0) { actionOptions = {}; }
    if (actionOptions.data) {
        throw new Errors_1.ElpongError(22 /* AJXGDA */);
    }
    var urlOptions = {
        params: actionOptions.params || {},
        suffix: selectorValue
    };
    var promise = Ajax_1.executeRequest(UrlHelper_1.createForCollection(collection, urlOptions), 'GET', undefined, actionOptions.headers);
    promise.then(function (response) {
        if (response.data) {
            var selectorKey = collection.scheme().configuration().selector;
            if (response.data[selectorKey] !== selectorValue) {
                throw new Errors_1.ElpongError(19 /* ELESNM */, response.data[selectorKey] + " != " + selectorValue);
            }
            collection.buildOrMerge(response.data);
        }
    });
    return promise;
}
exports.executeGetOne = executeGetOne;
function executeCustom(collection, actionName, actionConfig, actionOptions) {
    if (!actionOptions) {
        actionOptions = {};
    }
    var data = actionOptions.data;
    var method = actionConfig.method.toUpperCase();
    return Ajax_1.executeRequest(UrlHelper_1.createForCollection(collection, { suffix: actionConfig.path || actionName, params: actionOptions.params }), method, data, actionOptions.headers);
}
exports.executeCustom = executeCustom;


/***/ })
/******/ ]);
});
//# sourceMappingURL=elpong.js.map