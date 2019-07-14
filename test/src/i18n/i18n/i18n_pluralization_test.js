import test from "tape";
import I18n from "i18n_refactoring/i18n";

test("I18n.prototype.t() default pluralization", function(t) {
  t.test("doesnt attempt to pluralize without count key", function(t) {
    let i18n = new I18n({things: {other: "Many things"}});

    t.equal(i18n.t("things"), "Things");
  
    t.end();
  });

  t.test("{count: zero}", function(t) {
    let i18n = new I18n({things: {zero: "0 things"}});

    t.equal(i18n.t("things", {count: 0}), "0 things");
  
    t.end();
  });

  t.test("{count: one}", function(t) {
    let i18n = new I18n({things: {one: "1 thing"}});

    t.equal(i18n.t("things", {count: 1}), "1 thing");
  
    t.end();
  });

  t.test("{count: other}", function(t) {
    let i18n = new I18n({things: {other: "Many things"}});

    t.equal(i18n.t("things", {count: 2}), "Many things");
  
    t.end();
  });

  t.test("{count: zero} is replaceable with {count: other}", function(t) {
    let i18n = new I18n({things: {other: "Some things"}});

    t.equal(i18n.t("things", {count: 0}), "Some things");
  
    t.end();
  });

  t.test("replaces placeholders in countable translation", function(t) {
    let i18n = new I18n({things: {other: "%{count} %{type} things"}});

    t.equal(i18n.t("things", {count: 2, type: "awesome"}), "2 awesome things");
  
    t.end();
  });

  t.test("works with fallbackI18n", function(t) {
    let fallbackI18n = new I18n({things: {one: "One thing"}});
    let i18n = new I18n({things: {}}, {fallbackI18n});

    t.equal(i18n.t("things", {count: 1}), "One thing");
  
    t.end();
  });

  t.end();
});
  
test("I18n constructor options: pluralizationRule", function(t) {
  t.test("uses keys from pluralizationRule", function(t) {
    let pluralizationRule = (count) => count === 2 && "few";
    let i18n = new I18n({things: {few: "%{count} things"}}, { pluralizationRule });

    t.equal(i18n.t("things", {count: 2}), "2 things");
  
    t.end();
  });

  t.test("supports arrays as rules", function(t) {
    let pluralizationRule = () => ["some", "any"];
    let translations = {
      things: { some: "Some things" },
      users:  { any: "Any users" }
    };

    let i18n = new I18n(translations, { pluralizationRule });

    t.equal(i18n.t("things", {count: 2}), "Some things");
    t.equal(i18n.t("users", {count: 123}), "Any users");
  
    t.end();
  });

  t.test("{count: zero} is replaceable with {count: other}", function(t) {
    let pluralizationRule = () => "zero";
    let i18n = new I18n({things: {other: "%{count} things"}}, { pluralizationRule });

    t.equal(i18n.t("things", {count: 0}), "0 things");
  
    t.end();
  });

  t.end();
});