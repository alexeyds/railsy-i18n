import test from "enhanced-tape";
import I18n from "i18n/main";

test("I18n.Strict", function(t) {
  t.test("has same interface as regular I18n", function(t) {
    let i18n = new I18n.Strict({hi: {hello: "Hi, %{foo}"}});

    t.equal(i18n.t("hi.hello", {foo: "bar"}), "Hi, bar");
    t.equal(typeof i18n.scoped, "function");

    t.end();
  });

  t.test("throws on missing translations", function(t) {
    let i18n = new I18n.Strict({});

    t.throws(() => i18n.t("test.header"), /Translation missing/);
    
    t.end();
  });

  t.test("throws on undefined placeholders", function(t) {
    let i18n = new I18n.Strict({test: "%{test}"});

    t.throws(() => i18n.t("test", {test: undefined}), /interpolation variables/);
    
    t.end();
  });

  t.test("missing interpolation arguments", function(t) {
    let i18n = new I18n.Strict({a: "foo %{bar} %{baz}"});

    let test = () => i18n.t("a");

    t.throws(test, /Missing/, "throws error");
    t.throws(test, /bar,baz/, "includes missing arguments into error");

    t.end();
  });

  t.end();
});