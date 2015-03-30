describe('Usage Examples', function () {
  "use strict";
  function loadJsConfigInBrowserOrNode() {
    return (typeof require === 'function' && require('../src/JsConfig')) || window.JsConfig;
  }

  var conf,
    JsConfig = loadJsConfigInBrowserOrNode();
  beforeEach(function () {
    conf = new JsConfig();
  });

  describe('Example For README', function () {
    it('should give a complete example', function () {
      var myConfig = new JsConfig({
        someKey: 'someValue',
        collection: {
          item: 'a'
        }
      });

      myConfig.setDefault('collection', {
        item: 'b',
        another: 'c',
        overridden: 'd'
      });

      myConfig.set('collection.overridden', 'e');

      expect(myConfig.get('someKey')).toBe('someValue');
      expect(myConfig.get('collection.item')).toBe('a');
      expect(myConfig.get('collection.another')).toBe('c');
      expect(myConfig.get('collection.overridden')).toBe('e');
      expect(myConfig.get('collection.nothing')).toBe(undefined);
      expect(myConfig.get('collection.nothing.this.would.usually.cause.problems')).toBe(undefined);
    });
  });

  describe('Basic Usage', function () {
    it('should store and retrieve simple properties', function () {
      conf.set('a', 'b');
      expect(conf.get('a')).toBe('b');
    });
    it('should store and retrieve simple properties', function () {
      conf.set('a', 'b');
      conf.set('c', 'd');
      expect(conf.get('c')).toBe('d');
      expect(conf.get('a')).toBe('b');
    });
    it('should store and retrieve properties separated by dots', function () {
      conf.set('a.b', 'c');
      expect(conf.get('a.b')).toBe('c');
    });
    it('should gracefully deal with unknown properties', function () {
      expect(conf.get('unknown')).toBeUndefined();
    });
    it('should gracefully deal with unknown hierarchical properties', function () {
      conf.set('known', 'a');
      expect(conf.get('unknown.doesnt.exist')).toBeUndefined();
    });
    it('should not blow up when asking for a child of an undefined parent', function () {
      expect(conf.get('a.b')).toBeUndefined();
    });
    it('should not leak data between instances', function () {
      conf.set('a.b', 'c');
      expect(new JsConfig().get('a.b')).toBeUndefined();
    });
    it('should support setting the default', function () {
      conf.setDefault('a', 'b');
      expect(conf.get('a')).toBe('b');
    });
    it('should override the default', function () {
      conf.setDefault('a', 'b');
      conf.set('a', 'c');
      expect(conf.get('a')).toBe('c');
    });
    it('should override the default regardless of the order', function () {
      conf.set('a', 'c');
      conf.setDefault('a', 'b');
      expect(conf.get('a')).toBe('c');
    });
    it('should override booleans regardless of JS truthyness and falsyness', function () {
      conf.set('a', false);
      conf.setDefault('a', true);
      expect(conf.get('a')).toBe(false);
    });
    it('should override numbers regardless of JS truthyness and falsyness', function () {
      conf.set('b', 0);
      conf.setDefault('b', 1);
      expect(conf.get('b')).toBe(0);
    });
  });

  describe('Node Env Vars examples', function () {
    var process = {};
    beforeEach(function () {
      process.env = {PORT: '8080'};
    });

    describe('Env var helper', function () {
      it('should remap string values', function () {
        process.env.SOME_PREFIX__MY_VAR = 'value A';
        process.env.SOME_PREFIX__ANOTHER_VAR = 'value B';
        var actual = JsConfig.readFromObject(process.env, {
          myVar: 'SOME_PREFIX__MY_VAR',
          someRandomThing: 'SOME_PREFIX__ANOTHER_VAR'
        });
        expect(actual.getAll()).toEqual({
          myVar: 'value A',
          someRandomThing: 'value B'
        });
      });
      it('should remap string values into hierarchy', function () {
        process.env.SOME_PREFIX__MY_VAR = 'value A';
        process.env.SOME_PREFIX__ANOTHER_VAR = 'value B';
        var actual = JsConfig.readFromObject(process.env, {
          something: {
            myVar: 'SOME_PREFIX__MY_VAR'
          },
          somethingElse: {
            someRandomThing: 'SOME_PREFIX__ANOTHER_VAR'
          }
        });
        expect(actual.get('something.myVar')).toEqual('value A');
        expect(actual.get('somethingElse.someRandomThing')).toEqual('value B');
      });
      it('should allow defaults for nonexistnet keys', function () {
        process.env.EXISTS = 'true';
        var actual = JsConfig.readFromObject(process.env, {
          port: 'PORT',
          specific: 'NON_EXISTANT_ENV_VAR',
          another: 'EXISTS'
        });
        actual.setDefault('specific', 'fallback');
        actual.setDefault('another', 'fallback');
        expect(actual.getAll()).toEqual({
          port: '8080',
          specific: 'fallback',
          another: 'true'
        });
      });
      it('should assert against nonextent keys', function () {
        var actual = JsConfig.readFromObject(process.env, {
          port: 'PORT',
          specific: 'NON_EXISTANT_ENV_VAR'
        });
        expect(function () {
          actual.assertExists('specific');
        }).toThrow(new Error('JsConfig: missing key: "specific"'));
      });
      it('should assert presence of keys', function () {
        var actual = new JsConfig({facebook: {id: 123}});
        expect(function () {
          actual.assertExists('facebook.id');
        }).not.toThrow();
      });
      it('should fail when asserting missing keys', function () {
        var actual = new JsConfig({facebook: {}});
        expect(function () {
          actual.assertExists('facebook.id');
        }).toThrow(new Error('JsConfig: missing key: "facebook.id"'));
      });
      it('should assert multiple keys', function () {
        var actual = new JsConfig({facebook: {id: 123}});
        expect(function () {
          actual.assertExists('facebook.id', 'abc');
        }).toThrow(new Error('JsConfig: missing key: "abc"'));
      });
      it('should list multiple missing keys in error message', function () {
        var actual = new JsConfig({facebook: {id: 123}});
        expect(function () {
          actual.assertExists('abc', 'facebook.id', 'def', 'ghi');
        }).toThrow(new Error('JsConfig: missing keys: "abc", "def", "ghi"'));
      });
    });
  });

  describe('Hierarchy', function () {
    var collection;
    beforeEach(function () {
      collection = {
        child: 'a',
        sibling: 'b'
      };
    });
    it('should retrieve all children when getting a parent', function () {
      conf.set('parent.child', 'a');
      conf.set('parent.sibling', 'b');
      expect(conf.get('parent')).toEqual(collection);
    });
    it('should retrieve individual children after setting a parent object', function () {
      conf.set('parent', {
        child: 'a',
        sibling: 'b'
      });
      expect(conf.get('parent.child')).toBe('a');
      expect(conf.get('parent.sibling')).toBe('b');
    });
    it('should allow shorthand for adding single value to object as default', function () {
      conf.set('parent', {
        child: 'a'
      });
      conf.setDefault('parent.sibling', 'b');
      expect(conf.get('parent.child')).toBe('a');
      expect(conf.get('parent.sibling')).toBe('b');
    });
    it('should allow shorthand for adding multiple values to object as default', function () {
      conf.set('parent.child', 'a');
      conf.setDefault('parent', {sibling: 'b', child: 'c'});
      expect(conf.get('parent.child')).toBe('a');
      expect(conf.get('parent.sibling')).toBe('b');
    });
    it('should freeze object contents - to avoid crazyness', function () {
      conf.set('parent', collection);
      collection.child = 'c';
      expect(conf.get('parent.child')).toBe('a');
    });
    it('should freeze object contents when looking up key - to avoid craziness', function () {
      conf.set('parent', collection);
      var output = conf.get('parent');
      output.child = 'c';
      expect(conf.get('parent.child')).toBe('a');
    });
    it('should freeze object contents when looking up parent - to avoid craziness', function () {
      conf.set('parent', collection);
      collection.child = 'c';
      expect(conf.get('parent')).toEqual({
        child: 'a',
        sibling: 'b'
      });
    });
    it('should protect against changes after looking up objects', function () {
      conf.set('parent', collection);
      conf.get('parent').a = 'c';
      expect(conf.get('parent')).toEqual({
        child: 'a',
        sibling: 'b'
      });
    });
  });

  describe('Initial State', function () {
    it('should accept initial state on initialisation', function () {
      conf = new JsConfig({
        parent: {
          child: 'a'
        }
      });
      expect(conf.get('parent.child')).toBe('a');
    });
    it('should prioritise initial values over new defaults', function () {
      conf = new JsConfig({a: 'b'});
      conf.setDefault('a', 'c');
      expect(conf.get('a', 'b'));
    });
    it('should prioritise specifically set properties over initial values', function () {
      conf = new JsConfig({a: 'b'});
      conf.set('a', 'c');
      expect(conf.get('a', 'c'));
    });
  });

  describe('Conflict Resolution', function () {
    it('should overwrite individual properties', function () {
      conf.set('a', 'b');
      conf.set('a', 'c');
      expect(conf.get('a')).toBe('c');
    });
    it('should overwrite collection with property', function () {
      conf.set('a', {'b': 'c'});
      conf.set('a', 'd');
      expect(conf.get('a')).toBe('d');
    });
    it('should overwrite collection with property', function () {
      conf.set('a', 'b');
      conf.set('a', {c: 'd'});
      expect(conf.get('a')).toEqual({c: 'd'});
    });
    it('should overwrite collection with collection', function () {
      conf.set('a', {b: 'c'});
      conf.set('a', {d: 'e'});
      expect(conf.get('a')).toEqual({d: 'e'});
    });
  });

  describe('Removing properties', function () {
    it('should remove property', function () {
      conf.set('a', 'b');
      conf.remove('a');
      expect(conf.get('a')).toBeUndefined();
    });
    it('should remove collection', function () {
      conf.set('a', {b: 'c'});
      conf.remove('a');
      expect(conf.get('a')).toBeUndefined();
    });
    it('should fallback to default value when removed', function () {
      conf.setDefault('a', 'b');
      conf.set('a', 'c');
      conf.remove('a');
      expect(conf.get('a')).toBe('b');
    });
  });

  describe('Config Summary', function () {
    it('should give a summary', function () {
      conf.set('a.b', 'c');
      conf.setDefault('a.d', 'e');
      conf.set('a.f', 'g');
      conf.setDefault('something.interesting', 'h');
      conf.set('someother.interesting.thing', 'i');
      expect(conf.getAll()).toEqual({
        a: {
          b: 'c',
          d: 'e',
          f: 'g'
        },
        something: {
          interesting: 'h'
        },
        someother: {
          interesting: {
            thing: 'i'
          }
        }
      });
    });
  });

  it('should throw if missing new command', function () {
    expect(function () {
      JsConfig();
    }).toThrow(new Error('JsConfig is an object not a function, you must use `new JsConfig();`'));
  });
});
