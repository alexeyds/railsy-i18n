import test from "tape";
import { removeKeys } from "utils/object";

test("object utils removeKeys()", function(t) {
  let object = {a: 1, b: 2, c: 3, d: 4};
  let result = removeKeys(object, ["a", "d"]);

  t.same(result, {b: 2, c: 3}, "removes specified keys from object");

  t.end();
});