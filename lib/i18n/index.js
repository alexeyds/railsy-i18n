const I18nStrict = require("./strict");
const I18nBasic = require("./basic");

const I18n = {};

module.exports = I18n;

I18n.PRODUCTION_MODE = "production";
I18n.TEST_MODE = "test";

I18n.build = function(translations, config) {
  let i18nConfig;
  let mode;

  if (config) {
    i18nConfig = { fallbackI18n: config.defaultI18n, scope: config.scope };
    mode = config.mode;
  }

  mode = mode || (process.env.NODE_ENV === "test" ? I18n.TEST_MODE : I18n.PRODUCTION_MODE);

  if (mode === I18n.TEST_MODE) {
    return new I18nStrict(translations, i18nConfig);
  } else {
    return new I18nBasic(translations, i18nConfig);
  }
};