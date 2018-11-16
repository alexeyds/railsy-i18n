import test from "tape";
import I18nStrict from "i18n/strict";

test("I18nStrict#t", function(t) {
  t.test("existing translations", function(t) {
    let i = new I18nStrict({a: {b: "foo"}});

    t.equal(i.t("a.b"), "foo", "returns translated string");

    t.end();
  });

  t.test("missing translations", function(t) {
    let i = new I18nStrict({});

    t.throws(() => i.t("a.b"), /Translation missing/, "throws missing translation error");
    
    t.end();
  });

  t.test("unused interpolation arguments", function(t) {
    let i = new I18nStrict({a: "foo"});

    let test = () => i.t("a", {bar: 1, c: 2});
  
    t.throws(test, /Unused/, "throws error");
    t.throws(test, /bar, c/, "includes unused arguments into error");
    
    t.end();
  });

  t.test("missing interpolation arguments", function(t) {
    let i = new I18nStrict({a: "foo %{bar} %{baz}"});

    let test = () => i.t("a");

    t.throws(test, /Missing/, "throws error");
    t.throws(test, /bar, baz/, "includes missing arguments into error");

    t.end();
  });

  t.test("undefined interpolation arguments", function(t) {
    let i = new I18nStrict({a: "foo %{bar}"});

    let test = () => i.t("a", {bar: undefined});

    t.throws(test, /Undefined/, "throws error");
    t.throws(test, /bar/, "includes undefined arguments into error");

    t.end();
  });

  t.end();
});