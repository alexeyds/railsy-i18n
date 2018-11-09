import test from "tape";
import findTranslation from "i18n/base/translation_finder/_find_translation_generator";

test("findTranslation", function(t) {
  t.test("empty object", function(t) {
    let result = findTranslation({}, ["foo", "bar"]);

    t.same(result.stoppedAt, []);
    t.equal(result.translation, undefined);
    
    t.end();
  });

  t.test("existing translation", function(t) {
    let result = findTranslation({a: {b: 1}}, ["a", "b"]);

    t.same(result.stoppedAt, ["a", "b"]);
    t.equal(result.translation, 1);
    
    t.end();
  });

  t.test("missing translation", function(t) {
    let result = findTranslation({a: {b: {}}}, ["a", "b", "c"]);

    t.same(result.stoppedAt, ["a", "b"]);
    t.equal(result.translation, undefined);
    
    t.end();
  });

  t.test("empty steps", function(t) {
    let translations = {a: 1};
    let result = findTranslation(translations, []);

    t.same(result.stoppedAt, []);
    t.equal(result.translation, translations);
    
    t.end();
  });
  
  t.end();
});