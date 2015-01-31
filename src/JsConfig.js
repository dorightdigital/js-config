var jsConfig = {
  new: function () {
    "use strict";
    var data = {},
      clone = function (value) {
        var newObj = {}, prop;
        if (typeof value === 'string' || value === undefined) {
          return value;
        }
        for (prop in value) {
          if (value.hasOwnProperty(prop)) {
            newObj[prop] = value[prop];
          }
        }
        return newObj;
      };

    return {

      set: function (key, value) {
        var keys = key.split('.');
        if (keys[1] === undefined) {
          data[key] = clone(value);
        } else {
          if (data[keys[0]] === undefined) {
            data[keys[0]] = {};
          }
          data[keys[0]][keys[1]] = clone(value);
        }
      },
      setDefault: function (key, value) {
        if (data[key] === undefined) {
          this.set(key, value);
        }
      },
      get: function (key) {
        var keys = key.split('.');
        if (keys[1] === undefined) {
          return clone(data[key]);
        }
        if (data[keys[0]] === undefined) {
          return undefined;
        }
        return clone(data[keys[0]][keys[1]]);
      }
    };
  }
};

if (typeof module === 'object') {
  module.exports = jsConfig;
}
