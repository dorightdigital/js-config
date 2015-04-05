JS Config
====

An open source project to standardise JS configuration.  It's designed for use in any browser, node.js or io.js.

Insallation & Compatability
---

This library is designed to be usable in Node.JS, IO.JS and all browsers in-the-wild.  It's self-contained and dependency free.  If you're old-school want to you can just copy & paste this into your code then grab [JsConfig.js](src/JsConfig.js).  If you're up-to-date with the rest of the world you'll want to use a package manager.  You can install this module using *NPM* or *Bower*.

````shell
npm install --save js-config
````
or
````shell
bower install --save js-config
````

If you think other package managers should be supported (like the one for your favourite backend language) then feel free to raise a Pull Request for it - this library is designed to be assumption-free and should work with any backend language.

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

To use this with Node.JS or IO.JS you can do things like:

(using environment variables MY_OWN_PASSWORD=secret ONE_OPTIONAL_VALUE=abc)

```javascript
var myConfig = new JsConfig({
  someKey: 'someValue',
  optionalValueTwo: 'defghi',
  collection: {
    item: 'a',
    thePassword: 'default password'
  }
});

expect(myConfig.get('collection.thePassword')).toEqual('default password');

myConfig.readFromObject(process.env, {
  collection: {
    thePassword: 'MY_OWN_PASSWORD'
  },
  optionalValueOne: 'ONE_OPTIONAL_VALUE',
  optionalValueTwo: 'ANOTHER_OPTIONAL_VALUE'
});

expect(myConfig.get('collection.thePassword')).toEqual('secret');
expect(myConfig.get('optionalValueOne')).toEqual('abc');
expect(myConfig.get('optionalValueTwo')).toEqual('defghi');
```

Equally in the browser you can use it to do things like:

(using configFromServer={oneUsePassword:'secret', {parent: {child: {stateBasedValue:'abc'}}})

```javascript
var myConfig = new JsConfig({
  someKey: 'someValue',
  optionalValueTwo: 'defghi',
  collection: {
    item: 'a',
    thePassword: 'default password'
  }
});

expect(myConfig.get('collection.thePassword')).toEqual('default password');

myConfig.readFromObject(configFromServer, {
  collection: {
    thePassword: 'oneUsePassword'
  },
  optionalValueOne: 'parent.child.stateBasedValue',
  optionalValueTwo: 'parent.sibling.nonexistent'
});

expect(myConfig.get('collection.thePassword')).toEqual('secret');
expect(myConfig.get('optionalValueOne')).toEqual('abc');
expect(myConfig.get('optionalValueTwo')).toEqual('defghi');
```

This will give you an object which includes the environment variable values for MUST_BE_PRESENT, AN_ENV_VAR and NO_DEFAULT but blows up if one of them doesn't exist.
 It also includes ANOTHER_ENV_VAR and AN_OPTIONAL_FLAG if they're set or falls back to the specified defaults if they're not configured on the environment.

There are a load more usage examples at [test/usageExamplesSpec.js](test/usageExamplesSpec.js)

Revisions
---

v1.0.2: Improved use cases for node/io (also available in the browser)
 * `readFromObject` now allows you to use one name on environment variables and another name in your codebase.
   That's important for things like passwords - your environment variable may well be COMPANY_PROJECT_DB_PASS but
   your codebase might want to use config.get('db.password').  Previously you'd have to use
   config.get('COMPANY_PROJECT_DB_PASS') which leads to tightly coupled code & configuration - that was not a good thing.
 * `assertExists` is a new way of managing mandatory configuration - you list the keys
    you can't manage without and a descriptive error gets thrown if they aren't set or are undefined.
v1.0.1:
 * Released to Bower
v1.0.0: Initial release - the core functionality for managing configuration.
 * Released to NPM

Contributions
---

Contributions are welcome, this project is maintained by [Do Right Digital](http://dorightdigital.com/)
 and it's designed to be small enough and generic enough that it can be used on any JS project.
 If you think there's a missing feature feel free to code it (with accompanying tests) or
  if just create some failing tests, then mark them as 'xit' and send a pull request.

