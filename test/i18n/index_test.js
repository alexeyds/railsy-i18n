import test from "tape";
import I18n from "i18n";

test("i18n translations in production mode", function(t) {
  t.test("simple translations", function(t) {
    let i = I18n.build({bar: "foo"});

    t.equal(i.t("bar"), "foo", "returns correct string");
    
    t.end();
  });

  t.test("nested translations", function(t) {
    let i = I18n.build({a: {b: "foo"}});

    t.equal(i.t("a.b"), "foo", "returns correct string");

    t.end();
  });

  t.test("missing translations", function(t) {
    let i = I18n.build({}, {mode: I18n.PRODUCTION_MODE});

    t.equal(i.t("foo.bar"), "Bar", "returns readable string");
    
    t.end();
  });

  t.test("when translation is not a string", function(t) {
    let i = I18n.build({a: {b: "foo"}}, {mode: I18n.PRODUCTION_MODE});

    t.equal(i.t("a"), "A", "returns readable string");
    
    t.end();
  });

  t.test("simple interpolation", function(t) {
    let i = I18n.build({a: "foo %{bar}"});
  
    t.equal(i.t("a", {bar: 123}), "foo 123", "inserts arguments into string");
    
    t.end();
  });

  t.test("undefined interpolation", function(t) {
    let i = I18n.build({a: "foo %{bar}"}, {mode: I18n.PRODUCTION_MODE});

    t.equal(i.t("a", {bar: undefined}), "foo %{bar}", "returns string with placeholder in place");

    t.end();
  });

  t.test("missing placheolders", function(t) {
    let i = I18n.build({a: "foo"}, {mode: I18n.PRODUCTION_MODE});
  
    t.equal(i.t("a", {bar: 1}), "foo", "returns resulting string");
    
    t.end();
  });

  t.test("missing interpolation arguments", function(t) {
    let i = I18n.build({a: "foo %{bar} %{baz}"}, {mode: I18n.PRODUCTION_MODE});

    t.equal(i.t("a", {bar: "foo"}), "foo foo %{baz}", "returns  resulting string");

    t.end();
  });

  t.end();
});

test("i18n config", function(t) {
  t.test("scope option", function(t) {
    let i = I18n.build({ en: {a: {b: "foo"}} }, {scope: "en"});

    t.equal(i.t("a.b"), "foo", "searches for translations starting with {scope}.");
    
    t.end();
  });

  t.test("defaultI18n option", function(t) {
    let defaultI18n = I18n.build({foo: {bar: "foobar"}});
    let i = I18n.build({}, {defaultI18n});

    t.equal(i.t("foo.bar"), "foobar", "uses defaultI18n.t() for missing translations");

    t.end();
  });
  
  t.end();
});

test("I18n in test mode", function(t) {
  t.test("missing translations", function(t) {
    let i = I18n.build({});

    t.throws(() => i.t("a.b"), /Translation missing/, "throws missing translation error");
    
    t.end();
  });

  t.test("when translation is not a string", function(t) {
    let i = I18n.build({a: {b: "foo"}});

    t.throws(() => i.t("a"), /Translation missing/, "throws missing translation error");
    
    t.end();
  });

  t.test("undefined interpolation", function(t) {
    let i = I18n.build({a: "foo %{bar}"});

    t.throws(() => i.t("a", {bar: undefined}), /Undefined placeholder/, "throws error");

    t.end();
  });

  t.test("missing placeholders", function(t) {
    let i = I18n.build({a: "foo"});
  
    t.throws(() => i.t("a", {bar: 1}), /Placeholders missing/, "throws error");
    
    t.end();
  });

  t.test("missing interpolation arguments", function(t) {
    let i = I18n.build({a: "foo %{bar} %{baz}"});

    let test = () => i.t("a");

    t.throws(test, /Interpolation arguments missing/, "throws error when all args are missing");
    t.throws(test, /bar, baz/, "includes missing arguments into error");

    t.throws(() => i.t("a", {bar: "foo"}), /Interpolation arguments missing/, "throws error when only some of the args are missing");

    t.end();
  });

  
  t.end();
});

test("I18n#scoped", function(t) {
  let i = I18n.build({a: {b: {c: "foo %{a}"}}});
  let scopedT = i.scoped("a.b");

  t.equal(scopedT("c", {a: 123}), "foo 123", "returns wrapper function");

  t.end();
});