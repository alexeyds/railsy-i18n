import test from "tape";
import StringInterpolator from "i18n/base/string_interpolator";

test("StringInterpolator", function(t) {
  t.test("simple interpolation", function(t) {
    let result = new StringInterpolator().interpolate("foo %{bar}", {bar: "bar"});

    t.equal(result.interpolated, "foo bar", "replaces placeholders in string");
    t.equal(result.unusedPlaceholders, undefined, "returns extraInterpolationArguments: undefined");
    t.equal(result.remainingPlaceholders, undefined, "returns remainingPlaceholders: undefined");
    
    t.end();
  });

  t.test("non-string interpolation", function(t) {
    let result = new StringInterpolator().interpolate(1, {bar: "bar"});

    t.equal(result.interpolated, 1, "doesn't try to replace placeholders in non-string object");
    
    t.end();
  });

  t.test("extra interpolation arguments", function(t) {
    let result = new StringInterpolator().interpolate("%{bar}", {bar: "bar", foo1: "foo"});

    t.same(result.unusedPlaceholders, ["%{foo1}"], "returns array of unused arguments");

    t.end();
  });

  t.test("remaining placeholders in string", function(t) {
    let result = new StringInterpolator().interpolate("%{bar} %{foo}", {bar: "bar"});

    t.same(result.remainingPlaceholders, ["foo"], "returns array of remaining placeholders");

    t.end();
  });

  t.test("remaining placeholders in string without interpolation args", function(t) {
    let result = new StringInterpolator().interpolate("%{bar} %{foo}");

    t.same(result.remainingPlaceholders, ["bar", "foo"], "returns array of remaining placeholders");

    t.end();
  });

  t.test("undefined placeholders", function(t) {
    let result = new StringInterpolator().interpolate("%{bar}", {bar: undefined});

    t.same(result.undefinedPlaceholders, ["bar"], "returns array of undefined placeholders");
    t.equal(result.interpolated, "%{bar}", "doesn't replace undefined placeholders in translation");

    t.end();
  });

  t.end();
});