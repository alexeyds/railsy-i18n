import test from "tape";
import I18nBase from "i18n/base";

test("i18n/base", function(t) {
  t.test("string translations", function(t) {
    let result = new I18nBase({foo: {bar: "foo"}}).t("foo.bar");

    t.equal(result.translation, "foo", "returns translation");
    t.equal(result.isTranslated, true, "returns isTranslated: true");
    t.equal(result.path, "foo.bar", "returns searched path");
    t.equal(result.stoppedAt, "foo.bar", "returns stoppedAt");
    
    t.end();
  });

  t.test("missing translations", function(t) {
    let result = new I18nBase({foo: {}}).t("foo.bar");

    t.equal(result.translation, undefined, "returns translation: undefined");
    t.equal(result.isTranslated, false, "returns isTranslated: false");
    t.equal(result.stoppedAt, "foo", "returns correct stoppedAt location");
    
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
    
    t.end();
  });

  t.test("non-string interpolation", function(t) {
    let result = new I18nBase({a: 1}).t("a", {bar: "bar"});

    t.equal(result.translation, 1, "doesn't try to replace placeholders in non-string object");
    
    t.end();
  });

  t.end();
});