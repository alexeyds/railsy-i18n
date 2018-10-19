import test from "tape";
import I18nBasic from "i18n/basic";

test("i18nBasic#t", function(t) {
  t.test("existing translations", function(t) {
    let i = new I18nBasic({a: {b: "foo"}});

    t.equal(i.t("a.b"), "foo", "returns correct string");

    t.end();
  });

  t.test("missing translations", function(t) {
    let i = new I18nBasic({});

    t.equal(i.t("foo.bar_test"), "Bar test", "returns human-readable string based on path");
    
    t.end();
  });

  t.end();
});