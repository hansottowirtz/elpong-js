var HP, HPP, HTTPong, base, base1, base2, getOptions;

HTTPong = window.HTTPong = HP = {};

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
  }
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

HP.setHttpFunction = function(http_function) {
  return HPP.http_function = http_function;
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
    this.location = null;
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
    var parser;
    parser = document.createElement('a');
    parser.href = url;
    return this.location = {
      is_other_domain: parser.host !== window.location.host,
      protocol: parser.protocol,
      host: parser.host,
      path: HPP.Helpers.Url.trimSlashes(parser.pathname)
    };
  };

  Scheme.prototype.getApiUrl = function() {
    if (this.location.is_other_domain) {
      return this.location.protocol + "//" + this.location.host + "/" + this.location.path;
    } else {
      return "/" + this.location.path;
    }
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
    this.snapshots = {};
    this.last_snapshot_time = null;
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
    this.makeSnapshot('creation');
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

  Element.prototype.makeSnapshot = function(tag) {
    var date, hpe, s;
    date = Date.now();
    hpe = this;
    this.snapshots = HPP.Helpers.Snapshot.removeAfter(this.last_snapshot_time, this.snapshots);
    if (this.snapshots[date]) {
      return this.makeSnapshot(tag);
    }
    s = this.snapshots[date] = {
      tag: tag,
      time: date,
      data: HPP.Helpers.Element.getFields(this),
      revert: function() {
        return hpe.undo(date);
      }
    };
    this.last_snapshot_time = date;
    return s;
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
        if (this.snapshots[n]) {
          this.mergeWith(this.snapshots[n].data);
          return this.last_snapshot_time = n;
        } else {
          throw new Error("Diff at time " + n + " does not exist");
        }
      } else if (n < 0) {
        throw new Error(n + " is smaller than 0");
      } else {
        ds = HPP.Helpers.Snapshot.getSortedArray(this.snapshots);
        length = ds.length;
        index = ds.indexOf(this.snapshots[this.last_snapshot_time]);
        d = ds[index - n];
        this.mergeWith(d.data);
        return this.last_snapshot_time = d.time;
      }
    } else if (HP.Util.isString(n)) {
      a = null;
      ref = HPP.Helpers.Snapshot.getSortedArray(this.snapshots);
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
    return HP.Util.forEach(collection_settings.fields, function(field_settings, field_name) {
      var field_value, sv_1;
      if (field_value = pre_element[field_name]) {
        if (field_settings.embedded_element) {

        } else if (field_settings.embedded_collection) {

        } else {
          sv_1 = hpe.fields[field_name];
          if (field_settings.selector && sv_1 !== field_value && sv_1 && field_value) {
            throw new Error("Selector has changed from " + sv_1 + " to " + field_value);
          }
          return hpe.setField(field_name, field_value, true);
        }
      }
    });
  };

  Element.prototype.isPersisted = function() {
    var data, k, last_saved_snapshot, ref, v;
    if (this.isNew()) {
      return false;
    }
    last_saved_snapshot = null;
    HP.Util.reverseForIn(this.snapshots, function(k, v) {
      if (last_saved_snapshot) {
        return;
      }
      if (v.tag === 'after_post' || v.tag === 'after_put' || v.tag === 'after_get' || v.tag === 'creation') {
        return last_saved_snapshot = v;
      }
    });
    data = last_saved_snapshot.data;
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
    var arr, element, j, len;
    if (options == null) {
      options = {
        without_new: false
      };
    }
    arr = this.getArray(options);
    for (j = 0, len = arr.length; j < len; j++) {
      element = arr[j];
      if (element.getField(field_name, true) === field_value) {
        return element;
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

(base = String.prototype).endsWith || (base.endsWith = function(suffix) {
  return this.indexOf(suffix, this.length - suffix.length) !== -1;
});

(base1 = Array.prototype).includes || (base1.includes = function(e) {
  return this.indexOf(e) > -1;
});

(base2 = String.prototype).includes || (base2.includes = function(e) {
  return this.indexOf(e) > -1;
});

HP.Util = {
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
    return str.replace('_', ' ').replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      if (index === 0) {
        return letter.toLowerCase();
      } else {
        return letter.toUpperCase();
      }
    }).replace(/\s+/g, '');
  },
  upperCamelize: function(str) {
    return str.replace('_', ' ').replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
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
    var attr, results;
    results = [];
    for (attr in obj2) {
      results.push(obj1[attr] = obj2[attr]);
    }
    return results;
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
  forEach: function(o, f) {
    var k, results, v;
    results = [];
    for (k in o) {
      v = o[k];
      if (!o.hasOwnProperty(k)) {
        continue;
      }
      results.push(f(v, k));
    }
    return results;
  },
  reverseForIn: function(obj, f) {
    var arr, i, key;
    arr = [];
    for (key in obj) {
      arr.push(key);
    }
    i = arr.length - 1;
    while (i >= 0) {
      f.call(obj, arr[i], obj[arr[i]]);
      i--;
    }
  }
};

HPP.Helpers = {
  Url: {
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
  },
  Element: {
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
  },
  Collection: {
    getSettings: function(c) {
      return c.getScheme().data.collections[c.getName()];
    },
    getSingularName: function(c) {
      return HPP.Helpers.Collection.getSettings(c).singular;
    }
  },
  Field: {}
};

HPP.Helpers.Snapshot = {
  getSortedArray: function(snapshots) {
    var arr;
    arr = Object.values(snapshots);
    arr.sort(function(a, b) {
      return a.time - b.time;
    });
    return arr;
  },
  removeAfter: function(time, snapshots) {
    var arr, j, len, snapshots_2, v;
    arr = HPP.Helpers.Snapshot.getSortedArray(snapshots);
    snapshots_2 = {};
    for (j = 0, len = arr.length; j < len; j++) {
      v = arr[j];
      if (v.time <= time) {
        snapshots_2[v.time] = v;
      }
    }
    return snapshots_2;
  }
};

HPP.Helpers.Collection.doGetAllAction = function(hpc, user_options) {
  var data, options, promise;
  if (user_options == null) {
    user_options = {};
  }
  data = user_options.data;
  options = getOptions('GET', HPP.Helpers.Url.createForCollection('GET', hpc, user_options), data, user_options.headers);
  promise = HPP.http_function(options);
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
  var data, options, promise;
  if (user_options == null) {
    user_options = {};
  }
  data = user_options.data;
  options = getOptions('GET', HPP.Helpers.Url.createForCollection('GET', hpc, {
    suffix: selector_value
  }), data, user_options.headers);
  promise = HPP.http_function(options);
  promise.then(function(response) {
    return hpc.makeOrMerge(response.data);
  });
  return promise;
};

HPP.Helpers.Collection.doCustomAction = function(hpc, action_name, action_settings, user_options) {
  var data, method, options;
  if (user_options == null) {
    user_options = {};
  }
  method = action_settings.method.toUpperCase();
  data = user_options.data;
  options = getOptions(method, HPP.Helpers.Url.createForCollection('GET', hpc, {
    suffix: action_settings.path || action_name
  }), data, user_options.headers);
  return HPP.http_function(options);
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

getOptions = function(method, url, data, headers) {
  if (headers == null) {
    headers = {};
  }
  headers.Accept = headers['Content-Type'] = 'application/json';
  return {
    method: method,
    url: url,
    data: JSON.stringify(data || {}),
    headers: headers,
    dataType: 'json',
    responseType: 'json'
  };
};

HPP.Helpers.Element.doAction = function(hpe, method, user_options) {
  var data, options, promise;
  if (user_options == null) {
    user_options = {};
  }
  hpe.makeSnapshot("before_" + (method.toLowerCase()));
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
  options = getOptions(method, HPP.Helpers.Url.createForElement(method, {}, hpe, user_options), data, user_options.headers);
  promise = HPP.http_function(options);
  promise.then(function(response) {
    var collection;
    if (response.data) {
      hpe.mergeWith(response.data);
    }
    hpe.makeSnapshot("after_" + (method.toLowerCase()));
    collection = hpe.getCollection();
    if (collection.new_elements.includes(hpe)) {
      HP.Util.removeFromArray(collection.new_elements, hpe);
      return collection.elements[hpe.getSelectorValue()] = hpe;
    }
  });
  return promise;
};

HPP.Helpers.Element.doCustomAction = function(hpe, action_name, action_settings, user_options) {
  var data, method, options, promise;
  if (user_options == null) {
    user_options = {};
  }
  method = action_settings.method.toUpperCase();
  hpe.makeSnapshot("before_" + (method.toLowerCase()));
  if (user_options.data) {
    data = user_options.data;
  } else if (!action_settings.without_data) {
    data = HPP.Helpers.Element.toData(hpe);
  }
  options = getOptions(method, HPP.Helpers.Url.createForElement(action_name, action_settings, hpe, user_options), data, user_options.headers);
  promise = HPP.http_function(options);
  promise.then(function(response) {
    var collection;
    if (response.data && !action_settings.returns_other) {
      hpe.mergeWith(response.data);
    }
    hpe.makeSnapshot("after_" + (method.toLowerCase()));
    collection = hpe.getCollection();
    if (collection.new_elements.includes(hpe)) {
      HP.Util.removeFromArray(collection.new_elements, hpe);
      return collection.elements[hpe.getSelectorValue()] = hpe;
    }
  });
  return promise;
};

HPP.Helpers.Field.handleEmbeddedCollection = function(hpe, pre_element, field_name, field_settings) {
  var collection, embedded_element_collection, scheme;
  collection = hpe.getCollection();
  scheme = collection.getScheme();
  embedded_element_collection = scheme.getCollection(field_name || field_settings.collection);
  return HP.Util.forEach(pre_element[field_name], function(embedded_pre_element) {
    var embedded_element;
    embedded_element = new HP.Element(embedded_element_collection, embedded_pre_element);
    return embedded_element_collection.addElement(embedded_element);
  });
};

HPP.Helpers.Field.handleEmbeddedElement = function(hpe, pre_element, field_name, field_settings) {
  var associated_field_name, collection, embedded_element, embedded_element_collection, scheme;
  collection = hpe.getCollection();
  scheme = collection.getScheme();
  if (field_settings.collection) {
    embedded_element_collection = scheme.getCollection(field_settings.collection);
  } else {
    embedded_element_collection = scheme.getCollectionBySingularName(field_name);
  }
  embedded_element = embedded_element_collection.makeOrMerge(pre_element[field_name]);
  associated_field_name = field_settings.associated_field || (field_name + "_" + embedded_element_collection.selector_name);
  return hpe.setField(associated_field_name, embedded_element.getSelectorValue());
};
