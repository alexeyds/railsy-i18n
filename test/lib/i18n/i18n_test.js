import test from "enhanced-tape";
import I18n from "i18n/main";

test("I18n", function(t) {
  t.test("#t()", function(t) {
    t.test("returns simple translations", function(t) {
      let i18n = new I18n({hi: "Hello"});

      t.equal(i18n.t("hi"), "Hello");

      t.end();
    });

    t.test("returns nested translations", function(t) {
      let i18n = new I18n({header: {welcome: "Welcome!"}});

      t.equal(i18n.t("header.welcome"), "Welcome!");

      t.end();
    });

    t.test("returns readable string if translation is missing", function(t) {
      let i18n = new I18n({});

      t.equal(i18n.t("login_page"), "Login page");
    
      t.end();
    });

    t.test("replaces provided placeholders in string", function(t) {
      let i18n = new I18n({welcome: "Welcome, %{name}"});

      t.equal(i18n.t("welcome", {name: "Michael"}), "Welcome, Michael");
    
      t.end();
    });

    t.test("threats non-string translations with placeholders as missing", function(t) {
      let i18n = new I18n({welcome: {hi: "hello"}});

      t.equal(i18n.t("welcome", {name: "Michael"}), "Welcome");
    
      t.end();
    });

    t.test("is binded to i18n", function(t) {
      let { t: translate } = new I18n({hi: "hello"});

      t.equal(translate("hi"), "hello");
    
      t.end();
    });
  });

  t.test("#scoped()", function(t) {
    t.test("returns wrapper function delegates to t() with appended scope", function(t) {
      let i18n = new I18n({header: {hi: "Hello from header"}});
      let headerT = i18n.scoped("header");
    
      t.equal(headerT("hi"), "Hello from header");

      t.end();
    });

    t.test("passes all other args to t()", function(t) {
      let i18n = new I18n({header: {hi: "Hello, %{name}"}});
      let headerT = i18n.scoped("header");
    
      t.equal(headerT("hi", {name: "Jack"}), "Hello, Jack");

      t.end();
    });
  });

  t.test("pluralization", function(t) {
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
  });

  t.test("constructor options: { scope }", function(t) {
    t.test("searches within given scope", function(t) {
      let translations = {login: "Log in", header: {login: "Sign in"}};
      let i18n = new I18n(translations, {scope: "header"});

      t.equal(i18n.t("login"), "Sign in");
    
      t.end();
    });
  });

  t.test("constructor options: { fallbackI18n }", function(t) {
    t.test("attemps to search in fallbackI18n", function(t) {
      let fallbackI18n = new I18n({hi: "Hello."});
      let i18n = new I18n({}, { fallbackI18n });

      t.equal(i18n.t("hi"), "Hello.");
    
      t.end();
    });

    t.test("passes all other args to fallbackI18n", function(t) {
      let fallbackI18n = new I18n({hi: "Hi, %{name}"});
      let i18n = new I18n({}, { fallbackI18n });

      t.equal(i18n.t("hi", {name: "Kevin"}), "Hi, Kevin");
    
      t.end();
    });
  });

  t.test("constructor options: { pluralizationRule }", function(t) {
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
  });
});
