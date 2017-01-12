;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.HTTPong = factory();
  }
}(this, function() {
var HP, HPP, HTTPong, base, base1;

HTTPong = HP = {};

HP["private"] = HPP = {
  log: function() {
    return console.log.apply(console, ['%c HTTPong ', 'background: #80CBC4; color: #fff'].concat(Array.from(arguments)));
  },
  schemes: {},
  http_function: null,
  isHpe: function(e) {
    return e.constructor === HP.Element;
  },
  isHpc: function(e) {
    return e.constructor === HP.Collection;
  },
  Helpers: {}
};

HP.addScheme = function(pre_scheme) {
  var scheme;
  scheme = new HP.Scheme(pre_scheme);
  if (HPP.schemes[scheme.getName()]) {
    throw new Error("A scheme with name " + (scheme.getName()) + " already exists");
  }
  return HPP.schemes[scheme.getName()] = scheme;
};

HP.getScheme = function(name) {
  return HPP.schemes[name];
};

HP.initialize = function() {
  var collection, collection_name, j, len, ref, ref1, scheme, scheme_name, scheme_tag, scheme_tags;
  scheme_tags = document.querySelectorAll('meta[name=httpong-scheme]');
  if (!scheme_tags.length && !Object.keys(HPP.schemes).length) {
    throw new Error('No scheme added or found');
  }
  for (j = 0, len = scheme_tags.length; j < len; j++) {
    scheme_tag = scheme_tags[j];
    HP.addScheme(JSON.parse(scheme_tag.content));
  }
  ref = HPP.schemes;
  for (scheme_name in ref) {
    scheme = ref[scheme_name];
    ref1 = scheme.collections;
    for (collection_name in ref1) {
      collection = ref1[collection_name];
      collection.handlePreloadedElements();
    }
  }
  return HP;
};

HP.setHttpFunction = function(fn, type) {
  if (type === 'jquery' || (typeof jQuery !== 'undefined' && fn === jQuery.ajax)) {
    HPP.http_function = function(url, object) {
      var ajax, deferred;
      deferred = jQuery.Deferred();
      ajax = fn(url, object);
      ajax.then(function(data, status, jqxhr) {
        return deferred.resolve({
          data: data,
          status: jqxhr.statusCode().status,
          headers: jqxhr.getAllResponseHeaders()
        });
      });
      ajax["catch"](function(data, status, jqxhr) {
        return deferred.reject({
          data: data,
          status: jqxhr.statusCode().status,
          headers: jqxhr.getAllResponseHeaders()
        });
      });
      return deferred;
    };
  } else if (type === 'fetch' || (typeof window !== 'undefined' && fn === window.fetch)) {
    HPP.http_function = function(url, object) {
      return new Promise(function(resolve, reject) {
        var http_promise;
        object.body = object.data;
        http_promise = fn(url, object);
        http_promise.then(function(response) {
          var json_promise;
          if (response.headers.get('content-type') !== 'application/json') {
            return resolve(response);
          } else {
            json_promise = response.json();
            json_promise.then(function(json) {
              response.data = json;
              return resolve(response);
            });
            return json_promise["catch"](reject);
          }
        });
        return http_promise["catch"](reject);
      });
    };
  } else {
    HPP.http_function = function(url, object) {
      return fn(object);
    };
  }
};

HP.Scheme = (function() {
  function Scheme(pre_scheme, options) {
    if (options == null) {
      options = {
        no_normalize: false,
        no_create_collections: false
      };
    }
    this.data = pre_scheme;
    this.collections = {};
    this.api_url = null;
    if (!options.no_normalize) {
      this.normalize();
    }
    if (!options.no_create_collections) {
      this.createCollections();
    }
  }

  Scheme.prototype.getName = function() {
    return this.data.name;
  };

  Scheme.prototype.normalize = function() {
    var base, base1, base2, collection_name, collection_settings, ref, results;
    this.data.name = this.data.name.toLowerCase();
    ref = this.data.collections;
    results = [];
    for (collection_name in ref) {
      collection_settings = ref[collection_name];
      collection_settings.singular || (collection_settings.singular = collection_name.slice(0, -1));
      collection_settings.actions || (collection_settings.actions = {});
      collection_settings.collection_actions || (collection_settings.collection_actions = {});
      collection_settings.relations || (collection_settings.relations = {});
      (base = collection_settings.relations).has_one || (base.has_one = {});
      (base1 = collection_settings.relations).has_many || (base1.has_many = {});
      results.push((base2 = collection_settings.relations).belongs_to || (base2.belongs_to = {}));
    }
    return results;
  };

  Scheme.prototype.createCollections = function() {
    var collection, collection_name, collection_settings, ref, results;
    ref = this.data.collections;
    results = [];
    for (collection_name in ref) {
      collection_settings = ref[collection_name];
      if (this.collections[collection_name]) {
        HPP.log("Collection with name " + collection_name + " already exists in scheme");
        continue;
      }
      collection = new HP.Collection(this, collection_name);
      results.push(this.collections[collection_name] = collection);
    }
    return results;
  };

  Scheme.prototype.getCollection = function(name) {
    if (!this.collections[name]) {
      throw new Error("Collection " + name + " does not exist");
    } else {
      return this.collections[name];
    }
  };

  Scheme.prototype.getCollectionBySingularName = function(singular_name) {
    var collection, collection_name, ref;
    ref = this.collections;
    for (collection_name in ref) {
      collection = ref[collection_name];
      if (collection.getSingularName() === singular_name) {
        return collection;
      }
    }
    throw new Error("Collection " + singular_name + " does not exist");
  };

  Scheme.prototype.select = Scheme.prototype.getCollection;

  Scheme.prototype.setApiUrl = function(url) {
    this.api_url = HPP.Helpers.Url.trimSlashes(url);
    if (!(HP.Util.startsWith(this.api_url, 'http://') || HP.Util.startsWith(this.api_url, 'https://'))) {
      return this.api_url = "/" + this.api_url;
    }
  };

  Scheme.prototype.getApiUrl = function() {
    return this.api_url;
  };

  return Scheme;

})();

HP.Element = (function() {
  function Element(collection1, pre_element) {
    var collection_settings, hpe;
    this.collection = collection1;
    hpe = this;
    this.fields = {};
    this.relations = {};
    collection_settings = HPP.Helpers.Collection.getSettings(this.collection);
    HP.Util.forEach(collection_settings.fields, function(field_settings, field_name) {
      var field_value;
      if (field_settings.embedded_element) {
        return HPP.Helpers.Field.handleEmbeddedElement(hpe, pre_element, field_name, field_settings);
      } else if (field_settings.embedded_collection) {
        return HPP.Helpers.Field.handleEmbeddedCollection(hpe, pre_element, field_name, field_settings);
      } else {
        if (field_settings.only_send) {
          return;
        }
        field_value = pre_element[field_name];
        return hpe.setField(field_name, field_value, true);
      }
    });
    HP.Util.forEach(collection_settings.relations.has_many, function(relation_settings, relation_collection_name) {
      return HPP.Helpers.Element.setupHasManyRelation(hpe, relation_collection_name, relation_settings);
    });
    HP.Util.forEach(collection_settings.relations.has_one, function(relation_settings, relation_collection_singular_name) {
      return HPP.Helpers.Element.setupHasOneRelation(hpe, relation_collection_singular_name, relation_settings);
    });
    HP.Util.forEach(collection_settings.relations.belongs_to, function(relation_settings, relation_collection_singular_name) {
      return HPP.Helpers.Element.setupBelongsToRelation(hpe, relation_collection_singular_name, relation_settings);
    });
    this.actions = {
      doGet: function(user_options) {
        return HPP.Helpers.Element.doAction(hpe, 'GET', user_options);
      },
      doPost: function(user_options) {
        return HPP.Helpers.Element.doAction(hpe, 'POST', user_options);
      },
      doPut: function(user_options) {
        return HPP.Helpers.Element.doAction(hpe, 'PUT', user_options);
      },
      doDelete: function(user_options) {
        return HPP.Helpers.Element.doAction(hpe, 'DELETE', user_options);
      }
    };
    HP.Util.forEach(collection_settings.actions, function(action_settings, action_name) {
      return hpe.actions["do" + (HP.Util.upperCamelize(action_name))] = function(user_options) {
        if (hpe.isNew() && !action_settings.without_selector) {
          throw new Error('Element is new');
        }
        return HPP.Helpers.Element.doCustomAction(hpe, action_name, action_settings, user_options);
      };
    });
    this.snapshots = {
      getLastPersisted: function() {
        var last_persisted_snapshot;
        if (hpe.isNew()) {
          return null;
        }
        last_persisted_snapshot = null;
        HP.Util.reverseForIn(hpe.snapshots.list, function(k, v) {
          if (v.tag === 'after_post' || v.tag === 'after_put' || v.tag === 'after_get' || v.tag === 'creation') {
            last_persisted_snapshot = v;
            return HP.Util.BREAK;
          }
        });
        return last_persisted_snapshot;
      },
      getLastWithTag: function(tag) {
        var last_snapshot_with_tag;
        last_snapshot_with_tag = null;
        if (HP.Util.isRegex(tag)) {
          HP.Util.reverseForIn(hpe.snapshots.list, function(k, v) {
            if (tag.test(v.tag)) {
              last_snapshot_with_tag = v;
              return HP.Util.BREAK;
            }
          });
        } else {
          HP.Util.reverseForIn(hpe.snapshots.list, function(k, v) {
            if (v.tag === tag) {
              last_snapshot_with_tag = v;
              return HP.Util.BREAK;
            }
          });
        }
        return last_snapshot_with_tag;
      },
      getLast: function() {
        var last_snapshot;
        last_snapshot = null;
        HP.Util.reverseForIn(hpe.snapshots.list, function(k, v) {
          last_snapshot = v;
          return HP.Util.BREAK;
        });
        return last_snapshot;
      },
      make: function(tag) {
        var date, list, s;
        date = Date.now();
        list = hpe.snapshots.list = HPP.Helpers.Snapshot.removeAfter(hpe.last_snapshot_time, hpe.snapshots.list);
        if (list[date]) {
          return hpe.snapshots.make(tag);
        }
        s = list[date] = {
          tag: tag,
          time: date,
          data: HPP.Helpers.Element.getFields(hpe),
          revert: function() {
            return hpe.undo(date);
          }
        };
        hpe.last_snapshot_time = date;
        return s;
      },
      list: {}
    };
    this.last_snapshot_time = null;
    this.snapshots.make('creation');
  }

  Element.prototype.getCollection = function() {
    return this.collection;
  };

  Element.prototype.getCollectionName = function() {
    return this.collection.getName();
  };

  Element.prototype.getSelectorValue = function() {
    return this.fields[this.collection.selector_name];
  };

  Element.prototype.getField = function(field_name) {
    return this.fields[field_name];
  };

  Element.prototype.setField = function(field_name, field_value) {
    this.fields[field_name] = field_value;
    return this;
  };

  Element.prototype.remove = function() {
    var hpe;
    hpe = this;
    if (this.isNew()) {
      HP.Util.removeFromArray(this.getCollection().new_elements, this);
      return {
        then: (function(fn) {
          return fn();
        }),
        "catch": function() {}
      };
    } else {
      return this.actions.doDelete().then(function() {
        var elements;
        elements = hpe.getCollection().elements;
        return delete elements[hpe.getSelectorValue()];
      });
    }
  };

  Element.prototype.save = function() {
    if (this.isNew()) {
      return this.actions.doPost();
    } else {
      return this.actions.doPut();
    }
  };

  Element.prototype.isNew = function() {
    if (this.getCollection().new_elements.includes(this)) {
      if (this.getSelectorValue()) {
        throw new Error('Element has a selector value but is in new_elements array');
      } else {
        return true;
      }
    } else {
      if (!this.getSelectorValue()) {
        throw new Error('Element has no selector value but is in elements object');
      } else {
        return false;
      }
    }
  };

  Element.prototype.undo = function(n) {
    var a, d, ds, index, j, len, length, ref, v;
    if (n == null) {
      n = 0;
    }
    if (HP.Util.isInteger(n)) {
      if (n > 1000000) {
        if (this.snapshots.list[n]) {
          this.mergeWith(this.snapshots.list[n].data);
          return this.last_snapshot_time = n;
        } else {
          throw new Error("Diff at time " + n + " does not exist");
        }
      } else if (n < 0) {
        throw new Error(n + " is smaller than 0");
      } else {
        ds = HPP.Helpers.Snapshot.getSortedArray(this.snapshots.list);
        length = ds.length;
        index = ds.indexOf(this.snapshots.list[this.last_snapshot_time]);
        d = ds[index - n];
        this.mergeWith(d.data);
        return this.last_snapshot_time = d.time;
      }
    } else if (HP.Util.isString(n)) {
      a = null;
      ref = HPP.Helpers.Snapshot.getSortedArray(this.snapshots.list);
      for (j = 0, len = ref.length; j < len; j++) {
        v = ref[j];
        if (v.tag === n) {
          a || (a = v);
        }
      }
      if (a) {
        return this.mergeWith(a.data);
      } else {
        throw new Error("No snapshot found with tag " + n);
      }
    } else {
      throw new TypeError("Don't know what to do with " + n);
    }
  };

  Element.prototype.mergeWith = function(pre_element) {
    var collection_settings, hpe;
    hpe = this;
    collection_settings = HPP.Helpers.Collection.getSettings(this.collection);
    HP.Util.forEach(collection_settings.fields, function(field_settings, field_name) {
      var field_value, sv_1;
      if (field_value = pre_element[field_name]) {
        if (field_settings.embedded_element) {
          return HPP.Helpers.Field.handleEmbeddedElement(hpe, pre_element, field_name, field_settings);
        } else if (field_settings.embedded_collection) {
          return HPP.Helpers.Field.handleEmbeddedCollection(hpe, pre_element, field_name, field_settings);
        } else {
          sv_1 = hpe.fields[field_name];
          if (field_settings.selector && sv_1 !== field_value && sv_1 && field_value) {
            throw new Error("Selector has changed from " + sv_1 + " to " + field_value);
          }
          return hpe.setField(field_name, field_value, true);
        }
      }
    });
    return this;
  };

  Element.prototype.isPersisted = function() {
    var data, k, ref, v;
    if (this.isNew()) {
      return false;
    }
    data = this.snapshots.getLastPersisted().data;
    ref = HPP.Helpers.Element.getFields(this);
    for (k in ref) {
      v = ref[k];
      if (data[k] !== v) {
        return false;
      }
    }
    return true;
  };

  return Element;

})();

HP.Collection = (function() {
  function Collection(scheme1, name1) {
    var field_name, field_settings, hpc, ref, settings;
    this.scheme = scheme1;
    this.name = name1;
    hpc = this;
    this.elements = {};
    this.new_elements = [];
    this.default_pre_element = {};
    this.selector_name = null;
    settings = HPP.Helpers.Collection.getSettings(this);
    ref = settings.fields;
    for (field_name in ref) {
      field_settings = ref[field_name];
      if (field_settings.selector) {
        this.selector_name = field_name;
      }
      if (field_settings["default"]) {
        this.default_pre_element[field_name] = field_settings["default"];
      }
    }
    this.actions = {
      doGetAll: function(user_options) {
        return HPP.Helpers.Collection.doGetAllAction(hpc, user_options);
      },
      doGetOne: function(selector_value, user_options) {
        return HPP.Helpers.Collection.doGetOneAction(hpc, selector_value, user_options);
      }
    };
    HP.Util.forEach(settings.collection_actions, function(action_settings, action_name) {
      return hpc.actions["do" + (HP.Util.upperCamelize(action_name))] = function(user_options) {
        return HPP.Helpers.Collection.doCustomAction(hpc, action_name, action_settings, user_options);
      };
    });
  }

  Collection.prototype.handlePreloadedElements = function() {
    var collection_tag, collection_tags, element_tag, element_tags, j, l, len, len1, len2, m, pre_element, ref, results;
    collection_tags = document.querySelectorAll("meta[name=httpong-collection][collection=\"" + this.name + "\"][scheme=\"" + (this.scheme.getName()) + "\"]");
    element_tags = document.querySelectorAll("meta[name=httpong-element][collection=\"" + this.name + "\"][scheme=\"" + (this.scheme.getName()) + "\"]");
    for (j = 0, len = collection_tags.length; j < len; j++) {
      collection_tag = collection_tags[j];
      ref = JSON.parse(collection_tag.content);
      for (l = 0, len1 = ref.length; l < len1; l++) {
        pre_element = ref[l];
        this.makeOrMerge(pre_element);
      }
    }
    results = [];
    for (m = 0, len2 = element_tags.length; m < len2; m++) {
      element_tag = element_tags[m];
      results.push(this.makeOrMerge(JSON.parse(element_tag.content)));
    }
    return results;
  };

  Collection.prototype.getName = function() {
    return this.name;
  };

  Collection.prototype.getPluralName = Collection.prototype.getName;

  Collection.prototype.getSingularName = function() {
    return HPP.Helpers.Collection.getSingularName(this);
  };

  Collection.prototype.getScheme = function() {
    return this.scheme;
  };

  Collection.prototype.getArray = function(options) {
    var arr;
    if (options == null) {
      options = {
        without_new: false
      };
    }
    arr = options.without_new ? [] : this.new_elements;
    return arr.concat(Object.values(this.elements));
  };

  Collection.prototype.find = function(selector_value) {
    return this.elements[selector_value];
  };

  Collection.prototype.findBy = function(field_name, field_value, options) {
    var arr, element, is_correct, j, l, len, len1, len2, len3, m, p, props, response_arr;
    if (options == null) {
      options = {
        without_new: false,
        multiple: false
      };
    }
    if (HP.Util.isString(field_name)) {
      arr = this.getArray(options);
      if (options.multiple) {
        response_arr = [];
        for (j = 0, len = arr.length; j < len; j++) {
          element = arr[j];
          if (element.getField(field_name, true) === field_value) {
            response_arr.push(element);
          }
        }
        return response_arr;
      } else {
        for (l = 0, len1 = arr.length; l < len1; l++) {
          element = arr[l];
          if (element.getField(field_name, true) === field_value) {
            return element;
          }
        }
      }
    } else {
      props = field_name;
      options = field_value || {
        without_new: false,
        multiple: false
      };
      arr = this.getArray(options);
      if (options.multiple) {
        response_arr = [];
        for (m = 0, len2 = arr.length; m < len2; m++) {
          element = arr[m];
          is_correct = true;
          for (field_name in props) {
            field_value = props[field_name];
            if (element.getField(field_name, true) !== field_value) {
              is_correct = false;
              break;
            }
          }
          if (is_correct) {
            response_arr.push(element);
          }
        }
        return response_arr;
      } else {
        for (p = 0, len3 = arr.length; p < len3; p++) {
          element = arr[p];
          is_correct = true;
          for (field_name in props) {
            field_value = props[field_name];
            if (element.getField(field_name, true) !== field_value) {
              is_correct = false;
              break;
            }
          }
          if (is_correct) {
            return element;
          }
        }
      }
    }
  };

  Collection.prototype.makeNewElement = function(pre_element) {
    var el;
    if (pre_element == null) {
      pre_element = this.default_pre_element;
    }
    el = new HP.Element(this, pre_element);
    this.addElement(el);
    return el;
  };

  Collection.prototype.addElement = function(el) {
    if (el.getSelectorValue()) {
      return this.elements[el.getSelectorValue()] = el;
    } else {
      return this.new_elements.push(el);
    }
  };

  Collection.prototype.makeOrMerge = function(pre_element) {
    var el, sv;
    if (sv = pre_element[this.selector_name]) {
      if (el = this.find(sv)) {
        return el.mergeWith(pre_element);
      } else {
        return this.makeNewElement(pre_element);
      }
    } else {
      return this.makeNewElement(pre_element);
    }
  };

  return Collection;

})();

Object.values || (Object.values = function values(obj) {
	var vals = [];
	for (var key in obj) {
		if (obj.hasOwnProperty(key) && obj.propertyIsEnumerable(key)) {
			vals.push(obj[key]);
		}
	}
	return vals;
}
);

(base = Array.prototype).includes || (base.includes = function(e) {
  return this.indexOf(e) > -1;
});

(base1 = String.prototype).includes || (base1.includes = function(e) {
  return this.indexOf(e) > -1;
});

HP.Util = {
  BREAK: new Object(),
  kebab: function(string) {
    return string.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replace(/(é|ë)/g, 'e').split(' ').join('-');
  },
  unkebab: function(string) {
    return string.split('-').join(' ');
  },
  unsnake: function(string) {
    return string.split('_').join(' ');
  },
  capitalize: function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  camelize: function(str) {
    return str.replace(/_/g, ' ').replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      if (index === 0) {
        return letter.toLowerCase();
      } else {
        return letter.toUpperCase();
      }
    }).replace(/\s+/g, '');
  },
  upperCamelize: function(str) {
    return str.replace(/_/g, ' ').replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      return letter.toUpperCase();
    }).replace(/\s+/g, '');
  },
  arrayDiff: function(array1, array2) {
    return array1.filter(function(i) {
      return array2.indexOf(i) < 0;
    });
  },
  removeFromArray: function(array, element) {
    var i;
    i = array.indexOf(element);
    if (i === -1) {
      return false;
    } else {
      array.splice(i, i + 1);
      return true;
    }
  },
  copy: function(obj) {
    var attr, copy;
    if (null === obj || 'object' !== typeof obj) {
      return obj;
    }
    copy = obj.constructor();
    for (attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = obj[attr];
      }
    }
    return copy;
  },
  merge: function(obj1, obj2) {
    var attr;
    for (attr in obj2) {
      obj1[attr] = obj2[attr];
    }
    return obj1;
  },
  isInteger: function(value) {
    return value === parseInt(value, 10);
  },
  isNumber: function(value) {
    return isFinite(value) && !isNaN(parseFloat(value));
  },
  isString: function(value) {
    return typeof value === 'string';
  },
  isRegex: function(value) {
    return value instanceof RegExp;
  },
  forEach: function(o, f) {
    var k, v;
    for (k in o) {
      v = o[k];
      if (!o.hasOwnProperty(k)) {
        continue;
      }
      if (f(v, k) === HP.Util.BREAK) {
        break;
      }
    }
  },
  reverseForIn: function(obj, f) {
    var _break, arr, i, key, v;
    arr = [];
    _break = false;
    for (key in obj) {
      arr.push(key);
    }
    i = arr.length - 1;
    while (i >= 0 && !_break) {
      v = f.call(obj, arr[i], obj[arr[i]]);
      if (v === HP.Util.BREAK) {
        _break = true;
      }
      i--;
    }
  },
  endsWith: function(string, search) {
    if (string.endsWith) {
      return string.endsWith(search);
    } else {
      return string.substr(-search.length) === search;
    }
  },
  startsWith: function(string, search) {
    if (string.startsWith) {
      return string.startsWith(search);
    } else {
      return string.substr(0, search.length) === search;
    }
  }
};

HPP.Helpers.Ajax = {
  executeRequest: function(url, method, data, headers) {
    var options;
    if (headers == null) {
      headers = {};
    }
    headers['Accept'] = headers['Content-Type'] = 'application/json';
    options = {
      method: method,
      url: url,
      data: JSON.stringify(data === void 0 ? {} : data),
      headers: headers,
      dataType: 'json',
      responseType: 'json'
    };
    options.type = options.method;
    options.body = options.data;
    return HPP.http_function(options.url, options);
  }
};

HPP.Helpers.Collection = {
  getSettings: function(c) {
    return c.getScheme().data.collections[c.getName()];
  },
  getSingularName: function(c) {
    return HPP.Helpers.Collection.getSettings(c).singular;
  }
};

HPP.Helpers.Element = {
  toData: function(element) {
    var collection, data, o;
    collection = element.getCollection();
    o = HPP.Helpers.Element.getFields(element);
    return data = o;
  },
  getFields: function(element) {
    var collection, field_name, field_settings, field_value, o, ref, scheme;
    collection = element.getCollection();
    scheme = collection.getScheme();
    o = {};
    ref = scheme.data.collections[collection.getName()].fields;
    for (field_name in ref) {
      field_settings = ref[field_name];
      if (field_settings.only_receive || field_settings.embedded_collection || field_settings.embedded_element) {
        continue;
      }
      field_value = element.getField(field_name);
      o[field_name] = field_value;
    }
    return o;
  }
};

HPP.Helpers.Field = {};

HPP.Helpers.Snapshot = {
  getSortedArray: function(snapshots_list) {
    var arr;
    arr = Object.values(snapshots_list);
    arr.sort(function(a, b) {
      return a.time - b.time;
    });
    return arr;
  },
  removeAfter: function(time, snapshots_list) {
    var arr, j, len, snapshots_list_2, v;
    arr = HPP.Helpers.Snapshot.getSortedArray(snapshots_list);
    snapshots_list_2 = {};
    for (j = 0, len = arr.length; j < len; j++) {
      v = arr[j];
      if (v.time <= time) {
        snapshots_list_2[v.time] = v;
      }
    }
    return snapshots_list_2;
  }
};

HPP.Helpers.Url = {
  createForElement: function(action_name, action_settings, element, user_options) {
    var api_url, collection, path, scheme, url;
    collection = element.getCollection();
    scheme = collection.getScheme();
    api_url = scheme.getApiUrl();
    if (!api_url) {
      throw new Error('Api url has not yet been set');
    }
    if (user_options.path) {
      path = HPP.Helpers.Url.trimSlashes(user_options.path);
      url = api_url + "/" + path;
    } else {
      url = api_url + "/" + (collection.getName());
      if (!(action_settings.without_selector || action_name === 'POST')) {
        url = url + "/" + (element.getSelectorValue());
      }
    }
    if (action_settings.method) {
      url = url + "/" + (action_settings.path || action_name);
    }
    if (user_options.suffix) {
      url = url + "/" + user_options.suffix;
    }
    return url;
  },
  createForCollection: function(action_name, collection, user_options) {
    var url;
    url = (collection.getScheme().getApiUrl()) + "/" + (collection.getName());
    if (user_options.suffix) {
      url = url + "/" + user_options.suffix;
    }
    return url;
  },
  trimSlashes: function(s) {
    return s.replace(/\/$/, '').replace(/^\//, '');
  }
};

HPP.Helpers.Collection.doGetAllAction = function(hpc, user_options) {
  var data, promise;
  if (user_options == null) {
    user_options = {};
  }
  data = user_options.data;
  promise = HPP.Helpers.Ajax.executeRequest(HPP.Helpers.Url.createForCollection('GET', hpc, user_options), 'GET', data, user_options.headers);
  promise.then(function(response) {
    var j, len, pre_element, ref, results;
    ref = response.data;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      pre_element = ref[j];
      results.push(hpc.makeOrMerge(pre_element));
    }
    return results;
  });
  return promise;
};

HPP.Helpers.Collection.doGetOneAction = function(hpc, selector_value, user_options) {
  var data, promise;
  if (user_options == null) {
    user_options = {};
  }
  data = user_options.data;
  promise = HPP.Helpers.Ajax.executeRequest(HPP.Helpers.Url.createForCollection('GET', hpc, {
    suffix: selector_value
  }), 'GET', data, user_options.headers);
  promise.then(function(response) {
    if (response.data) {
      return hpc.makeOrMerge(response.data);
    }
  });
  return promise;
};

HPP.Helpers.Collection.doCustomAction = function(hpc, action_name, action_settings, user_options) {
  var data, method;
  if (user_options == null) {
    user_options = {};
  }
  method = action_settings.method.toUpperCase();
  data = user_options.data;
  return HPP.Helpers.Ajax.executeRequest(HPP.Helpers.Url.createForCollection('GET', hpc, {
    suffix: action_settings.path || action_name
  }), method, data, user_options.headers);
};

HPP.Helpers.Element.setupBelongsToRelation = function(hpe, relation_collection_singular_name, relation_settings) {
  var collection, collection_field_name, collection_selector_field, field_name, relation_collection;
  collection = hpe.getCollection();
  if (!relation_settings.polymorphic) {
    if (relation_settings.collection) {
      relation_collection = collection.getScheme().getCollection(relation_settings.collection);
    } else {
      relation_collection = collection.getScheme().getCollectionBySingularName(relation_collection_singular_name);
    }
  }
  if (relation_settings.polymorphic) {
    collection_field_name = relation_settings.collection_field || (relation_collection_singular_name + "_collection");
    collection_selector_field = relation_settings.collection_selector_field;
    field_name = relation_settings.field;
    return hpe.relations["get" + (HP.Util.upperCamelize(relation_collection_singular_name))] = function() {
      return HPP.Helpers.Element.getPolymorphicBelongsToElement(hpe, field_name, collection_field_name, collection_selector_field, relation_collection_singular_name);
    };
  } else {
    field_name = relation_settings.field || (relation_collection_singular_name + "_" + relation_collection.selector_name);
    return hpe.relations["get" + (HP.Util.upperCamelize(relation_collection_singular_name))] = function() {
      return HPP.Helpers.Element.getBelongsToElement(hpe, relation_collection, field_name);
    };
  }
};

