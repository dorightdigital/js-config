var jsConfig = {new: function () {
  var data = {};
  return {

    set: function (key, value){
      var keys = key.split('.');
      if (keys[1] === undefined) {
        data[key]=value;
      }
      else {
        if (data[keys[0]] === undefined) {
          data[keys[0]] = {};
        }
        data[keys[0]][keys[1]] = value;
      }
    },
    setDefault: function (key, value) {
      if(data[key]===undefined){
        this.set(key,value);
      }
    },
    get: function (key){
      var keys = key.split('.');
      if (keys[1] === undefined) {
        return data[key];
      }
      else {
        if (data[keys[0]] === undefined){
          return undefined;
        }
        return data[keys[0]][keys[1]]
      }
    }
  }
}};
