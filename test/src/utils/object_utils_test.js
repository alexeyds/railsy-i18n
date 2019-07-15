import test from "tape";
import { accessNestedProperty, getValueByKeys } from "utils/object_utils";

test("object utils accessNestedProperty()", function(t) {
  t.test("returns success: true when property found", function(t) {
    let result = accessNestedProperty({a: {b: 1}}, ["a", "b"]);

    t.equal(result.value, 1);
    t.equal(result.success, true);
    t.same(result.stepsTaken, ["a", "b"]);
  
    t.end();
  });

  t.test("returns success: false when property not found", function(t) {
    let result = accessNestedProperty({a: {b: {}}}, ["a", "b", "c"]);

    t.false("value" in result);
    t.equal(result.success, false);
    t.same(result.stepsTaken, ["a", "b"]);
  
    t.end();
  });

  t.test("works with falsy values", function(t) {
    let result = accessNestedProperty({a: {b: undefined}}, ["a", "b"]);

    t.equal(result.value, undefined);
    t.equal(result.success, true);
  
    t.end();
  });

  t.test("stops search if next value is not an object", function(t) {
    let result = accessNestedProperty({a: "foo"}, ["a", "b"]);

    t.equal(result.success, false);
    t.same(result.stepsTaken, ["a"]);

    t.end();
  });

  t.end();
});

test("object utils getValueByKeys()", function(t) {
  t.test("returns value", function(t) {
    t.equal(getValueByKeys({a: 1}, "a"), 1);
  
    t.end();
  });

  t.test("works with arrays", function(t) {
    t.equal(getValueByKeys({a: 1}, ["a", "b"]), 1);
    t.equal(getValueByKeys({b: 2}, ["a", "b"]), 2);

    t.end();
  });

  t.test("works with falsy keys", function(t) {
    t.equal(getValueByKeys({a: null}, ["a", "b"]), null);

    t.end();
  });

  t.end();
});