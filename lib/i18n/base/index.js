const TranslationFinder = require("./translation_finder");
const StringInterpolator = require("./string_interpolator");

module.exports = class I18nBase {
  constructor(translations, options) {
    let translatorOptions = {};

    if (options) {
      translatorOptions.scope = options.scope;
      this._fallbackI18n = options.fallbackI18n;
    }

    this._translationFinder = new TranslationFinder(translations, translatorOptions);
    this._stringInterpolator = new StringInterpolator();
  }

  scoped(scope) {
    return (path, placeholders) => this.t(`${scope}.${path}`, placeholders);
  }

  t() {
    return this._t(...arguments);
  }

  _t(path, replacements) {
    let { translation, paths } = this._translationFinder.find(path);

    if (typeof translation === 'string') { 
      replacements = replacements || {};
      let { validation, interpolated } = this._stringInterpolator.interpolate(translation, replacements);

      return { translation: interpolated, paths, isTranslated: true, interpolation: validation };
    } else if (this._fallbackI18n) {
      return this._fallbackI18n._t(path, replacements);
    } else {
      return { 
        translation, paths, isTranslated: false, 
        interpolation: this._stringInterpolator.emptyValidationResult() 
      };
    }
  }
};