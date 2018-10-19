import test from "tape";
import I18nBase from "i18n/base";

test("i18n/base", function(t) {
  t.test("string translations", function(t) {
    let result = new I18nBase({foo: {bar: "translation"}}).t("foo.bar");

    t.equal(result.translation, "translation");
    t.equal(result.isTranslated, true);

    t.equal(result.paths.original, "foo.bar");
    t.equal(result.paths.scoped, "foo.bar");
    t.equal(result.paths.stoppedAt, "foo.bar");

    t.equal(result.interpolation.unusedPlaceholders, undefined);
    t.equal(result.interpolation.remainingPlaceholders, undefined);
    
    t.end();
  });

  t.test("missing translations", function(t) {
    let result = new I18nBase({foo: {}}).t("foo.bar");

    t.equal(result.translation, undefined, "returns translation: undefined");
    t.equal(result.isTranslated, false, "returns isTranslated: false");
    t.equal(result.paths.stoppedAt, "foo", "returns correct stoppedAt location");
    
    t.end();
  });

  t.test("non-string translations", function(t) {
    let result = new I18nBase({foo: 1}).t("foo");

    t.equal(result.translation, 1, "returns translation object");
    t.equal(result.isTranslated, false, "returns isTranslated: false");

    t.end();
  });

  t.test("string interpolation", function(t) {
    let result = new I18nBase({a: "foo %{bar}"}).t("a", {bar: "bar"});

    t.equal(result.translation, "foo bar", "replaces placeholders in string");
    t.equal(result.interpolation.unusedPlaceholders, undefined, "returns extraInterpolationArguments: undefined");
    t.equal(result.interpolation.remainingPlaceholders, undefined, "returns remainingPlaceholders: undefined");
    
    t.end();
  });

  t.test("non-string interpolation", function(t) {
    let result = new I18nBase({a: 1}).t("a", {bar: "bar"});

    t.equal(result.translation, 1, "doesn't try to replace placeholders in non-string object");
    
    t.end();
  });

  t.test("extra interpolation arguments", function(t) {
    let result = new I18nBase({a: "%{bar}"}).t("a", {bar: "bar", foo1: "foo"});

    t.same(result.interpolation.unusedPlaceholders, ["%{foo1}"], "returns array of unused arguments");

    t.end();
  });

  t.test("remaining placeholders in string", function(t) {
    let result = new I18nBase({a: "%{bar} %{foo}"}).t("a", {bar: "bar"});

    t.same(result.interpolation.remainingPlaceholders, ["foo"], "returns array of remaining placeholders");

    t.end();
  });

  t.test("remaining placeholders in string without interpolation args", function(t) {
    let result = new I18nBase({a: "%{bar} %{foo}"}).t("a");

    t.same(result.interpolation.remainingPlaceholders, ["bar", "foo"], "returns array of remaining placeholders");

    t.end();
  });

  t.test("undefined placeholders", function(t) {
    let result = new I18nBase({a: "%{bar}"}).t("a", {bar: undefined});

    t.same(result.interpolation.undefinedPlaceholders, ["bar"], "returns array of undefined placeholders");
    t.equal(result.translation, "%{bar}", "doesn't replace undefined placeholders in translation");

    t.end();
  });

  t.end();
});

test("i18n/base config", function(t) {
  t.test("scope option", function(t) {
    let result = new I18nBase({foo: {bar: "translation"}}, {scope: "foo"}).t("bar");

    t.equal(result.translation, "translation", "searches for translation in provided scope");
    t.equal(result.paths.original, "bar", "returns path passed to it unchanged");
    t.equal(result.paths.scoped, "foo.bar");

    t.end();
  });

  t.test("fallbackI18n option", function(t) {
    let fallbackI18n = new I18nBase({foo: "foo"});
    let result = new I18nBase({}, {fallbackI18n}).t("foo");

    t.equal(result.translation, "foo", "uses fallbackI18n to provide missing translations");

    t.end();
  });

  t.test("fallbackI18n option with scope option", function(t) {
    let fallbackI18n = new I18nBase({foo: "foo"});
    let result = new I18nBase({}, {fallbackI18n, scope: "bar"}).t("foo");

    t.equal(result.translation, "foo", "passes unscoped path to fallbackI18n");

    t.end();
  });

  t.end();
});

test("i18n/base fallbackI18n with subclassing", function(t) {
  class SimpleI18n extends I18nBase { t() { return super.t(...arguments).translation; } }

  t.test("delegates t to subclass", function(t) {
    let fallbackI18n = new SimpleI18n({foo: "foobar"});
    let result = new SimpleI18n({}, {fallbackI18n}).t("foo");

    t.equal(result, "foobar");
    
    t.end();
  });

  t.end();
});