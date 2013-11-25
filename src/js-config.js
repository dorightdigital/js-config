var jsConfig = {new: function () {
  return {
    set: function (key, value){
      this.tmp = value;
    },
    setDefault: function () {
      this.set.apply(this, arguments);
    },
    get: function (){
      return this.tmp;
    }
  }
}};
