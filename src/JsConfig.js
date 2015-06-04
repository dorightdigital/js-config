var JsConfig = (function () {
  "use strict";
  function loop(arr, callback) {
    var key, returnVal;
    for (key in arr) {
      if (arr.hasOwnProperty(key)) {
        returnVal = callback(arr[key], key);
        if (returnVal === false) {
          return;
        }
      }
    }
  }

  function isEmpty(obj) {
    var empty = true;
    loop(obj, function () {
      empty = false;
      return false;
    });
    return empty;
  }

  function isObject(obj) {
    return typeof obj === 'object' && obj !== null && obj.length === undefined;
  }

  function clone(original) {
    var newObj = {};
    if (!isObject(original) || original === undefined) {
      return original;
    }
    loop(original, function (val, key) {
      newObj[key] = val;
    });
    return newObj;
  }

  function eachPart(pathAsString, object, callback) {
    var currentObj = object, arr = pathAsString.split('.');
    loop(arr, function (name, pos) {
      var returnValue = callback(currentObj, name, arr.length - pos - 1 === 0);
      currentObj = currentObj[name];
      return returnValue;
    });
  }

  function JsConfig(initialConfig) {
    if (!this || this.constructor !== JsConfig) {
      throw new Error('JsConfig is an object not a function, you must use `new JsConfig();`');
    }
    var defaults = [], data = initialConfig === undefined ? {} : clone(initialConfig);

    function addToValueObject(key, value, object) {
      eachPart(key, object, function (parent, name, isEnd) {
        parent[name] = isEnd ? clone(value) : (parent[name] || {});
      });
    }

    function lookupKeyInDefaults(key) {
      return defaults[key];
    }

    function lookupKeyInData(key, obj) {
      var answer;
      eachPart(key, obj, function (parent, name, isEnd) {
        if (isEnd) {
          answer = parent[name];
        } else if (parent[name] === undefined) {
          return false;
        }
      });
      return answer;
    }

    this.set = function (key, value) {
      addToValueObject(key, value, data);
    };

    this.setDefault = function (key, value) {
      defaults[key] = clone(value);
    };

    this.get = function (key) {
      var answer = lookupKeyInData(key, this.getAll());
      if (answer === undefined) {
        answer = lookupKeyInDefaults(key);
      }
      return clone(answer);
    };

    this.assertExists = function () {
      var missingKeys = [], self = this, i, key;
      for (i = 0; i < arguments.length; i += 1) {
        key = arguments[i];
        if (self.get(key) === undefined) {
          missingKeys.push(key);
        }
      }
      if (missingKeys.length > 0) {
        throw new Error([
          'JsConfig: missing key',
          (missingKeys.length > 1 ? 's' : ''),
          ': "',
          missingKeys.join('", "'),
          '"'].join(''));
      }
    };

    this.getAll = function () {
      var output = clone(data);
      loop(defaults, function (defaultValue, defaultKey) {
        var keySoFar = '';
        eachPart(defaultKey, output, function (value, partName, isFinal) {
          keySoFar += (keySoFar.length > 0 ? '.' : '') + partName;
          if (lookupKeyInData(keySoFar, output) === undefined) {
            value[partName] = isFinal ? defaultValue : {};
          }
        });
      });
      return output;
    };

    this.remove = function (key) {
      var toCheck = [];
      eachPart(key, data, function (parent, name, isFinal) {
        if (isFinal) {
          delete parent[name];
        } else {
          toCheck.unshift({parent: parent, name: name});
        }
      });
      loop(toCheck, function (value) {
        if (isEmpty(value.parent[value.name])) {
          delete value.parent[value.name];
        }
      });
    };

    this.readFromObject = function (obj, items) {
      if (!isObject(obj)) {
        throw new Error('Couldn\'t "readFromObject" as no object was provided');
      }
      if (!isObject(items)) {
        throw new Error('Couldn\'t "readFromObject" as no item definition was provided');
      }
      var self = this, lookedUpValue;
      function deepLoop(parent, combinedName) {
        loop(parent, function (value, key) {
          var name = combinedName ? combinedName + '.' : '';
          name += key;
          if (isObject(value)) {
            deepLoop(value, name);
          } else {
            lookedUpValue = lookupKeyInData(value, obj);
            if (lookedUpValue) {
              self.set(name, lookedUpValue);
            }
          }
        });
      }

      if (items) {
        deepLoop(items);
      }
    };
  }

  JsConfig.readFromObject = function () {
    var output = new JsConfig();
    output.readFromObject.apply(output, arguments);
    return output;
  };

  return JsConfig;
}());

if (typeof module === 'object') {
  module.exports = JsConfig;
}
