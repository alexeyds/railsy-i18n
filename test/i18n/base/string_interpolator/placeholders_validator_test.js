import test from "tape";
import PlaceholdersValidator from "i18n/base/string_interpolator/placeholders_validator";

test("PlaceholdersValidator#filter", function(t) {
  t.test("extra replacements", function(t) {
    let placeholders = {bar: "%{bar}"};
    let replacements = {bar: "bar", foo1: "foo"};
    let result = new PlaceholdersValidator(placeholders).filter(replacements);

    t.same(result.validation.unusedReplacements, ["foo1"], "returns array of unused replacements");

    t.end();
  });

  t.test("remaining placeholders", function(t) {
    let result = new PlaceholdersValidator({bar: "%{bar}", foo: "%{foo}"}).filter({bar: "bar"});

    t.same(result.validation.remainingPlaceholders, ["foo"], "returns array of remaining placeholders");

    t.end();
  });

  t.test("remaining placeholders when replacements === {}", function(t) {
    let result = new PlaceholdersValidator({bar: "%{bar}", foo: "%{foo}"}).filter({});

    t.same(result.validation.remainingPlaceholders, ["bar", "foo"], "returns array of remaining placeholders");

    t.end();
  });

  t.test("undefined replacements", function(t) {
    let result = new PlaceholdersValidator({bar: "%{bar}"}).filter({bar: undefined, foo: "test"});

    t.same(result.validation.undefinedReplacements, ["bar"], "returns array of undefined replacements");
    t.same(result.filteredReplacements, {foo: "test"}, "filters out undefined replacements");
    t.equal(result.validation.remainingPlaceholders, undefined, "doesn't count undefined placeholders as remaining");

    t.end();
  });

  t.test("with empty placeholders object", function(t) {
    let result = new PlaceholdersValidator({}).filter({});

    t.same(result.validation, emptyResult());

    t.end();
  });

  t.end();
});

test("PlaceholdersValidator.emptyValidationResult", function(t) {
  let result = PlaceholdersValidator.emptyValidationResult();

  t.same(result, emptyResult());

  t.end();
});

function emptyResult() {
  return { unusedReplacements: undefined, remainingPlaceholders: undefined, undefinedReplacements: undefined };
}