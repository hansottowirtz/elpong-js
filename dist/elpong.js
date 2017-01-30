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
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Elpong_1 = __webpack_require__(1);
	module.exports = Elpong_1.Elpong;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Scheme_1 = __webpack_require__(2);
	var Errors_1 = __webpack_require__(6);
	var Util_1 = __webpack_require__(11);
	var Ajax_1 = __webpack_require__(9);
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Collection_1 = __webpack_require__(3);
	var Configuration_1 = __webpack_require__(20);
	var Errors_1 = __webpack_require__(6);
	var Helpers_1 = __webpack_require__(4);
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
	        this.api_url = null;
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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Helpers_1 = __webpack_require__(4);
	var Element_1 = __webpack_require__(10);
	var Util_1 = __webpack_require__(11);
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
	            getAll: function (user_options) {
	                return Helpers_1.CollectionHelper.Actions.executeGetAll(this, user_options);
	            },
	            getOne: function (selector_value, user_options) {
	                return Helpers_1.CollectionHelper.Actions.executeGetOne(this, selector_value, user_options);
	            }
	        };
	        Util_1.Util.forEach(config.collection_actions, function (action_settings, action_name) {
	            _this.actions[Util_1.Util.camelize(action_name)] = function (user_options) {
	                Helpers_1.CollectionHelper.Actions.executeCustom(_this, action_name, action_settings, user_options);
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
	        return this.elements[selector_value];
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
	        return response_arr;
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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var UrlHelper_1 = __webpack_require__(5);
	exports.UrlHelper = UrlHelper_1.UrlHelper;
	var CollectionHelper_1 = __webpack_require__(7);
	exports.CollectionHelper = CollectionHelper_1.CollectionHelper;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Errors_1 = __webpack_require__(6);
	var UrlHelper;
	(function (UrlHelper) {
	    // Creates the api url for an element
	    //
	    // @param {String} action_name           The action name, custom or 'GET', 'POST', 'PUT', 'DELETE'.
	    // @param {HP.Element} element      The element.
	    // @param {Object} user_options          The user_options, keys: suffix, path.
	    //
	    // @return undefined [Description]
	    function createForElement(action_name, action_configuration, element, url_options) {
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
	            if (!action_configuration.no_selector && (action_name !== 'POST')) {
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
	        var url = collection.scheme().getApiUrl() + "/" + collection.name; //HPP.Helpers.Url.createForCollection(, hpe, user_options) # (action_name, element, user_options = {}, suffix)
	        if (url_options.suffix) {
	            url = url + "/" + url_options.suffix;
	        }
	        return url;
	    }
	    UrlHelper.createForCollection = createForCollection;
	    function trimSlashes(s) {
	        return s.replace(/\/$/, '').replace(/^\//, '');
	    }
	    UrlHelper.trimSlashes = trimSlashes;
	    function isFqdn(s) {
	        return (/^https?:\/\//).test(s);
	    }
	    UrlHelper.isFqdn = isFqdn;
	})(UrlHelper = exports.UrlHelper || (exports.UrlHelper = {}));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	if (true) {
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
	        'apinur': 'Api url has not yet been set'
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


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Actions_1 = __webpack_require__(8);
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
	    CollectionHelper.Actions = Actions_1.Actions;
	})(CollectionHelper = exports.CollectionHelper || (exports.CollectionHelper = {}));


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Ajax_1 = __webpack_require__(9);
	var UrlHelper_1 = __webpack_require__(5);
	var Actions;
	(function (Actions) {
	    function executeGetAll(collection, action_options) {
	        if (!action_options) {
	            action_options = {};
	        }
	        var data = action_options.data;
	        var promise;
	        promise = Ajax_1.Ajax.executeRequest(UrlHelper_1.UrlHelper.createForCollection('GET', collection, action_options), 'GET', data, action_options.headers);
	        promise.then(function (response) {
	            response.data.map(function (pre_element) {
	                collection.buildOrMerge(pre_element);
	            });
	        });
	        return promise;
	    }
	    Actions.executeGetAll = executeGetAll;
	    function executeGetOne(collection, selector_value, action_options) {
	        if (action_options == null) {
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
	        if (action_options == null) {
	            action_options = {};
	        }
	        var data = action_options.data;
	        var method = action_config.method.toUpperCase();
	        return Ajax_1.Ajax.executeRequest(UrlHelper_1.UrlHelper.createForCollection('GET', collection, { suffix: action_config.path || action_name }), method, data, action_options.headers);
	    }
	    Actions.executeCustom = executeCustom;
	})(Actions = exports.Actions || (exports.Actions = {}));


/***/ },
/* 9 */
/***/ function(module, exports) {

	/// <reference path="../typings/index.d.ts"/>
	"use strict";
	var Ajax;
	(function (Ajax) {
	    var ajax_function;
	    function executeRequest(url, method, data, headers) {
	        if (headers == null) {
	            headers = {};
	        }
	        headers['Accept'] = headers['Content-Type'] = 'application/json';
	        var options = {
	            method: method,
	            url: method,
	            data: JSON.stringify(data === undefined ? {} : data),
	            headers: headers,
	            dataType: 'json',
	            responseType: 'json'
	        };
	        options['type'] = options.method;
	        options['body'] = options.data;
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
	                var type = 'jquery';
	            else if ((typeof fetch !== 'undefined') && (fn === fetch))
	                var type = 'fetch';
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
	                this.ajax_function = function (url, instruction) { return fn(instruction); };
	        }
	    }
	    Ajax.setAjaxFunction = setAjaxFunction;
	})(Ajax = exports.Ajax || (exports.Ajax = {}));


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Util_1 = __webpack_require__(11);
	var Fields_1 = __webpack_require__(12);
	var Relations_1 = __webpack_require__(14);
	var Actions_1 = __webpack_require__(18);
	var Errors_1 = __webpack_require__(6);
	var Element = (function () {
	    function Element(collection, pre_element) {
	        this.fields = {};
	        this.relations = {};
	        this.actions = {};
	        this._collection = collection;
	        var collection_config = collection.configuration();
	        Fields_1.Fields.setup(this, collection_config.fields, pre_element);
	        Relations_1.Relations.setup(this, collection_config.relations);
	        Actions_1.Actions.setup(this, collection_config.actions);
	        // Helpers.ElementHelper.setupSnapshots(epe);
	        this.last_snapshot_time = null;
	        // this.snapshots.make('creation');
	        // TODO: snapshots
	    }
	    Element.prototype.collection = function () {
	        return this._collection;
	    };
	    Element.prototype.selector = function () {
	        return this.fields[this.collection().scheme().configuration().selector];
	    };
	    Element.prototype.remove = function () {
	        var _this = this;
	        var element = this;
	        if (this.isNew()) {
	            Util_1.Util.removeFromArray(this.collection().new_elements, this);
	            return { then: function (fn) { return fn(); }, catch: function () { } };
	        }
	        else {
	            return this.actions.delete().then(function () {
	                var elements = _this.collection().elements;
	                return delete elements[_this.selector()];
	            });
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
	    // undo(n) {
	    //   if (n == null) { n = 0; }
	    //   if (Util.isInteger(n)) {
	    //     if (n > 1000000) {
	    //       if (this.snapshots.list[n]) {
	    //         this.merge(this.snapshots.list[n].data);
	    //         return this.last_snapshot_time = n;
	    //       } else {
	    //         throw new Error(`Diff at time ${n} does not exist`);
	    //       }
	    //     } else if (n < 0) {
	    //       throw new Error(`${n} is smaller than 0`);
	    //     } else {
	    //       let ds = SnapshotHelper.getSortedArray(this.snapshots.list);
	    //       let { length } = ds;
	    //       let index = ds.indexOf(this.snapshots.list[this.last_snapshot_time]);
	    //       // index = 0 if index < 0
	    //       let d = ds[index - n];
	    //       this.merge(d.data);
	    //       return this.last_snapshot_time = d.time;
	    //     }
	    //   } else if (HP.Util.isString(n)) {
	    //     let a = null;
	    //     for (let v of Array.from(HPP.Helpers.Snapshot.getSortedArray(this.snapshots.list))) {
	    //       if (v.tag === n) {
	    //         if (!a) { a = v; }
	    //       }
	    //     }
	    //     if (a) {
	    //       return this.merge(a.data);
	    //     } else {
	    //       throw new Error(`No snapshot found with tag ${n}`);
	    //     }
	    //   } else {
	    //     throw new TypeError(`Don't know what to do with ${n}`);
	    //   }
	    // }
	    Element.prototype.merge = function (pre_element) {
	        var _this = this;
	        var collection_settings = this.collection().configuration();
	        Util_1.Util.forEach(collection_settings.fields, function (field_settings, field_name) {
	            var field_value;
	            if (field_value = pre_element[field_name]) {
	                if (field_settings.embedded_element) {
	                    Fields_1.Fields.handleEmbeddedElement(_this, pre_element, field_name, field_settings);
	                }
	                else if (field_settings.embedded_collection) {
	                    Fields_1.Fields.handleEmbeddedCollection(_this, pre_element, field_name, field_settings);
	                }
	                else {
	                    var sv_1 = _this.fields[field_name];
	                    if (field_settings.selector && (sv_1 !== field_value) && sv_1 && field_value) {
	                        throw new Error("Selector has changed from " + sv_1 + " to " + field_value);
	                    }
	                    _this.fields[field_name] = field_value;
	                }
	            }
	        });
	        return this;
	    };
	    return Element;
	}());
	exports.Element = Element;


/***/ },
/* 11 */
/***/ function(module, exports) {

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
	            // add hasOwnPropertyCheck if needed
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


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Element_1 = __webpack_require__(10);
	var Util_1 = __webpack_require__(11);
	var SchemeHelper_1 = __webpack_require__(13);
	var CollectionHelper_1 = __webpack_require__(7);
	var Fields;
	(function (Fields) {
	    function setup(element, fields_config_map, pre_element) {
	        Util_1.Util.forEach(fields_config_map, function (field_config, field_name) {
	            if (field_config.embedded_element) {
	                return handleEmbeddedElement(element, pre_element, field_name, field_config);
	            }
	            else if (field_config.embedded_collection) {
	                return handleEmbeddedCollection(element, pre_element, field_name, field_config);
	            }
	            else {
	                var field_value = pre_element[field_name];
	                return element.fields[field_name] = field_value;
	            }
	        });
	    }
	    Fields.setup = setup;
	    function handleEmbeddedElement(hpe, pre_element, field_name, field_config) {
	        var embedded_element_collection;
	        var embedded_pre_element = pre_element[field_name];
	        if (!embedded_pre_element) {
	            return;
	        }
	        var collection = hpe.collection();
	        var scheme = collection.scheme();
	        if (field_config.collection) {
	            embedded_element_collection = scheme.select(field_config.collection);
	        }
	        else {
	            embedded_element_collection = SchemeHelper_1.SchemeHelper.getCollectionBySingularName(scheme, field_name);
	        }
	        var embedded_element = embedded_element_collection.buildOrMerge(embedded_pre_element);
	        var associated_field_name = field_name + "_" + scheme.configuration().selector;
	        return hpe.fields[associated_field_name] = embedded_element.selector();
	    }
	    Fields.handleEmbeddedElement = handleEmbeddedElement;
	    function handleEmbeddedCollection(hpe, pre_element, field_name, field_configuration) {
	        var embedded_pre_collection;
	        if (!(embedded_pre_collection = pre_element[field_name])) {
	            return;
	        }
	        var collection = hpe.collection();
	        var scheme = collection.scheme();
	        var embedded_element_collection = scheme.select(field_name || field_configuration.collection);
	        return Util_1.Util.forEach(embedded_pre_collection, function (embedded_pre_element) {
	            var embedded_element = new Element_1.Element(embedded_element_collection, embedded_pre_element);
	            return CollectionHelper_1.CollectionHelper.addElement(embedded_element_collection, embedded_element);
	        });
	    }
	    Fields.handleEmbeddedCollection = handleEmbeddedCollection;
	})(Fields = exports.Fields || (exports.Fields = {}));


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Errors_1 = __webpack_require__(6);
	var CollectionHelper_1 = __webpack_require__(7);
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


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Util_1 = __webpack_require__(11);
	var HasMany_1 = __webpack_require__(15);
	var HasOne_1 = __webpack_require__(16);
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


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var CollectionHelper_1 = __webpack_require__(7);
	var Util_1 = __webpack_require__(11);
	var HasMany;
	(function (HasMany) {
	    function setup(element, relation_collection_name, relation_settings) {
	        var collection = element.collection();
	        var collection_config = collection.configuration();
	        var relation_collection = collection.scheme().select(relation_settings.collection || relation_collection_name);
	        var references_field_name = relation_settings.references_field || relation_collection_name + "_" + collection.scheme().configuration().selector + "s"; // dogs_ids, unless specified otherwise
	        var relation_field_settings;
	        if (relation_field_settings = collection_config.fields[references_field_name]) {
	            // throw new Error("Field #{field_name} of collection #{collection.getName()} are not references") if !relation_field_settings.references
	            return element.relations[Util_1.Util.camelize(relation_collection_name)] = function () {
	                return getHasManyRelationArrayThroughReferencesField(element, relation_collection, references_field_name);
	            };
	        }
	        else {
	            return element.relations[Util_1.Util.camelize(relation_collection_name)] =
	                getHasManyRelationFunction(element, collection, relation_settings, relation_collection);
	        }
	    }
	    HasMany.setup = setup;
	    function getHasManyRelationFunction(element, collection, relation_config, relation_collection) {
	        var has_many_field_name;
	        var collection_singular_name = CollectionHelper_1.CollectionHelper.getSingularName(collection);
	        var relation_collection_settings = relation_collection.configuration();
	        var selector_key = collection.scheme().configuration().selector;
	        if (relation_config.polymorphic) {
	            has_many_field_name = relation_config.as + "_" + selector_key;
	            var has_many_collection_field_name_1 = relation_config.as + "_collection";
	            return function () { return getPolymorphicHasManyRelationArray(element, relation_collection, has_many_field_name, has_many_collection_field_name_1); };
	        }
	        else {
	            if (relation_config.field) {
	                has_many_field_name = relation_config.field;
	            }
	            else if (relation_config.as) {
	                has_many_field_name = relation_config.as + "_" + selector_key;
	            }
	            else {
	                has_many_field_name = collection_singular_name + "_" + selector_key;
	            }
	            return function () { return getHasManyRelationArray(element, relation_collection, has_many_field_name); };
	        }
	    }
	    HasMany.getHasManyRelationFunction = getHasManyRelationFunction;
	    function getHasManyRelationArray(element, relation_collection, has_many_field_name) {
	        var element2_arr = [];
	        var selector_value = element.selector();
	        for (var _i = 0, _a = relation_collection.array(); _i < _a.length; _i++) {
	            var element2 = _a[_i];
	            if (selector_value === element.fields[has_many_field_name]) {
	                element2_arr.push(element2);
	            }
	        }
	        return element2_arr;
	    }
	    function getPolymorphicHasManyRelationArray(element, relation_collection, has_many_field_name, has_many_collection_field_name) {
	        var element2_arr = [];
	        var selector_value = element.selector();
	        var collection_name = element.collection().name;
	        for (var _i = 0, _a = relation_collection.array(); _i < _a.length; _i++) {
	            var element2 = _a[_i];
	            if (selector_value === element2.fields[has_many_field_name] && collection_name === element2.fields[has_many_collection_field_name]) {
	                element2_arr.push(element2);
	            }
	        }
	        return element2_arr;
	    }
	    function getHasManyRelationArrayThroughReferencesField(element, relation_collection, field_name) {
	        var selector_value_arr = element.fields[field_name];
	        if (!Array.isArray(selector_value_arr)) {
	            throw new Error("Field " + field_name + " is not an array, but it should be an array of references to " + relation_collection.name);
	        }
	        var hpe2_arr = [];
	        for (var _i = 0, _a = relation_collection.array(); _i < _a.length; _i++) {
	            var hpe2 = _a[_i];
	            if (Util_1.Util.includes(selector_value_arr, element.selector())) {
	                hpe2_arr.push(hpe2);
	            }
	        }
	        return hpe2_arr;
	    }
	})(HasMany = exports.HasMany || (exports.HasMany = {}));


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var HasMany_1 = __webpack_require__(15);
	var SchemeHelper_1 = __webpack_require__(13);
	var Util_1 = __webpack_require__(11);
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
	            HasMany_1.HasMany.getHasManyRelationFunction(element, collection, relation_config, relation_collection)()[0];
	        };
	    }
	    HasOne.setup = setup;
	})(HasOne = exports.HasOne || (exports.HasOne = {}));


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Util_1 = __webpack_require__(11);
	var BelongsTo;
	(function (BelongsTo) {
	    function setup(element, relation_collection_singular_name, relation_config) {
	        var field_name, relation_collection;
	        var collection = element.collection();
	        // TODO should be reference
	        if (relation_config.polymorphic) {
	            var collection_field_name_1 = relation_config.collection_field || relation_collection_singular_name + "_collection";
	            field_name = relation_config.field;
	            element.relations[Util_1.Util.camelize(relation_collection_singular_name)] = function () {
	                return getPolymorphicBelongsToElement(element, field_name, collection_field_name_1, relation_collection_singular_name);
	            };
	        }
	        else {
	            relation_collection = collection.scheme().select(relation_config.collection || relation_collection_singular_name);
	            field_name = relation_config.field || relation_collection_singular_name + "_" + relation_collection.selector_name;
	            element.relations[Util_1.Util.camelize(relation_collection_singular_name)] = function () {
	                return getBelongsToElement(element, relation_collection, field_name);
	            };
	        }
	    }
	    BelongsTo.setup = setup;
	    var getBelongsToElement = function (element, relation_collection, field_name) {
	        var selector_value = element.fields[field_name];
	        return relation_collection.find(selector_value) || null;
	    };
	    // Gets the polymorphic belongs_to element
	    //
	    // @param {Element} hpe              The element to which the other element belongs
	    // @param {string} field_name                The foreign key, e.g. parent_id.
	    // @param {string} collection_field_name     The field name of the other collection, required, e.g. parent_collection.
	    // @param {string} collection_selector_field The selector name of the other collection, if it was specified, e.g. id. (Will not be looked at if field_name is present)
	    // @param {string} collection_singular_name  e.g. parent
	    //
	    // @return {Element|null}            The related element.
	    var getPolymorphicBelongsToElement = function (element, field_name, collection_field_name, collection_singular_name) {
	        // console.log hpe, collection_field_name, collection_selector_field
	        var relation_collection_name = element.fields[collection_field_name];
	        var relation_collection = element.collection().scheme().select(relation_collection_name);
	        if (!field_name) {
	            var selector_key = element.collection().scheme().configuration().selector;
	            field_name = collection_singular_name + "_" + selector_key;
	        }
	        var selector_value = element.fields[field_name];
	        return relation_collection.find(selector_value) || null;
	    };
	})(BelongsTo = exports.BelongsTo || (exports.BelongsTo = {}));


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Ajax_1 = __webpack_require__(9);
	var Util_1 = __webpack_require__(11);
	var Errors_1 = __webpack_require__(6);
	var ElementHelper_1 = __webpack_require__(19);
	var UrlHelper_1 = __webpack_require__(5);
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
	            element.actions[Util_1.Util.camelize(action_name)] = function (user_options) {
	                if (element.isNew() && !action_config.no_selector) {
	                    throw new Errors_1.ElpongError('elenew');
	                }
	                return executeCustom(element, action_name, action_config, user_options);
	            };
	        });
	    }
	    Actions.setup = setup;
	    function execute(element, method, action_options) {
	        if (!action_options) {
	            action_options = {};
	        }
	        var data;
	        // element.snapshots.make(`before_${method.toLowerCase()}`);
	        if (action_options.data) {
	            data = action_options;
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
	        var promise = Ajax_1.Ajax.executeRequest(UrlHelper_1.UrlHelper.createForElement(method, {}, element, action_options), method, data, action_options.headers);
	        promise.then(function (response) {
	            if (response.data) {
	                element.merge(response.data);
	            }
	            // TODO element.snapshots.make(`after_${method.toLowerCase()}`);
	            var collection = element.collection();
	            if (Util_1.Util.includes(collection.new_elements, element)) {
	                Util_1.Util.removeFromArray(collection.new_elements, element);
	                return collection.elements[element.selector()] = element;
	            }
	        });
	        return promise;
	    }
	    Actions.execute = execute;
	    function executeCustom(hpe, action_name, action_settings, user_options) {
	        if (user_options == null) {
	            user_options = {};
	        }
	        var method = action_settings.method.toUpperCase();
	        hpe.snapshots.make("before_" + method.toLowerCase());
	        var data;
	        if (user_options.data) {
	            data = user_options.data;
	        }
	        else if (!action_settings.without_data) {
	            data = ElementHelper_1.ElementHelper.toData(hpe);
	        }
	        var promise = Ajax_1.Ajax.executeRequest(UrlHelper_1.UrlHelper.createForElement(action_name, action_settings, hpe, user_options), method, data, user_options.headers);
	        promise.then(function (response) {
	            var selector_value;
	            if (!action_settings.returns_other) {
	                if (response.data) {
	                    hpe.mergeWith(response.data);
	                }
	                hpe.snapshots.make("after_" + method.toLowerCase());
	            }
	            var collection = hpe.getCollection();
	            if ((selector_value = hpe.getSelectorValue()) && Util_1.Util.includes(collection.new_elements, hpe)) {
	                Util_1.Util.removeFromArray(collection.new_elements, hpe);
	                return collection.elements[selector_value] = hpe;
	            }
	        });
	        return promise;
	    }
	    Actions.executeCustom = executeCustom;
	    ;
	})(Actions = exports.Actions || (exports.Actions = {}));


