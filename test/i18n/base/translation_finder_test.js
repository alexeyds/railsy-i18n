import test from "tape";
import TranslationFinder from "i18n/base/translation_finder";

test("TranslationFinder#find", function(t) {
  t.test("simple translations", function(t) {
    let finder = new TranslationFinder({foo: {bar: "translation"}}, {});

    let result = finder.find("foo.bar");

    t.equal(result.translation, "translation");

    t.equal(result.paths.original, "foo.bar");
    t.equal(result.paths.scoped, "foo.bar");
    t.equal(result.paths.stoppedAt, "foo.bar");
    
    t.end();
  });

  t.test("missing translations", function(t) {
    let result = new TranslationFinder({foo: {}}, {}).find("foo.bar");

    t.equal(result.translation, undefined, "returns translation: undefined");

    t.equal(result.paths.stoppedAt, "foo", "returns correct stoppedAt location");
    
    t.end();
  });

  t.end();
});

test("TranslationFinder config", function(t) {
  t.test("scope option", function(t) {
    let finder = new TranslationFinder({foo: {bar: "translation"}}, {scope: "foo"});
    let result = finder.find("bar");

    t.equal(result.translation, "translation", "searches for translation in provided scope");
    t.equal(result.paths.original, "bar");
    t.equal(result.paths.scoped, "foo.bar");

    t.end();
  });
  t.end();
});