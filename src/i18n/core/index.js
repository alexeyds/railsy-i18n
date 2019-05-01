import TranslationFinder from "./translation_finder/index";
import StringInterpolator from "./string_interpolator/index";

export default class I18nCore {
  constructor(translations, options) {
    let translatorOptions = {};

    if (options) {
      translatorOptions.scope = options.scope;
      this._fallbackI18n = options.fallbackI18n;
      this._pluralizationRule = options.pluralizationRule;
    }

    this._pluralizationRule = this._pluralizationRule || defaultPluralizationRule;
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
    let optionalStep = getCountKey(replacements, this._pluralizationRule);
    let { translation, paths, isOptionalStepTaken } = this._translationFinder.find(path, {optionalStep});

    if (typeof translation === 'string') { 
      let interpolationOpts = {};
      replacements = replacements || {};

      if (isOptionalStepTaken) {
        interpolationOpts = { optionalReplacements: ["count"] };
      }

      let { validation, interpolated } = 
        this._stringInterpolator.interpolate(translation, replacements, interpolationOpts);

      return { translation: interpolated, paths, isTranslated: true, interpolation: validation };
    } else if (this._fallbackI18n) {
      return this._fallbackI18n._t(path, replacements);
    } else {
      return { 
        translation, paths, isTranslated: false, 
        interpolation: {}
      };
    }
  }
}

function getCountKey(replacements, pluralizationRule) {
  if (!replacements || replacements.count === undefined) {
    return undefined;
  } else {
    let key = pluralizationRule(replacements.count);

    if (key === "zero") {
      key = ["zero", "other"];
    }

    return key;
  }
}

function defaultPluralizationRule(count) {
  if (count === 0) {
    return "zero";
  } else if (count === 1) {
    return "one";
  } else {
    return "other";
  }
}