import test from "tape";
import StringInterpolator from "i18n/base/string_interpolator";

test("StringInterpolator#interpolate", function(t) {
  t.test("simple interpolation", function(t) {
    let result = new StringInterpolator().interpolate("foo %{bar}", {bar: "bar"});

    t.equal(result.interpolated, "foo bar", "replaces placeholders in string");
    
    t.notEqual(result.validation, undefined, "validates placeholders");
    
    t.end();
  });

  // t.test("foo", function(t) {
  //   let result = new StringInterpolator().interpolate("%{bar}");

  //   console.log(result);
    
  //   t.end();
  // });

  t.test("undefined replacements", function(t) {
    let result = new StringInterpolator().interpolate("%{bar}", {bar: undefined});

    t.equal(result.interpolated, "%{bar}", "doesn't use undefined replacements for interpolation");

    t.end();
  });

  t.end();
});

test("StringInterpolator#emptyValidationResult", function(t) {
  let result = new StringInterpolator().emptyValidationResult();

  t.notEqual(result, undefined, "delegates to placeholdersValidator");

  t.end();
});