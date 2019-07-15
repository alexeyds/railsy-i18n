import test from "tape";
import { removeKeys, removeUndef, accessNestedProperty, getValueByKeys } from "utils/object_utils";

test("object utils removeKeys()", function(t) {
  let object = {a: 1, b: 2, c: 3, d: 4};
  let result = removeKeys(object, ["a", "d"]);

  t.same(result, {b: 2, c: 3}, "removes specified keys from object");

  t.end();
});

test("object utils removeUndef()", function(t) {
  let object = {a: 1, b: undefined, c: 3, d: undefined};
  let result = removeUndef(object);

  let expectedResult = {a: 1, c: 3};
  t.same(result, expectedResult, "removes undefined keys from object");
  t.notSame(object, expectedResult, "doesn't modify passed object");

  t.end();
});

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