/***/ },
/* 19 */
/***/ function(module, exports) {

	"use strict";
	var ElementHelper;
	(function (ElementHelper) {
	    function toData(element) {
	        var collection = element.collection();
	        var scheme = collection.scheme();
	        var o = {};
	        var object = scheme.configuration().collections[collection.name].fields;
	        for (var field_name in object) {
	            var field_settings = object[field_name];
	            if (field_settings.no_send || field_settings.embedded_collection || field_settings.embedded_element) {
	                continue;
	            }
	            var field_value = element.fields[field_name];
	            o[field_name] = field_value;
	        }
	        return o;
	    }
	    ElementHelper.toData = toData;
	})(ElementHelper = exports.ElementHelper || (exports.ElementHelper = {}));


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Errors_1 = __webpack_require__(6);
	if (true) {
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
	            if (collection_preconf.relations) {
	                for (var _a = 0, relation_types_1 = relation_types; _a < relation_types_1.length; _a++) {
	                    var relation_type = relation_types_1[_a];
	                    collection_configuration.relations[relation_type] = collection_preconf.relations[relation_type] || {};
	                }
	            }
	        }
	    }
	    return SchemeConfiguration;
	}());
	exports.SchemeConfiguration = SchemeConfiguration;


/***/ }
/******/ ])
});
;
//# sourceMappingURL=elpong.js.map