import test from "tape";
import { removeKeys, removeUndef } from "utils/object";

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