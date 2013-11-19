JS Config
====

An open source project to standardise JS configuration. 

Development Notes - how to contribute
---

Have a look [test/usage-examples.js](test/usage-examples.js), see if there are any tests which
are marked 'xit' this means that it's a desired feature which hasn't been worked on yet.  You can then
remove the 'x' to make 'it' and you'll (hopefully) see the test fail, you can then fix that test
and send a pull request.  You'll probably want to write more granular tests alongside it, feel free to do that
but create or re-use a test inside [test/unit-tests](test/unit-tests) (and add
it to [SpecRunner](test/jasmine/SpecRunner.html) of course).

If you think there's a missing feature create some failing tests, then mark them as 'xit' and send a pull request.
