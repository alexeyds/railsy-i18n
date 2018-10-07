class MissingTranslationError extends Error {}
class InterpolationError extends Error {}

module.exports = class I18n {
  static get PRODUCTION_MODE() { return "production"; }
  static get TEST_MODE() { return "test"; }

  constructor(translations, config) {
    this._translations = translations;

    if (config) {
      this._mode = config.mode;
      this._defaultI18n = config.defaultI18n;
      this._scope = config.scope;
    }

    this._mode = this._mode || (process.env.NODE_ENV === "test" ? I18n.TEST_MODE : I18n.PRODUCTION_MODE);
  }

  scoped(scope) {
    return (path, interpolations) => this.t(`${scope}.${path}`, interpolations);
  }

  t(path, interpolations) {
    if (this._scope) { path = `${this._scope}.${path}`; }

    let splitPath = path.split(".");
    let translation = this._findTranslation(splitPath);

    if (translation === undefined || typeof translation !== "string") {
      translation = this._handleMissingTranslation(path, splitPath);
    }

    if (interpolations) {
      translation = this._insertIntoString(translation, interpolations);
    }
    
    this._checkMissingInterpolationArguments(translation);

    return translation;
  }

  _findTranslation(splitPath) {
    let translation = this._translations;

    splitPath.forEach(key => {
      if (translation === undefined) {
        return;
      } 
      translation = translation[key];
    });

    return translation;
  }

  _handleMissingTranslation(path, splitPath) {
    if (this._defaultI18n) {
      return this._defaultI18n.t(path);
    }

    if (this._isInTestMode()) {
      throw new MissingTranslationError(`Translation missing: ${path}`);
    } else {
      let lastKey = splitPath[splitPath.length-1];
      return capitalize(lastKey);
    }
  }

  _insertIntoString(string, insertions) {
    let result = string;

    for (let k in insertions) {
      if (insertions[k] === undefined && this._isInTestMode()) {
        throw new InterpolationError(`undefined interpolation value for ${k}`);
      }

      let replaceTarget = `%{${k}}`;

      if (result.includes(replaceTarget)) {
        result = result.replace(replaceTarget, insertions[k]);
      } else if(this._isInTestMode()) {
        throw new InterpolationError(`Placeholder missing: expected "${string}" to include "${replaceTarget}"`);
      }
    }

    return result;
  }

  _checkMissingInterpolationArguments(string) {
    if (!this._isInTestMode()) { return; }

    let remainingPlaceholders = findAllMatchesInString(string, /%{(.+?)}/g);

    if (remainingPlaceholders.length) {
      throw new InterpolationError(`Interpolation arguments missing: ${remainingPlaceholders}`);
    }
  }

  _isInTestMode() {
    return this._mode === I18n.TEST_MODE;
  }
};

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function findAllMatchesInString(string, regex) {
  let matches = [];

  let match = regex.exec(string);

  while (match != null) {
    matches.push(match[1]);
    match = regex.exec(string);
  }

  return matches;
}