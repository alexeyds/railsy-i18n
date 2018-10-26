import test from "tape";
import PlaceholdersValidator from "i18n/base/string_interpolator/placeholders_validator";

test("PlaceholdersValidator", function(t) {
  t.test("extra replacements", function(t) {
    let placeholders = {bar: "%{bar}"};
    let replacements = {bar: "bar", foo1: "foo"};
    let result = new PlaceholdersValidator(placeholders).validate(replacements);

    t.same(result.unusedReplacements, ["foo1"], "returns array of unused replacements");

    t.end();
  });

  t.test("remaining placeholders", function(t) {
    let result = new PlaceholdersValidator({bar: "%{bar}", foo: "%{foo}"}).validate({bar: "bar"});

    t.same(result.remainingPlaceholders, ["foo"], "returns array of remaining placeholders");

    t.end();
  });

  t.test("remaining placeholders when replacements === undefined", function(t) {
    let result = new PlaceholdersValidator({bar: "%{bar}", foo: "%{foo}"}).validate();

    t.same(result.remainingPlaceholders, ["bar", "foo"], "returns array of remaining placeholders");

    t.end();
  });

  t.test("undefined replacements", function(t) {
    let result = new PlaceholdersValidator({bar: "%{bar}"}).validate({bar: undefined, foo: "test"});

    t.same(result.undefinedReplacements, ["bar"], "returns array of undefined replacements");
    t.same(result.filteredReplacements, {foo: "test"}, "filters out undefined replacements");
    t.equal(result.remainingPlaceholders, undefined, "doesn't count undefined placeholders as remaining");

    t.end();
  });

  t.test("with empty placeholders object", function(t) {
    let result = new PlaceholdersValidator({}).validate();

    t.equal(result.unusedReplacements, undefined);
    t.equal(result.remainingPlaceholders, undefined);
    t.equal(result.undefinedReplacements, undefined);

    t.end();
  });

  t.end();
});