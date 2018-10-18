const I18nBase = require("./base");

class MissingTranslationError extends Error {}
class InterpolationError extends Error {}

module.exports = class I18nStrict {
  constructor() {
    this._i18n = new I18nBase(...arguments);
  }

  t() {
    let { paths, isTranslated, translation, interpolation } = this._i18n.t(...arguments);
    if (isTranslated) {
      this._checkMissingInterpolation(interpolation, paths.scoped);
      return translation;
    } else {
      throw new MissingTranslationError(`Translation missing: ${paths.scoped}`);
    }
  }

  _checkMissingInterpolation(interpolation, path) {
    if (interpolation.unusedPlaceholders) {
      let placeholders = interpolation.unusedPlaceholders.join(", ");

      throw new InterpolationError(`Placeholders missing: expected translation at ${path} to include ${placeholders}`);
    } 

    if (interpolation.remainingPlaceholders) {
      let args = interpolation.remainingPlaceholders.join(", ");

      throw new InterpolationError(`Interpolation arguments missing: expected to receive {${args}} for translation at ${path}`);
    }
  }
};