import test from "enhanced-tape";
import I18n from "../../dist/railsy-i18n";

test("Compiled I18n: README.md examples", function(t) {
  t.test("main readme example", function(t) {
    let enI18n = new I18n({
      en: {
        users_count: {
          zero: "No users",
          one: "One user",
          other: "%{count} users"
        },
        header: {
          login: "Log me in",
          signup: "Sign me up",
          welcome: "Welcome, %{name}"
        },
      }
    }, { scope: "en" });

    // Basic usage
    let login = enI18n.t("header.login"); //=> "Log me in"
    t.equal(login, "Log me in");

    let welcome = enI18n.t("header.welcome", {name: "John"}); //=> "Welcome, John"
    t.equal(welcome, "Welcome, John");

    // Pluralization
    let users_4 = enI18n.t("users_count", { count: 4} ); //=> "4 users"
    t.equal(users_4, "4 users");

    let users_0 = enI18n.t("users_count", { count: 0} ); //=> "No users"
    t.equal(users_0, "No users");

    // Missing translations
    let missing = enI18n.t("header.missing_translation"); //=> "Missing translation"
    t.equal(missing, "Missing translation");

    // I18n#scoped method
    let headerT = enI18n.scoped("header");
    let headerWelcome = headerT("welcome", {name: "John"}); //= "Welcome, John"
    t.equal(headerWelcome, "Welcome, John");

    // fallbacks
    let ruI18n = new I18n({
      ru: {
        header: {
          login: "Войти",
        },
      }
    }, { scope: "ru", fallbackI18n: enI18n });

    let ruLogin = ruI18n.t("header.login"); //=> "Войти"
    t.equal(ruLogin, "Войти");

    let fallbackWelcome = ruI18n.t("header.welcome", {name: "Джон"}); //=> "Welcome, Джон"
    t.equal(fallbackWelcome, "Welcome, Джон");

    t.end();
  });

  t.test("I18n.prototype.t readme example", function(t) {
    let i18n = new I18n({foo: "foo %{bar}, %{baz}"});

    // Extra interpolation variables are ignored
    let foo = i18n.t("foo", {bar: "bazzz", baz: "barrr", ignored: "123"}); //=> "foo bazzz, barrr"
    t.equal(foo, "foo bazzz, barrr");

    // Missing translations
    let missing = i18n.t("foo.bar.baz"); //=> "Baz"
    t.equal(missing, "Baz");
  
    t.end();
  });

  t.test("I18n.prototype.scoped readme example", function(t) {
    let i18n = new I18n({foo: {bar: "scoped bar"}});
    let scopedT = i18n.scoped("foo");

    let bar = scopedT("bar"); //=> "scoped bar"
    t.equal(bar, "scoped bar");
  
    t.end();
  });

  t.test("Pluralization readme example: default rule", function(t) {
    let defaultI18n = new I18n({
      users: {
        one: "One user",
        other: "%{count} users"
      },
      items: "%{count} items"
    });

    // Note how `users.other` is used in this case and not `users.zero`(which is undefined)
    let users_0 = defaultI18n.t("users", {count: 0}); //=> "0 users"
    t.equal(users_0, "0 users");

    let users_1 = defaultI18n.t("users", {count: 1}); //=> "One user"
    t.equal(users_1, "One user");

    let users_312 = defaultI18n.t("users", {count: 312}); //=> "312 users"
    t.equal(users_312, "312 users");

    let items_1 = defaultI18n.t("items", {count: 1}); //=> "1 items"
    t.equal(items_1, "1 items");

    t.end();
  });

  t.test("Pluralization readme example: custom rules", function(t) {
    let myRule = (count) => {
      if (count === 0) {
        // It's also possible use an array of keys
        return ["my_zero", "my_zero2"];
      } else if (count === 1) {
        return "my_one";
      } else {
        return "something_else";
      }
    };

    let customI18n = new I18n({
      users: {
        my_zero: "My Zero users",
        my_one: "My One user",
        something_else: "My %{count} users"
      },
      items: {
        my_zero2: "My Zero2 items"
      }
    }, { pluralizationRule: myRule });

    let users_0 = customI18n.t("users", {count: 0}); //=> "My Zero users"
    t.equal(users_0, "My Zero users");

    let users_1 = customI18n.t("users", {count: 1}); //=> "My One user"
    t.equal(users_1, "My One user");

    let users_312 = customI18n.t("users", {count: 312}); //=> "My 312 users"
    t.equal(users_312, "My 312 users");

    let items_0 = customI18n.t("items", {count: 0}); //=> "My Zero2 items"
    t.equal(items_0, "My Zero2 items");
  
    t.end();
  });

  t.test("I18n.Strict readme example", function(t) {
    let strict = new I18n.Strict({
      page: {
        title: "%{text} Page"
      },

      users: {
        one: "One user"
      },
      items: "%{count} items"
    });

    // Throws: Translation missing: t("title", {})
    t.throws(() => strict.t("title"), /missing/);

    // Throws: Missing interpolation variables: expected to receive {text} for "%{text} Page", but got: t("page.title", {})
    t.throws(() => strict.t("page.title"), /Missing/);

    // Throws: Encountered undefined interpolation variables for t("page.title", { text: undefined })
    t.throws(() => strict.t("page.title", {text: undefined}), /undefined interpolation variables/);

    // Returns correct string if there are no errors
    t.equal(strict.t("page.title", { text: "Home" }), "Home Page"); //=> Home Page

    // Throws: Translation missing: t("users", { count: 0 })
    t.throws(() => strict.t("users", { count: 0 } ), /missing/);
  
    t.end();
  });

  t.end();
});