import test from "enhanced-tape";
import { getLastElement } from "utils/array_utils";

test("array_utils", function(t) {
  t.test("getLastElement", function(t) {
    t.test("returns last element", function(t) {
      t.equal(getLastElement([1, 2]), 2);
    
      t.end();
    });
  });
});