HPP.Helpers.Element.getBelongsToElement = function(hpe, relation_collection, field_name) {
  var selector_value;
  selector_value = hpe.getField(field_name, true, 'belongs_to');
  return relation_collection.find(selector_value) || null;
};

HPP.Helpers.Element.getPolymorphicBelongsToElement = function(hpe, field_name, collection_field_name, collection_selector_field, collection_singular_name) {
  var relation_collection, relation_collection_name, selector_value;
  relation_collection_name = hpe.getField(collection_field_name, true, 'belongs_to_collection');
  relation_collection = hpe.getCollection().getScheme().getCollection(relation_collection_name);
  if (!field_name) {
    collection_selector_field || (collection_selector_field = relation_collection.selector_name);
    field_name = collection_singular_name + "_" + collection_selector_field;
  }
  selector_value = hpe.getField(field_name, true, 'belongs_to');
  return relation_collection.find(selector_value) || null;
};

HPP.Helpers.Element.setupHasManyRelation = function(hpe, relation_collection_name, relation_settings) {
  var collection, collection_settings, references_field_name, relation_collection, relation_field_settings;
  collection = hpe.getCollection();
  collection_settings = HPP.Helpers.Collection.getSettings(hpe.getCollection());
  relation_collection = collection.getScheme().getCollection(relation_settings.collection || relation_collection_name);
  references_field_name = relation_settings.references_field || (relation_collection_name + "_" + relation_collection.selector_name + "s");
  if (relation_field_settings = collection_settings.fields[references_field_name]) {
    return hpe.relations["get" + (HP.Util.upperCamelize(relation_collection_name))] = function() {
      return HPP.Helpers.Element.getHasManyRelationArrayThroughReferencesField(hpe, relation_collection, field_name);
    };
  } else {
    return hpe.relations["get" + (HP.Util.upperCamelize(relation_collection_name))] = HPP.Helpers.Element.getHasManyRelationFunction(hpe, collection, relation_settings, relation_collection);
  }
};

HPP.Helpers.Element.getHasManyRelationFunction = function(hpe, collection, relation_settings, relation_collection) {
  var collection_singular_name, has_many_collection_field_name, has_many_field_name, relation_collection_settings;
  collection_singular_name = collection.getSingularName();
  relation_collection_settings = HPP.Helpers.Collection.getSettings(relation_collection);
  if (relation_settings.polymorphic) {
    has_many_field_name = relation_settings.as + "_" + collection.selector_name;
    has_many_collection_field_name = relation_settings.as + "_collection";
    return function() {
      return HPP.Helpers.Element.getPolymorphicHasManyRelationArray(hpe, relation_collection, has_many_field_name, has_many_collection_field_name);
    };
  } else {
    has_many_field_name = relation_settings.field ? relation_settings.field : relation_settings.as ? relation_settings.as + "_" + collection.selector_name : collection_singular_name + "_" + collection.selector_name;
    return function() {
      return HPP.Helpers.Element.getHasManyRelationArray(hpe, relation_collection, has_many_field_name);
    };
  }
};

HPP.Helpers.Element.getHasManyRelationArray = function(hpe, relation_collection, has_many_field_name) {
  var hpe2, hpe2_arr, j, len, ref, selector_value;
  hpe2_arr = [];
  selector_value = hpe.getSelectorValue();
  ref = relation_collection.getArray();
  for (j = 0, len = ref.length; j < len; j++) {
    hpe2 = ref[j];
    if (selector_value === hpe2.getField(has_many_field_name, true, 'has_many')) {
      hpe2_arr.push(hpe2);
    }
  }
  return hpe2_arr;
};

HPP.Helpers.Element.getPolymorphicHasManyRelationArray = function(hpe, relation_collection, has_many_field_name, has_many_collection_field_name) {
  var collection_name, hpe2, hpe2_arr, j, len, ref, selector_value;
  hpe2_arr = [];
  selector_value = hpe.getSelectorValue();
  collection_name = hpe.getCollection().getName();
  ref = relation_collection.getArray();
  for (j = 0, len = ref.length; j < len; j++) {
    hpe2 = ref[j];
    if (selector_value === hpe2.getField(has_many_field_name, true, 'has_many') && collection_name === hpe2.getField(has_many_collection_field_name, true, 'has_many_collection_name')) {
      hpe2_arr.push(hpe2);
    }
  }
  return hpe2_arr;
};

HPP.Helpers.Element.getHasManyRelationArrayThroughReferencesField = function(hpe, relation_collection, field_name) {
  var hpe2, hpe2_arr, j, len, ref, selector_value_arr;
  selector_value_arr = hpe.getField(field_name, true, 'has_many_array');
  if (!Array.isArray(selector_value_arr)) {
    throw new Error("Field " + field_name + " is not an array, but it should be an array of references to " + (relation_collection.getName()));
  }
  hpe2_arr = [];
  ref = relation_collection.getArray();
  for (j = 0, len = ref.length; j < len; j++) {
    hpe2 = ref[j];
    if (selector_value_arr.includes(hpe.getSelectorValue())) {
      hpe2_arr.push(hpe2);
    }
  }
  return hpe2_arr;
};

HPP.Helpers.Element.setupHasOneRelation = function(hpe, relation_collection_singular_name, relation_settings) {
  var collection, collection_settings, relation_collection, scheme;
  collection = hpe.getCollection();
  collection_settings = HPP.Helpers.Collection.getSettings(hpe.getCollection());
  scheme = collection.getScheme();
  if (relation_settings.collection) {
    relation_collection = scheme.getCollection(relation_settings.collection);
  } else {
    relation_collection = scheme.getCollectionBySingularName(relation_collection_singular_name);
  }
  return hpe.relations["get" + (HP.Util.upperCamelize(relation_collection_singular_name))] = function() {
    return HPP.Helpers.Element.getHasManyRelationFunction(hpe, collection, relation_settings, relation_collection)()[0];
  };
};

HPP.Helpers.Element.doAction = function(hpe, method, user_options) {
  var data, promise;
  if (user_options == null) {
    user_options = {};
  }
  hpe.snapshots.make("before_" + (method.toLowerCase()));
  if (user_options.data) {
    data = user_options.data;
  } else if (method !== 'GET') {
    data = HPP.Helpers.Element.toData(hpe);
  }
  if (method === 'POST') {
    if (!hpe.isNew()) {
      throw new Error('Element is not new');
    }
  } else {
    if (hpe.isNew()) {
      throw new Error('Element is new');
    }
  }
  promise = HPP.Helpers.Ajax.executeRequest(HPP.Helpers.Url.createForElement(method, {}, hpe, user_options), method, data, user_options.headers);
  promise.then(function(response) {
    var collection;
    if (response.data) {
      hpe.mergeWith(response.data);
    }
    hpe.snapshots.make("after_" + (method.toLowerCase()));
    collection = hpe.getCollection();
    if (collection.new_elements.includes(hpe)) {
      HP.Util.removeFromArray(collection.new_elements, hpe);
      return collection.elements[hpe.getSelectorValue()] = hpe;
    }
  });
  return promise;
};

HPP.Helpers.Element.doCustomAction = function(hpe, action_name, action_settings, user_options) {
  var data, method, promise;
  if (user_options == null) {
    user_options = {};
  }
  method = action_settings.method.toUpperCase();
  hpe.snapshots.make("before_" + (method.toLowerCase()));
  if (user_options.data) {
    data = user_options.data;
  } else if (!action_settings.without_data) {
    data = HPP.Helpers.Element.toData(hpe);
  }
  promise = HPP.Helpers.Ajax.executeRequest(HPP.Helpers.Url.createForElement(action_name, action_settings, hpe, user_options), method, data, user_options.headers);
  promise.then(function(response) {
    var collection, selector_value;
    if (!action_settings.returns_other) {
      if (response.data) {
        hpe.mergeWith(response.data);
      }
      hpe.snapshots.make("after_" + (method.toLowerCase()));
    }
    collection = hpe.getCollection();
    if ((selector_value = hpe.getSelectorValue()) && collection.new_elements.includes(hpe)) {
      HP.Util.removeFromArray(collection.new_elements, hpe);
      return collection.elements[selector_value] = hpe;
    }
  });
  return promise;
};

HPP.Helpers.Field.handleEmbeddedCollection = function(hpe, pre_element, field_name, field_settings) {
  var collection, embedded_element_collection, embedded_pre_collection, scheme;
  embedded_pre_collection = pre_element[field_name];
  if (!embedded_pre_collection && !field_settings.required) {
    return;
  }
  collection = hpe.getCollection();
  scheme = collection.getScheme();
  embedded_element_collection = scheme.getCollection(field_name || field_settings.collection);
  return HP.Util.forEach(embedded_pre_collection, function(embedded_pre_element) {
    var embedded_element;
    embedded_element = new HP.Element(embedded_element_collection, embedded_pre_element);
    return embedded_element_collection.addElement(embedded_element);
  });
};

HPP.Helpers.Field.handleEmbeddedElement = function(hpe, pre_element, field_name, field_settings) {
  var associated_field_name, collection, embedded_element, embedded_element_collection, embedded_pre_element, scheme;
  embedded_pre_element = pre_element[field_name];
  if (!embedded_pre_element && !field_settings.required) {
    return;
  }
  collection = hpe.getCollection();
  scheme = collection.getScheme();
  if (field_settings.collection) {
    embedded_element_collection = scheme.getCollection(field_settings.collection);
  } else {
    embedded_element_collection = scheme.getCollectionBySingularName(field_name);
  }
  embedded_element = embedded_element_collection.makeOrMerge(embedded_pre_element);
  associated_field_name = field_settings.associated_field || (field_name + "_" + embedded_element_collection.selector_name);
  return hpe.setField(associated_field_name, embedded_element.getSelectorValue());
};

