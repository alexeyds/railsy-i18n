import test from "tape";
import I18n from "i18n_refactoring/main";

test("I18n.prototype.t()", function(t) {
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

  t.end();
});

test("I18n.prototype.scoped()", function(t) {
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

  t.end();
});

test("I18n constructor options: scope", function(t) {
  t.test("searches within given scope", function(t) {
    let translations = {login: "Log in", header: {login: "Sign in"}};
    let i18n = new I18n(translations, {scope: "header"});

    t.equal(i18n.t("login"), "Sign in");
  
    t.end();
  });

  t.end();
});

test("I18n constructor options: fallbackI18n", function(t) {
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

  t.end();
});