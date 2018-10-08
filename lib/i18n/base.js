module.exports = class I18nBase {
  constructor(translations, options) {
    this._translations = translations;

    if (options) {
      this._scope = options.scope;
      this._fallbackI18n = options.fallbackI18n;
    }
  }

  t(path, placeholders) {
    let originalPath = path;
    if (this._scope) { path = `${this._scope}.${path}`; }

    let { translation, stoppedAt } = this._findTranslation(path);
    let isTranslated;
    // var extraInterpolationArguments;

    if (typeof translation === "string") {
      isTranslated = true;
      
      if (placeholders) { 
        var { result, extraInterpolationArguments, remainingPlaceholders } = this._replacePlaceholders(translation, placeholders); 
        translation = result;
      }
    } else {
      if (this._fallbackI18n) {
        return this._fallbackI18n.t(originalPath);
      } else {
        isTranslated = false;
      }
    }

    return {translation, isTranslated, path, stoppedAt, extraInterpolationArguments, remainingPlaceholders};
  }

  _findTranslation(path) {
    let splitPath = path.split(".");
    let translation = this._translations;
    let stoppedAt = [];

    splitPath.forEach(key => {
      if (translation === undefined) {
        return;
      } 
      translation = translation[key];
      translation !== undefined && stoppedAt.push(key);
    });

    return {translation, stoppedAt: stoppedAt.join(".")};
  }

  _replacePlaceholders(string, placeholders) {
    let result = string;
    let extraInterpolationArguments = {};

    for (let k in placeholders) {
      let replaceTarget = `%{${k}}`;

      if (result.includes(replaceTarget)) {
        result = result.replace(replaceTarget, placeholders[k]);
      } else {
        extraInterpolationArguments[k] = placeholders[k];
      }
    }

    extraInterpolationArguments = Object.keys(extraInterpolationArguments).length === 0 ? undefined : extraInterpolationArguments;
    let remainingPlaceholders = this._getRemainingPlaceholders(result);

    return { result, extraInterpolationArguments, remainingPlaceholders };
  }

  _getRemainingPlaceholders(string) {
    let matches = findFirstMatchGroupInString(string, /%{(.+?)}/g);

    if (matches.length === 0) {
      return undefined;
    } else {
      let result = {};
      matches.forEach(m => result[m] = `%{${m}}`);

      return result;
    }
  }
};

function findFirstMatchGroupInString(string, regex) {
  let matches = [];

  let match = regex.exec(string);

  while (match != null) {
    matches.push(match[1]);
    match = regex.exec(string);
  }

  return matches;
}