return HTTPong;
}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9kaXN0L2h0dHBvbmcuanMiLCIvZGlzdC9odHRwb25nLmpzIiwiL2Rpc3QvaHR0cG9uZy5qcyIsIi9kaXN0L2h0dHBvbmcuanMiLCIvZGlzdC9odHRwb25nLmpzIiwiL2Rpc3QvaHR0cG9uZy5qcyIsIi9kaXN0L2h0dHBvbmcuanMiLCIvZGlzdC9odHRwb25nLmpzIiwiL2Rpc3QvaHR0cG9uZy5qcyIsIi9kaXN0L2h0dHBvbmcuanMiLCIvZGlzdC9odHRwb25nLmpzIiwiL2Rpc3QvaHR0cG9uZy5qcyIsIi9kaXN0L2h0dHBvbmcuanMiLCIvZGlzdC9odHRwb25nLmpzIiwiL2Rpc3QvaHR0cG9uZy5qcyIsIi9kaXN0L2h0dHBvbmcuanMiLCIvZGlzdC9odHRwb25nLmpzIiwiL2Rpc3QvaHR0cG9uZy5qcyIsIi9kaXN0L2h0dHBvbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBS0EsSUFBQTs7QUFBQSxPQUFBLEdBQUEsRUFBQSxHQUFBOztBQUNBLEVBQUEsRUFBQSxPQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUE7RUFDQSxHQUFBLEVBQUEsU0FBQTtXQUNBLE9BQUEsQ0FBQSxHQUFBLENBQUEsS0FBQSxDQUFBLE9BQUEsRUFBQSxDQUFBLGFBQUEsRUFBQSxrQ0FBQSxDQUFBLENBQUEsTUFBQSxDQUFBLEtBQUEsQ0FBQSxJQUFBLENBQUEsU0FBQSxDQUFBLENBQUE7RUFEQSxDQURBO0VBR0EsT0FBQSxFQUFBLEVBSEE7RUFJQSxhQUFBLEVBQUEsSUFKQTtFQUtBLEtBQUEsRUFBQSxTQUFBLENBQUE7V0FDQSxDQUFBLENBQUEsV0FBQSxLQUFBLEVBQUEsQ0FBQTtFQURBLENBTEE7RUFPQSxLQUFBLEVBQUEsU0FBQSxDQUFBO1dBQ0EsQ0FBQSxDQUFBLFdBQUEsS0FBQSxFQUFBLENBQUE7RUFEQSxDQVBBO0VBU0EsT0FBQSxFQUFBLEVBVEE7OztBQWlCQSxFQUFBLENBQUEsU0FBQSxHQUFBLFNBQUEsVUFBQTtBQUNBLE1BQUE7RUFBQSxNQUFBLEdBQUEsSUFBQSxFQUFBLENBQUEsTUFBQSxDQUFBLFVBQUE7RUFDQSxJQUFBLEdBQUEsQ0FBQSxPQUFBLENBQUEsTUFBQSxDQUFBLE9BQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxVQUFBLElBQUEsS0FBQSxDQUFBLHFCQUFBLEdBQUEsQ0FBQSxNQUFBLENBQUEsT0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLGlCQUFBLEVBREE7O1NBR0EsR0FBQSxDQUFBLE9BQUEsQ0FBQSxNQUFBLENBQUEsT0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBO0FBTEE7O0FBV0EsRUFBQSxDQUFBLFNBQUEsR0FBQSxTQUFBLElBQUE7U0FDQSxHQUFBLENBQUEsT0FBQSxDQUFBLElBQUE7QUFEQTs7QUFNQSxFQUFBLENBQUEsVUFBQSxHQUFBLFNBQUE7QUFDQSxNQUFBO0VBQUEsV0FBQSxHQUFBLFFBQUEsQ0FBQSxnQkFBQSxDQUFBLDJCQUFBO0VBQ0EsSUFBQSxDQUFBLFdBQUEsQ0FBQSxNQUFBLElBQUEsQ0FBQSxNQUFBLENBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQSxPQUFBLENBQUEsQ0FBQSxNQUFBO0FBQ0EsVUFBQSxJQUFBLEtBQUEsQ0FBQSwwQkFBQSxFQURBOztBQUdBLE9BQUEsNkNBQUE7O0lBQ0EsRUFBQSxDQUFBLFNBQUEsQ0FBQSxJQUFBLENBQUEsS0FBQSxDQUFBLFVBQUEsQ0FBQSxPQUFBLENBQUE7QUFEQTtBQUdBO0FBQUEsT0FBQSxrQkFBQTs7QUFDQTtBQUFBLFNBQUEsdUJBQUE7O01BQ0EsVUFBQSxDQUFBLHVCQUFBLENBQUE7QUFEQTtBQURBO0FBSUEsU0FBQTtBQVpBOztBQXVCQSxFQUFBLENBQUEsZUFBQSxHQUFBLFNBQUEsRUFBQSxFQUFBLElBQUE7RUFDQSxJQUFBLElBQUEsS0FBQSxRQUFBLElBQ0EsQ0FBQSxPQUFBLE1BQUEsS0FBQSxXQUFBLElBQUEsRUFBQSxLQUFBLE1BQUEsQ0FBQSxJQUFBLENBREE7SUFFQSxHQUFBLENBQUEsYUFBQSxHQUFBLFNBQUEsR0FBQSxFQUFBLE1BQUE7QUFDQSxVQUFBO01BQUEsUUFBQSxHQUFBLE1BQUEsQ0FBQSxRQUFBLENBQUE7TUFDQSxJQUFBLEdBQUEsRUFBQSxDQUFBLEdBQUEsRUFBQSxNQUFBO01BQ0EsSUFBQSxDQUFBLElBQUEsQ0FBQSxTQUFBLElBQUEsRUFBQSxNQUFBLEVBQUEsS0FBQTtlQUNBLFFBQUEsQ0FBQSxPQUFBLENBQUE7VUFBQSxJQUFBLEVBQUEsSUFBQTtVQUFBLE1BQUEsRUFBQSxLQUFBLENBQUEsVUFBQSxDQUFBLENBQUEsQ0FBQSxNQUFBO1VBQUEsT0FBQSxFQUFBLEtBQUEsQ0FBQSxxQkFBQSxDQUFBLENBQUE7U0FBQTtNQURBLENBQUE7TUFFQSxJQUFBLEVBQUEsS0FBQSxFQUFBLENBQUEsU0FBQSxJQUFBLEVBQUEsTUFBQSxFQUFBLEtBQUE7ZUFDQSxRQUFBLENBQUEsTUFBQSxDQUFBO1VBQUEsSUFBQSxFQUFBLElBQUE7VUFBQSxNQUFBLEVBQUEsS0FBQSxDQUFBLFVBQUEsQ0FBQSxDQUFBLENBQUEsTUFBQTtVQUFBLE9BQUEsRUFBQSxLQUFBLENBQUEscUJBQUEsQ0FBQSxDQUFBO1NBQUE7TUFEQSxDQUFBO0FBRUEsYUFBQTtJQVBBLEVBRkE7R0FBQSxNQVdBLElBQUEsSUFBQSxLQUFBLE9BQUEsSUFDQSxDQUFBLE9BQUEsTUFBQSxLQUFBLFdBQUEsSUFBQSxFQUFBLEtBQUEsTUFBQSxDQUFBLEtBQUEsQ0FEQTtJQUVBLEdBQUEsQ0FBQSxhQUFBLEdBQUEsU0FBQSxHQUFBLEVBQUEsTUFBQTthQUNBLElBQUEsT0FBQSxDQUFBLFNBQUEsT0FBQSxFQUFBLE1BQUE7QUFDQSxZQUFBO1FBQUEsTUFBQSxDQUFBLElBQUEsR0FBQSxNQUFBLENBQUE7UUFDQSxZQUFBLEdBQUEsRUFBQSxDQUFBLEdBQUEsRUFBQSxNQUFBO1FBQ0EsWUFBQSxDQUFBLElBQUEsQ0FBQSxTQUFBLFFBQUE7QUFDQSxjQUFBO1VBQUEsSUFBQSxRQUFBLENBQUEsT0FBQSxDQUFBLEdBQUEsQ0FBQSxjQUFBLENBQUEsS0FBQSxrQkFBQTttQkFDQSxPQUFBLENBQUEsUUFBQSxFQURBO1dBQUEsTUFBQTtZQUdBLFlBQUEsR0FBQSxRQUFBLENBQUEsSUFBQSxDQUFBO1lBQ0EsWUFBQSxDQUFBLElBQUEsQ0FBQSxTQUFBLElBQUE7Y0FDQSxRQUFBLENBQUEsSUFBQSxHQUFBO3FCQUNBLE9BQUEsQ0FBQSxRQUFBO1lBRkEsQ0FBQTttQkFHQSxZQUFBLEVBQUEsS0FBQSxFQUFBLENBQUEsTUFBQSxFQVBBOztRQURBLENBQUE7ZUFTQSxZQUFBLEVBQUEsS0FBQSxFQUFBLENBQUEsTUFBQTtNQVpBLENBQUE7SUFEQSxFQUZBO0dBQUEsTUFBQTtJQWtCQSxHQUFBLENBQUEsYUFBQSxHQUFBLFNBQUEsR0FBQSxFQUFBLE1BQUE7YUFDQSxFQUFBLENBQUEsTUFBQTtJQURBLEVBbEJBOztBQVpBOztBQy9EQSxFQUFBLENBQUE7RUFDQSxnQkFBQSxVQUFBLEVBQUEsT0FBQTs7TUFBQSxVQUFBO1FBQUEsWUFBQSxFQUFBLEtBQUE7UUFBQSxxQkFBQSxFQUFBLEtBQUE7OztJQUNBLElBQUEsQ0FBQSxJQUFBLEdBQUE7SUFDQSxJQUFBLENBQUEsV0FBQSxHQUFBO0lBQ0EsSUFBQSxDQUFBLE9BQUEsR0FBQTtJQUNBLElBQUEsQ0FBQSxPQUFBLENBQUEsWUFBQTtNQUFBLElBQUEsQ0FBQSxTQUFBLENBQUEsRUFBQTs7SUFDQSxJQUFBLENBQUEsT0FBQSxDQUFBLHFCQUFBO01BQUEsSUFBQSxDQUFBLGlCQUFBLENBQUEsRUFBQTs7RUFMQTs7bUJBT0EsT0FBQSxHQUFBLFNBQUE7V0FDQSxJQUFBLENBQUEsSUFBQSxDQUFBO0VBREE7O21CQUdBLFNBQUEsR0FBQSxTQUFBO0FBQ0EsUUFBQTtJQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsSUFBQSxHQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsSUFBQSxDQUFBLFdBQUEsQ0FBQTtBQUNBO0FBQUE7U0FBQSxzQkFBQTs7TUFDQSxtQkFBQSxDQUFBLGFBQUEsbUJBQUEsQ0FBQSxXQUFBLGVBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQTtNQUNBLG1CQUFBLENBQUEsWUFBQSxtQkFBQSxDQUFBLFVBQUE7TUFDQSxtQkFBQSxDQUFBLHVCQUFBLG1CQUFBLENBQUEscUJBQUE7TUFDQSxtQkFBQSxDQUFBLGNBQUEsbUJBQUEsQ0FBQSxZQUFBO2NBQ0EsbUJBQUEsQ0FBQSxVQUFBLENBQUEsZ0JBQUEsQ0FBQSxVQUFBO2VBQ0EsbUJBQUEsQ0FBQSxVQUFBLENBQUEsa0JBQUEsQ0FBQSxXQUFBOzRCQUNBLG1CQUFBLENBQUEsVUFBQSxDQUFBLG9CQUFBLENBQUEsYUFBQTtBQVBBOztFQUZBOzttQkFXQSxpQkFBQSxHQUFBLFNBQUE7QUFDQSxRQUFBO0FBQUE7QUFBQTtTQUFBLHNCQUFBOztNQUNBLElBQUEsSUFBQSxDQUFBLFdBQUEsQ0FBQSxlQUFBLENBQUE7UUFDQSxHQUFBLENBQUEsR0FBQSxDQUFBLHVCQUFBLEdBQUEsZUFBQSxHQUFBLDJCQUFBO0FBQ0EsaUJBRkE7O01BR0EsVUFBQSxHQUFBLElBQUEsRUFBQSxDQUFBLFVBQUEsQ0FBQSxJQUFBLEVBQUEsZUFBQTttQkFDQSxJQUFBLENBQUEsV0FBQSxDQUFBLGVBQUEsQ0FBQSxHQUFBO0FBTEE7O0VBREE7O21CQVFBLGFBQUEsR0FBQSxTQUFBLElBQUE7SUFDQSxJQUFBLENBQUEsSUFBQSxDQUFBLFdBQUEsQ0FBQSxJQUFBLENBQUE7QUFDQSxZQUFBLElBQUEsS0FBQSxDQUFBLGFBQUEsR0FBQSxJQUFBLEdBQUEsaUJBQUEsRUFEQTtLQUFBLE1BQUE7YUFHQSxJQUFBLENBQUEsV0FBQSxDQUFBLElBQUEsRUFIQTs7RUFEQTs7bUJBTUEsMkJBQUEsR0FBQSxTQUFBLGFBQUE7QUFDQSxRQUFBO0FBQUE7QUFBQSxTQUFBLHNCQUFBOztNQUNBLElBQUEsVUFBQSxDQUFBLGVBQUEsQ0FBQSxDQUFBLEtBQUEsYUFBQTtBQUFBLGVBQUEsV0FBQTs7QUFEQTtBQUVBLFVBQUEsSUFBQSxLQUFBLENBQUEsYUFBQSxHQUFBLGFBQUEsR0FBQSxpQkFBQTtFQUhBOzttQkFLQSxNQUFBLEdBQUEsTUFBQSxDQUFBLFNBQUEsQ0FBQTs7bUJBRUEsU0FBQSxHQUFBLFNBQUEsR0FBQTtJQUNBLElBQUEsQ0FBQSxPQUFBLEdBQUEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBLENBQUEsV0FBQSxDQUFBLEdBQUE7SUFDQSxJQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsSUFBQSxDQUFBLFVBQUEsQ0FBQSxJQUFBLENBQUEsT0FBQSxFQUFBLFNBQUEsQ0FBQSxJQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQSxDQUFBLElBQUEsQ0FBQSxPQUFBLEVBQUEsVUFBQSxDQUFBLENBQUE7YUFDQSxJQUFBLENBQUEsT0FBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLENBQUEsUUFEQTs7RUFGQTs7bUJBS0EsU0FBQSxHQUFBLFNBQUE7V0FDQSxJQUFBLENBQUE7RUFEQTs7Ozs7O0FDaERBLEVBQUEsQ0FBQTtFQUNBLGlCQUFBLFdBQUEsRUFBQSxXQUFBO0FBQ0EsUUFBQTtJQURBLElBQUEsQ0FBQSxhQUFBO0lBQ0EsR0FBQSxHQUFBO0lBQ0EsSUFBQSxDQUFBLE1BQUEsR0FBQTtJQUNBLElBQUEsQ0FBQSxTQUFBLEdBQUE7SUFFQSxtQkFBQSxHQUFBLEdBQUEsQ0FBQSxPQUFBLENBQUEsVUFBQSxDQUFBLFdBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQTtJQUVBLEVBQUEsQ0FBQSxJQUFBLENBQUEsT0FBQSxDQUFBLG1CQUFBLENBQUEsTUFBQSxFQUFBLFNBQUEsY0FBQSxFQUFBLFVBQUE7QUFDQSxVQUFBO01BQUEsSUFBQSxjQUFBLENBQUEsZ0JBQUE7ZUFDQSxHQUFBLENBQUEsT0FBQSxDQUFBLEtBQUEsQ0FBQSxxQkFBQSxDQUFBLEdBQUEsRUFBQSxXQUFBLEVBQUEsVUFBQSxFQUFBLGNBQUEsRUFEQTtPQUFBLE1BRUEsSUFBQSxjQUFBLENBQUEsbUJBQUE7ZUFDQSxHQUFBLENBQUEsT0FBQSxDQUFBLEtBQUEsQ0FBQSx3QkFBQSxDQUFBLEdBQUEsRUFBQSxXQUFBLEVBQUEsVUFBQSxFQUFBLGNBQUEsRUFEQTtPQUFBLE1BQUE7UUFHQSxJQUFBLGNBQUEsQ0FBQSxTQUFBO0FBQUEsaUJBQUE7O1FBQ0EsV0FBQSxHQUFBLFdBQUEsQ0FBQSxVQUFBO2VBQ0EsR0FBQSxDQUFBLFFBQUEsQ0FBQSxVQUFBLEVBQUEsV0FBQSxFQUFBLElBQUEsRUFMQTs7SUFIQSxDQUFBO0lBVUEsRUFBQSxDQUFBLElBQUEsQ0FBQSxPQUFBLENBQUEsbUJBQUEsQ0FBQSxTQUFBLENBQUEsUUFBQSxFQUFBLFNBQUEsaUJBQUEsRUFBQSx3QkFBQTthQUNBLEdBQUEsQ0FBQSxPQUFBLENBQUEsT0FBQSxDQUFBLG9CQUFBLENBQUEsR0FBQSxFQUFBLHdCQUFBLEVBQUEsaUJBQUE7SUFEQSxDQUFBO0lBR0EsRUFBQSxDQUFBLElBQUEsQ0FBQSxPQUFBLENBQUEsbUJBQUEsQ0FBQSxTQUFBLENBQUEsT0FBQSxFQUFBLFNBQUEsaUJBQUEsRUFBQSxpQ0FBQTthQUNBLEdBQUEsQ0FBQSxPQUFBLENBQUEsT0FBQSxDQUFBLG1CQUFBLENBQUEsR0FBQSxFQUFBLGlDQUFBLEVBQUEsaUJBQUE7SUFEQSxDQUFBO0lBR0EsRUFBQSxDQUFBLElBQUEsQ0FBQSxPQUFBLENBQUEsbUJBQUEsQ0FBQSxTQUFBLENBQUEsVUFBQSxFQUFBLFNBQUEsaUJBQUEsRUFBQSxpQ0FBQTthQUNBLEdBQUEsQ0FBQSxPQUFBLENBQUEsT0FBQSxDQUFBLHNCQUFBLENBQUEsR0FBQSxFQUFBLGlDQUFBLEVBQUEsaUJBQUE7SUFEQSxDQUFBO0lBR0EsSUFBQSxDQUFBLE9BQUEsR0FBQTtNQUNBLEtBQUEsRUFBQSxTQUFBLFlBQUE7ZUFDQSxHQUFBLENBQUEsT0FBQSxDQUFBLE9BQUEsQ0FBQSxRQUFBLENBQUEsR0FBQSxFQUFBLEtBQUEsRUFBQSxZQUFBO01BREEsQ0FEQTtNQUlBLE1BQUEsRUFBQSxTQUFBLFlBQUE7ZUFDQSxHQUFBLENBQUEsT0FBQSxDQUFBLE9BQUEsQ0FBQSxRQUFBLENBQUEsR0FBQSxFQUFBLE1BQUEsRUFBQSxZQUFBO01BREEsQ0FKQTtNQU9BLEtBQUEsRUFBQSxTQUFBLFlBQUE7ZUFDQSxHQUFBLENBQUEsT0FBQSxDQUFBLE9BQUEsQ0FBQSxRQUFBLENBQUEsR0FBQSxFQUFBLEtBQUEsRUFBQSxZQUFBO01BREEsQ0FQQTtNQVVBLFFBQUEsRUFBQSxTQUFBLFlBQUE7ZUFDQSxHQUFBLENBQUEsT0FBQSxDQUFBLE9BQUEsQ0FBQSxRQUFBLENBQUEsR0FBQSxFQUFBLFFBQUEsRUFBQSxZQUFBO01BREEsQ0FWQTs7SUFjQSxFQUFBLENBQUEsSUFBQSxDQUFBLE9BQUEsQ0FBQSxtQkFBQSxDQUFBLE9BQUEsRUFBQSxTQUFBLGVBQUEsRUFBQSxXQUFBO2FBQ0EsR0FBQSxDQUFBLE9BQUEsQ0FBQSxJQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsSUFBQSxDQUFBLGFBQUEsQ0FBQSxXQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsU0FBQSxZQUFBO1FBQ0EsSUFBQSxHQUFBLENBQUEsS0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLGVBQUEsQ0FBQSxnQkFBQTtBQUFBLGdCQUFBLElBQUEsS0FBQSxDQUFBLGdCQUFBLEVBQUE7O2VBQ0EsR0FBQSxDQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUEsY0FBQSxDQUFBLEdBQUEsRUFBQSxXQUFBLEVBQUEsZUFBQSxFQUFBLFlBQUE7TUFGQTtJQURBLENBQUE7SUFLQSxJQUFBLENBQUEsU0FBQSxHQUFBO01BQ0EsZ0JBQUEsRUFBQSxTQUFBO0FBQ0EsWUFBQTtRQUFBLElBQUEsR0FBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBO0FBQUEsaUJBQUEsS0FBQTs7UUFDQSx1QkFBQSxHQUFBO1FBQ0EsRUFBQSxDQUFBLElBQUEsQ0FBQSxZQUFBLENBQUEsR0FBQSxDQUFBLFNBQUEsQ0FBQSxJQUFBLEVBQUEsU0FBQSxDQUFBLEVBQUEsQ0FBQTtVQUNBLElBQUEsQ0FBQSxDQUFBLEdBQUEsS0FBQSxZQUFBLElBQUEsQ0FBQSxDQUFBLEdBQUEsS0FBQSxXQUFBLElBQUEsQ0FBQSxDQUFBLEdBQUEsS0FBQSxXQUFBLElBQUEsQ0FBQSxDQUFBLEdBQUEsS0FBQSxVQUFBO1lBQ0EsdUJBQUEsR0FBQTtBQUNBLG1CQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsTUFGQTs7UUFEQSxDQUFBO2VBS0E7TUFSQSxDQURBO01BV0EsY0FBQSxFQUFBLFNBQUEsR0FBQTtBQUNBLFlBQUE7UUFBQSxzQkFBQSxHQUFBO1FBQ0EsSUFBQSxFQUFBLENBQUEsSUFBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBLENBQUE7VUFDQSxFQUFBLENBQUEsSUFBQSxDQUFBLFlBQUEsQ0FBQSxHQUFBLENBQUEsU0FBQSxDQUFBLElBQUEsRUFBQSxTQUFBLENBQUEsRUFBQSxDQUFBO1lBQ0EsSUFBQSxHQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLENBQUE7Y0FDQSxzQkFBQSxHQUFBO0FBQ0EscUJBQUEsRUFBQSxDQUFBLElBQUEsQ0FBQSxNQUZBOztVQURBLENBQUEsRUFEQTtTQUFBLE1BQUE7VUFNQSxFQUFBLENBQUEsSUFBQSxDQUFBLFlBQUEsQ0FBQSxHQUFBLENBQUEsU0FBQSxDQUFBLElBQUEsRUFBQSxTQUFBLENBQUEsRUFBQSxDQUFBO1lBQ0EsSUFBQSxDQUFBLENBQUEsR0FBQSxLQUFBLEdBQUE7Y0FDQSxzQkFBQSxHQUFBO0FBQ0EscUJBQUEsRUFBQSxDQUFBLElBQUEsQ0FBQSxNQUZBOztVQURBLENBQUEsRUFOQTs7ZUFVQTtNQVpBLENBWEE7TUF5QkEsT0FBQSxFQUFBLFNBQUE7QUFDQSxZQUFBO1FBQUEsYUFBQSxHQUFBO1FBQ0EsRUFBQSxDQUFBLElBQUEsQ0FBQSxZQUFBLENBQUEsR0FBQSxDQUFBLFNBQUEsQ0FBQSxJQUFBLEVBQUEsU0FBQSxDQUFBLEVBQUEsQ0FBQTtVQUNBLGFBQUEsR0FBQTtBQUNBLGlCQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUE7UUFGQSxDQUFBO2VBR0E7TUFMQSxDQXpCQTtNQWdDQSxJQUFBLEVBQUEsU0FBQSxHQUFBO0FBQ0EsWUFBQTtRQUFBLElBQUEsR0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBO1FBQ0EsSUFBQSxHQUFBLEdBQUEsQ0FBQSxTQUFBLENBQUEsSUFBQSxHQUNBLEdBQUEsQ0FBQSxPQUFBLENBQUEsUUFBQSxDQUFBLFdBQUEsQ0FBQSxHQUFBLENBQUEsa0JBQUEsRUFBQSxHQUFBLENBQUEsU0FBQSxDQUFBLElBQUE7UUFDQSxJQUFBLElBQUEsQ0FBQSxJQUFBLENBQUE7QUFDQSxpQkFBQSxHQUFBLENBQUEsU0FBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLEVBREE7O1FBRUEsQ0FBQSxHQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQTtVQUNBLEdBQUEsRUFBQSxHQURBO1VBRUEsSUFBQSxFQUFBLElBRkE7VUFHQSxJQUFBLEVBQUEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUEsU0FBQSxDQUFBLEdBQUEsQ0FIQTtVQUlBLE1BQUEsRUFBQSxTQUFBO21CQUNBLEdBQUEsQ0FBQSxJQUFBLENBQUEsSUFBQTtVQURBLENBSkE7O1FBT0EsR0FBQSxDQUFBLGtCQUFBLEdBQUE7QUFDQSxlQUFBO01BZEEsQ0FoQ0E7TUFnREEsSUFBQSxFQUFBLEVBaERBOztJQWtEQSxJQUFBLENBQUEsa0JBQUEsR0FBQTtJQUVBLElBQUEsQ0FBQSxTQUFBLENBQUEsSUFBQSxDQUFBLFVBQUE7RUFqR0E7O29CQW1HQSxhQUFBLEdBQUEsU0FBQTtXQUNBLElBQUEsQ0FBQTtFQURBOztvQkFHQSxpQkFBQSxHQUFBLFNBQUE7V0FDQSxJQUFBLENBQUEsVUFBQSxDQUFBLE9BQUEsQ0FBQTtFQURBOztvQkFHQSxnQkFBQSxHQUFBLFNBQUE7V0FDQSxJQUFBLENBQUEsTUFBQSxDQUFBLElBQUEsQ0FBQSxVQUFBLENBQUEsYUFBQTtFQURBOztvQkFHQSxRQUFBLEdBQUEsU0FBQSxVQUFBO1dBQ0EsSUFBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBO0VBREE7O29CQUdBLFFBQUEsR0FBQSxTQUFBLFVBQUEsRUFBQSxXQUFBO0lBQ0EsSUFBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLENBQUEsR0FBQTtBQUNBLFdBQUE7RUFGQTs7b0JBSUEsTUFBQSxHQUFBLFNBQUE7QUFDQSxRQUFBO0lBQUEsR0FBQSxHQUFBO0lBQ0EsSUFBQSxJQUFBLENBQUEsS0FBQSxDQUFBLENBQUE7TUFDQSxFQUFBLENBQUEsSUFBQSxDQUFBLGVBQUEsQ0FBQSxJQUFBLENBQUEsYUFBQSxDQUFBLENBQUEsQ0FBQSxZQUFBLEVBQUEsSUFBQTtBQUNBLGFBQUE7UUFBQSxJQUFBLEVBQUEsQ0FBQSxTQUFBLEVBQUE7aUJBQUEsRUFBQSxDQUFBO1FBQUEsQ0FBQSxDQUFBO1FBQUEsQ0FBQSxLQUFBLENBQUEsRUFBQSxTQUFBLEdBQUEsQ0FBQTtRQUZBO0tBQUEsTUFBQTtBQUlBLGFBQUEsSUFBQSxDQUFBLE9BQUEsQ0FBQSxRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxTQUFBO0FBQ0EsWUFBQTtRQUFBLFFBQUEsR0FBQSxHQUFBLENBQUEsYUFBQSxDQUFBLENBQUEsQ0FBQTtlQUNBLE9BQUEsUUFBQSxDQUFBLEdBQUEsQ0FBQSxnQkFBQSxDQUFBLENBQUE7TUFGQSxDQUFBLEVBSkE7O0VBRkE7O29CQVVBLElBQUEsR0FBQSxTQUFBO0lBQ0EsSUFBQSxJQUFBLENBQUEsS0FBQSxDQUFBLENBQUE7YUFDQSxJQUFBLENBQUEsT0FBQSxDQUFBLE1BQUEsQ0FBQSxFQURBO0tBQUEsTUFBQTthQUdBLElBQUEsQ0FBQSxPQUFBLENBQUEsS0FBQSxDQUFBLEVBSEE7O0VBREE7O29CQU1BLEtBQUEsR0FBQSxTQUFBO0lBQ0EsSUFBQSxJQUFBLENBQUEsYUFBQSxDQUFBLENBQUEsQ0FBQSxZQUFBLENBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQTtNQUNBLElBQUEsSUFBQSxDQUFBLGdCQUFBLENBQUEsQ0FBQTtBQUNBLGNBQUEsSUFBQSxLQUFBLENBQUEsMkRBQUEsRUFEQTtPQUFBLE1BQUE7QUFHQSxlQUFBLEtBSEE7T0FEQTtLQUFBLE1BQUE7TUFNQSxJQUFBLENBQUEsSUFBQSxDQUFBLGdCQUFBLENBQUEsQ0FBQTtBQUNBLGNBQUEsSUFBQSxLQUFBLENBQUEseURBQUEsRUFEQTtPQUFBLE1BQUE7QUFHQSxlQUFBLE1BSEE7T0FOQTs7RUFEQTs7b0JBWUEsSUFBQSxHQUFBLFNBQUEsQ0FBQTtBQUNBLFFBQUE7O01BREEsSUFBQTs7SUFDQSxJQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsU0FBQSxDQUFBLENBQUEsQ0FBQTtNQUNBLElBQUEsQ0FBQSxHQUFBLE9BQUE7UUFDQSxJQUFBLElBQUEsQ0FBQSxTQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsQ0FBQTtVQUNBLElBQUEsQ0FBQSxTQUFBLENBQUEsSUFBQSxDQUFBLFNBQUEsQ0FBQSxJQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtpQkFDQSxJQUFBLENBQUEsa0JBQUEsR0FBQSxFQUZBO1NBQUEsTUFBQTtBQUlBLGdCQUFBLElBQUEsS0FBQSxDQUFBLGVBQUEsR0FBQSxDQUFBLEdBQUEsaUJBQUEsRUFKQTtTQURBO09BQUEsTUFNQSxJQUFBLENBQUEsR0FBQSxDQUFBO0FBQ0EsY0FBQSxJQUFBLEtBQUEsQ0FBQSxDQUFBLEdBQUEsb0JBQUEsRUFEQTtPQUFBLE1BQUE7UUFHQSxFQUFBLEdBQUEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxRQUFBLENBQUEsY0FBQSxDQUFBLElBQUEsQ0FBQSxTQUFBLENBQUEsSUFBQTtRQUNBLE1BQUEsR0FBQSxFQUFBLENBQUE7UUFDQSxLQUFBLEdBQUEsRUFBQSxDQUFBLE9BQUEsQ0FBQSxJQUFBLENBQUEsU0FBQSxDQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsa0JBQUEsQ0FBQTtRQUVBLENBQUEsR0FBQSxFQUFBLENBQUEsS0FBQSxHQUFBLENBQUE7UUFDQSxJQUFBLENBQUEsU0FBQSxDQUFBLENBQUEsQ0FBQSxJQUFBO2VBQ0EsSUFBQSxDQUFBLGtCQUFBLEdBQUEsQ0FBQSxDQUFBLEtBVEE7T0FQQTtLQUFBLE1BaUJBLElBQUEsRUFBQSxDQUFBLElBQUEsQ0FBQSxRQUFBLENBQUEsQ0FBQSxDQUFBO01BQ0EsQ0FBQSxHQUFBO0FBQ0E7QUFBQSxXQUFBLHFDQUFBOztRQUNBLElBQUEsQ0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBO1VBQ0EsTUFBQSxJQUFBLEdBREE7O0FBREE7TUFHQSxJQUFBLENBQUE7ZUFDQSxJQUFBLENBQUEsU0FBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLEVBREE7T0FBQSxNQUFBO0FBR0EsY0FBQSxJQUFBLEtBQUEsQ0FBQSw2QkFBQSxHQUFBLENBQUEsRUFIQTtPQUxBO0tBQUEsTUFBQTtBQVVBLFlBQUEsSUFBQSxTQUFBLENBQUEsNkJBQUEsR0FBQSxDQUFBLEVBVkE7O0VBbEJBOztvQkE4QkEsU0FBQSxHQUFBLFNBQUEsV0FBQTtBQUNBLFFBQUE7SUFBQSxHQUFBLEdBQUE7SUFDQSxtQkFBQSxHQUFBLEdBQUEsQ0FBQSxPQUFBLENBQUEsVUFBQSxDQUFBLFdBQUEsQ0FBQSxJQUFBLENBQUEsVUFBQTtJQUNBLEVBQUEsQ0FBQSxJQUFBLENBQUEsT0FBQSxDQUFBLG1CQUFBLENBQUEsTUFBQSxFQUFBLFNBQUEsY0FBQSxFQUFBLFVBQUE7QUFDQSxVQUFBO01BQUEsSUFBQSxXQUFBLEdBQUEsV0FBQSxDQUFBLFVBQUEsQ0FBQTtRQUNBLElBQUEsY0FBQSxDQUFBLGdCQUFBO2lCQUNBLEdBQUEsQ0FBQSxPQUFBLENBQUEsS0FBQSxDQUFBLHFCQUFBLENBQUEsR0FBQSxFQUFBLFdBQUEsRUFBQSxVQUFBLEVBQUEsY0FBQSxFQURBO1NBQUEsTUFFQSxJQUFBLGNBQUEsQ0FBQSxtQkFBQTtpQkFDQSxHQUFBLENBQUEsT0FBQSxDQUFBLEtBQUEsQ0FBQSx3QkFBQSxDQUFBLEdBQUEsRUFBQSxXQUFBLEVBQUEsVUFBQSxFQUFBLGNBQUEsRUFEQTtTQUFBLE1BQUE7VUFHQSxJQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBO1VBQ0EsSUFBQSxjQUFBLENBQUEsUUFBQSxJQUFBLElBQUEsS0FBQSxXQUFBLElBQUEsSUFBQSxJQUFBLFdBQUE7QUFDQSxrQkFBQSxJQUFBLEtBQUEsQ0FBQSw0QkFBQSxHQUFBLElBQUEsR0FBQSxNQUFBLEdBQUEsV0FBQSxFQURBOztpQkFFQSxHQUFBLENBQUEsUUFBQSxDQUFBLFVBQUEsRUFBQSxXQUFBLEVBQUEsSUFBQSxFQU5BO1NBSEE7O0lBREEsQ0FBQTtBQVdBLFdBQUE7RUFkQTs7b0JBZ0JBLFdBQUEsR0FBQSxTQUFBO0FBQ0EsUUFBQTtJQUFBLElBQUEsSUFBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBO0FBQUEsYUFBQSxNQUFBOztJQUNBLElBQUEsR0FBQSxJQUFBLENBQUEsU0FBQSxDQUFBLGdCQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0E7QUFBQSxTQUFBLFFBQUE7O01BQ0EsSUFBQSxJQUFBLENBQUEsQ0FBQSxDQUFBLEtBQUEsQ0FBQTtBQUFBLGVBQUEsTUFBQTs7QUFEQTtBQUVBLFdBQUE7RUFMQTs7Ozs7O0FDOUxBLEVBQUEsQ0FBQTtFQUNBLG9CQUFBLE9BQUEsRUFBQSxLQUFBO0FBQ0EsUUFBQTtJQURBLElBQUEsQ0FBQSxTQUFBO0lBQUEsSUFBQSxDQUFBLE9BQUE7SUFDQSxHQUFBLEdBQUE7SUFDQSxJQUFBLENBQUEsUUFBQSxHQUFBO0lBQ0EsSUFBQSxDQUFBLFlBQUEsR0FBQTtJQUNBLElBQUEsQ0FBQSxtQkFBQSxHQUFBO0lBQ0EsSUFBQSxDQUFBLGFBQUEsR0FBQTtJQUVBLFFBQUEsR0FBQSxHQUFBLENBQUEsT0FBQSxDQUFBLFVBQUEsQ0FBQSxXQUFBLENBQUEsSUFBQTtBQUVBO0FBQUEsU0FBQSxpQkFBQTs7TUFDQSxJQUFBLGNBQUEsQ0FBQSxRQUFBO1FBQ0EsSUFBQSxDQUFBLGFBQUEsR0FBQSxXQURBOztNQUdBLElBQUEsY0FBQSxFQUFBLE9BQUEsRUFBQTtRQUNBLElBQUEsQ0FBQSxtQkFBQSxDQUFBLFVBQUEsQ0FBQSxHQUFBLGNBQUEsRUFBQSxPQUFBLEdBREE7O0FBSkE7SUFhQSxJQUFBLENBQUEsT0FBQSxHQUFBO01BQ0EsUUFBQSxFQUFBLFNBQUEsWUFBQTtlQUNBLEdBQUEsQ0FBQSxPQUFBLENBQUEsVUFBQSxDQUFBLGNBQUEsQ0FBQSxHQUFBLEVBQUEsWUFBQTtNQURBLENBREE7TUFHQSxRQUFBLEVBQUEsU0FBQSxjQUFBLEVBQUEsWUFBQTtlQUNBLEdBQUEsQ0FBQSxPQUFBLENBQUEsVUFBQSxDQUFBLGNBQUEsQ0FBQSxHQUFBLEVBQUEsY0FBQSxFQUFBLFlBQUE7TUFEQSxDQUhBOztJQU9BLEVBQUEsQ0FBQSxJQUFBLENBQUEsT0FBQSxDQUFBLFFBQUEsQ0FBQSxrQkFBQSxFQUFBLFNBQUEsZUFBQSxFQUFBLFdBQUE7YUFDQSxHQUFBLENBQUEsT0FBQSxDQUFBLElBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsYUFBQSxDQUFBLFdBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxTQUFBLFlBQUE7ZUFDQSxHQUFBLENBQUEsT0FBQSxDQUFBLFVBQUEsQ0FBQSxjQUFBLENBQUEsR0FBQSxFQUFBLFdBQUEsRUFBQSxlQUFBLEVBQUEsWUFBQTtNQURBO0lBREEsQ0FBQTtFQTdCQTs7dUJBaUNBLHVCQUFBLEdBQUEsU0FBQTtBQUNBLFFBQUE7SUFBQSxlQUFBLEdBQUEsUUFBQSxDQUFBLGdCQUFBLENBQUEsNkNBQUEsR0FBQSxJQUFBLENBQUEsSUFBQSxHQUFBLGVBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQSxNQUFBLENBQUEsT0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLEtBQUE7SUFDQSxZQUFBLEdBQUEsUUFBQSxDQUFBLGdCQUFBLENBQUEsMENBQUEsR0FBQSxJQUFBLENBQUEsSUFBQSxHQUFBLGVBQUEsR0FBQSxDQUFBLElBQUEsQ0FBQSxNQUFBLENBQUEsT0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLEtBQUE7QUFDQSxTQUFBLGlEQUFBOztBQUNBO0FBQUEsV0FBQSx1Q0FBQTs7UUFDQSxJQUFBLENBQUEsV0FBQSxDQUFBLFdBQUE7QUFEQTtBQURBO0FBR0E7U0FBQSxnREFBQTs7bUJBQ0EsSUFBQSxDQUFBLFdBQUEsQ0FBQSxJQUFBLENBQUEsS0FBQSxDQUFBLFdBQUEsQ0FBQSxPQUFBLENBQUE7QUFEQTs7RUFOQTs7dUJBU0EsT0FBQSxHQUFBLFNBQUE7V0FDQSxJQUFBLENBQUE7RUFEQTs7dUJBR0EsYUFBQSxHQUFBLFVBQUEsQ0FBQSxTQUFBLENBQUE7O3VCQUVBLGVBQUEsR0FBQSxTQUFBO1dBQ0EsR0FBQSxDQUFBLE9BQUEsQ0FBQSxVQUFBLENBQUEsZUFBQSxDQUFBLElBQUE7RUFEQTs7dUJBR0EsU0FBQSxHQUFBLFNBQUE7V0FDQSxJQUFBLENBQUE7RUFEQTs7dUJBUUEsUUFBQSxHQUFBLFNBQUEsT0FBQTtBQUNBLFFBQUE7O01BREEsVUFBQTtRQUFBLFdBQUEsRUFBQSxLQUFBOzs7SUFDQSxHQUFBLEdBQUEsT0FBQSxDQUFBLFdBQUEsR0FBQSxFQUFBLEdBQUEsSUFBQSxDQUFBO1dBQ0EsR0FBQSxDQUFBLE1BQUEsQ0FBQSxNQUFBLENBQUEsTUFBQSxDQUFBLElBQUEsQ0FBQSxRQUFBLENBQUE7RUFGQTs7dUJBSUEsSUFBQSxHQUFBLFNBQUEsY0FBQTtXQUNBLElBQUEsQ0FBQSxRQUFBLENBQUEsY0FBQTtFQURBOzt1QkFHQSxNQUFBLEdBQUEsU0FBQSxVQUFBLEVBQUEsV0FBQSxFQUFBLE9BQUE7QUFDQSxRQUFBOztNQURBLFVBQUE7UUFBQSxXQUFBLEVBQUEsS0FBQTtRQUFBLFFBQUEsRUFBQSxLQUFBOzs7SUFDQSxJQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsUUFBQSxDQUFBLFVBQUEsQ0FBQTtNQUNBLEdBQUEsR0FBQSxJQUFBLENBQUEsUUFBQSxDQUFBLE9BQUE7TUFDQSxJQUFBLE9BQUEsQ0FBQSxRQUFBO1FBQ0EsWUFBQSxHQUFBO0FBQ0EsYUFBQSxxQ0FBQTs7VUFDQSxJQUFBLE9BQUEsQ0FBQSxRQUFBLENBQUEsVUFBQSxFQUFBLElBQUEsQ0FBQSxLQUFBLFdBQUE7WUFBQSxZQUFBLENBQUEsSUFBQSxDQUFBLE9BQUEsRUFBQTs7QUFEQTtBQUVBLGVBQUEsYUFKQTtPQUFBLE1BQUE7QUFNQSxhQUFBLHVDQUFBOztVQUNBLElBQUEsT0FBQSxDQUFBLFFBQUEsQ0FBQSxVQUFBLEVBQUEsSUFBQSxDQUFBLEtBQUEsV0FBQTtBQUFBLG1CQUFBLFFBQUE7O0FBREEsU0FOQTtPQUZBO0tBQUEsTUFBQTtNQVdBLEtBQUEsR0FBQTtNQUNBLE9BQUEsR0FBQSxXQUFBLElBQUE7UUFBQSxXQUFBLEVBQUEsS0FBQTtRQUFBLFFBQUEsRUFBQSxLQUFBOztNQUNBLEdBQUEsR0FBQSxJQUFBLENBQUEsUUFBQSxDQUFBLE9BQUE7TUFDQSxJQUFBLE9BQUEsQ0FBQSxRQUFBO1FBQ0EsWUFBQSxHQUFBO0FBQ0EsYUFBQSx1Q0FBQTs7VUFDQSxVQUFBLEdBQUE7QUFDQSxlQUFBLG1CQUFBOztZQUNBLElBQUEsT0FBQSxDQUFBLFFBQUEsQ0FBQSxVQUFBLEVBQUEsSUFBQSxDQUFBLEtBQUEsV0FBQTtjQUNBLFVBQUEsR0FBQTtBQUNBLG9CQUZBOztBQURBO1VBSUEsSUFBQSxVQUFBO1lBQUEsWUFBQSxDQUFBLElBQUEsQ0FBQSxPQUFBLEVBQUE7O0FBTkE7QUFPQSxlQUFBLGFBVEE7T0FBQSxNQUFBO0FBV0EsYUFBQSx1Q0FBQTs7VUFDQSxVQUFBLEdBQUE7QUFDQSxlQUFBLG1CQUFBOztZQUNBLElBQUEsT0FBQSxDQUFBLFFBQUEsQ0FBQSxVQUFBLEVBQUEsSUFBQSxDQUFBLEtBQUEsV0FBQTtjQUNBLFVBQUEsR0FBQTtBQUNBLG9CQUZBOztBQURBO1VBSUEsSUFBQSxVQUFBO0FBQUEsbUJBQUEsUUFBQTs7QUFOQSxTQVhBO09BZEE7O0VBREE7O3VCQWtDQSxjQUFBLEdBQUEsU0FBQSxXQUFBO0FBQ0EsUUFBQTs7TUFEQSxjQUFBLElBQUEsQ0FBQTs7SUFDQSxFQUFBLEdBQUEsSUFBQSxFQUFBLENBQUEsT0FBQSxDQUFBLElBQUEsRUFBQSxXQUFBO0lBQ0EsSUFBQSxDQUFBLFVBQUEsQ0FBQSxFQUFBO0FBQ0EsV0FBQTtFQUhBOzt1QkFLQSxVQUFBLEdBQUEsU0FBQSxFQUFBO0lBQ0EsSUFBQSxFQUFBLENBQUEsZ0JBQUEsQ0FBQSxDQUFBO2FBQ0EsSUFBQSxDQUFBLFFBQUEsQ0FBQSxFQUFBLENBQUEsZ0JBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxHQURBO0tBQUEsTUFBQTthQUdBLElBQUEsQ0FBQSxZQUFBLENBQUEsSUFBQSxDQUFBLEVBQUEsRUFIQTs7RUFEQTs7dUJBTUEsV0FBQSxHQUFBLFNBQUEsV0FBQTtBQUNBLFFBQUE7SUFBQSxJQUFBLEVBQUEsR0FBQSxXQUFBLENBQUEsSUFBQSxDQUFBLGFBQUEsQ0FBQTtNQUNBLElBQUEsRUFBQSxHQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsRUFBQSxDQUFBO2VBQ0EsRUFBQSxDQUFBLFNBQUEsQ0FBQSxXQUFBLEVBREE7T0FBQSxNQUFBO2VBR0EsSUFBQSxDQUFBLGNBQUEsQ0FBQSxXQUFBLEVBSEE7T0FEQTtLQUFBLE1BQUE7YUFNQSxJQUFBLENBQUEsY0FBQSxDQUFBLFdBQUEsRUFOQTs7RUFEQTs7Ozs7O0FDN0dBLE1BQUEsQ0FBQSxXQUFBLE1BQUEsQ0FBQSxTQUFBOzs7Ozs7Ozs7OztRQVdBLEtBQUEsQ0FBQSxVQUFBLENBQUEsaUJBQUEsQ0FBQSxXQUFBLFNBQUEsQ0FBQTtTQUNBLElBQUEsQ0FBQSxPQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQTtBQURBOztTQUdBLE1BQUEsQ0FBQSxVQUFBLENBQUEsa0JBQUEsQ0FBQSxXQUFBLFNBQUEsQ0FBQTtTQUNBLElBQUEsQ0FBQSxPQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsQ0FBQTtBQURBOztBQ2hCQSxFQUFBLENBQUEsSUFBQSxHQUFBO0VBQ0EsS0FBQSxFQUFBLElBQUEsTUFBQSxDQUFBLENBREE7RUFFQSxLQUFBLEVBQUEsU0FBQSxNQUFBO1dBQ0EsTUFBQSxDQUFBLFdBQUEsQ0FBQSxDQUFBLENBQUEsT0FBQSxDQUFBLDRCQUFBLEVBQUEsRUFBQSxDQUFBLENBQUEsT0FBQSxDQUFBLFFBQUEsRUFBQSxHQUFBLENBQUEsQ0FBQSxLQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLEdBQUE7RUFEQSxDQUZBO0VBSUEsT0FBQSxFQUFBLFNBQUEsTUFBQTtXQUNBLE1BQUEsQ0FBQSxLQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLEdBQUE7RUFEQSxDQUpBO0VBTUEsT0FBQSxFQUFBLFNBQUEsTUFBQTtXQUNBLE1BQUEsQ0FBQSxLQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLEdBQUE7RUFEQSxDQU5BO0VBUUEsVUFBQSxFQUFBLFNBQUEsTUFBQTtXQUNBLE1BQUEsQ0FBQSxNQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsV0FBQSxDQUFBLENBQUEsR0FBQSxNQUFBLENBQUEsS0FBQSxDQUFBLENBQUE7RUFEQSxDQVJBO0VBVUEsUUFBQSxFQUFBLFNBQUEsR0FBQTtXQUNBLEdBQUEsQ0FBQSxPQUFBLENBQUEsSUFBQSxFQUFBLEdBQUEsQ0FBQSxDQUFBLE9BQUEsQ0FBQSxxQkFBQSxFQUFBLFNBQUEsTUFBQSxFQUFBLEtBQUE7TUFDQSxJQUFBLEtBQUEsS0FBQSxDQUFBO2VBQUEsTUFBQSxDQUFBLFdBQUEsQ0FBQSxFQUFBO09BQUEsTUFBQTtlQUFBLE1BQUEsQ0FBQSxXQUFBLENBQUEsRUFBQTs7SUFEQSxDQUFBLENBRUEsQ0FBQSxPQUZBLENBRUEsTUFGQSxFQUVBLEVBRkE7RUFEQSxDQVZBO0VBY0EsYUFBQSxFQUFBLFNBQUEsR0FBQTtXQUNBLEdBQUEsQ0FBQSxPQUFBLENBQUEsSUFBQSxFQUFBLEdBQUEsQ0FBQSxDQUFBLE9BQUEsQ0FBQSxxQkFBQSxFQUFBLFNBQUEsTUFBQSxFQUFBLEtBQUE7YUFDQSxNQUFBLENBQUEsV0FBQSxDQUFBO0lBREEsQ0FBQSxDQUVBLENBQUEsT0FGQSxDQUVBLE1BRkEsRUFFQSxFQUZBO0VBREEsQ0FkQTtFQWtCQSxTQUFBLEVBQUEsU0FBQSxNQUFBLEVBQUEsTUFBQTtXQUNBLE1BQUEsQ0FBQSxNQUFBLENBQ0EsU0FBQSxDQUFBO2FBQUEsTUFBQSxDQUFBLE9BQUEsQ0FBQSxDQUFBLENBQUEsR0FBQTtJQUFBLENBREE7RUFEQSxDQWxCQTtFQXNCQSxlQUFBLEVBQUEsU0FBQSxLQUFBLEVBQUEsT0FBQTtBQUNBLFFBQUE7SUFBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLE9BQUEsQ0FBQSxPQUFBO0lBQ0EsSUFBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBO0FBQ0EsYUFBQSxNQURBO0tBQUEsTUFBQTtNQUdBLEtBQUEsQ0FBQSxNQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxDQUFBO0FBQ0EsYUFBQSxLQUpBOztFQUZBLENBdEJBO0VBOEJBLElBQUEsRUFBQSxTQUFBLEdBQUE7QUFDQSxRQUFBO0lBQUEsSUFBQSxJQUFBLEtBQUEsR0FBQSxJQUFBLFFBQUEsS0FBQSxPQUFBLEdBQUE7QUFDQSxhQUFBLElBREE7O0lBRUEsSUFBQSxHQUFBLEdBQUEsQ0FBQSxXQUFBLENBQUE7QUFDQSxTQUFBLFdBQUE7TUFDQSxJQUFBLEdBQUEsQ0FBQSxjQUFBLENBQUEsSUFBQSxDQUFBO1FBQ0EsSUFBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLEdBQUEsQ0FBQSxJQUFBLEVBREE7O0FBREE7V0FHQTtFQVBBLENBOUJBO0VBdUNBLEtBQUEsRUFBQSxTQUFBLElBQUEsRUFBQSxJQUFBO0FBQ0EsUUFBQTtBQUFBLFNBQUEsWUFBQTtNQUNBLElBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxJQUFBLENBQUEsSUFBQTtBQURBO1dBRUE7RUFIQSxDQXZDQTtFQTRDQSxTQUFBLEVBQUEsU0FBQSxLQUFBO1dBQ0EsS0FBQSxLQUFBLFFBQUEsQ0FBQSxLQUFBLEVBQUEsRUFBQTtFQURBLENBNUNBO0VBK0NBLFFBQUEsRUFBQSxTQUFBLEtBQUE7V0FDQSxRQUFBLENBQUEsS0FBQSxDQUFBLElBQUEsQ0FBQSxLQUFBLENBQUEsVUFBQSxDQUFBLEtBQUEsQ0FBQTtFQURBLENBL0NBO0VBa0RBLFFBQUEsRUFBQSxTQUFBLEtBQUE7V0FDQSxPQUFBLEtBQUEsS0FBQTtFQURBLENBbERBO0VBcURBLE9BQUEsRUFBQSxTQUFBLEtBQUE7V0FDQSxLQUFBLFlBQUE7RUFEQSxDQXJEQTtFQXdEQSxPQUFBLEVBQUEsU0FBQSxDQUFBLEVBQUEsQ0FBQTtBQUNBLFFBQUE7QUFBQSxTQUFBLE1BQUE7O01BQ0EsSUFBQSxDQUFBLENBQUEsQ0FBQSxjQUFBLENBQUEsQ0FBQSxDQUFBO0FBQUEsaUJBQUE7O01BQ0EsSUFBQSxDQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxLQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsS0FBQTtBQUNBLGNBREE7O0FBRkE7RUFEQSxDQXhEQTtFQStEQSxZQUFBLEVBQUEsU0FBQSxHQUFBLEVBQUEsQ0FBQTtBQUNBLFFBQUE7SUFBQSxHQUFBLEdBQUE7SUFDQSxNQUFBLEdBQUE7QUFDQSxTQUFBLFVBQUE7TUFFQSxHQUFBLENBQUEsSUFBQSxDQUFBLEdBQUE7QUFGQTtJQUdBLENBQUEsR0FBQSxHQUFBLENBQUEsTUFBQSxHQUFBO0FBQ0EsV0FBQSxDQUFBLElBQUEsQ0FBQSxJQUFBLENBQUEsTUFBQTtNQUNBLENBQUEsR0FBQSxDQUFBLENBQUEsSUFBQSxDQUFBLEdBQUEsRUFBQSxHQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTtNQUNBLElBQUEsQ0FBQSxLQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsS0FBQTtRQUFBLE1BQUEsR0FBQSxLQUFBOztNQUNBLENBQUE7SUFIQTtFQVBBLENBL0RBO0VBNEVBLFFBQUEsRUFBQSxTQUFBLE1BQUEsRUFBQSxNQUFBO0lBQ0EsSUFBQSxNQUFBLENBQUEsUUFBQTthQUNBLE1BQUEsQ0FBQSxRQUFBLENBQUEsTUFBQSxFQURBO0tBQUEsTUFBQTthQUdBLE1BQUEsQ0FBQSxNQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsTUFBQSxDQUFBLEtBQUEsT0FIQTs7RUFEQSxDQTVFQTtFQWtGQSxVQUFBLEVBQUEsU0FBQSxNQUFBLEVBQUEsTUFBQTtJQUNBLElBQUEsTUFBQSxDQUFBLFVBQUE7YUFDQSxNQUFBLENBQUEsVUFBQSxDQUFBLE1BQUEsRUFEQTtLQUFBLE1BQUE7YUFHQSxNQUFBLENBQUEsTUFBQSxDQUFBLENBQUEsRUFBQSxNQUFBLENBQUEsTUFBQSxDQUFBLEtBQUEsT0FIQTs7RUFEQSxDQWxGQTs7O0FDQUEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxJQUFBLEdBQUE7RUFDQSxjQUFBLEVBQUEsU0FBQSxHQUFBLEVBQUEsTUFBQSxFQUFBLElBQUEsRUFBQSxPQUFBO0FBQ0EsUUFBQTs7TUFEQSxVQUFBOztJQUNBLE9BQUEsQ0FBQSxRQUFBLENBQUEsR0FBQSxPQUFBLENBQUEsY0FBQSxDQUFBLEdBQUE7SUFDQSxPQUFBLEdBQUE7TUFDQSxNQUFBLEVBQUEsTUFEQTtNQUVBLEdBQUEsRUFBQSxHQUZBO01BR0EsSUFBQSxFQUFBLElBQUEsQ0FBQSxTQUFBLENBQUEsSUFBQSxLQUFBLE1BQUEsR0FBQSxFQUFBLEdBQUEsSUFBQSxDQUhBO01BSUEsT0FBQSxFQUFBLE9BSkE7TUFLQSxRQUFBLEVBQUEsTUFMQTtNQU1BLFlBQUEsRUFBQSxNQU5BOztJQVFBLE9BQUEsQ0FBQSxJQUFBLEdBQUEsT0FBQSxDQUFBO0lBQ0EsT0FBQSxDQUFBLElBQUEsR0FBQSxPQUFBLENBQUE7V0FDQSxHQUFBLENBQUEsYUFBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBLEVBQUEsT0FBQTtFQVpBLENBREE7OztBQ0FBLEdBQUEsQ0FBQSxPQUFBLENBQUEsVUFBQSxHQUFBO0VBQ0EsV0FBQSxFQUFBLFNBQUEsQ0FBQTtXQUNBLENBQUEsQ0FBQSxTQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxXQUFBLENBQUEsQ0FBQSxDQUFBLE9BQUEsQ0FBQSxDQUFBO0VBREEsQ0FEQTtFQUlBLGVBQUEsRUFBQSxTQUFBLENBQUE7V0FDQSxHQUFBLENBQUEsT0FBQSxDQUFBLFVBQUEsQ0FBQSxXQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7RUFEQSxDQUpBOzs7QUNBQSxHQUFBLENBQUEsT0FBQSxDQUFBLE9BQUEsR0FBQTtFQUNBLE1BQUEsRUFBQSxTQUFBLE9BQUE7QUFDQSxRQUFBO0lBQUEsVUFBQSxHQUFBLE9BQUEsQ0FBQSxhQUFBLENBQUE7SUFDQSxDQUFBLEdBQUEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUEsU0FBQSxDQUFBLE9BQUE7V0FNQSxJQUFBLEdBQUE7RUFSQSxDQURBO0VBV0EsU0FBQSxFQUFBLFNBQUEsT0FBQTtBQUNBLFFBQUE7SUFBQSxVQUFBLEdBQUEsT0FBQSxDQUFBLGFBQUEsQ0FBQTtJQUNBLE1BQUEsR0FBQSxVQUFBLENBQUEsU0FBQSxDQUFBO0lBQ0EsQ0FBQSxHQUFBO0FBQ0E7QUFBQSxTQUFBLGlCQUFBOztNQUNBLElBQUEsY0FBQSxDQUFBLFlBQUEsSUFBQSxjQUFBLENBQUEsbUJBQUEsSUFBQSxjQUFBLENBQUEsZ0JBQUE7QUFBQSxpQkFBQTs7TUFDQSxXQUFBLEdBQUEsT0FBQSxDQUFBLFFBQUEsQ0FBQSxVQUFBO01BQ0EsQ0FBQSxDQUFBLFVBQUEsQ0FBQSxHQUFBO0FBSEE7V0FJQTtFQVJBLENBWEE7OztBQ0FBLEdBQUEsQ0FBQSxPQUFBLENBQUEsS0FBQSxHQUFBOztBQ0FBLEdBQUEsQ0FBQSxPQUFBLENBQUEsUUFBQSxHQUFBO0VBQ0EsY0FBQSxFQUFBLFNBQUEsY0FBQTtBQUNBLFFBQUE7SUFBQSxHQUFBLEdBQUEsTUFBQSxDQUFBLE1BQUEsQ0FBQSxjQUFBO0lBQ0EsR0FBQSxDQUFBLElBQUEsQ0FBQSxTQUFBLENBQUEsRUFBQSxDQUFBO2FBQUEsQ0FBQSxDQUFBLElBQUEsR0FBQSxDQUFBLENBQUE7SUFBQSxDQUFBO1dBQ0E7RUFIQSxDQURBO0VBTUEsV0FBQSxFQUFBLFNBQUEsSUFBQSxFQUFBLGNBQUE7QUFDQSxRQUFBO0lBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxPQUFBLENBQUEsUUFBQSxDQUFBLGNBQUEsQ0FBQSxjQUFBO0lBQ0EsZ0JBQUEsR0FBQTtBQUNBLFNBQUEscUNBQUE7O01BQ0EsSUFBQSxDQUFBLENBQUEsSUFBQSxJQUFBLElBQUE7UUFBQSxnQkFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxFQUFBOztBQURBO1dBRUE7RUFMQSxDQU5BOzs7QUNBQSxHQUFBLENBQUEsT0FBQSxDQUFBLEdBQUEsR0FBQTtFQVFBLGdCQUFBLEVBQUEsU0FBQSxXQUFBLEVBQUEsZUFBQSxFQUFBLE9BQUEsRUFBQSxZQUFBO0FBQ0EsUUFBQTtJQUFBLFVBQUEsR0FBQSxPQUFBLENBQUEsYUFBQSxDQUFBO0lBQ0EsTUFBQSxHQUFBLFVBQUEsQ0FBQSxTQUFBLENBQUE7SUFDQSxPQUFBLEdBQUEsTUFBQSxDQUFBLFNBQUEsQ0FBQTtJQUNBLElBQUEsQ0FBQSxPQUFBO0FBQUEsWUFBQSxJQUFBLEtBQUEsQ0FBQSw4QkFBQSxFQUFBOztJQUVBLElBQUEsWUFBQSxDQUFBLElBQUE7TUFDQSxJQUFBLEdBQUEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBLENBQUEsV0FBQSxDQUFBLFlBQUEsQ0FBQSxJQUFBO01BQ0EsR0FBQSxHQUFBLE9BQUEsR0FBQSxHQUFBLEdBQUEsS0FGQTtLQUFBLE1BQUE7TUFJQSxHQUFBLEdBQUEsT0FBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLFVBQUEsQ0FBQSxPQUFBLENBQUEsQ0FBQTtNQUNBLElBQUEsQ0FBQSxDQUFBLGVBQUEsQ0FBQSxnQkFBQSxJQUFBLFdBQUEsS0FBQSxNQUFBLENBQUE7UUFBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxnQkFBQSxDQUFBLENBQUEsRUFBQTtPQUxBOztJQU9BLElBQUEsZUFBQSxDQUFBLE1BQUE7TUFDQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLGVBQUEsQ0FBQSxJQUFBLElBQUEsV0FBQSxFQURBOztJQUdBLElBQUEsWUFBQSxDQUFBLE1BQUE7TUFBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxZQUFBLENBQUEsT0FBQTs7V0FDQTtFQWpCQSxDQVJBO0VBMkJBLG1CQUFBLEVBQUEsU0FBQSxXQUFBLEVBQUEsVUFBQSxFQUFBLFlBQUE7QUFDQSxRQUFBO0lBQUEsR0FBQSxHQUFBLENBQUEsVUFBQSxDQUFBLFNBQUEsQ0FBQSxDQUFBLENBQUEsU0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLFVBQUEsQ0FBQSxPQUFBLENBQUEsQ0FBQTtJQUNBLElBQUEsWUFBQSxDQUFBLE1BQUE7TUFBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxZQUFBLENBQUEsT0FBQTs7V0FDQTtFQUhBLENBM0JBO0VBZ0NBLFdBQUEsRUFBQSxTQUFBLENBQUE7V0FDQSxDQUFBLENBQUEsT0FBQSxDQUFBLEtBQUEsRUFBQSxFQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsS0FBQSxFQUFBLEVBQUE7RUFEQSxDQWhDQTs7O0FDQUEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxVQUFBLENBQUEsY0FBQSxHQUFBLFNBQUEsR0FBQSxFQUFBLFlBQUE7QUFDQSxNQUFBOztJQURBLGVBQUE7O0VBQ0EsSUFBQSxHQUFBLFlBQUEsQ0FBQTtFQUVBLE9BQUEsR0FBQSxHQUFBLENBQUEsT0FBQSxDQUFBLElBQUEsQ0FBQSxjQUFBLENBQ0EsR0FBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBLENBQUEsbUJBQUEsQ0FBQSxLQUFBLEVBQUEsR0FBQSxFQUFBLFlBQUEsQ0FEQSxFQUVBLEtBRkEsRUFHQSxJQUhBLEVBSUEsWUFBQSxDQUFBLE9BSkE7RUFNQSxPQUFBLENBQUEsSUFBQSxDQUFBLFNBQUEsUUFBQTtBQUNBLFFBQUE7QUFBQTtBQUFBO1NBQUEscUNBQUE7O21CQUNBLEdBQUEsQ0FBQSxXQUFBLENBQUEsV0FBQTtBQURBOztFQURBLENBQUE7QUFHQSxTQUFBO0FBWkE7O0FBY0EsR0FBQSxDQUFBLE9BQUEsQ0FBQSxVQUFBLENBQUEsY0FBQSxHQUFBLFNBQUEsR0FBQSxFQUFBLGNBQUEsRUFBQSxZQUFBO0FBQ0EsTUFBQTs7SUFEQSxlQUFBOztFQUNBLElBQUEsR0FBQSxZQUFBLENBQUE7RUFFQSxPQUFBLEdBQUEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxJQUFBLENBQUEsY0FBQSxDQUNBLEdBQUEsQ0FBQSxPQUFBLENBQUEsR0FBQSxDQUFBLG1CQUFBLENBQUEsS0FBQSxFQUFBLEdBQUEsRUFBQTtJQUFBLE1BQUEsRUFBQSxjQUFBO0dBQUEsQ0FEQSxFQUVBLEtBRkEsRUFHQSxJQUhBLEVBSUEsWUFBQSxDQUFBLE9BSkE7RUFNQSxPQUFBLENBQUEsSUFBQSxDQUFBLFNBQUEsUUFBQTtJQUNBLElBQUEsUUFBQSxDQUFBLElBQUE7YUFBQSxHQUFBLENBQUEsV0FBQSxDQUFBLFFBQUEsQ0FBQSxJQUFBLEVBQUE7O0VBREEsQ0FBQTtBQUVBLFNBQUE7QUFYQTs7QUFhQSxHQUFBLENBQUEsT0FBQSxDQUFBLFVBQUEsQ0FBQSxjQUFBLEdBQUEsU0FBQSxHQUFBLEVBQUEsV0FBQSxFQUFBLGVBQUEsRUFBQSxZQUFBO0FBQ0EsTUFBQTs7SUFEQSxlQUFBOztFQUNBLE1BQUEsR0FBQSxlQUFBLENBQUEsTUFBQSxDQUFBLFdBQUEsQ0FBQTtFQUVBLElBQUEsR0FBQSxZQUFBLENBQUE7U0FFQSxHQUFBLENBQUEsT0FBQSxDQUFBLElBQUEsQ0FBQSxjQUFBLENBQ0EsR0FBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBLENBQUEsbUJBQUEsQ0FBQSxLQUFBLEVBQUEsR0FBQSxFQUFBO0lBQUEsTUFBQSxFQUFBLGVBQUEsQ0FBQSxJQUFBLElBQUEsV0FBQTtHQUFBLENBREEsRUFFQSxNQUZBLEVBR0EsSUFIQSxFQUlBLFlBQUEsQ0FBQSxPQUpBO0FBTEE7O0FDM0JBLEdBQUEsQ0FBQSxPQUFBLENBQUEsT0FBQSxDQUFBLHNCQUFBLEdBQUEsU0FBQSxHQUFBLEVBQUEsaUNBQUEsRUFBQSxpQkFBQTtBQUNBLE1BQUE7RUFBQSxVQUFBLEdBQUEsR0FBQSxDQUFBLGFBQUEsQ0FBQTtFQUNBLElBQUEsQ0FBQSxpQkFBQSxDQUFBLFdBQUE7SUFDQSxJQUFBLGlCQUFBLENBQUEsVUFBQTtNQUNBLG1CQUFBLEdBQUEsVUFBQSxDQUFBLFNBQUEsQ0FBQSxDQUFBLENBQUEsYUFBQSxDQUFBLGlCQUFBLENBQUEsVUFBQSxFQURBO0tBQUEsTUFBQTtNQUdBLG1CQUFBLEdBQUEsVUFBQSxDQUFBLFNBQUEsQ0FBQSxDQUFBLENBQUEsMkJBQUEsQ0FBQSxpQ0FBQSxFQUhBO0tBREE7O0VBT0EsSUFBQSxpQkFBQSxDQUFBLFdBQUE7SUFDQSxxQkFBQSxHQUFBLGlCQUFBLENBQUEsZ0JBQUEsSUFBQSxDQUFBLGlDQUFBLEdBQUEsYUFBQTtJQUNBLHlCQUFBLEdBQUEsaUJBQUEsQ0FBQTtJQUNBLFVBQUEsR0FBQSxpQkFBQSxDQUFBO1dBQ0EsR0FBQSxDQUFBLFNBQUEsQ0FBQSxLQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsSUFBQSxDQUFBLGFBQUEsQ0FBQSxpQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLFNBQUE7YUFDQSxHQUFBLENBQUEsT0FBQSxDQUFBLE9BQUEsQ0FBQSw4QkFBQSxDQUFBLEdBQUEsRUFBQSxVQUFBLEVBQUEscUJBQUEsRUFBQSx5QkFBQSxFQUFBLGlDQUFBO0lBREEsRUFKQTtHQUFBLE1BQUE7SUFPQSxVQUFBLEdBQUEsaUJBQUEsQ0FBQSxLQUFBLElBQUEsQ0FBQSxpQ0FBQSxHQUFBLEdBQUEsR0FBQSxtQkFBQSxDQUFBLGFBQUE7V0FDQSxHQUFBLENBQUEsU0FBQSxDQUFBLEtBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsYUFBQSxDQUFBLGlDQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsU0FBQTthQUNBLEdBQUEsQ0FBQSxPQUFBLENBQUEsT0FBQSxDQUFBLG1CQUFBLENBQUEsR0FBQSxFQUFBLG1CQUFBLEVBQUEsVUFBQTtJQURBLEVBUkE7O0FBVEE7O0FBb0JBLEdBQUEsQ0FBQSxPQUFBLENBQUEsT0FBQSxDQUFBLG1CQUFBLEdBQUEsU0FBQSxHQUFBLEVBQUEsbUJBQUEsRUFBQSxVQUFBO0FBQ0EsTUFBQTtFQUFBLGNBQUEsR0FBQSxHQUFBLENBQUEsUUFBQSxDQUFBLFVBQUEsRUFBQSxJQUFBLEVBQUEsWUFBQTtTQUNBLG1CQUFBLENBQUEsSUFBQSxDQUFBLGNBQUEsQ0FBQSxJQUFBO0FBRkE7O0FBYUEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUEsOEJBQUEsR0FBQSxTQUFBLEdBQUEsRUFBQSxVQUFBLEVBQUEscUJBQUEsRUFBQSx5QkFBQSxFQUFBLHdCQUFBO0FBRUEsTUFBQTtFQUFBLHdCQUFBLEdBQUEsR0FBQSxDQUFBLFFBQUEsQ0FBQSxxQkFBQSxFQUFBLElBQUEsRUFBQSx1QkFBQTtFQUNBLG1CQUFBLEdBQUEsR0FBQSxDQUFBLGFBQUEsQ0FBQSxDQUFBLENBQUEsU0FBQSxDQUFBLENBQUEsQ0FBQSxhQUFBLENBQUEsd0JBQUE7RUFDQSxJQUFBLENBQUEsVUFBQTtJQUNBLDhCQUFBLDRCQUFBLG1CQUFBLENBQUE7SUFDQSxVQUFBLEdBQUEsd0JBQUEsR0FBQSxHQUFBLEdBQUEsMEJBRkE7O0VBR0EsY0FBQSxHQUFBLEdBQUEsQ0FBQSxRQUFBLENBQUEsVUFBQSxFQUFBLElBQUEsRUFBQSxZQUFBO1NBQ0EsbUJBQUEsQ0FBQSxJQUFBLENBQUEsY0FBQSxDQUFBLElBQUE7QUFSQTs7QUNqQ0EsR0FBQSxDQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUEsb0JBQUEsR0FBQSxTQUFBLEdBQUEsRUFBQSx3QkFBQSxFQUFBLGlCQUFBO0FBQ0EsTUFBQTtFQUFBLFVBQUEsR0FBQSxHQUFBLENBQUEsYUFBQSxDQUFBO0VBQ0EsbUJBQUEsR0FBQSxHQUFBLENBQUEsT0FBQSxDQUFBLFVBQUEsQ0FBQSxXQUFBLENBQUEsR0FBQSxDQUFBLGFBQUEsQ0FBQSxDQUFBO0VBRUEsbUJBQUEsR0FBQSxVQUFBLENBQUEsU0FBQSxDQUFBLENBQUEsQ0FBQSxhQUFBLENBQUEsaUJBQUEsQ0FBQSxVQUFBLElBQUEsd0JBQUE7RUFFQSxxQkFBQSxHQUFBLGlCQUFBLENBQUEsZ0JBQUEsSUFBQSxDQUFBLHdCQUFBLEdBQUEsR0FBQSxHQUFBLG1CQUFBLENBQUEsYUFBQSxHQUFBLEdBQUE7RUFFQSxJQUFBLHVCQUFBLEdBQUEsbUJBQUEsQ0FBQSxNQUFBLENBQUEscUJBQUEsQ0FBQTtXQUVBLEdBQUEsQ0FBQSxTQUFBLENBQUEsS0FBQSxHQUFBLENBQUEsRUFBQSxDQUFBLElBQUEsQ0FBQSxhQUFBLENBQUEsd0JBQUEsQ0FBQSxDQUFBLENBQUEsR0FBQSxTQUFBO2FBQ0EsR0FBQSxDQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUEsNkNBQUEsQ0FBQSxHQUFBLEVBQUEsbUJBQUEsRUFBQSxVQUFBO0lBREEsRUFGQTtHQUFBLE1BQUE7V0FNQSxHQUFBLENBQUEsU0FBQSxDQUFBLEtBQUEsR0FBQSxDQUFBLEVBQUEsQ0FBQSxJQUFBLENBQUEsYUFBQSxDQUFBLHdCQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUEsMEJBQUEsQ0FBQSxHQUFBLEVBQUEsVUFBQSxFQUFBLGlCQUFBLEVBQUEsbUJBQUEsRUFOQTs7QUFSQTs7QUFnQkEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUEsMEJBQUEsR0FBQSxTQUFBLEdBQUEsRUFBQSxVQUFBLEVBQUEsaUJBQUEsRUFBQSxtQkFBQTtBQUNBLE1BQUE7RUFBQSx3QkFBQSxHQUFBLFVBQUEsQ0FBQSxlQUFBLENBQUE7RUFDQSw0QkFBQSxHQUFBLEdBQUEsQ0FBQSxPQUFBLENBQUEsVUFBQSxDQUFBLFdBQUEsQ0FBQSxtQkFBQTtFQUVBLElBQUEsaUJBQUEsQ0FBQSxXQUFBO0lBQ0EsbUJBQUEsR0FBQSxpQkFBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsVUFBQSxDQUFBO0lBQ0EsOEJBQUEsR0FBQSxpQkFBQSxDQUFBLEVBQUEsR0FBQTtBQUVBLFdBQUEsU0FBQTthQUFBLEdBQUEsQ0FBQSxPQUFBLENBQUEsT0FBQSxDQUFBLGtDQUFBLENBQUEsR0FBQSxFQUFBLG1CQUFBLEVBQUEsbUJBQUEsRUFBQSw4QkFBQTtJQUFBLEVBSkE7R0FBQSxNQUFBO0lBTUEsbUJBQUEsR0FBQSxpQkFBQSxDQUFBLEtBQUEsR0FDQSxpQkFBQSxDQUFBLEtBREEsR0FFQSxpQkFBQSxDQUFBLEVBQUEsR0FDQSxpQkFBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsVUFBQSxDQUFBLGFBREEsR0FHQSx3QkFBQSxHQUFBLEdBQUEsR0FBQSxVQUFBLENBQUE7QUFFQSxXQUFBLFNBQUE7YUFBQSxHQUFBLENBQUEsT0FBQSxDQUFBLE9BQUEsQ0FBQSx1QkFBQSxDQUFBLEdBQUEsRUFBQSxtQkFBQSxFQUFBLG1CQUFBO0lBQUEsRUFiQTs7QUFKQTs7QUFtQkEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUEsdUJBQUEsR0FBQSxTQUFBLEdBQUEsRUFBQSxtQkFBQSxFQUFBLG1CQUFBO0FBQ0EsTUFBQTtFQUFBLFFBQUEsR0FBQTtFQUNBLGNBQUEsR0FBQSxHQUFBLENBQUEsZ0JBQUEsQ0FBQTtBQUNBO0FBQUEsT0FBQSxxQ0FBQTs7SUFDQSxJQUFBLGNBQUEsS0FBQSxJQUFBLENBQUEsUUFBQSxDQUFBLG1CQUFBLEVBQUEsSUFBQSxFQUFBLFVBQUEsQ0FBQTtNQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUEsSUFBQSxFQUFBOztBQURBO0FBRUEsU0FBQTtBQUxBOztBQU9BLEdBQUEsQ0FBQSxPQUFBLENBQUEsT0FBQSxDQUFBLGtDQUFBLEdBQUEsU0FBQSxHQUFBLEVBQUEsbUJBQUEsRUFBQSxtQkFBQSxFQUFBLDhCQUFBO0FBQ0EsTUFBQTtFQUFBLFFBQUEsR0FBQTtFQUNBLGNBQUEsR0FBQSxHQUFBLENBQUEsZ0JBQUEsQ0FBQTtFQUNBLGVBQUEsR0FBQSxHQUFBLENBQUEsYUFBQSxDQUFBLENBQUEsQ0FBQSxPQUFBLENBQUE7QUFDQTtBQUFBLE9BQUEscUNBQUE7O0lBQ0EsSUFBQSxjQUFBLEtBQUEsSUFBQSxDQUFBLFFBQUEsQ0FBQSxtQkFBQSxFQUFBLElBQUEsRUFBQSxVQUFBLENBQUEsSUFBQSxlQUFBLEtBQUEsSUFBQSxDQUFBLFFBQUEsQ0FBQSw4QkFBQSxFQUFBLElBQUEsRUFBQSwwQkFBQSxDQUFBO01BQUEsUUFBQSxDQUFBLElBQUEsQ0FBQSxJQUFBLEVBQUE7O0FBREE7QUFFQSxTQUFBO0FBTkE7O0FBUUEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUEsNkNBQUEsR0FBQSxTQUFBLEdBQUEsRUFBQSxtQkFBQSxFQUFBLFVBQUE7QUFDQSxNQUFBO0VBQUEsa0JBQUEsR0FBQSxHQUFBLENBQUEsUUFBQSxDQUFBLFVBQUEsRUFBQSxJQUFBLEVBQUEsZ0JBQUE7RUFDQSxJQUFBLENBQUEsS0FBQSxDQUFBLE9BQUEsQ0FBQSxrQkFBQSxDQUFBO0FBQUEsVUFBQSxJQUFBLEtBQUEsQ0FBQSxRQUFBLEdBQUEsVUFBQSxHQUFBLCtEQUFBLEdBQUEsQ0FBQSxtQkFBQSxDQUFBLE9BQUEsQ0FBQSxDQUFBLENBQUEsRUFBQTs7RUFDQSxRQUFBLEdBQUE7QUFDQTtBQUFBLE9BQUEscUNBQUE7O0lBQ0EsSUFBQSxrQkFBQSxDQUFBLFFBQUEsQ0FBQSxHQUFBLENBQUEsZ0JBQUEsQ0FBQSxDQUFBLENBQUE7TUFBQSxRQUFBLENBQUEsSUFBQSxDQUFBLElBQUEsRUFBQTs7QUFEQTtBQUVBLFNBQUE7QUFOQTs7QUNsREEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUEsbUJBQUEsR0FBQSxTQUFBLEdBQUEsRUFBQSxpQ0FBQSxFQUFBLGlCQUFBO0FBQ0EsTUFBQTtFQUFBLFVBQUEsR0FBQSxHQUFBLENBQUEsYUFBQSxDQUFBO0VBQ0EsbUJBQUEsR0FBQSxHQUFBLENBQUEsT0FBQSxDQUFBLFVBQUEsQ0FBQSxXQUFBLENBQUEsR0FBQSxDQUFBLGFBQUEsQ0FBQSxDQUFBO0VBRUEsTUFBQSxHQUFBLFVBQUEsQ0FBQSxTQUFBLENBQUE7RUFFQSxJQUFBLGlCQUFBLENBQUEsVUFBQTtJQUNBLG1CQUFBLEdBQUEsTUFBQSxDQUFBLGFBQUEsQ0FBQSxpQkFBQSxDQUFBLFVBQUEsRUFEQTtHQUFBLE1BQUE7SUFHQSxtQkFBQSxHQUFBLE1BQUEsQ0FBQSwyQkFBQSxDQUFBLGlDQUFBLEVBSEE7O1NBS0EsR0FBQSxDQUFBLFNBQUEsQ0FBQSxLQUFBLEdBQUEsQ0FBQSxFQUFBLENBQUEsSUFBQSxDQUFBLGFBQUEsQ0FBQSxpQ0FBQSxDQUFBLENBQUEsQ0FBQSxHQUFBLFNBQUE7V0FBQSxHQUFBLENBQUEsT0FBQSxDQUFBLE9BQUEsQ0FBQSwwQkFBQSxDQUFBLEdBQUEsRUFBQSxVQUFBLEVBQUEsaUJBQUEsRUFBQSxtQkFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7RUFBQTtBQVhBOztBQ0FBLEdBQUEsQ0FBQSxPQUFBLENBQUEsT0FBQSxDQUFBLFFBQUEsR0FBQSxTQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsWUFBQTtBQUNBLE1BQUE7O0lBREEsZUFBQTs7RUFDQSxHQUFBLENBQUEsU0FBQSxDQUFBLElBQUEsQ0FBQSxTQUFBLEdBQUEsQ0FBQSxNQUFBLENBQUEsV0FBQSxDQUFBLENBQUEsQ0FBQTtFQUNBLElBQUEsWUFBQSxDQUFBLElBQUE7SUFDQSxJQUFBLEdBQUEsWUFBQSxDQUFBLEtBREE7R0FBQSxNQUVBLElBQUEsTUFBQSxLQUFBLEtBQUE7SUFDQSxJQUFBLEdBQUEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUEsTUFBQSxDQUFBLEdBQUEsRUFEQTs7RUFHQSxJQUFBLE1BQUEsS0FBQSxNQUFBO0lBQ0EsSUFBQSxDQUFBLEdBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQTtBQUFBLFlBQUEsSUFBQSxLQUFBLENBQUEsb0JBQUEsRUFBQTtLQURBO0dBQUEsTUFBQTtJQUdBLElBQUEsR0FBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBO0FBQUEsWUFBQSxJQUFBLEtBQUEsQ0FBQSxnQkFBQSxFQUFBO0tBSEE7O0VBS0EsT0FBQSxHQUFBLEdBQUEsQ0FBQSxPQUFBLENBQUEsSUFBQSxDQUFBLGNBQUEsQ0FDQSxHQUFBLENBQUEsT0FBQSxDQUFBLEdBQUEsQ0FBQSxnQkFBQSxDQUFBLE1BQUEsRUFBQSxFQUFBLEVBQUEsR0FBQSxFQUFBLFlBQUEsQ0FEQSxFQUVBLE1BRkEsRUFHQSxJQUhBLEVBSUEsWUFBQSxDQUFBLE9BSkE7RUFNQSxPQUFBLENBQUEsSUFBQSxDQUFBLFNBQUEsUUFBQTtBQUNBLFFBQUE7SUFBQSxJQUFBLFFBQUEsQ0FBQSxJQUFBO01BQUEsR0FBQSxDQUFBLFNBQUEsQ0FBQSxRQUFBLENBQUEsSUFBQSxFQUFBOztJQUNBLEdBQUEsQ0FBQSxTQUFBLENBQUEsSUFBQSxDQUFBLFFBQUEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxXQUFBLENBQUEsQ0FBQSxDQUFBO0lBRUEsVUFBQSxHQUFBLEdBQUEsQ0FBQSxhQUFBLENBQUE7SUFFQSxJQUFBLFVBQUEsQ0FBQSxZQUFBLENBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBQTtNQUNBLEVBQUEsQ0FBQSxJQUFBLENBQUEsZUFBQSxDQUFBLFVBQUEsQ0FBQSxZQUFBLEVBQUEsR0FBQTthQUNBLFVBQUEsQ0FBQSxRQUFBLENBQUEsR0FBQSxDQUFBLGdCQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUEsSUFGQTs7RUFOQSxDQUFBO0FBVUEsU0FBQTtBQTVCQTs7QUE4QkEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUEsY0FBQSxHQUFBLFNBQUEsR0FBQSxFQUFBLFdBQUEsRUFBQSxlQUFBLEVBQUEsWUFBQTtBQUNBLE1BQUE7O0lBREEsZUFBQTs7RUFDQSxNQUFBLEdBQUEsZUFBQSxDQUFBLE1BQUEsQ0FBQSxXQUFBLENBQUE7RUFDQSxHQUFBLENBQUEsU0FBQSxDQUFBLElBQUEsQ0FBQSxTQUFBLEdBQUEsQ0FBQSxNQUFBLENBQUEsV0FBQSxDQUFBLENBQUEsQ0FBQTtFQUVBLElBQUEsWUFBQSxDQUFBLElBQUE7SUFDQSxJQUFBLEdBQUEsWUFBQSxDQUFBLEtBREE7R0FBQSxNQUVBLElBQUEsQ0FBQSxlQUFBLENBQUEsWUFBQTtJQUNBLElBQUEsR0FBQSxHQUFBLENBQUEsT0FBQSxDQUFBLE9BQUEsQ0FBQSxNQUFBLENBQUEsR0FBQSxFQURBOztFQUdBLE9BQUEsR0FBQSxHQUFBLENBQUEsT0FBQSxDQUFBLElBQUEsQ0FBQSxjQUFBLENBQ0EsR0FBQSxDQUFBLE9BQUEsQ0FBQSxHQUFBLENBQUEsZ0JBQUEsQ0FBQSxXQUFBLEVBQUEsZUFBQSxFQUFBLEdBQUEsRUFBQSxZQUFBLENBREEsRUFFQSxNQUZBLEVBR0EsSUFIQSxFQUlBLFlBQUEsQ0FBQSxPQUpBO0VBTUEsT0FBQSxDQUFBLElBQUEsQ0FBQSxTQUFBLFFBQUE7QUFDQSxRQUFBO0lBQUEsSUFBQSxDQUFBLGVBQUEsQ0FBQSxhQUFBO01BQ0EsSUFBQSxRQUFBLENBQUEsSUFBQTtRQUFBLEdBQUEsQ0FBQSxTQUFBLENBQUEsUUFBQSxDQUFBLElBQUEsRUFBQTs7TUFDQSxHQUFBLENBQUEsU0FBQSxDQUFBLElBQUEsQ0FBQSxRQUFBLEdBQUEsQ0FBQSxNQUFBLENBQUEsV0FBQSxDQUFBLENBQUEsQ0FBQSxFQUZBOztJQUlBLFVBQUEsR0FBQSxHQUFBLENBQUEsYUFBQSxDQUFBO0lBRUEsSUFBQSxDQUFBLGNBQUEsR0FBQSxHQUFBLENBQUEsZ0JBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxVQUFBLENBQUEsWUFBQSxDQUFBLFFBQUEsQ0FBQSxHQUFBLENBQUE7TUFDQSxFQUFBLENBQUEsSUFBQSxDQUFBLGVBQUEsQ0FBQSxVQUFBLENBQUEsWUFBQSxFQUFBLEdBQUE7YUFDQSxVQUFBLENBQUEsUUFBQSxDQUFBLGNBQUEsQ0FBQSxHQUFBLElBRkE7O0VBUEEsQ0FBQTtBQVdBLFNBQUE7QUExQkE7O0FDOUJBLEdBQUEsQ0FBQSxPQUFBLENBQUEsS0FBQSxDQUFBLHdCQUFBLEdBQUEsU0FBQSxHQUFBLEVBQUEsV0FBQSxFQUFBLFVBQUEsRUFBQSxjQUFBO0FBQ0EsTUFBQTtFQUFBLHVCQUFBLEdBQUEsV0FBQSxDQUFBLFVBQUE7RUFDQSxJQUFBLENBQUEsdUJBQUEsSUFBQSxDQUFBLGNBQUEsQ0FBQSxRQUFBO0FBQUEsV0FBQTs7RUFDQSxVQUFBLEdBQUEsR0FBQSxDQUFBLGFBQUEsQ0FBQTtFQUNBLE1BQUEsR0FBQSxVQUFBLENBQUEsU0FBQSxDQUFBO0VBQ0EsMkJBQUEsR0FBQSxNQUFBLENBQUEsYUFBQSxDQUFBLFVBQUEsSUFBQSxjQUFBLENBQUEsVUFBQTtTQUVBLEVBQUEsQ0FBQSxJQUFBLENBQUEsT0FBQSxDQUFBLHVCQUFBLEVBQUEsU0FBQSxvQkFBQTtBQUNBLFFBQUE7SUFBQSxnQkFBQSxHQUFBLElBQUEsRUFBQSxDQUFBLE9BQUEsQ0FBQSwyQkFBQSxFQUFBLG9CQUFBO1dBQ0EsMkJBQUEsQ0FBQSxVQUFBLENBQUEsZ0JBQUE7RUFGQSxDQUFBO0FBUEE7O0FDQUEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxLQUFBLENBQUEscUJBQUEsR0FBQSxTQUFBLEdBQUEsRUFBQSxXQUFBLEVBQUEsVUFBQSxFQUFBLGNBQUE7QUFDQSxNQUFBO0VBQUEsb0JBQUEsR0FBQSxXQUFBLENBQUEsVUFBQTtFQUNBLElBQUEsQ0FBQSxvQkFBQSxJQUFBLENBQUEsY0FBQSxDQUFBLFFBQUE7QUFBQSxXQUFBOztFQUNBLFVBQUEsR0FBQSxHQUFBLENBQUEsYUFBQSxDQUFBO0VBQ0EsTUFBQSxHQUFBLFVBQUEsQ0FBQSxTQUFBLENBQUE7RUFDQSxJQUFBLGNBQUEsQ0FBQSxVQUFBO0lBQ0EsMkJBQUEsR0FBQSxNQUFBLENBQUEsYUFBQSxDQUFBLGNBQUEsQ0FBQSxVQUFBLEVBREE7R0FBQSxNQUFBO0lBR0EsMkJBQUEsR0FBQSxNQUFBLENBQUEsMkJBQUEsQ0FBQSxVQUFBLEVBSEE7O0VBS0EsZ0JBQUEsR0FBQSwyQkFBQSxDQUFBLFdBQUEsQ0FBQSxvQkFBQTtFQUVBLHFCQUFBLEdBQUEsY0FBQSxDQUFBLGdCQUFBLElBQUEsQ0FBQSxVQUFBLEdBQUEsR0FBQSxHQUFBLDJCQUFBLENBQUEsYUFBQTtTQUNBLEdBQUEsQ0FBQSxRQUFBLENBQUEscUJBQUEsRUFBQSxnQkFBQSxDQUFBLGdCQUFBLENBQUEsQ0FBQTtBQWJBIiwiZmlsZSI6Imh0dHBvbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIjIEEgSmF2YXNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiBIVFRQb25nXG4jXG4jIEBhdXRob3IgSGFucyBPdHRvIFdpcnR6XG4jIEB2ZXJzaW9uIDAuMy44XG5cbkhUVFBvbmcgPSBIUCA9IHt9XG5IUC5wcml2YXRlID0gSFBQID0ge1xuICBsb2c6IC0+XG4gICAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgWyclYyBIVFRQb25nICcsICdiYWNrZ3JvdW5kOiAjODBDQkM0OyBjb2xvcjogI2ZmZiddLmNvbmNhdChBcnJheS5mcm9tKGFyZ3VtZW50cykpKVxuICBzY2hlbWVzOiB7fVxuICBodHRwX2Z1bmN0aW9uOiBudWxsXG4gIGlzSHBlOiAoZSkgLT5cbiAgICBlLmNvbnN0cnVjdG9yIGlzIEhQLkVsZW1lbnRcbiAgaXNIcGM6IChlKSAtPlxuICAgIGUuY29uc3RydWN0b3IgaXMgSFAuQ29sbGVjdGlvblxuICBIZWxwZXJzOiB7fVxufVxuXG4jIEFkZHMgYSBzY2hlbWVcbiNcbiMgQHBhcmFtIHtPYmplY3R9IHByZV9zY2hlbWUgVGhlIG9iamVjdCB0aGF0IHdpbGwgYmVjb21lIGEgU2NoZW1lLlxuIyBAdGhyb3cge0Vycm9yfSBpZiBhIHNjaGVtZSB3aXRoIHRoZSBnaXZlbiBuYW1lIGFscmVhZHkgZXhpc3RzLlxuIyBAcmV0dXJuIHtIUC5TY2hlbWV9IFRoZSBzY2hlbWVcbkhQLmFkZFNjaGVtZSA9IChwcmVfc2NoZW1lKSAtPlxuICBzY2hlbWUgPSBuZXcgSFAuU2NoZW1lKHByZV9zY2hlbWUpXG4gIGlmIEhQUC5zY2hlbWVzW3NjaGVtZS5nZXROYW1lKCldXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQSBzY2hlbWUgd2l0aCBuYW1lICN7c2NoZW1lLmdldE5hbWUoKX0gYWxyZWFkeSBleGlzdHNcIilcblxuICBIUFAuc2NoZW1lc1tzY2hlbWUuZ2V0TmFtZSgpXSA9IHNjaGVtZVxuXG4jIEdldHMgYSBzY2hlbWUgYnkgaXRzIG5hbWUuXG4jXG4jIEBwYXJhbSB7U3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBzY2hlbWUuXG4jIEByZXR1cm4ge0hQLlNjaGVtZSwgdW5kZWZpbmVkfSBUaGUgc2NoZW1lLCBvciB1bmRlZmluZWQgaWYgaXQgZG9lcyBub3QgZXhpc3QuXG5IUC5nZXRTY2hlbWUgPSAobmFtZSkgLT5cbiAgSFBQLnNjaGVtZXNbbmFtZV1cblxuIyBCb290c3RyYXAgSFRUUG9uZ1xuI1xuIyBAcmV0dXJuIHtPYmplY3R9IEhUVFBvbmdcbkhQLmluaXRpYWxpemUgPSAtPlxuICBzY2hlbWVfdGFncyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ21ldGFbbmFtZT1odHRwb25nLXNjaGVtZV0nKVxuICBpZiAhc2NoZW1lX3RhZ3MubGVuZ3RoIGFuZCAhT2JqZWN0LmtleXMoSFBQLnNjaGVtZXMpLmxlbmd0aFxuICAgIHRocm93IG5ldyBFcnJvcignTm8gc2NoZW1lIGFkZGVkIG9yIGZvdW5kJylcblxuICBmb3Igc2NoZW1lX3RhZyBpbiBzY2hlbWVfdGFnc1xuICAgIEhQLmFkZFNjaGVtZShKU09OLnBhcnNlKHNjaGVtZV90YWcuY29udGVudCkpXG5cbiAgZm9yIHNjaGVtZV9uYW1lLCBzY2hlbWUgb2YgSFBQLnNjaGVtZXNcbiAgICBmb3IgY29sbGVjdGlvbl9uYW1lLCBjb2xsZWN0aW9uIG9mIHNjaGVtZS5jb2xsZWN0aW9uc1xuICAgICAgY29sbGVjdGlvbi5oYW5kbGVQcmVsb2FkZWRFbGVtZW50cygpXG5cbiAgcmV0dXJuIEhQXG5cbiMgU2V0IHRoZSBodHRwIGZ1bmN0aW9uIHVzZWQgZm9yIHJlcXVlc3RzXG4jIFRoZSBmdW5jdGlvbiBzaG91bGQgYWNjZXB0IG9uZSBvYmplY3Qgd2l0aCBrZXlzXG4jIG1ldGhvZCwgdXJsLCBwYXJhbXMsIGhlYWRlcnNcbiMgYW5kIHJldHVybiBhIHByb21pc2UtbGlrZSBvYmplY3RcbiMgd2l0aCB0aGVuIGFuZCBjYXRjaFxuI1xuIyBAbm90ZSBMaWtlICRodHRwIG9yIGpRdWVyeS5hamF4XG4jIEBwYXJhbSB7RnVuY3Rpb259IGh0dHBfZnVuY3Rpb24gVGhlIGZ1bmN0aW9uLlxuIyBAcmV0dXJuIHtPYmplY3R9IEhQXG5IUC5zZXRIdHRwRnVuY3Rpb24gPSAoZm4sIHR5cGUpIC0+XG4gIGlmIHR5cGUgaXMgJ2pxdWVyeScgb3JcbiAgKHR5cGVvZiBqUXVlcnkgaXNudCAndW5kZWZpbmVkJyBhbmQgZm4gaXMgalF1ZXJ5LmFqYXgpXG4gICAgSFBQLmh0dHBfZnVuY3Rpb24gPSAodXJsLCBvYmplY3QpIC0+XG4gICAgICBkZWZlcnJlZCA9IGpRdWVyeS5EZWZlcnJlZCgpXG4gICAgICBhamF4ID0gZm4odXJsLCBvYmplY3QpXG4gICAgICBhamF4LnRoZW4gKGRhdGEsIHN0YXR1cywganF4aHIpIC0+XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoe2RhdGE6IGRhdGEsIHN0YXR1czoganF4aHIuc3RhdHVzQ29kZSgpLnN0YXR1cywgaGVhZGVyczoganF4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCl9KVxuICAgICAgYWpheC5jYXRjaCAoZGF0YSwgc3RhdHVzLCBqcXhocikgLT5cbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KHtkYXRhOiBkYXRhLCBzdGF0dXM6IGpxeGhyLnN0YXR1c0NvZGUoKS5zdGF0dXMsIGhlYWRlcnM6IGpxeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpfSlcbiAgICAgIHJldHVybiBkZWZlcnJlZFxuXG4gIGVsc2UgaWYgdHlwZSBpcyAnZmV0Y2gnIG9yXG4gICh0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGZuIGlzIHdpbmRvdy5mZXRjaClcbiAgICBIUFAuaHR0cF9mdW5jdGlvbiA9ICh1cmwsIG9iamVjdCkgLT5cbiAgICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICAgIG9iamVjdC5ib2R5ID0gb2JqZWN0LmRhdGFcbiAgICAgICAgaHR0cF9wcm9taXNlID0gZm4odXJsLCBvYmplY3QpXG4gICAgICAgIGh0dHBfcHJvbWlzZS50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgICAgICBpZiByZXNwb25zZS5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykgaXNudCAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAganNvbl9wcm9taXNlID0gcmVzcG9uc2UuanNvbigpXG4gICAgICAgICAgICBqc29uX3Byb21pc2UudGhlbiAoanNvbikgLT5cbiAgICAgICAgICAgICAgcmVzcG9uc2UuZGF0YSA9IGpzb25cbiAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSlcbiAgICAgICAgICAgIGpzb25fcHJvbWlzZS5jYXRjaCByZWplY3RcbiAgICAgICAgaHR0cF9wcm9taXNlLmNhdGNoIHJlamVjdFxuXG4gIGVsc2UgIyBhbmd1bGFyIG9yIHNpbWlsYXJcbiAgICBIUFAuaHR0cF9mdW5jdGlvbiA9ICh1cmwsIG9iamVjdCkgLT5cbiAgICAgIGZuKG9iamVjdClcbiAgcmV0dXJuXG4iLCJjbGFzcyBIUC5TY2hlbWVcbiAgY29uc3RydWN0b3I6IChwcmVfc2NoZW1lLCBvcHRpb25zID0ge25vX25vcm1hbGl6ZTogZmFsc2UsIG5vX2NyZWF0ZV9jb2xsZWN0aW9uczogZmFsc2V9KSAtPlxuICAgIEBkYXRhID0gcHJlX3NjaGVtZVxuICAgIEBjb2xsZWN0aW9ucyA9IHt9XG4gICAgQGFwaV91cmwgPSBudWxsXG4gICAgQG5vcm1hbGl6ZSgpIHVubGVzcyBvcHRpb25zLm5vX25vcm1hbGl6ZVxuICAgIEBjcmVhdGVDb2xsZWN0aW9ucygpIHVubGVzcyBvcHRpb25zLm5vX2NyZWF0ZV9jb2xsZWN0aW9uc1xuXG4gIGdldE5hbWU6IC0+XG4gICAgQGRhdGEubmFtZVxuXG4gIG5vcm1hbGl6ZTogLT5cbiAgICBAZGF0YS5uYW1lID0gQGRhdGEubmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgZm9yIGNvbGxlY3Rpb25fbmFtZSwgY29sbGVjdGlvbl9zZXR0aW5ncyBvZiBAZGF0YS5jb2xsZWN0aW9uc1xuICAgICAgY29sbGVjdGlvbl9zZXR0aW5ncy5zaW5ndWxhciB8fD0gY29sbGVjdGlvbl9uYW1lLnNsaWNlKDAsIC0xKVxuICAgICAgY29sbGVjdGlvbl9zZXR0aW5ncy5hY3Rpb25zIHx8PSB7fVxuICAgICAgY29sbGVjdGlvbl9zZXR0aW5ncy5jb2xsZWN0aW9uX2FjdGlvbnMgfHw9IHt9XG4gICAgICBjb2xsZWN0aW9uX3NldHRpbmdzLnJlbGF0aW9ucyB8fD0ge31cbiAgICAgIGNvbGxlY3Rpb25fc2V0dGluZ3MucmVsYXRpb25zLmhhc19vbmUgfHw9IHt9XG4gICAgICBjb2xsZWN0aW9uX3NldHRpbmdzLnJlbGF0aW9ucy5oYXNfbWFueSB8fD0ge31cbiAgICAgIGNvbGxlY3Rpb25fc2V0dGluZ3MucmVsYXRpb25zLmJlbG9uZ3NfdG8gfHw9IHt9XG5cbiAgY3JlYXRlQ29sbGVjdGlvbnM6IC0+XG4gICAgZm9yIGNvbGxlY3Rpb25fbmFtZSwgY29sbGVjdGlvbl9zZXR0aW5ncyBvZiBAZGF0YS5jb2xsZWN0aW9uc1xuICAgICAgaWYgQGNvbGxlY3Rpb25zW2NvbGxlY3Rpb25fbmFtZV1cbiAgICAgICAgSFBQLmxvZyBcIkNvbGxlY3Rpb24gd2l0aCBuYW1lICN7Y29sbGVjdGlvbl9uYW1lfSBhbHJlYWR5IGV4aXN0cyBpbiBzY2hlbWVcIlxuICAgICAgICBjb250aW51ZVxuICAgICAgY29sbGVjdGlvbiA9IG5ldyBIUC5Db2xsZWN0aW9uKEAsIGNvbGxlY3Rpb25fbmFtZSlcbiAgICAgIEBjb2xsZWN0aW9uc1tjb2xsZWN0aW9uX25hbWVdID0gY29sbGVjdGlvblxuXG4gIGdldENvbGxlY3Rpb246IChuYW1lKSAtPlxuICAgIGlmICFAY29sbGVjdGlvbnNbbmFtZV1cbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvbGxlY3Rpb24gI3tuYW1lfSBkb2VzIG5vdCBleGlzdFwiKVxuICAgIGVsc2VcbiAgICAgIEBjb2xsZWN0aW9uc1tuYW1lXVxuXG4gIGdldENvbGxlY3Rpb25CeVNpbmd1bGFyTmFtZTogKHNpbmd1bGFyX25hbWUpIC0+XG4gICAgZm9yIGNvbGxlY3Rpb25fbmFtZSwgY29sbGVjdGlvbiBvZiBAY29sbGVjdGlvbnNcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uIGlmIGNvbGxlY3Rpb24uZ2V0U2luZ3VsYXJOYW1lKCkgaXMgc2luZ3VsYXJfbmFtZVxuICAgIHRocm93IG5ldyBFcnJvcihcIkNvbGxlY3Rpb24gI3tzaW5ndWxhcl9uYW1lfSBkb2VzIG5vdCBleGlzdFwiKVxuXG4gIHNlbGVjdDogQDo6Z2V0Q29sbGVjdGlvblxuXG4gIHNldEFwaVVybDogKHVybCkgLT5cbiAgICBAYXBpX3VybCA9IEhQUC5IZWxwZXJzLlVybC50cmltU2xhc2hlcyh1cmwpXG4gICAgdW5sZXNzIEhQLlV0aWwuc3RhcnRzV2l0aChAYXBpX3VybCwgJ2h0dHA6Ly8nKSBvciBIUC5VdGlsLnN0YXJ0c1dpdGgoQGFwaV91cmwsICdodHRwczovLycpXG4gICAgICBAYXBpX3VybCA9IFwiLyN7QGFwaV91cmx9XCJcblxuICBnZXRBcGlVcmw6IC0+XG4gICAgQGFwaV91cmxcbiIsImNsYXNzIEhQLkVsZW1lbnRcbiAgY29uc3RydWN0b3I6IChAY29sbGVjdGlvbiwgcHJlX2VsZW1lbnQpIC0+XG4gICAgaHBlID0gQFxuICAgIEBmaWVsZHMgPSB7fVxuICAgIEByZWxhdGlvbnMgPSB7fVxuXG4gICAgY29sbGVjdGlvbl9zZXR0aW5ncyA9IEhQUC5IZWxwZXJzLkNvbGxlY3Rpb24uZ2V0U2V0dGluZ3MoQGNvbGxlY3Rpb24pXG5cbiAgICBIUC5VdGlsLmZvckVhY2ggY29sbGVjdGlvbl9zZXR0aW5ncy5maWVsZHMsIChmaWVsZF9zZXR0aW5ncywgZmllbGRfbmFtZSkgLT5cbiAgICAgIGlmIGZpZWxkX3NldHRpbmdzLmVtYmVkZGVkX2VsZW1lbnRcbiAgICAgICAgSFBQLkhlbHBlcnMuRmllbGQuaGFuZGxlRW1iZWRkZWRFbGVtZW50KGhwZSwgcHJlX2VsZW1lbnQsIGZpZWxkX25hbWUsIGZpZWxkX3NldHRpbmdzKVxuICAgICAgZWxzZSBpZiBmaWVsZF9zZXR0aW5ncy5lbWJlZGRlZF9jb2xsZWN0aW9uXG4gICAgICAgIEhQUC5IZWxwZXJzLkZpZWxkLmhhbmRsZUVtYmVkZGVkQ29sbGVjdGlvbihocGUsIHByZV9lbGVtZW50LCBmaWVsZF9uYW1lLCBmaWVsZF9zZXR0aW5ncylcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIGlmIGZpZWxkX3NldHRpbmdzLm9ubHlfc2VuZFxuICAgICAgICBmaWVsZF92YWx1ZSA9IHByZV9lbGVtZW50W2ZpZWxkX25hbWVdXG4gICAgICAgIGhwZS5zZXRGaWVsZChmaWVsZF9uYW1lLCBmaWVsZF92YWx1ZSwgdHJ1ZSlcblxuICAgIEhQLlV0aWwuZm9yRWFjaCBjb2xsZWN0aW9uX3NldHRpbmdzLnJlbGF0aW9ucy5oYXNfbWFueSwgKHJlbGF0aW9uX3NldHRpbmdzLCByZWxhdGlvbl9jb2xsZWN0aW9uX25hbWUpIC0+XG4gICAgICBIUFAuSGVscGVycy5FbGVtZW50LnNldHVwSGFzTWFueVJlbGF0aW9uKGhwZSwgcmVsYXRpb25fY29sbGVjdGlvbl9uYW1lLCByZWxhdGlvbl9zZXR0aW5ncylcblxuICAgIEhQLlV0aWwuZm9yRWFjaCBjb2xsZWN0aW9uX3NldHRpbmdzLnJlbGF0aW9ucy5oYXNfb25lLCAocmVsYXRpb25fc2V0dGluZ3MsIHJlbGF0aW9uX2NvbGxlY3Rpb25fc2luZ3VsYXJfbmFtZSkgLT5cbiAgICAgIEhQUC5IZWxwZXJzLkVsZW1lbnQuc2V0dXBIYXNPbmVSZWxhdGlvbihocGUsIHJlbGF0aW9uX2NvbGxlY3Rpb25fc2luZ3VsYXJfbmFtZSwgcmVsYXRpb25fc2V0dGluZ3MpXG5cbiAgICBIUC5VdGlsLmZvckVhY2ggY29sbGVjdGlvbl9zZXR0aW5ncy5yZWxhdGlvbnMuYmVsb25nc190bywgKHJlbGF0aW9uX3NldHRpbmdzLCByZWxhdGlvbl9jb2xsZWN0aW9uX3Npbmd1bGFyX25hbWUpIC0+XG4gICAgICBIUFAuSGVscGVycy5FbGVtZW50LnNldHVwQmVsb25nc1RvUmVsYXRpb24oaHBlLCByZWxhdGlvbl9jb2xsZWN0aW9uX3Npbmd1bGFyX25hbWUsIHJlbGF0aW9uX3NldHRpbmdzKVxuXG4gICAgQGFjdGlvbnMgPSB7XG4gICAgICBkb0dldDogKHVzZXJfb3B0aW9ucykgLT5cbiAgICAgICAgSFBQLkhlbHBlcnMuRWxlbWVudC5kb0FjdGlvbihocGUsICdHRVQnLCB1c2VyX29wdGlvbnMpXG5cbiAgICAgIGRvUG9zdDogKHVzZXJfb3B0aW9ucykgLT5cbiAgICAgICAgSFBQLkhlbHBlcnMuRWxlbWVudC5kb0FjdGlvbihocGUsICdQT1NUJywgdXNlcl9vcHRpb25zKVxuXG4gICAgICBkb1B1dDogKHVzZXJfb3B0aW9ucykgLT5cbiAgICAgICAgSFBQLkhlbHBlcnMuRWxlbWVudC5kb0FjdGlvbihocGUsICdQVVQnLCB1c2VyX29wdGlvbnMpXG5cbiAgICAgIGRvRGVsZXRlOiAodXNlcl9vcHRpb25zKSAtPlxuICAgICAgICBIUFAuSGVscGVycy5FbGVtZW50LmRvQWN0aW9uKGhwZSwgJ0RFTEVURScsIHVzZXJfb3B0aW9ucylcbiAgICB9XG5cbiAgICBIUC5VdGlsLmZvckVhY2ggY29sbGVjdGlvbl9zZXR0aW5ncy5hY3Rpb25zLCAoYWN0aW9uX3NldHRpbmdzLCBhY3Rpb25fbmFtZSkgLT5cbiAgICAgIGhwZS5hY3Rpb25zW1wiZG8je0hQLlV0aWwudXBwZXJDYW1lbGl6ZShhY3Rpb25fbmFtZSl9XCJdID0gKHVzZXJfb3B0aW9ucykgLT5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IGlzIG5ldycpIGlmIGhwZS5pc05ldygpIGFuZCAhYWN0aW9uX3NldHRpbmdzLndpdGhvdXRfc2VsZWN0b3JcbiAgICAgICAgSFBQLkhlbHBlcnMuRWxlbWVudC5kb0N1c3RvbUFjdGlvbihocGUsIGFjdGlvbl9uYW1lLCBhY3Rpb25fc2V0dGluZ3MsIHVzZXJfb3B0aW9ucylcblxuICAgIEBzbmFwc2hvdHMgPSB7XG4gICAgICBnZXRMYXN0UGVyc2lzdGVkOiAtPlxuICAgICAgICByZXR1cm4gbnVsbCBpZiBocGUuaXNOZXcoKVxuICAgICAgICBsYXN0X3BlcnNpc3RlZF9zbmFwc2hvdCA9IG51bGxcbiAgICAgICAgSFAuVXRpbC5yZXZlcnNlRm9ySW4gaHBlLnNuYXBzaG90cy5saXN0LCAoaywgdikgLT5cbiAgICAgICAgICBpZiB2LnRhZyBpcyAnYWZ0ZXJfcG9zdCcgb3Igdi50YWcgaXMgJ2FmdGVyX3B1dCcgb3Igdi50YWcgaXMgJ2FmdGVyX2dldCcgb3Igdi50YWcgaXMgJ2NyZWF0aW9uJ1xuICAgICAgICAgICAgbGFzdF9wZXJzaXN0ZWRfc25hcHNob3QgPSB2XG4gICAgICAgICAgICByZXR1cm4gSFAuVXRpbC5CUkVBS1xuXG4gICAgICAgIGxhc3RfcGVyc2lzdGVkX3NuYXBzaG90XG5cbiAgICAgIGdldExhc3RXaXRoVGFnOiAodGFnKSAtPlxuICAgICAgICBsYXN0X3NuYXBzaG90X3dpdGhfdGFnID0gbnVsbFxuICAgICAgICBpZiBIUC5VdGlsLmlzUmVnZXgodGFnKVxuICAgICAgICAgIEhQLlV0aWwucmV2ZXJzZUZvckluIGhwZS5zbmFwc2hvdHMubGlzdCwgKGssIHYpIC0+XG4gICAgICAgICAgICBpZiB0YWcudGVzdCh2LnRhZylcbiAgICAgICAgICAgICAgbGFzdF9zbmFwc2hvdF93aXRoX3RhZyA9IHZcbiAgICAgICAgICAgICAgcmV0dXJuIEhQLlV0aWwuQlJFQUtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEhQLlV0aWwucmV2ZXJzZUZvckluIGhwZS5zbmFwc2hvdHMubGlzdCwgKGssIHYpIC0+XG4gICAgICAgICAgICBpZiB2LnRhZyBpcyB0YWdcbiAgICAgICAgICAgICAgbGFzdF9zbmFwc2hvdF93aXRoX3RhZyA9IHZcbiAgICAgICAgICAgICAgcmV0dXJuIEhQLlV0aWwuQlJFQUtcbiAgICAgICAgbGFzdF9zbmFwc2hvdF93aXRoX3RhZ1xuXG4gICAgICBnZXRMYXN0OiAtPlxuICAgICAgICBsYXN0X3NuYXBzaG90ID0gbnVsbFxuICAgICAgICBIUC5VdGlsLnJldmVyc2VGb3JJbiBocGUuc25hcHNob3RzLmxpc3QsIChrLCB2KSAtPlxuICAgICAgICAgIGxhc3Rfc25hcHNob3QgPSB2XG4gICAgICAgICAgcmV0dXJuIEhQLlV0aWwuQlJFQUtcbiAgICAgICAgbGFzdF9zbmFwc2hvdFxuXG4gICAgICBtYWtlOiAodGFnKSAtPlxuICAgICAgICBkYXRlID0gRGF0ZS5ub3coKVxuICAgICAgICBsaXN0ID0gaHBlLnNuYXBzaG90cy5saXN0ID1cbiAgICAgICAgICBIUFAuSGVscGVycy5TbmFwc2hvdC5yZW1vdmVBZnRlcihocGUubGFzdF9zbmFwc2hvdF90aW1lLCBocGUuc25hcHNob3RzLmxpc3QpXG4gICAgICAgIGlmIGxpc3RbZGF0ZV1cbiAgICAgICAgICByZXR1cm4gaHBlLnNuYXBzaG90cy5tYWtlKHRhZykgIyBsb29wIHVudGlsIDFtcyBoYXMgcGFzc2VkXG4gICAgICAgIHMgPSBsaXN0W2RhdGVdID0ge1xuICAgICAgICAgIHRhZzogdGFnXG4gICAgICAgICAgdGltZTogZGF0ZVxuICAgICAgICAgIGRhdGE6IEhQUC5IZWxwZXJzLkVsZW1lbnQuZ2V0RmllbGRzKGhwZSlcbiAgICAgICAgICByZXZlcnQ6IC0+XG4gICAgICAgICAgICBocGUudW5kbyhkYXRlKVxuICAgICAgICB9XG4gICAgICAgIGhwZS5sYXN0X3NuYXBzaG90X3RpbWUgPSBkYXRlXG4gICAgICAgIHJldHVybiBzXG5cbiAgICAgIGxpc3Q6IHt9XG4gICAgfVxuICAgIEBsYXN0X3NuYXBzaG90X3RpbWUgPSBudWxsXG5cbiAgICBAc25hcHNob3RzLm1ha2UoJ2NyZWF0aW9uJylcblxuICBnZXRDb2xsZWN0aW9uOiAtPlxuICAgIEBjb2xsZWN0aW9uXG5cbiAgZ2V0Q29sbGVjdGlvbk5hbWU6IC0+XG4gICAgQGNvbGxlY3Rpb24uZ2V0TmFtZSgpXG5cbiAgZ2V0U2VsZWN0b3JWYWx1ZTogLT5cbiAgICBAZmllbGRzW0Bjb2xsZWN0aW9uLnNlbGVjdG9yX25hbWVdXG5cbiAgZ2V0RmllbGQ6IChmaWVsZF9uYW1lKSAtPlxuICAgIEBmaWVsZHNbZmllbGRfbmFtZV1cblxuICBzZXRGaWVsZDogKGZpZWxkX25hbWUsIGZpZWxkX3ZhbHVlKSAtPlxuICAgIEBmaWVsZHNbZmllbGRfbmFtZV0gPSBmaWVsZF92YWx1ZVxuICAgIHJldHVybiBAXG5cbiAgcmVtb3ZlOiAtPlxuICAgIGhwZSA9IEBcbiAgICBpZiBAaXNOZXcoKVxuICAgICAgSFAuVXRpbC5yZW1vdmVGcm9tQXJyYXkoQGdldENvbGxlY3Rpb24oKS5uZXdfZWxlbWVudHMsIEApXG4gICAgICByZXR1cm4ge3RoZW46ICgoZm4pIC0+IGZuKCkpLCBjYXRjaDogLT59XG4gICAgZWxzZVxuICAgICAgcmV0dXJuIEBhY3Rpb25zLmRvRGVsZXRlKCkudGhlbiAtPlxuICAgICAgICBlbGVtZW50cyA9IGhwZS5nZXRDb2xsZWN0aW9uKCkuZWxlbWVudHNcbiAgICAgICAgZGVsZXRlIGVsZW1lbnRzW2hwZS5nZXRTZWxlY3RvclZhbHVlKCldXG5cbiAgc2F2ZTogLT5cbiAgICBpZiBAaXNOZXcoKVxuICAgICAgQGFjdGlvbnMuZG9Qb3N0KClcbiAgICBlbHNlXG4gICAgICBAYWN0aW9ucy5kb1B1dCgpXG5cbiAgaXNOZXc6IC0+XG4gICAgaWYgQGdldENvbGxlY3Rpb24oKS5uZXdfZWxlbWVudHMuaW5jbHVkZXMoQClcbiAgICAgIGlmIEBnZXRTZWxlY3RvclZhbHVlKClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IGhhcyBhIHNlbGVjdG9yIHZhbHVlIGJ1dCBpcyBpbiBuZXdfZWxlbWVudHMgYXJyYXknKVxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIGVsc2VcbiAgICAgIGlmICFAZ2V0U2VsZWN0b3JWYWx1ZSgpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRWxlbWVudCBoYXMgbm8gc2VsZWN0b3IgdmFsdWUgYnV0IGlzIGluIGVsZW1lbnRzIG9iamVjdCcpXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBmYWxzZVxuXG4gIHVuZG86IChuID0gMCkgLT5cbiAgICBpZiBIUC5VdGlsLmlzSW50ZWdlcihuKVxuICAgICAgaWYgbiA+IDEwMDAwMDBcbiAgICAgICAgaWYgQHNuYXBzaG90cy5saXN0W25dXG4gICAgICAgICAgQG1lcmdlV2l0aCBAc25hcHNob3RzLmxpc3Rbbl0uZGF0YVxuICAgICAgICAgIEBsYXN0X3NuYXBzaG90X3RpbWUgPSBuXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEaWZmIGF0IHRpbWUgI3tufSBkb2VzIG5vdCBleGlzdFwiKVxuICAgICAgZWxzZSBpZiBuIDwgMFxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCIje259IGlzIHNtYWxsZXIgdGhhbiAwXCIpXG4gICAgICBlbHNlXG4gICAgICAgIGRzID0gSFBQLkhlbHBlcnMuU25hcHNob3QuZ2V0U29ydGVkQXJyYXkoQHNuYXBzaG90cy5saXN0KVxuICAgICAgICBsZW5ndGggPSBkcy5sZW5ndGhcbiAgICAgICAgaW5kZXggPSBkcy5pbmRleE9mKEBzbmFwc2hvdHMubGlzdFtAbGFzdF9zbmFwc2hvdF90aW1lXSlcbiAgICAgICAgIyBpbmRleCA9IDAgaWYgaW5kZXggPCAwXG4gICAgICAgIGQgPSBkc1tpbmRleCAtIG5dXG4gICAgICAgIEBtZXJnZVdpdGggZC5kYXRhXG4gICAgICAgIEBsYXN0X3NuYXBzaG90X3RpbWUgPSBkLnRpbWVcbiAgICBlbHNlIGlmIEhQLlV0aWwuaXNTdHJpbmcobilcbiAgICAgIGEgPSBudWxsXG4gICAgICBmb3IgdiBpbiBIUFAuSGVscGVycy5TbmFwc2hvdC5nZXRTb3J0ZWRBcnJheShAc25hcHNob3RzLmxpc3QpXG4gICAgICAgIGlmIHYudGFnIGlzIG5cbiAgICAgICAgICBhIHx8PSB2XG4gICAgICBpZiBhXG4gICAgICAgIEBtZXJnZVdpdGggYS5kYXRhXG4gICAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIHNuYXBzaG90IGZvdW5kIHdpdGggdGFnICN7bn1cIilcbiAgICBlbHNlXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRG9uJ3Qga25vdyB3aGF0IHRvIGRvIHdpdGggI3tufVwiKVxuXG4gIG1lcmdlV2l0aDogKHByZV9lbGVtZW50KSAtPlxuICAgIGhwZSA9IEBcbiAgICBjb2xsZWN0aW9uX3NldHRpbmdzID0gSFBQLkhlbHBlcnMuQ29sbGVjdGlvbi5nZXRTZXR0aW5ncyhAY29sbGVjdGlvbilcbiAgICBIUC5VdGlsLmZvckVhY2ggY29sbGVjdGlvbl9zZXR0aW5ncy5maWVsZHMsIChmaWVsZF9zZXR0aW5ncywgZmllbGRfbmFtZSkgLT5cbiAgICAgIGlmIGZpZWxkX3ZhbHVlID0gcHJlX2VsZW1lbnRbZmllbGRfbmFtZV1cbiAgICAgICAgaWYgZmllbGRfc2V0dGluZ3MuZW1iZWRkZWRfZWxlbWVudFxuICAgICAgICAgIEhQUC5IZWxwZXJzLkZpZWxkLmhhbmRsZUVtYmVkZGVkRWxlbWVudChocGUsIHByZV9lbGVtZW50LCBmaWVsZF9uYW1lLCBmaWVsZF9zZXR0aW5ncylcbiAgICAgICAgZWxzZSBpZiBmaWVsZF9zZXR0aW5ncy5lbWJlZGRlZF9jb2xsZWN0aW9uXG4gICAgICAgICAgSFBQLkhlbHBlcnMuRmllbGQuaGFuZGxlRW1iZWRkZWRDb2xsZWN0aW9uKGhwZSwgcHJlX2VsZW1lbnQsIGZpZWxkX25hbWUsIGZpZWxkX3NldHRpbmdzKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgc3ZfMSA9IGhwZS5maWVsZHNbZmllbGRfbmFtZV1cbiAgICAgICAgICBpZiBmaWVsZF9zZXR0aW5ncy5zZWxlY3RvciBhbmQgc3ZfMSBpc250IGZpZWxkX3ZhbHVlIGFuZCBzdl8xIGFuZCBmaWVsZF92YWx1ZVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2VsZWN0b3IgaGFzIGNoYW5nZWQgZnJvbSAje3N2XzF9IHRvICN7ZmllbGRfdmFsdWV9XCIpXG4gICAgICAgICAgaHBlLnNldEZpZWxkKGZpZWxkX25hbWUsIGZpZWxkX3ZhbHVlLCB0cnVlKVxuICAgIHJldHVybiBAXG5cbiAgaXNQZXJzaXN0ZWQ6IC0+XG4gICAgcmV0dXJuIGZhbHNlIGlmIEBpc05ldygpXG4gICAgZGF0YSA9IEBzbmFwc2hvdHMuZ2V0TGFzdFBlcnNpc3RlZCgpLmRhdGFcbiAgICBmb3IgaywgdiBvZiBIUFAuSGVscGVycy5FbGVtZW50LmdldEZpZWxkcyhAKVxuICAgICAgcmV0dXJuIGZhbHNlIGlmIGRhdGFba10gaXNudCB2XG4gICAgcmV0dXJuIHRydWVcbiIsImNsYXNzIEhQLkNvbGxlY3Rpb25cbiAgY29uc3RydWN0b3I6IChAc2NoZW1lLCBAbmFtZSkgLT5cbiAgICBocGMgPSBAXG4gICAgQGVsZW1lbnRzID0ge31cbiAgICBAbmV3X2VsZW1lbnRzID0gW11cbiAgICBAZGVmYXVsdF9wcmVfZWxlbWVudCA9IHt9XG4gICAgQHNlbGVjdG9yX25hbWUgPSBudWxsXG5cbiAgICBzZXR0aW5ncyA9IEhQUC5IZWxwZXJzLkNvbGxlY3Rpb24uZ2V0U2V0dGluZ3MoQClcblxuICAgIGZvciBmaWVsZF9uYW1lLCBmaWVsZF9zZXR0aW5ncyBvZiBzZXR0aW5ncy5maWVsZHNcbiAgICAgIGlmIGZpZWxkX3NldHRpbmdzLnNlbGVjdG9yXG4gICAgICAgIEBzZWxlY3Rvcl9uYW1lID0gZmllbGRfbmFtZVxuXG4gICAgICBpZiBmaWVsZF9zZXR0aW5ncy5kZWZhdWx0XG4gICAgICAgIEBkZWZhdWx0X3ByZV9lbGVtZW50W2ZpZWxkX25hbWVdID0gZmllbGRfc2V0dGluZ3MuZGVmYXVsdFxuXG4gICAgIyBmb3IgY29sbGVjdGlvbl9hY3Rpb25fbmFtZSwgY29sbGVjdGlvbl9hY3Rpb25fc2V0dGluZ3Mgb2Ygc2V0dGluZ3MuY29sbGVjdGlvbl9hY3Rpb25zXG4gICAgIyAgIEBhY3Rpb25zW0hQLlV0aWwuY2FtZWxpemUoY29sbGVjdGlvbl9hY3Rpb25fbmFtZSldID0gLT5cbiAgICAjICAgICAjIGNvbGxlY3Rpb25fYWN0aW9uX29wdGlvbnMgPSB7bWV0aG9kOiBjb2xsZWN0aW9uX2FjdGlvbl9zZXR0aW5ncy5tZXRob2QudG9VcHBlckNhc2UoKSwgfVxuICAgICMgICAgICMgbmV3X29wdGlvbnMgPSBIUC5VdGlsLm1lcmdlKEhQLlV0aWwubWVyZ2Uoe21ldGhvZDogJ0dFVCd9LCB7bWV0aH0pLCBvcHRpb25zKVxuICAgICMgICAgICMgSFBQLmh0dHBfZnVuY3Rpb24obmV3X29wdGlvbnMpXG5cbiAgICBAYWN0aW9ucyA9IHtcbiAgICAgIGRvR2V0QWxsOiAodXNlcl9vcHRpb25zKSAtPlxuICAgICAgICBIUFAuSGVscGVycy5Db2xsZWN0aW9uLmRvR2V0QWxsQWN0aW9uKGhwYywgdXNlcl9vcHRpb25zKVxuICAgICAgZG9HZXRPbmU6IChzZWxlY3Rvcl92YWx1ZSwgdXNlcl9vcHRpb25zKSAtPlxuICAgICAgICBIUFAuSGVscGVycy5Db2xsZWN0aW9uLmRvR2V0T25lQWN0aW9uKGhwYywgc2VsZWN0b3JfdmFsdWUsIHVzZXJfb3B0aW9ucylcbiAgICB9XG5cbiAgICBIUC5VdGlsLmZvckVhY2ggc2V0dGluZ3MuY29sbGVjdGlvbl9hY3Rpb25zLCAoYWN0aW9uX3NldHRpbmdzLCBhY3Rpb25fbmFtZSkgLT5cbiAgICAgIGhwYy5hY3Rpb25zW1wiZG8je0hQLlV0aWwudXBwZXJDYW1lbGl6ZShhY3Rpb25fbmFtZSl9XCJdID0gKHVzZXJfb3B0aW9ucykgLT5cbiAgICAgICAgSFBQLkhlbHBlcnMuQ29sbGVjdGlvbi5kb0N1c3RvbUFjdGlvbihocGMsIGFjdGlvbl9uYW1lLCBhY3Rpb25fc2V0dGluZ3MsIHVzZXJfb3B0aW9ucylcblxuICBoYW5kbGVQcmVsb2FkZWRFbGVtZW50czogLT5cbiAgICBjb2xsZWN0aW9uX3RhZ3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwibWV0YVtuYW1lPWh0dHBvbmctY29sbGVjdGlvbl1bY29sbGVjdGlvbj1cXFwiI3tAbmFtZX1cXFwiXVtzY2hlbWU9XFxcIiN7QHNjaGVtZS5nZXROYW1lKCl9XFxcIl1cIilcbiAgICBlbGVtZW50X3RhZ3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwibWV0YVtuYW1lPWh0dHBvbmctZWxlbWVudF1bY29sbGVjdGlvbj1cXFwiI3tAbmFtZX1cXFwiXVtzY2hlbWU9XFxcIiN7QHNjaGVtZS5nZXROYW1lKCl9XFxcIl1cIilcbiAgICBmb3IgY29sbGVjdGlvbl90YWcgaW4gY29sbGVjdGlvbl90YWdzXG4gICAgICBmb3IgcHJlX2VsZW1lbnQgaW4gSlNPTi5wYXJzZShjb2xsZWN0aW9uX3RhZy5jb250ZW50KVxuICAgICAgICBAbWFrZU9yTWVyZ2UgcHJlX2VsZW1lbnRcbiAgICBmb3IgZWxlbWVudF90YWcgaW4gZWxlbWVudF90YWdzXG4gICAgICBAbWFrZU9yTWVyZ2UgSlNPTi5wYXJzZShlbGVtZW50X3RhZy5jb250ZW50KVxuXG4gIGdldE5hbWU6IC0+XG4gICAgQG5hbWVcblxuICBnZXRQbHVyYWxOYW1lOiBAOjpnZXROYW1lXG5cbiAgZ2V0U2luZ3VsYXJOYW1lOiAtPlxuICAgIEhQUC5IZWxwZXJzLkNvbGxlY3Rpb24uZ2V0U2luZ3VsYXJOYW1lKEApXG5cbiAgZ2V0U2NoZW1lOiAtPlxuICAgIEBzY2hlbWVcblxuICAjIEdldCBhbiBhcnJheSBvZiBhbGwgZWxlbWVudHNcbiAgI1xuICAjIEBwYXJhbSB7Qm9vbGVhbn0gd2l0aG91dF9uZXcgU2tpcCBuZXcgZWxlbWVudHMuXG4gICNcbiAgIyBAcmV0dXJuIHtBcnJheX0gQXJyYXkgb2Yge0hQLkVsZW1lbnR9c1xuICBnZXRBcnJheTogKG9wdGlvbnMgPSB7d2l0aG91dF9uZXc6IGZhbHNlfSkgLT5cbiAgICBhcnIgPSBpZiBvcHRpb25zLndpdGhvdXRfbmV3IHRoZW4gW10gZWxzZSBAbmV3X2VsZW1lbnRzXG4gICAgYXJyLmNvbmNhdChPYmplY3QudmFsdWVzKEBlbGVtZW50cykpXG5cbiAgZmluZDogKHNlbGVjdG9yX3ZhbHVlKSAtPlxuICAgIEBlbGVtZW50c1tzZWxlY3Rvcl92YWx1ZV1cblxuICBmaW5kQnk6IChmaWVsZF9uYW1lLCBmaWVsZF92YWx1ZSwgb3B0aW9ucyA9IHt3aXRob3V0X25ldzogZmFsc2UsIG11bHRpcGxlOiBmYWxzZX0pIC0+XG4gICAgaWYgSFAuVXRpbC5pc1N0cmluZyhmaWVsZF9uYW1lKVxuICAgICAgYXJyID0gQGdldEFycmF5KG9wdGlvbnMpXG4gICAgICBpZiBvcHRpb25zLm11bHRpcGxlXG4gICAgICAgIHJlc3BvbnNlX2FyciA9IFtdXG4gICAgICAgIGZvciBlbGVtZW50IGluIGFyclxuICAgICAgICAgIHJlc3BvbnNlX2Fyci5wdXNoIGVsZW1lbnQgaWYgZWxlbWVudC5nZXRGaWVsZChmaWVsZF9uYW1lLCB0cnVlKSA9PSBmaWVsZF92YWx1ZVxuICAgICAgICByZXR1cm4gcmVzcG9uc2VfYXJyXG4gICAgICBlbHNlXG4gICAgICAgIGZvciBlbGVtZW50IGluIGFyclxuICAgICAgICAgIHJldHVybiBlbGVtZW50IGlmIGVsZW1lbnQuZ2V0RmllbGQoZmllbGRfbmFtZSwgdHJ1ZSkgPT0gZmllbGRfdmFsdWVcbiAgICBlbHNlXG4gICAgICBwcm9wcyA9IGZpZWxkX25hbWVcbiAgICAgIG9wdGlvbnMgPSBmaWVsZF92YWx1ZSB8fCB7d2l0aG91dF9uZXc6IGZhbHNlLCBtdWx0aXBsZTogZmFsc2V9XG4gICAgICBhcnIgPSBAZ2V0QXJyYXkob3B0aW9ucylcbiAgICAgIGlmIG9wdGlvbnMubXVsdGlwbGVcbiAgICAgICAgcmVzcG9uc2VfYXJyID0gW11cbiAgICAgICAgZm9yIGVsZW1lbnQgaW4gYXJyXG4gICAgICAgICAgaXNfY29ycmVjdCA9IHRydWVcbiAgICAgICAgICBmb3IgZmllbGRfbmFtZSwgZmllbGRfdmFsdWUgb2YgcHJvcHNcbiAgICAgICAgICAgIGlmIGVsZW1lbnQuZ2V0RmllbGQoZmllbGRfbmFtZSwgdHJ1ZSkgIT0gZmllbGRfdmFsdWVcbiAgICAgICAgICAgICAgaXNfY29ycmVjdCA9IGZhbHNlXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgcmVzcG9uc2VfYXJyLnB1c2ggZWxlbWVudCBpZiBpc19jb3JyZWN0XG4gICAgICAgIHJldHVybiByZXNwb25zZV9hcnJcbiAgICAgIGVsc2VcbiAgICAgICAgZm9yIGVsZW1lbnQgaW4gYXJyXG4gICAgICAgICAgaXNfY29ycmVjdCA9IHRydWVcbiAgICAgICAgICBmb3IgZmllbGRfbmFtZSwgZmllbGRfdmFsdWUgb2YgcHJvcHNcbiAgICAgICAgICAgIGlmIGVsZW1lbnQuZ2V0RmllbGQoZmllbGRfbmFtZSwgdHJ1ZSkgIT0gZmllbGRfdmFsdWVcbiAgICAgICAgICAgICAgaXNfY29ycmVjdCA9IGZhbHNlXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgcmV0dXJuIGVsZW1lbnQgaWYgaXNfY29ycmVjdFxuXG4gIG1ha2VOZXdFbGVtZW50OiAocHJlX2VsZW1lbnQgPSBAZGVmYXVsdF9wcmVfZWxlbWVudCkgLT5cbiAgICBlbCA9IG5ldyBIUC5FbGVtZW50KEAsIHByZV9lbGVtZW50KVxuICAgIEBhZGRFbGVtZW50KGVsKVxuICAgIHJldHVybiBlbFxuXG4gIGFkZEVsZW1lbnQ6IChlbCkgLT5cbiAgICBpZiBlbC5nZXRTZWxlY3RvclZhbHVlKClcbiAgICAgIEBlbGVtZW50c1tlbC5nZXRTZWxlY3RvclZhbHVlKCldID0gZWxcbiAgICBlbHNlXG4gICAgICBAbmV3X2VsZW1lbnRzLnB1c2goZWwpXG5cbiAgbWFrZU9yTWVyZ2U6IChwcmVfZWxlbWVudCkgLT5cbiAgICBpZiBzdiA9IHByZV9lbGVtZW50W0BzZWxlY3Rvcl9uYW1lXVxuICAgICAgaWYgZWwgPSBAZmluZChzdilcbiAgICAgICAgZWwubWVyZ2VXaXRoIHByZV9lbGVtZW50XG4gICAgICBlbHNlXG4gICAgICAgIEBtYWtlTmV3RWxlbWVudCBwcmVfZWxlbWVudFxuICAgIGVsc2VcbiAgICAgIEBtYWtlTmV3RWxlbWVudCBwcmVfZWxlbWVudFxuIiwiIyBjb2ZmZWVsaW50OiBkaXNhYmxlPW5vX3RoaXNcblxuT2JqZWN0LnZhbHVlcyB8fD0gYGZ1bmN0aW9uIHZhbHVlcyhvYmopIHtcblx0dmFyIHZhbHMgPSBbXTtcblx0Zm9yICh2YXIga2V5IGluIG9iaikge1xuXHRcdGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSAmJiBvYmoucHJvcGVydHlJc0VudW1lcmFibGUoa2V5KSkge1xuXHRcdFx0dmFscy5wdXNoKG9ialtrZXldKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHZhbHM7XG59XG5gXG5cbkFycmF5LnByb3RvdHlwZS5pbmNsdWRlcyB8fD0gKGUpIC0+XG4gIHRoaXMuaW5kZXhPZihlKSA+IC0xXG5cblN0cmluZy5wcm90b3R5cGUuaW5jbHVkZXMgfHw9IChlKSAtPlxuICB0aGlzLmluZGV4T2YoZSkgPiAtMVxuXG4jIGNvZmZlZWxpbnQ6IGVuYWJsZT1ub190aGlzXG4iLCJIUC5VdGlsID0ge1xuICBCUkVBSzogbmV3IE9iamVjdCgpXG4gIGtlYmFiOiAoc3RyaW5nKSAtPlxuICAgIHN0cmluZy50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1smXFwvXFxcXCMsKygpJH4lLidcIjoqPzw+e31dL2csICcnKS5yZXBsYWNlKC8ow6l8w6spL2csICdlJykuc3BsaXQoJyAnKS5qb2luKCctJylcbiAgdW5rZWJhYjogKHN0cmluZykgLT5cbiAgICBzdHJpbmcuc3BsaXQoJy0nKS5qb2luKCcgJylcbiAgdW5zbmFrZTogKHN0cmluZykgLT5cbiAgICBzdHJpbmcuc3BsaXQoJ18nKS5qb2luKCcgJylcbiAgY2FwaXRhbGl6ZTogKHN0cmluZykgLT5cbiAgICBzdHJpbmcuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHJpbmcuc2xpY2UoMSlcbiAgY2FtZWxpemU6IChzdHIpIC0+XG4gICAgc3RyLnJlcGxhY2UoL18vZywgJyAnKS5yZXBsYWNlKC8oPzpeXFx3fFtBLVpdfFxcYlxcdykvZywgKGxldHRlciwgaW5kZXgpIC0+XG4gICAgICBpZiBpbmRleCA9PSAwIHRoZW4gbGV0dGVyLnRvTG93ZXJDYXNlKCkgZWxzZSBsZXR0ZXIudG9VcHBlckNhc2UoKVxuICAgICkucmVwbGFjZSAvXFxzKy9nLCAnJ1xuICB1cHBlckNhbWVsaXplOiAoc3RyKSAtPlxuICAgIHN0ci5yZXBsYWNlKC9fL2csICcgJykucmVwbGFjZSgvKD86Xlxcd3xbQS1aXXxcXGJcXHcpL2csIChsZXR0ZXIsIGluZGV4KSAtPlxuICAgICAgbGV0dGVyLnRvVXBwZXJDYXNlKClcbiAgICApLnJlcGxhY2UgL1xccysvZywgJydcbiAgYXJyYXlEaWZmOiAoYXJyYXkxLCBhcnJheTIpIC0+XG4gICAgYXJyYXkxLmZpbHRlcihcbiAgICAgIChpKSAtPiBhcnJheTIuaW5kZXhPZihpKSA8IDBcbiAgICApXG4gIHJlbW92ZUZyb21BcnJheTogKGFycmF5LCBlbGVtZW50KSAtPlxuICAgIGkgPSBhcnJheS5pbmRleE9mKGVsZW1lbnQpXG4gICAgaWYgaSA9PSAtMVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgZWxzZVxuICAgICAgYXJyYXkuc3BsaWNlKGksIGkgKyAxKVxuICAgICAgcmV0dXJuIHRydWVcblxuICBjb3B5OiAob2JqKSAtPlxuICAgIGlmIG51bGwgPT0gb2JqIG9yICdvYmplY3QnICE9IHR5cGVvZiBvYmpcbiAgICAgIHJldHVybiBvYmpcbiAgICBjb3B5ID0gb2JqLmNvbnN0cnVjdG9yKClcbiAgICBmb3IgYXR0ciBvZiBvYmpcbiAgICAgIGlmIG9iai5oYXNPd25Qcm9wZXJ0eShhdHRyKVxuICAgICAgICBjb3B5W2F0dHJdID0gb2JqW2F0dHJdXG4gICAgY29weVxuXG4gIG1lcmdlOiAob2JqMSwgb2JqMikgLT5cbiAgICBmb3IgYXR0ciBvZiBvYmoyXG4gICAgICBvYmoxW2F0dHJdID0gb2JqMlthdHRyXVxuICAgIG9iajFcblxuICBpc0ludGVnZXI6ICh2YWx1ZSkgLT5cbiAgICB2YWx1ZSBpcyBwYXJzZUludCh2YWx1ZSwgMTApXG5cbiAgaXNOdW1iZXI6ICh2YWx1ZSkgLT5cbiAgICBpc0Zpbml0ZSh2YWx1ZSkgYW5kICFpc05hTihwYXJzZUZsb2F0KHZhbHVlKSlcblxuICBpc1N0cmluZzogKHZhbHVlKSAtPlxuICAgIHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJ1xuXG4gIGlzUmVnZXg6ICh2YWx1ZSkgLT5cbiAgICB2YWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cFxuXG4gIGZvckVhY2g6IChvLCBmKSAtPlxuICAgIGZvciBrLCB2IG9mIG9cbiAgICAgIGNvbnRpbnVlIGlmICFvLmhhc093blByb3BlcnR5KGspXG4gICAgICBpZiBmKHYsIGspIGlzIEhQLlV0aWwuQlJFQUtcbiAgICAgICAgYnJlYWtcbiAgICByZXR1cm5cblxuICByZXZlcnNlRm9ySW46IChvYmosIGYpIC0+XG4gICAgYXJyID0gW11cbiAgICBfYnJlYWsgPSBmYWxzZVxuICAgIGZvciBrZXkgb2Ygb2JqXG4gICAgICAjIGFkZCBoYXNPd25Qcm9wZXJ0eUNoZWNrIGlmIG5lZWRlZFxuICAgICAgYXJyLnB1c2gga2V5XG4gICAgaSA9IGFyci5sZW5ndGggLSAxXG4gICAgd2hpbGUgaSA+PSAwIGFuZCBub3QgX2JyZWFrXG4gICAgICB2ID0gZi5jYWxsIG9iaiwgYXJyW2ldLCBvYmpbYXJyW2ldXVxuICAgICAgX2JyZWFrID0gdHJ1ZSBpZiB2IGlzIEhQLlV0aWwuQlJFQUtcbiAgICAgIGktLVxuICAgIHJldHVyblxuXG4gIGVuZHNXaXRoOiAoc3RyaW5nLCBzZWFyY2gpIC0+XG4gICAgaWYgc3RyaW5nLmVuZHNXaXRoXG4gICAgICBzdHJpbmcuZW5kc1dpdGgoc2VhcmNoKVxuICAgIGVsc2VcbiAgICAgIHN0cmluZy5zdWJzdHIoLXNlYXJjaC5sZW5ndGgpID09IHNlYXJjaFxuXG4gIHN0YXJ0c1dpdGg6IChzdHJpbmcsIHNlYXJjaCkgLT5cbiAgICBpZiBzdHJpbmcuc3RhcnRzV2l0aFxuICAgICAgc3RyaW5nLnN0YXJ0c1dpdGgoc2VhcmNoKVxuICAgIGVsc2VcbiAgICAgIHN0cmluZy5zdWJzdHIoMCwgc2VhcmNoLmxlbmd0aCkgPT0gc2VhcmNoXG59XG4iLCJIUFAuSGVscGVycy5BamF4ID0ge1xuICBleGVjdXRlUmVxdWVzdDogKHVybCwgbWV0aG9kLCBkYXRhLCBoZWFkZXJzID0ge30pIC0+XG4gICAgaGVhZGVyc1snQWNjZXB0J10gPSBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgIG9wdGlvbnMgPSB7XG4gICAgICBtZXRob2Q6IG1ldGhvZFxuICAgICAgdXJsOiB1cmxcbiAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGlmIGRhdGEgaXMgdW5kZWZpbmVkIHRoZW4ge30gZWxzZSBkYXRhKVxuICAgICAgaGVhZGVyczogaGVhZGVyc1xuICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgICAgcmVzcG9uc2VUeXBlOiAnanNvbidcbiAgICB9XG4gICAgb3B0aW9ucy50eXBlID0gb3B0aW9ucy5tZXRob2RcbiAgICBvcHRpb25zLmJvZHkgPSBvcHRpb25zLmRhdGFcbiAgICBIUFAuaHR0cF9mdW5jdGlvbihvcHRpb25zLnVybCwgb3B0aW9ucylcbn1cbiIsIkhQUC5IZWxwZXJzLkNvbGxlY3Rpb24gPSB7XG4gIGdldFNldHRpbmdzOiAoYykgLT5cbiAgICBjLmdldFNjaGVtZSgpLmRhdGEuY29sbGVjdGlvbnNbYy5nZXROYW1lKCldXG5cbiAgZ2V0U2luZ3VsYXJOYW1lOiAoYykgLT5cbiAgICBIUFAuSGVscGVycy5Db2xsZWN0aW9uLmdldFNldHRpbmdzKGMpLnNpbmd1bGFyXG59XG4iLCJIUFAuSGVscGVycy5FbGVtZW50ID0ge1xuICB0b0RhdGE6IChlbGVtZW50KSAtPlxuICAgIGNvbGxlY3Rpb24gPSBlbGVtZW50LmdldENvbGxlY3Rpb24oKVxuICAgIG8gPSBIUFAuSGVscGVycy5FbGVtZW50LmdldEZpZWxkcyhlbGVtZW50KVxuXG4gICAgIyBkYXRhID0ge31cbiAgICAjIGRhdGFbSFBQLkhlbHBlcnMuQ29sbGVjdGlvbi5nZXRTaW5ndWxhck5hbWUoY29sbGVjdGlvbildID0gb1xuICAgICMgZGF0YVxuXG4gICAgZGF0YSA9IG9cblxuICBnZXRGaWVsZHM6IChlbGVtZW50KSAtPlxuICAgIGNvbGxlY3Rpb24gPSBlbGVtZW50LmdldENvbGxlY3Rpb24oKVxuICAgIHNjaGVtZSA9IGNvbGxlY3Rpb24uZ2V0U2NoZW1lKClcbiAgICBvID0ge31cbiAgICBmb3IgZmllbGRfbmFtZSwgZmllbGRfc2V0dGluZ3Mgb2Ygc2NoZW1lLmRhdGEuY29sbGVjdGlvbnNbY29sbGVjdGlvbi5nZXROYW1lKCldLmZpZWxkc1xuICAgICAgY29udGludWUgaWYgZmllbGRfc2V0dGluZ3Mub25seV9yZWNlaXZlIG9yIGZpZWxkX3NldHRpbmdzLmVtYmVkZGVkX2NvbGxlY3Rpb24gb3IgZmllbGRfc2V0dGluZ3MuZW1iZWRkZWRfZWxlbWVudFxuICAgICAgZmllbGRfdmFsdWUgPSBlbGVtZW50LmdldEZpZWxkKGZpZWxkX25hbWUpXG4gICAgICBvW2ZpZWxkX25hbWVdID0gZmllbGRfdmFsdWVcbiAgICBvXG59XG4iLCJIUFAuSGVscGVycy5GaWVsZCA9IHt9XG4iLCJIUFAuSGVscGVycy5TbmFwc2hvdCA9IHtcbiAgZ2V0U29ydGVkQXJyYXk6IChzbmFwc2hvdHNfbGlzdCkgLT5cbiAgICBhcnIgPSBPYmplY3QudmFsdWVzKHNuYXBzaG90c19saXN0KVxuICAgIGFyci5zb3J0IChhLCBiKSAtPiBhLnRpbWUgLSBiLnRpbWVcbiAgICBhcnJcblxuICByZW1vdmVBZnRlcjogKHRpbWUsIHNuYXBzaG90c19saXN0KSAtPlxuICAgIGFyciA9IEhQUC5IZWxwZXJzLlNuYXBzaG90LmdldFNvcnRlZEFycmF5KHNuYXBzaG90c19saXN0KVxuICAgIHNuYXBzaG90c19saXN0XzIgPSB7fVxuICAgIGZvciB2IGluIGFyclxuICAgICAgc25hcHNob3RzX2xpc3RfMlt2LnRpbWVdID0gdiBpZiB2LnRpbWUgPD0gdGltZVxuICAgIHNuYXBzaG90c19saXN0XzJcbn1cbiIsIkhQUC5IZWxwZXJzLlVybCA9IHtcbiAgIyBDcmVhdGVzIHRoZSBhcGkgdXJsIGZvciBhbiBlbGVtZW50XG4gICNcbiAgIyBAcGFyYW0ge1N0cmluZ30gYWN0aW9uX25hbWUgICAgICAgICAgIFRoZSBhY3Rpb24gbmFtZSwgY3VzdG9tIG9yICdHRVQnLCAnUE9TVCcsICdQVVQnLCAnREVMRVRFJy5cbiAgIyBAcGFyYW0ge0hQLkVsZW1lbnR9IGVsZW1lbnQgICAgICBUaGUgZWxlbWVudC5cbiAgIyBAcGFyYW0ge09iamVjdH0gdXNlcl9vcHRpb25zICAgICAgICAgIFRoZSB1c2VyX29wdGlvbnMsIGtleXM6IHN1ZmZpeCwgcGF0aC5cbiAgI1xuICAjIEByZXR1cm4gdW5kZWZpbmVkIFtEZXNjcmlwdGlvbl1cbiAgY3JlYXRlRm9yRWxlbWVudDogKGFjdGlvbl9uYW1lLCBhY3Rpb25fc2V0dGluZ3MsIGVsZW1lbnQsIHVzZXJfb3B0aW9ucykgLT5cbiAgICBjb2xsZWN0aW9uID0gZWxlbWVudC5nZXRDb2xsZWN0aW9uKClcbiAgICBzY2hlbWUgPSBjb2xsZWN0aW9uLmdldFNjaGVtZSgpXG4gICAgYXBpX3VybCA9IHNjaGVtZS5nZXRBcGlVcmwoKVxuICAgIHRocm93IG5ldyBFcnJvcignQXBpIHVybCBoYXMgbm90IHlldCBiZWVuIHNldCcpIGlmICFhcGlfdXJsXG5cbiAgICBpZiB1c2VyX29wdGlvbnMucGF0aFxuICAgICAgcGF0aCA9IEhQUC5IZWxwZXJzLlVybC50cmltU2xhc2hlcyh1c2VyX29wdGlvbnMucGF0aClcbiAgICAgIHVybCA9IFwiI3thcGlfdXJsfS8je3BhdGh9XCJcbiAgICBlbHNlXG4gICAgICB1cmwgPSBcIiN7YXBpX3VybH0vI3tjb2xsZWN0aW9uLmdldE5hbWUoKX1cIlxuICAgICAgdXJsID0gXCIje3VybH0vI3tlbGVtZW50LmdldFNlbGVjdG9yVmFsdWUoKX1cIiB1bmxlc3MgYWN0aW9uX3NldHRpbmdzLndpdGhvdXRfc2VsZWN0b3Igb3IgYWN0aW9uX25hbWUgaXMgJ1BPU1QnXG5cbiAgICBpZiBhY3Rpb25fc2V0dGluZ3MubWV0aG9kICMgaXMgY3VzdG9tIGFjdGlvblxuICAgICAgdXJsID0gXCIje3VybH0vI3thY3Rpb25fc2V0dGluZ3MucGF0aCB8fCBhY3Rpb25fbmFtZX1cIlxuXG4gICAgdXJsID0gXCIje3VybH0vI3t1c2VyX29wdGlvbnMuc3VmZml4fVwiIGlmIHVzZXJfb3B0aW9ucy5zdWZmaXhcbiAgICB1cmxcblxuICBjcmVhdGVGb3JDb2xsZWN0aW9uOiAoYWN0aW9uX25hbWUsIGNvbGxlY3Rpb24sIHVzZXJfb3B0aW9ucykgLT5cbiAgICB1cmwgPSBcIiN7Y29sbGVjdGlvbi5nZXRTY2hlbWUoKS5nZXRBcGlVcmwoKX0vI3tjb2xsZWN0aW9uLmdldE5hbWUoKX1cIiAjSFBQLkhlbHBlcnMuVXJsLmNyZWF0ZUZvckNvbGxlY3Rpb24oLCBocGUsIHVzZXJfb3B0aW9ucykgIyAoYWN0aW9uX25hbWUsIGVsZW1lbnQsIHVzZXJfb3B0aW9ucyA9IHt9LCBzdWZmaXgpXG4gICAgdXJsID0gXCIje3VybH0vI3t1c2VyX29wdGlvbnMuc3VmZml4fVwiIGlmIHVzZXJfb3B0aW9ucy5zdWZmaXhcbiAgICB1cmxcblxuICB0cmltU2xhc2hlczogKHMpIC0+XG4gICAgcy5yZXBsYWNlKC9cXC8kLywgJycpLnJlcGxhY2UoL15cXC8vLCAnJylcbn1cbiIsIkhQUC5IZWxwZXJzLkNvbGxlY3Rpb24uZG9HZXRBbGxBY3Rpb24gPSAoaHBjLCB1c2VyX29wdGlvbnMgPSB7fSkgLT5cbiAgZGF0YSA9IHVzZXJfb3B0aW9ucy5kYXRhXG5cbiAgcHJvbWlzZSA9IEhQUC5IZWxwZXJzLkFqYXguZXhlY3V0ZVJlcXVlc3QoXG4gICAgSFBQLkhlbHBlcnMuVXJsLmNyZWF0ZUZvckNvbGxlY3Rpb24oJ0dFVCcsIGhwYywgdXNlcl9vcHRpb25zKSxcbiAgICAnR0VUJyxcbiAgICBkYXRhLFxuICAgIHVzZXJfb3B0aW9ucy5oZWFkZXJzXG4gIClcbiAgcHJvbWlzZS50aGVuIChyZXNwb25zZSkgLT5cbiAgICBmb3IgcHJlX2VsZW1lbnQgaW4gcmVzcG9uc2UuZGF0YVxuICAgICAgaHBjLm1ha2VPck1lcmdlKHByZV9lbGVtZW50KVxuICByZXR1cm4gcHJvbWlzZVxuXG5IUFAuSGVscGVycy5Db2xsZWN0aW9uLmRvR2V0T25lQWN0aW9uID0gKGhwYywgc2VsZWN0b3JfdmFsdWUsIHVzZXJfb3B0aW9ucyA9IHt9KSAtPlxuICBkYXRhID0gdXNlcl9vcHRpb25zLmRhdGFcblxuICBwcm9taXNlID0gSFBQLkhlbHBlcnMuQWpheC5leGVjdXRlUmVxdWVzdChcbiAgICBIUFAuSGVscGVycy5VcmwuY3JlYXRlRm9yQ29sbGVjdGlvbignR0VUJywgaHBjLCB7c3VmZml4OiBzZWxlY3Rvcl92YWx1ZX0pLFxuICAgICdHRVQnLFxuICAgIGRhdGEsXG4gICAgdXNlcl9vcHRpb25zLmhlYWRlcnNcbiAgKVxuICBwcm9taXNlLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgIGhwYy5tYWtlT3JNZXJnZSByZXNwb25zZS5kYXRhIGlmIHJlc3BvbnNlLmRhdGFcbiAgcmV0dXJuIHByb21pc2VcblxuSFBQLkhlbHBlcnMuQ29sbGVjdGlvbi5kb0N1c3RvbUFjdGlvbiA9IChocGMsIGFjdGlvbl9uYW1lLCBhY3Rpb25fc2V0dGluZ3MsIHVzZXJfb3B0aW9ucyA9IHt9KSAtPlxuICBtZXRob2QgPSBhY3Rpb25fc2V0dGluZ3MubWV0aG9kLnRvVXBwZXJDYXNlKClcblxuICBkYXRhID0gdXNlcl9vcHRpb25zLmRhdGFcblxuICBIUFAuSGVscGVycy5BamF4LmV4ZWN1dGVSZXF1ZXN0KFxuICAgIEhQUC5IZWxwZXJzLlVybC5jcmVhdGVGb3JDb2xsZWN0aW9uKCdHRVQnLCBocGMsIHtzdWZmaXg6IGFjdGlvbl9zZXR0aW5ncy5wYXRoIHx8IGFjdGlvbl9uYW1lfSlcbiAgICBtZXRob2QsXG4gICAgZGF0YSxcbiAgICB1c2VyX29wdGlvbnMuaGVhZGVyc1xuICApXG4iLCJIUFAuSGVscGVycy5FbGVtZW50LnNldHVwQmVsb25nc1RvUmVsYXRpb24gPSAoaHBlLCByZWxhdGlvbl9jb2xsZWN0aW9uX3Npbmd1bGFyX25hbWUsIHJlbGF0aW9uX3NldHRpbmdzKSAtPlxuICBjb2xsZWN0aW9uID0gaHBlLmdldENvbGxlY3Rpb24oKVxuICBpZiAhcmVsYXRpb25fc2V0dGluZ3MucG9seW1vcnBoaWNcbiAgICBpZiByZWxhdGlvbl9zZXR0aW5ncy5jb2xsZWN0aW9uXG4gICAgICByZWxhdGlvbl9jb2xsZWN0aW9uID0gY29sbGVjdGlvbi5nZXRTY2hlbWUoKS5nZXRDb2xsZWN0aW9uKHJlbGF0aW9uX3NldHRpbmdzLmNvbGxlY3Rpb24pXG4gICAgZWxzZVxuICAgICAgcmVsYXRpb25fY29sbGVjdGlvbiA9IGNvbGxlY3Rpb24uZ2V0U2NoZW1lKCkuZ2V0Q29sbGVjdGlvbkJ5U2luZ3VsYXJOYW1lKHJlbGF0aW9uX2NvbGxlY3Rpb25fc2luZ3VsYXJfbmFtZSlcblxuICAjIFRPRE8gc2hvdWxkIGJlIHJlZmVyZW5jZVxuICBpZiByZWxhdGlvbl9zZXR0aW5ncy5wb2x5bW9ycGhpY1xuICAgIGNvbGxlY3Rpb25fZmllbGRfbmFtZSA9IHJlbGF0aW9uX3NldHRpbmdzLmNvbGxlY3Rpb25fZmllbGQgfHwgIFwiI3tyZWxhdGlvbl9jb2xsZWN0aW9uX3Npbmd1bGFyX25hbWV9X2NvbGxlY3Rpb25cIlxuICAgIGNvbGxlY3Rpb25fc2VsZWN0b3JfZmllbGQgPSByZWxhdGlvbl9zZXR0aW5ncy5jb2xsZWN0aW9uX3NlbGVjdG9yX2ZpZWxkXG4gICAgZmllbGRfbmFtZSA9IHJlbGF0aW9uX3NldHRpbmdzLmZpZWxkXG4gICAgaHBlLnJlbGF0aW9uc1tcImdldCN7SFAuVXRpbC51cHBlckNhbWVsaXplKHJlbGF0aW9uX2NvbGxlY3Rpb25fc2luZ3VsYXJfbmFtZSl9XCJdID0gLT5cbiAgICAgIEhQUC5IZWxwZXJzLkVsZW1lbnQuZ2V0UG9seW1vcnBoaWNCZWxvbmdzVG9FbGVtZW50KGhwZSwgZmllbGRfbmFtZSwgY29sbGVjdGlvbl9maWVsZF9uYW1lLCBjb2xsZWN0aW9uX3NlbGVjdG9yX2ZpZWxkLCByZWxhdGlvbl9jb2xsZWN0aW9uX3Npbmd1bGFyX25hbWUpXG4gIGVsc2UgIyBub3JtYWxcbiAgICBmaWVsZF9uYW1lID0gcmVsYXRpb25fc2V0dGluZ3MuZmllbGQgfHwgXCIje3JlbGF0aW9uX2NvbGxlY3Rpb25fc2luZ3VsYXJfbmFtZX1fI3tyZWxhdGlvbl9jb2xsZWN0aW9uLnNlbGVjdG9yX25hbWV9XCJcbiAgICBocGUucmVsYXRpb25zW1wiZ2V0I3tIUC5VdGlsLnVwcGVyQ2FtZWxpemUocmVsYXRpb25fY29sbGVjdGlvbl9zaW5ndWxhcl9uYW1lKX1cIl0gPSAtPlxuICAgICAgSFBQLkhlbHBlcnMuRWxlbWVudC5nZXRCZWxvbmdzVG9FbGVtZW50KGhwZSwgcmVsYXRpb25fY29sbGVjdGlvbiwgZmllbGRfbmFtZSlcblxuSFBQLkhlbHBlcnMuRWxlbWVudC5nZXRCZWxvbmdzVG9FbGVtZW50ID0gKGhwZSwgcmVsYXRpb25fY29sbGVjdGlvbiwgZmllbGRfbmFtZSkgLT5cbiAgc2VsZWN0b3JfdmFsdWUgPSBocGUuZ2V0RmllbGQoZmllbGRfbmFtZSwgdHJ1ZSwgJ2JlbG9uZ3NfdG8nKVxuICByZWxhdGlvbl9jb2xsZWN0aW9uLmZpbmQoc2VsZWN0b3JfdmFsdWUpIHx8IG51bGxcblxuIyBHZXRzIHRoZSBwb2x5bW9ycGhpYyBiZWxvbmdzX3RvIGVsZW1lbnRcbiNcbiMgQHBhcmFtIHtIVFRQb25nLkVsZW1lbnR9IGhwZSAgICAgICAgICAgICAgVGhlIGVsZW1lbnQgdG8gd2hpY2ggdGhlIG90aGVyIGVsZW1lbnQgYmVsb25nc1xuIyBAcGFyYW0ge1N0cmluZ30gZmllbGRfbmFtZSAgICAgICAgICAgICAgICBUaGUgZm9yZWlnbiBrZXksIGUuZy4gcGFyZW50X2lkLlxuIyBAcGFyYW0ge1N0cmluZ30gY29sbGVjdGlvbl9maWVsZF9uYW1lICAgICBUaGUgZmllbGQgbmFtZSBvZiB0aGUgb3RoZXIgY29sbGVjdGlvbiwgcmVxdWlyZWQsIGUuZy4gcGFyZW50X2NvbGxlY3Rpb24uXG4jIEBwYXJhbSB7U3RyaW5nfSBjb2xsZWN0aW9uX3NlbGVjdG9yX2ZpZWxkIFRoZSBzZWxlY3RvciBuYW1lIG9mIHRoZSBvdGhlciBjb2xsZWN0aW9uLCBpZiBpdCB3YXMgc3BlY2lmaWVkLCBlLmcuIGlkLiAoV2lsbCBub3QgYmUgbG9va2VkIGF0IGlmIGZpZWxkX25hbWUgaXMgcHJlc2VudClcbiMgQHBhcmFtIHtTdHJpbmd9IGNvbGxlY3Rpb25fc2luZ3VsYXJfbmFtZSAgZS5nLiBwYXJlbnRcbiNcbiMgQHJldHVybiB7SFRUUG9uZy5FbGVtZW50fG51bGx9ICAgICAgICAgICAgVGhlIHJlbGF0ZWQgZWxlbWVudC5cbkhQUC5IZWxwZXJzLkVsZW1lbnQuZ2V0UG9seW1vcnBoaWNCZWxvbmdzVG9FbGVtZW50ID0gKGhwZSwgZmllbGRfbmFtZSwgY29sbGVjdGlvbl9maWVsZF9uYW1lLCBjb2xsZWN0aW9uX3NlbGVjdG9yX2ZpZWxkLCBjb2xsZWN0aW9uX3Npbmd1bGFyX25hbWUpIC0+XG4gICMgY29uc29sZS5sb2cgaHBlLCBjb2xsZWN0aW9uX2ZpZWxkX25hbWUsIGNvbGxlY3Rpb25fc2VsZWN0b3JfZmllbGRcbiAgcmVsYXRpb25fY29sbGVjdGlvbl9uYW1lID0gaHBlLmdldEZpZWxkKGNvbGxlY3Rpb25fZmllbGRfbmFtZSwgdHJ1ZSwgJ2JlbG9uZ3NfdG9fY29sbGVjdGlvbicpXG4gIHJlbGF0aW9uX2NvbGxlY3Rpb24gPSBocGUuZ2V0Q29sbGVjdGlvbigpLmdldFNjaGVtZSgpLmdldENvbGxlY3Rpb24ocmVsYXRpb25fY29sbGVjdGlvbl9uYW1lKVxuICBpZiAhZmllbGRfbmFtZVxuICAgIGNvbGxlY3Rpb25fc2VsZWN0b3JfZmllbGQgfHw9IHJlbGF0aW9uX2NvbGxlY3Rpb24uc2VsZWN0b3JfbmFtZVxuICAgIGZpZWxkX25hbWUgPSBcIiN7Y29sbGVjdGlvbl9zaW5ndWxhcl9uYW1lfV8je2NvbGxlY3Rpb25fc2VsZWN0b3JfZmllbGR9XCJcbiAgc2VsZWN0b3JfdmFsdWUgPSBocGUuZ2V0RmllbGQoZmllbGRfbmFtZSwgdHJ1ZSwgJ2JlbG9uZ3NfdG8nKVxuICByZWxhdGlvbl9jb2xsZWN0aW9uLmZpbmQoc2VsZWN0b3JfdmFsdWUpIHx8IG51bGxcbiIsIkhQUC5IZWxwZXJzLkVsZW1lbnQuc2V0dXBIYXNNYW55UmVsYXRpb24gPSAoaHBlLCByZWxhdGlvbl9jb2xsZWN0aW9uX25hbWUsIHJlbGF0aW9uX3NldHRpbmdzKSAtPlxuICBjb2xsZWN0aW9uID0gaHBlLmdldENvbGxlY3Rpb24oKVxuICBjb2xsZWN0aW9uX3NldHRpbmdzID0gSFBQLkhlbHBlcnMuQ29sbGVjdGlvbi5nZXRTZXR0aW5ncyhocGUuZ2V0Q29sbGVjdGlvbigpKVxuXG4gIHJlbGF0aW9uX2NvbGxlY3Rpb24gPSBjb2xsZWN0aW9uLmdldFNjaGVtZSgpLmdldENvbGxlY3Rpb24ocmVsYXRpb25fc2V0dGluZ3MuY29sbGVjdGlvbiB8fCByZWxhdGlvbl9jb2xsZWN0aW9uX25hbWUpXG5cbiAgcmVmZXJlbmNlc19maWVsZF9uYW1lID0gcmVsYXRpb25fc2V0dGluZ3MucmVmZXJlbmNlc19maWVsZCB8fCBcIiN7cmVsYXRpb25fY29sbGVjdGlvbl9uYW1lfV8je3JlbGF0aW9uX2NvbGxlY3Rpb24uc2VsZWN0b3JfbmFtZX1zXCIgIyBkb2dzX2lkcywgdW5sZXNzIHNwZWNpZmllZCBvdGhlcndpc2VcblxuICBpZiByZWxhdGlvbl9maWVsZF9zZXR0aW5ncyA9IGNvbGxlY3Rpb25fc2V0dGluZ3MuZmllbGRzW3JlZmVyZW5jZXNfZmllbGRfbmFtZV1cbiAgICAjIHRocm93IG5ldyBFcnJvcihcIkZpZWxkICN7ZmllbGRfbmFtZX0gb2YgY29sbGVjdGlvbiAje2NvbGxlY3Rpb24uZ2V0TmFtZSgpfSBhcmUgbm90IHJlZmVyZW5jZXNcIikgaWYgIXJlbGF0aW9uX2ZpZWxkX3NldHRpbmdzLnJlZmVyZW5jZXNcbiAgICBocGUucmVsYXRpb25zW1wiZ2V0I3tIUC5VdGlsLnVwcGVyQ2FtZWxpemUocmVsYXRpb25fY29sbGVjdGlvbl9uYW1lKX1cIl0gPSAtPlxuICAgICAgSFBQLkhlbHBlcnMuRWxlbWVudC5nZXRIYXNNYW55UmVsYXRpb25BcnJheVRocm91Z2hSZWZlcmVuY2VzRmllbGQoaHBlLCByZWxhdGlvbl9jb2xsZWN0aW9uLCBmaWVsZF9uYW1lKVxuXG4gIGVsc2UgIyBub3JtYWwgaGFzX21hbnkgcmVsYXRpb25zaGlwXG4gICAgaHBlLnJlbGF0aW9uc1tcImdldCN7SFAuVXRpbC51cHBlckNhbWVsaXplKHJlbGF0aW9uX2NvbGxlY3Rpb25fbmFtZSl9XCJdID0gSFBQLkhlbHBlcnMuRWxlbWVudC5nZXRIYXNNYW55UmVsYXRpb25GdW5jdGlvbihocGUsIGNvbGxlY3Rpb24sIHJlbGF0aW9uX3NldHRpbmdzLCByZWxhdGlvbl9jb2xsZWN0aW9uKVxuXG5IUFAuSGVscGVycy5FbGVtZW50LmdldEhhc01hbnlSZWxhdGlvbkZ1bmN0aW9uID0gKGhwZSwgY29sbGVjdGlvbiwgcmVsYXRpb25fc2V0dGluZ3MsIHJlbGF0aW9uX2NvbGxlY3Rpb24pIC0+XG4gIGNvbGxlY3Rpb25fc2luZ3VsYXJfbmFtZSA9IGNvbGxlY3Rpb24uZ2V0U2luZ3VsYXJOYW1lKClcbiAgcmVsYXRpb25fY29sbGVjdGlvbl9zZXR0aW5ncyA9IEhQUC5IZWxwZXJzLkNvbGxlY3Rpb24uZ2V0U2V0dGluZ3MocmVsYXRpb25fY29sbGVjdGlvbilcblxuICBpZiByZWxhdGlvbl9zZXR0aW5ncy5wb2x5bW9ycGhpY1xuICAgIGhhc19tYW55X2ZpZWxkX25hbWUgPSBcIiN7cmVsYXRpb25fc2V0dGluZ3MuYXN9XyN7Y29sbGVjdGlvbi5zZWxlY3Rvcl9uYW1lfVwiXG4gICAgaGFzX21hbnlfY29sbGVjdGlvbl9maWVsZF9uYW1lID0gXCIje3JlbGF0aW9uX3NldHRpbmdzLmFzfV9jb2xsZWN0aW9uXCJcblxuICAgIHJldHVybiAtPiBIUFAuSGVscGVycy5FbGVtZW50LmdldFBvbHltb3JwaGljSGFzTWFueVJlbGF0aW9uQXJyYXkoaHBlLCByZWxhdGlvbl9jb2xsZWN0aW9uLCBoYXNfbWFueV9maWVsZF9uYW1lLCBoYXNfbWFueV9jb2xsZWN0aW9uX2ZpZWxkX25hbWUpXG4gIGVsc2VcbiAgICBoYXNfbWFueV9maWVsZF9uYW1lID0gaWYgcmVsYXRpb25fc2V0dGluZ3MuZmllbGRcbiAgICAgIHJlbGF0aW9uX3NldHRpbmdzLmZpZWxkXG4gICAgZWxzZSBpZiByZWxhdGlvbl9zZXR0aW5ncy5hc1xuICAgICAgXCIje3JlbGF0aW9uX3NldHRpbmdzLmFzfV8je2NvbGxlY3Rpb24uc2VsZWN0b3JfbmFtZX1cIlxuICAgIGVsc2VcbiAgICAgIFwiI3tjb2xsZWN0aW9uX3Npbmd1bGFyX25hbWV9XyN7Y29sbGVjdGlvbi5zZWxlY3Rvcl9uYW1lfVwiXG5cbiAgICByZXR1cm4gLT4gSFBQLkhlbHBlcnMuRWxlbWVudC5nZXRIYXNNYW55UmVsYXRpb25BcnJheShocGUsIHJlbGF0aW9uX2NvbGxlY3Rpb24sIGhhc19tYW55X2ZpZWxkX25hbWUpXG5cbkhQUC5IZWxwZXJzLkVsZW1lbnQuZ2V0SGFzTWFueVJlbGF0aW9uQXJyYXkgPSAoaHBlLCByZWxhdGlvbl9jb2xsZWN0aW9uLCBoYXNfbWFueV9maWVsZF9uYW1lKSAtPlxuICBocGUyX2FyciA9IFtdXG4gIHNlbGVjdG9yX3ZhbHVlID0gaHBlLmdldFNlbGVjdG9yVmFsdWUoKVxuICBmb3IgaHBlMiBpbiByZWxhdGlvbl9jb2xsZWN0aW9uLmdldEFycmF5KClcbiAgICBocGUyX2Fyci5wdXNoKGhwZTIpIGlmIHNlbGVjdG9yX3ZhbHVlIGlzIGhwZTIuZ2V0RmllbGQoaGFzX21hbnlfZmllbGRfbmFtZSwgdHJ1ZSwgJ2hhc19tYW55JylcbiAgcmV0dXJuIGhwZTJfYXJyXG5cbkhQUC5IZWxwZXJzLkVsZW1lbnQuZ2V0UG9seW1vcnBoaWNIYXNNYW55UmVsYXRpb25BcnJheSA9IChocGUsIHJlbGF0aW9uX2NvbGxlY3Rpb24sIGhhc19tYW55X2ZpZWxkX25hbWUsIGhhc19tYW55X2NvbGxlY3Rpb25fZmllbGRfbmFtZSkgLT5cbiAgaHBlMl9hcnIgPSBbXVxuICBzZWxlY3Rvcl92YWx1ZSA9IGhwZS5nZXRTZWxlY3RvclZhbHVlKClcbiAgY29sbGVjdGlvbl9uYW1lID0gaHBlLmdldENvbGxlY3Rpb24oKS5nZXROYW1lKClcbiAgZm9yIGhwZTIgaW4gcmVsYXRpb25fY29sbGVjdGlvbi5nZXRBcnJheSgpXG4gICAgaHBlMl9hcnIucHVzaChocGUyKSBpZiBzZWxlY3Rvcl92YWx1ZSBpcyBocGUyLmdldEZpZWxkKGhhc19tYW55X2ZpZWxkX25hbWUsIHRydWUsICdoYXNfbWFueScpIGFuZCBjb2xsZWN0aW9uX25hbWUgaXMgaHBlMi5nZXRGaWVsZChoYXNfbWFueV9jb2xsZWN0aW9uX2ZpZWxkX25hbWUsIHRydWUsICdoYXNfbWFueV9jb2xsZWN0aW9uX25hbWUnKVxuICByZXR1cm4gaHBlMl9hcnJcblxuSFBQLkhlbHBlcnMuRWxlbWVudC5nZXRIYXNNYW55UmVsYXRpb25BcnJheVRocm91Z2hSZWZlcmVuY2VzRmllbGQgPSAoaHBlLCByZWxhdGlvbl9jb2xsZWN0aW9uLCBmaWVsZF9uYW1lKSAtPlxuICBzZWxlY3Rvcl92YWx1ZV9hcnIgPSBocGUuZ2V0RmllbGQoZmllbGRfbmFtZSwgdHJ1ZSwgJ2hhc19tYW55X2FycmF5JylcbiAgdGhyb3cgbmV3IEVycm9yKFwiRmllbGQgI3tmaWVsZF9uYW1lfSBpcyBub3QgYW4gYXJyYXksIGJ1dCBpdCBzaG91bGQgYmUgYW4gYXJyYXkgb2YgcmVmZXJlbmNlcyB0byAje3JlbGF0aW9uX2NvbGxlY3Rpb24uZ2V0TmFtZSgpfVwiKSBpZiAhQXJyYXkuaXNBcnJheShzZWxlY3Rvcl92YWx1ZV9hcnIpXG4gIGhwZTJfYXJyID0gW11cbiAgZm9yIGhwZTIgaW4gcmVsYXRpb25fY29sbGVjdGlvbi5nZXRBcnJheSgpXG4gICAgaHBlMl9hcnIucHVzaChocGUyKSBpZiBzZWxlY3Rvcl92YWx1ZV9hcnIuaW5jbHVkZXMgaHBlLmdldFNlbGVjdG9yVmFsdWUoKVxuICByZXR1cm4gaHBlMl9hcnJcbiIsIkhQUC5IZWxwZXJzLkVsZW1lbnQuc2V0dXBIYXNPbmVSZWxhdGlvbiA9IChocGUsIHJlbGF0aW9uX2NvbGxlY3Rpb25fc2luZ3VsYXJfbmFtZSwgcmVsYXRpb25fc2V0dGluZ3MpIC0+XG4gIGNvbGxlY3Rpb24gPSBocGUuZ2V0Q29sbGVjdGlvbigpXG4gIGNvbGxlY3Rpb25fc2V0dGluZ3MgPSBIUFAuSGVscGVycy5Db2xsZWN0aW9uLmdldFNldHRpbmdzKGhwZS5nZXRDb2xsZWN0aW9uKCkpXG5cbiAgc2NoZW1lID0gY29sbGVjdGlvbi5nZXRTY2hlbWUoKVxuXG4gIGlmIHJlbGF0aW9uX3NldHRpbmdzLmNvbGxlY3Rpb25cbiAgICByZWxhdGlvbl9jb2xsZWN0aW9uID0gc2NoZW1lLmdldENvbGxlY3Rpb24ocmVsYXRpb25fc2V0dGluZ3MuY29sbGVjdGlvbilcbiAgZWxzZVxuICAgIHJlbGF0aW9uX2NvbGxlY3Rpb24gPSBzY2hlbWUuZ2V0Q29sbGVjdGlvbkJ5U2luZ3VsYXJOYW1lKHJlbGF0aW9uX2NvbGxlY3Rpb25fc2luZ3VsYXJfbmFtZSlcblxuICBocGUucmVsYXRpb25zW1wiZ2V0I3tIUC5VdGlsLnVwcGVyQ2FtZWxpemUocmVsYXRpb25fY29sbGVjdGlvbl9zaW5ndWxhcl9uYW1lKX1cIl0gPSAtPiBIUFAuSGVscGVycy5FbGVtZW50LmdldEhhc01hbnlSZWxhdGlvbkZ1bmN0aW9uKGhwZSwgY29sbGVjdGlvbiwgcmVsYXRpb25fc2V0dGluZ3MsIHJlbGF0aW9uX2NvbGxlY3Rpb24pKClbMF1cbiIsIkhQUC5IZWxwZXJzLkVsZW1lbnQuZG9BY3Rpb24gPSAoaHBlLCBtZXRob2QsIHVzZXJfb3B0aW9ucyA9IHt9KSAtPlxuICBocGUuc25hcHNob3RzLm1ha2UoXCJiZWZvcmVfI3ttZXRob2QudG9Mb3dlckNhc2UoKX1cIilcbiAgaWYgdXNlcl9vcHRpb25zLmRhdGFcbiAgICBkYXRhID0gdXNlcl9vcHRpb25zLmRhdGFcbiAgZWxzZSBpZiBtZXRob2QgaXNudCAnR0VUJ1xuICAgIGRhdGEgPSBIUFAuSGVscGVycy5FbGVtZW50LnRvRGF0YShocGUpXG5cbiAgaWYgbWV0aG9kIGlzICdQT1NUJ1xuICAgIHRocm93IG5ldyBFcnJvcignRWxlbWVudCBpcyBub3QgbmV3JykgaWYgIWhwZS5pc05ldygpXG4gIGVsc2VcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0VsZW1lbnQgaXMgbmV3JykgaWYgaHBlLmlzTmV3KClcblxuICBwcm9taXNlID0gSFBQLkhlbHBlcnMuQWpheC5leGVjdXRlUmVxdWVzdChcbiAgICBIUFAuSGVscGVycy5VcmwuY3JlYXRlRm9yRWxlbWVudChtZXRob2QsIHt9LCBocGUsIHVzZXJfb3B0aW9ucyksXG4gICAgbWV0aG9kLFxuICAgIGRhdGEsXG4gICAgdXNlcl9vcHRpb25zLmhlYWRlcnNcbiAgKVxuICBwcm9taXNlLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgIGhwZS5tZXJnZVdpdGggcmVzcG9uc2UuZGF0YSBpZiByZXNwb25zZS5kYXRhXG4gICAgaHBlLnNuYXBzaG90cy5tYWtlKFwiYWZ0ZXJfI3ttZXRob2QudG9Mb3dlckNhc2UoKX1cIilcblxuICAgIGNvbGxlY3Rpb24gPSBocGUuZ2V0Q29sbGVjdGlvbigpXG5cbiAgICBpZiBjb2xsZWN0aW9uLm5ld19lbGVtZW50cy5pbmNsdWRlcyhocGUpXG4gICAgICBIUC5VdGlsLnJlbW92ZUZyb21BcnJheShjb2xsZWN0aW9uLm5ld19lbGVtZW50cywgaHBlKVxuICAgICAgY29sbGVjdGlvbi5lbGVtZW50c1tocGUuZ2V0U2VsZWN0b3JWYWx1ZSgpXSA9IGhwZVxuXG4gIHJldHVybiBwcm9taXNlXG5cbkhQUC5IZWxwZXJzLkVsZW1lbnQuZG9DdXN0b21BY3Rpb24gPSAoaHBlLCBhY3Rpb25fbmFtZSwgYWN0aW9uX3NldHRpbmdzLCB1c2VyX29wdGlvbnMgPSB7fSkgLT5cbiAgbWV0aG9kID0gYWN0aW9uX3NldHRpbmdzLm1ldGhvZC50b1VwcGVyQ2FzZSgpXG4gIGhwZS5zbmFwc2hvdHMubWFrZShcImJlZm9yZV8je21ldGhvZC50b0xvd2VyQ2FzZSgpfVwiKVxuXG4gIGlmIHVzZXJfb3B0aW9ucy5kYXRhXG4gICAgZGF0YSA9IHVzZXJfb3B0aW9ucy5kYXRhXG4gIGVsc2UgaWYgbm90IGFjdGlvbl9zZXR0aW5ncy53aXRob3V0X2RhdGFcbiAgICBkYXRhID0gSFBQLkhlbHBlcnMuRWxlbWVudC50b0RhdGEoaHBlKVxuXG4gIHByb21pc2UgPSBIUFAuSGVscGVycy5BamF4LmV4ZWN1dGVSZXF1ZXN0KFxuICAgIEhQUC5IZWxwZXJzLlVybC5jcmVhdGVGb3JFbGVtZW50KGFjdGlvbl9uYW1lLCBhY3Rpb25fc2V0dGluZ3MsIGhwZSwgdXNlcl9vcHRpb25zKVxuICAgIG1ldGhvZCxcbiAgICBkYXRhLFxuICAgIHVzZXJfb3B0aW9ucy5oZWFkZXJzXG4gIClcbiAgcHJvbWlzZS50aGVuIChyZXNwb25zZSkgLT5cbiAgICBpZiAhYWN0aW9uX3NldHRpbmdzLnJldHVybnNfb3RoZXJcbiAgICAgIGhwZS5tZXJnZVdpdGggcmVzcG9uc2UuZGF0YSBpZiByZXNwb25zZS5kYXRhXG4gICAgICBocGUuc25hcHNob3RzLm1ha2UoXCJhZnRlcl8je21ldGhvZC50b0xvd2VyQ2FzZSgpfVwiKVxuXG4gICAgY29sbGVjdGlvbiA9IGhwZS5nZXRDb2xsZWN0aW9uKClcblxuICAgIGlmIChzZWxlY3Rvcl92YWx1ZSA9IGhwZS5nZXRTZWxlY3RvclZhbHVlKCkpIGFuZCBjb2xsZWN0aW9uLm5ld19lbGVtZW50cy5pbmNsdWRlcyhocGUpXG4gICAgICBIUC5VdGlsLnJlbW92ZUZyb21BcnJheShjb2xsZWN0aW9uLm5ld19lbGVtZW50cywgaHBlKVxuICAgICAgY29sbGVjdGlvbi5lbGVtZW50c1tzZWxlY3Rvcl92YWx1ZV0gPSBocGVcblxuICByZXR1cm4gcHJvbWlzZVxuIiwiSFBQLkhlbHBlcnMuRmllbGQuaGFuZGxlRW1iZWRkZWRDb2xsZWN0aW9uID0gKGhwZSwgcHJlX2VsZW1lbnQsIGZpZWxkX25hbWUsIGZpZWxkX3NldHRpbmdzKSAtPlxuICBlbWJlZGRlZF9wcmVfY29sbGVjdGlvbiA9IHByZV9lbGVtZW50W2ZpZWxkX25hbWVdXG4gIHJldHVybiBpZiAhZW1iZWRkZWRfcHJlX2NvbGxlY3Rpb24gYW5kICFmaWVsZF9zZXR0aW5ncy5yZXF1aXJlZFxuICBjb2xsZWN0aW9uID0gaHBlLmdldENvbGxlY3Rpb24oKVxuICBzY2hlbWUgPSBjb2xsZWN0aW9uLmdldFNjaGVtZSgpXG4gIGVtYmVkZGVkX2VsZW1lbnRfY29sbGVjdGlvbiA9IHNjaGVtZS5nZXRDb2xsZWN0aW9uKGZpZWxkX25hbWUgfHwgZmllbGRfc2V0dGluZ3MuY29sbGVjdGlvbilcblxuICBIUC5VdGlsLmZvckVhY2ggZW1iZWRkZWRfcHJlX2NvbGxlY3Rpb24sIChlbWJlZGRlZF9wcmVfZWxlbWVudCkgLT5cbiAgICBlbWJlZGRlZF9lbGVtZW50ID0gbmV3IEhQLkVsZW1lbnQoZW1iZWRkZWRfZWxlbWVudF9jb2xsZWN0aW9uLCBlbWJlZGRlZF9wcmVfZWxlbWVudClcbiAgICBlbWJlZGRlZF9lbGVtZW50X2NvbGxlY3Rpb24uYWRkRWxlbWVudChlbWJlZGRlZF9lbGVtZW50KVxuIiwiSFBQLkhlbHBlcnMuRmllbGQuaGFuZGxlRW1iZWRkZWRFbGVtZW50ID0gKGhwZSwgcHJlX2VsZW1lbnQsIGZpZWxkX25hbWUsIGZpZWxkX3NldHRpbmdzKSAtPlxuICBlbWJlZGRlZF9wcmVfZWxlbWVudCA9IHByZV9lbGVtZW50W2ZpZWxkX25hbWVdXG4gIHJldHVybiBpZiAhZW1iZWRkZWRfcHJlX2VsZW1lbnQgYW5kICFmaWVsZF9zZXR0aW5ncy5yZXF1aXJlZFxuICBjb2xsZWN0aW9uID0gaHBlLmdldENvbGxlY3Rpb24oKVxuICBzY2hlbWUgPSBjb2xsZWN0aW9uLmdldFNjaGVtZSgpXG4gIGlmIGZpZWxkX3NldHRpbmdzLmNvbGxlY3Rpb25cbiAgICBlbWJlZGRlZF9lbGVtZW50X2NvbGxlY3Rpb24gPSBzY2hlbWUuZ2V0Q29sbGVjdGlvbihmaWVsZF9zZXR0aW5ncy5jb2xsZWN0aW9uKVxuICBlbHNlXG4gICAgZW1iZWRkZWRfZWxlbWVudF9jb2xsZWN0aW9uID0gc2NoZW1lLmdldENvbGxlY3Rpb25CeVNpbmd1bGFyTmFtZShmaWVsZF9uYW1lKVxuXG4gIGVtYmVkZGVkX2VsZW1lbnQgPSBlbWJlZGRlZF9lbGVtZW50X2NvbGxlY3Rpb24ubWFrZU9yTWVyZ2UoZW1iZWRkZWRfcHJlX2VsZW1lbnQpXG5cbiAgYXNzb2NpYXRlZF9maWVsZF9uYW1lID0gZmllbGRfc2V0dGluZ3MuYXNzb2NpYXRlZF9maWVsZCB8fCBcIiN7ZmllbGRfbmFtZX1fI3tlbWJlZGRlZF9lbGVtZW50X2NvbGxlY3Rpb24uc2VsZWN0b3JfbmFtZX1cIlxuICBocGUuc2V0RmllbGQoYXNzb2NpYXRlZF9maWVsZF9uYW1lLCBlbWJlZGRlZF9lbGVtZW50LmdldFNlbGVjdG9yVmFsdWUoKSlcbiJdfQ==
