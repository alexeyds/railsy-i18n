import test from "enhanced-tape";
import { humanize, capitalize, interpolate } from "utils/string_utils";

test("string_utils", function(t) {
  t.test("capitalize()", function(t) {
    t.test("capitalizes string", function(t) {
      t.equal(capitalize("foo"), "Foo");
    
      t.end();
    });
  });
  
  t.test("humanize()", function(t) {
    t.test("converts snake_case", function(t) {
      t.equal(humanize("test_me"), "Test me");
    
      t.end();
    });
  });

  t.test("interpolate()", function(t) {
    let delimeter = {start: "%{", end: "}"};

    t.test("returns unchanged string if placeholders are empty", function(t) {
      t.equal(interpolate("%{bar}", {}, delimeter), "%{bar}");
    
      t.end();
    });

    t.test("replaces found placeholders", function(t) {
      let result = interpolate("%{bar} {baz} ${a} %{foo}", {bar: "foo", foo: "bar"}, delimeter);

      t.equal(result, "foo {baz} ${a} bar");
    
      t.end();
    });
  });

});

