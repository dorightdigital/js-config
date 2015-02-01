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

  function clone(original) {
    var newObj = {};
    if (typeof original !== 'object' || original === undefined) {
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
    var defaults = {}, data = initialConfig === undefined ? {} : clone(initialConfig);

    function addToValueObject(key, value, object) {
      eachPart(key, object, function (parent, name, isEnd) {
        parent[name] = isEnd ? clone(value) : (parent[name] || {});
      });
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
      addToValueObject(key, value, defaults);
    };

    this.get = function (key) {
      var answer = lookupKeyInData(key, data);
      if (answer === undefined) {
        answer = lookupKeyInData(key, defaults);
      }
      return clone(answer);
    };

    this.remove = function (key) {
      if (data.hasOwnProperty(key)) {
        delete data[key];
      }
    };
  }

  JsConfig.readFromObject = function (obj, required, defaults) {
    var missingKeys = [], output = new JsConfig();
    loop(defaults, function (value, key) {
      output.setDefault(key, value);
      if (obj.hasOwnProperty(key)) {
        output.set(key, obj[key]);
      }
    });
    loop(required, function (name) {
      if (!obj.hasOwnProperty(name)) {
        missingKeys.push(name);
      } else {
        output.set(name, obj[name]);
      }
    });
    if (missingKeys.length > 0) {
      throw new Error('Missing required configuration parameter [' + missingKeys.join(',') + '].');
    }
    return output;
  };

  return JsConfig;
}());

if (typeof module === 'object') {
  module.exports = JsConfig;
}
