describe('Usage Examples', function () {
  xit('should store and retrieve simple properties', function () {
    var conf = jsConfig.new();
    conf.set('a', 'b');
    expect(conf.get('a')).toBe('b');
  });
  xit('should store and retrieve properties separated by dots', function () {
    var conf = jsConfig.new();
    conf.set('a.b', 'c');
    expect(conf.get('a.b')).toBe('c');
  });
});
