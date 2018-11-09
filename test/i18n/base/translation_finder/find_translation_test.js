import test from "tape";
import findTranslation from "i18n/base/translation_finder/find_translation";

test("findTranslation", function(t) {
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
  
  t.end();
});