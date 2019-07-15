# railsy-i18n
Node.js adaptation of Ruby I18n library

Main goal of this project is to provide an easy way of using Ruby I18n conventions in node applications.

It is intended to be a simple, flexible library for internationalization and localization which can be used as a standalone solution or/and easen the transfer of translation files from Rails backend to any node environment.

## Installation
```
npm i railsy-i18n
```

## Example Usage
```js
const I18n = require("railsy-i18n");

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
enI18n.t("header.login"); //=> "Log me in"
enI18n.t("header.welcome", {name: "John"}); //=> "Welcome, John"

// Pluralization
enI18n.t("users_count", { count: 4} ); //=> "4 users"
enI18n.t("users_count", { count: 0} ); //=> "No users"

// Missing translations
enI18n.t("header.missing_translation"); //=> "Missing translation"

// I18n#scoped method
let headerT = enI18n.scoped("header");
headerT("welcome", {name: "John"}); //= "Welcome, John"

// fallbacks
let ruI18n = new I18n({
  ru: {
    header: {
      login: "Войти",
    },
  }
}, { scope: "ru", fallbackI18n: enI18n });

ruI18n.t("header.login"); //=> "Войти"
ruI18n.t("header.welcome", {name: "Джон"}); //=> "Welcome, Джон"
```

## API
### Constructor options
```js
new I18n(translations[, options])
```

- `translations`: an object, containing all translations for this instance. Required.
- `options.scope`: a string, default scope for all translations. Optiona.
- `options.fallbackI18n`: an `I18n` instance to which all missing translations will be delegated. Optional.
- `options.pluralizationRule`: a function. See [Pluralization section](#pluralization) for more details. Optional.

### I18n#t method
```js
enI18n.t(path[, interpolationVariables])
```

- `path`: a string, path to translation in 'path.to.translation' format
- `interpolationVariables`: an object of placeholder replacements in the translation string.

If translation is not a string, this method will return a humanized string based on the translation path. For example:
```js
const I18n = require("railsy-i18n");

let i18n = new I18n({foo: "foo %{bar}, %{baz}"});

// Extra interpolation variables are ignored
i18n.t("foo", {bar: "bazzz", baz: "barrr", ignored: "123"}); //=> "foo bazzz, barrr"

// Missing translations
i18n.t("foo.bar.baz"); //=> "Baz"
```

### I18n#scoped method
Returns a wrapper function which delegates to I18n#t with appended scope.
- `scope`: a string

Example:
```js
const I18n = require("railsy-i18n");

let i18n = new I18n({foo: {bar: "scoped bar"}});

let t = i18n.scoped("foo");

t("bar"); //=> "scoped bar"
```

### Pluralization
`count` key in [I18n#t](#i18nt-method) `interpolationVariables` object has a special meaning. If translation at `path` is an object and `count` is present, railsy-i18n will try to search this object for a corresponding key based on the provided(or default) `pluralizationRule` function(see [Constructor options](#constructor-options)). Default rule looks like this: 

```js
function defaultPluralizationRule(count) {
  if (count === 0) {
    return "zero";
  } else if (count === 1) {
    return "one";
  } else {
    return "other";
  }
}
```

As you can see, it simply returns a key which is then used to determine correct translation string. `%{count}` placeholder is also replaced inside this string if necessary. It's completely up to you which keys to use, but common conventions are "zero", "one", "few" and "other". **The only assumption railsy-i18n makes about these keys is that 'zero' key is optional and can replaced with 'other'.** Some examples:

Default rule: 
```js
const I18n = require("railsy-i18n");

let defaultI18n = new I18n({
  users: {
    one: "One user",
    other: "%{count} users"
  },
  items: "%{count} items"
});

// Note how `users.other` is used in this case and not `users.zero`(which is undefined)
defaultI18n.t("users", {count: 0}); //=> "0 users"

defaultI18n.t("users", {count: 1}); //=> "One user"
defaultI18n.t("users", {count: 312}); //=> "312 users"

// 
defaultI18n.t("items", {count: 1}); //=> "1 items"
```

Custom rules:
```js
const I18n = require("railsy-i18n");

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

customI18n.t("users", {count: 0}); //=> "My Zero users"
customI18n.t("users", {count: 1}); //=> "My One user"
customI18n.t("users", {count: 312}); //=> "My 312 users"

customI18n.t("items", {count: 0}); //=> "My Zero2 items"
```

## I18n.Strict
This package also provides a Strict version of I18n class which throws an error if one of the following occurs:
1. Translation cannot be found or is not a string.
2. Some of the placeholders in translation string are not replaced.
3. Some of the placeholders in translation string are not present, but were passed as `interpolationVariables`.
4. Some of the `interpolationVariables` are undefined.

The only intended use of `I18n.Strict` is testing, do not use it in production environments!

Example usage:

```js
const I18n = require("railsy-i18n");

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
strict.t("title");

// Throws: Missing interpolation variables: expected to receive {text} for "%{text} Page", but got: t("page.title", {})
strict.t("page.title");

// Throws: Encountered undefined interpolation variables for t("page.title", { text: undefined })
strict.t("page.title", {text: undefined});

// Returns correct string if there are no errors
strict.t("page.title", { text: "Home" }); //=> Home Page

// Throws: Translation missing: t("users", { count: 0 })
strict.t("users", { count: 0 } );
```

## License
MIT