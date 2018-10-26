import test from "tape";
import StringInterpolator from "i18n/base/string_interpolator";

test("StringInterpolator", function(t) {
  t.test("simple interpolation", function(t) {
    let result = new StringInterpolator().interpolate("foo %{bar}", {bar: "bar"});

    t.equal(result.interpolated, "foo bar", "replaces placeholders in string");
    
    t.equal(result.unusedReplacements, undefined);
    t.equal(result.remainingPlaceholders, undefined);
    t.equal(result.undefinedReplacements, undefined);
    
    t.end();
  });

  t.test("non-string interpolation", function(t) {
    let result = new StringInterpolator().interpolate(1, {bar: "bar"});

    t.equal(result.interpolated, 1, "doesn't try to replace placeholders in non-string object");
    
    t.end();
  });

  t.test("undefined replacements", function(t) {
    let result = new StringInterpolator().interpolate("%{bar}", {bar: undefined});

    t.equal(result.interpolated, "%{bar}", "doesn't use undefined replacements for interpolation");

    t.end();
  });

  t.end();
});