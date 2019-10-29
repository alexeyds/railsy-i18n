import test from "enhanced-tape";
import { presentFunctionCall } from "utils/function_utils";

test("function utils", function(t) {
  t.test("presentFunctionCall", function(t) {
    t.test("presents calls with no arguments", function(t) {
      let result = presentFunctionCall("test");

      t.equal(result, "test()");
    
      t.end();
    });

    t.test("presents calls with basic arguments", function(t) {
      let result = presentFunctionCall("test", 1, "foo", false);

      t.equal(result, 'test(1, "foo", false)');
    
      t.end();
    });

    t.test("presents calls with undefined and null", function(t) {
      let result = presentFunctionCall("test", undefined, null);

      t.equal(result, 'test(undefined, null)');
    
      t.end();
    });

    t.test("presents calls with object args", function(t) {
      let result = presentFunctionCall("test", {a: 1, b: "foo", c: {a: undefined}});

      t.equal(result, 'test({ a: 1, b: "foo", c: { a: undefined } })');
    
      t.end();
    });

    t.test("presents calls with array args", function(t) {
      let result = presentFunctionCall("test", [1, 2]);

      t.equal(result, 'test([1, 2])');
    
      t.end();
    });

    t.test("correctly presents values inside of an array", function(t) {
      let result = presentFunctionCall("test", [null]);

      t.equal(result, 'test([null])');
    
      t.end();
    });

    t.test("presents calls with empty object args", function(t) {
      let result = presentFunctionCall("test", {});

      t.equal(result, 'test({})');

      t.end();
    });

    t.test("!!!presenting non-plain objects is not yet supported!!!", function(t) {
      class Test {}
      let testObj = new Test();
      let result = presentFunctionCall("test", testObj);

      t.equal(result, 'test({})');
    
      t.end();
    });
  });
});