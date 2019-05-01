import I18nBase from "./i18n_base";

class MissingTranslationError extends Error {}
class InterpolationError extends Error {}

export default class I18nStrict extends I18nBase {
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
      let replacements = toStr(interpolation.unusedReplacements);

      throw new InterpolationError(`Unused interpolation variables for '${path}': ${replacements}`);
    } 

    if (interpolation.undefinedReplacements) {
      let replacements = toStr(interpolation.undefinedReplacements);

      throw new InterpolationError(`Undefined interpolation variables for '${path}': ${replacements}`);
    }

    if (interpolation.remainingPlaceholders) {
      let placeholders = toStr(interpolation.remainingPlaceholders);

      throw new InterpolationError(
        `Missing interpolation variables: expected to receive {${placeholders}} for translation at '${path}'`
      );
    }
  }
}

function toStr(arr) {
  return arr.join(", ");
}