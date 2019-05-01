import test from "tape";
import findTranslation from "i18n/core/translation_finder/find_translation";

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

  t.test("falsy keys and values", function(t) {
    let result = findTranslation({0: 0}, [0]);

    t.same(result.stoppedAt, [0]);
    t.equal(result.translation, 0);
    
    t.end();
  });

  t.test("optionalStep option", function(t) {
    let result = findTranslation( {a: {b: 1}}, ["a"], {optionalStep: "b"} );

    t.same(result.stoppedAt, ["a", "b"]);
    t.equal(result.translation, 1);
    t.equal(result.isOptionalStepTaken, true);
    
    t.end();
  });

  t.test("optionalStep with falsy value", function(t) {
    let result = findTranslation( {a: {"b": 0}}, ["a"], {optionalStep: "b"});

    t.equal(result.isOptionalStepTaken, true);

    t.end();
  });

  t.test("when optionalStep's value is undefined", function(t) {
    let result = findTranslation( {a: {}}, ["a"], {optionalStep: "b"});

    t.same(result.stoppedAt, ["a"], "doesnt take the step");
    t.same(result.translation, {});
    t.equal(result.isOptionalStepTaken, false);
      
    t.end();
  });

  t.test("optionalStep is actually optional", function(t) {
    let result = findTranslation( {a: 1}, ["a"], {optionalStep: "b"} );

    t.same(result.stoppedAt, ["a"]);
    t.equal(result.translation, 1);
    t.equal(result.isOptionalStepTaken, false);
    
    t.end();
  });

  t.test("optionalStep array", function(t) {
    let result = findTranslation( {a: {c: 1}}, ["a"], {optionalStep: ["b", "c", "d"]} );

    t.same(result.stoppedAt, ["a", "c"]);
    t.equal(result.translation, 1);
    t.equal(result.isOptionalStepTaken, true);
    
    t.end();
  });
  
  t.end();
});