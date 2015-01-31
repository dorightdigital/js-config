describe('Usage Examples', function () {
  var conf;
  beforeEach(function () {
    conf = jsConfig.new();
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
      conf.set('known', 'a')
      expect(conf.get('unknown.doesnt.exist')).toBeUndefined();
    });
    it('should not blow up when asking for a child of an undefined parent', function () {
      expect(conf.get('a.b')).toBeUndefined();
    });
    it('should not leak data between instances', function () {
      conf.set('a.b', 'c');
      expect(jsConfig.new().get('a.b')).toBeUndefined();
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
  });

  describe('Hierarchy', function () {
    var collection;
    beforeEach(function () {
      collection = {
        child: 'a',
        sibling: 'b'
      };
    })
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
    xit('should freeze object contents when looking up parent - to avoid craziness', function () {
      conf.set('parent', collection);
      collection.child = 'c';
      expect(conf.get('parent')).toEqual({
        child: 'a',
        sibling: 'b'
      });
    });
    xit('should protect against changes after looking up objects', function () {
      conf.set('parent', collection);
      conf.get('parent').a = 'c';
      expect(conf.get('parent')).toEqual({
        child: 'a',
        sibling: 'b'
      });
    });
  });

  describe('Initial State', function () {
    xit('should accept initial state on initialisation', function () {
      conf = jsConfig.new({
        parent: {
          child: 'a'
        }
      });
      expect(conf.get('parent.child')).toBe('a');
    });
    xit('should prioritise existing properties over new defaults', function () {
      conf = jsConfig.new({a:'b'});
      conf.setDefault('a', 'c');
      expect(conf.get('a', 'b'));
    });
    xit('should prioritise existing properties over new defaults', function () {
      conf = jsConfig.new({a:'b'});
      conf.set('a', 'c');
      expect(conf.get('a', 'c'));
    });
  });

  describe('Conflict Resolution', function () {
    xit('should overwrite individual properties', function () {
      conf.set('a', 'b');
      conf.set('a', 'c');
      expect(conf.get('a')).toBe('c');
    });
    xit('should overwrite collection with property', function () {
      conf.set('a', {'b': 'c'});
      conf.set('a', 'd');
      expect(conf.get('a')).toBe('d');
    });
    xit('should overwrite collection with property', function () {
      conf.set('a', 'b');
      conf.set('a', {c:'d'});
      expect(conf.get('a')).toEqual({c:'d'});
    });
    xit('should overwrite collection with collection', function () {
      conf.set('a', {b:'c'});
      conf.set('a', {d:'e'});
      expect(conf.get('a')).toEqual({d:'e'});
    });
  });

  describe('Removing properties', function () {
    xit('should remove property', function () {
      conf.set('a', 'b');
      conf.remove('a');
      expect(conf.get('a')).toBeUndefined();
    });
    xit('should remove collection', function () {
      conf.set('a', {b:'c'});
      conf.remove('a');
      expect(conf.get('a')).toBeUndefined();
    });
    xit('should fallback to default value when removed', function () {
      conf.setDefault('a', 'b');
      conf.set('a', 'c');
      conf.remove('a');
      expect(conf.get('a')).toBe('b');
    });
  });
});
