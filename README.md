JS Config
====

An open source project to standardise JS configuration.  It's designed for use in any browser, node.js or io.js.

Usage Examples
---

Config should be pretty simple, hopefully simplicity is what you'll find when using JS Config!  The basic examples are:

```javascript
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

```

There are a load more usage examples at [test/usageExamplesSpec.js](test/usageExamplesSpec.js)

Contributions
---

Contributions are welcome, this project is maintained by [Do Right Digital](http://dorightdigital.com/)
 and it's designed to be small enough and generic enough that it can be used on any JS project.
 If you think there's a missing feature feel free to code it (with accompanying tests) or
  if just create some failing tests, then mark them as 'xit' and send a pull request.

