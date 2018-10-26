const I18nBase = require("./base");

class MissingTranslationError extends Error {}
class InterpolationError extends Error {}

module.exports = class I18nStrict extends I18nBase {
  t() {
    let { paths, isTranslated, translation, interpolation } = super.t(...arguments);
    if (isTranslated) {
      this._checkMissingInterpolation(interpolation, paths.scoped);
      return translation;
    } else {
      throw new MissingTranslationError(`Translation missing: ${paths.scoped}`);
    }
  }

  _checkMissingInterpolation(interpolation, path) {
    if (interpolation.unusedReplacements) {
      let placeholders = interpolation.unusedReplacements.join(", ");

      throw new InterpolationError(`Unused interpolation arguments for '${path}': ${placeholders}`);
    } 

    if (interpolation.undefinedReplacements) {
      let placeholders = interpolation.undefinedReplacements.join(", ");

      throw new InterpolationError(`Undefined interpolation arguments for '${path}': ${placeholders}`);
    }

    if (interpolation.remainingPlaceholders) {
      let args = interpolation.remainingPlaceholders.join(", ");

      throw new InterpolationError(`Interpolation arguments missing: expected to receive {${args}} for translation at '${path}'`);
    }
  }
};