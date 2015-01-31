var JsConfig = (function () {
  "use strict";
  function loop(arr, callback) {
    var key;
    for (key in arr) {
      if (arr.hasOwnProperty(key)) {
        callback(arr[key], key);
      }
    }
  }

  function JsConfig() {
    if (!this || this.constructor !== JsConfig) {
      throw new Error('JsConfig is an object not a function, you must use `new JsConfig();`');
    }
    var data = {},
      clone = function (original) {
        var newObj = {};
        if (typeof original !== 'object' || original === undefined) {
          return original;
        }
        loop(original, function (val, key) {
          newObj[key] = val;
        });
        return newObj;
      };

    this.set = function (key, value) {
      var keys = key.split('.');
      if (keys[1] === undefined) {
        data[key] = clone(value);
      } else {
        if (data[keys[0]] === undefined) {
          data[keys[0]] = {};
        }
        data[keys[0]][keys[1]] = clone(value);
      }
    };

    this.setDefault = function (key, value) {
      if (data[key] === undefined) {
        this.set(key, value);
      }
    };

    this.get = function (key) {
      var keys = key.split('.');
      if (keys[1] === undefined) {
        return clone(data[key]);
      }
      if (data[keys[0]] === undefined) {
        return undefined;
      }
      return clone(data[keys[0]][keys[1]]);
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
