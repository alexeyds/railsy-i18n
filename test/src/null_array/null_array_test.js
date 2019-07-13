import test from "tape";
import NullArray from "null_array/null_array";

test("NullArray constructor", function(t) {
  t.test("without args", function(t) {
    let arr = new NullArray();

    t.equal(arr.value, undefined, "sets value to undefined");
    
    t.end();
  });

  t.test("with args list", function(t) {
    let arr = new NullArray(1, 2, 3);

    t.same(arr.value, [1, 2, 3], "adds all arguments to value array");
    
    t.end();
  });

  t.end();
});

test("NullArray#push", function(t) {
  t.test("when arr is not empty", function(t) {
    let arr = new NullArray(1);
    arr.push(2);

    t.same(arr.value, [1, 2]);
    
    t.end();
  });

  t.test("when arr is empty", function(t) {
    let arr = new NullArray();
    arr.push(1);
    arr.push(2);

    t.same(arr.value, [1, 2]);

    t.end();
  });

  t.end();
});