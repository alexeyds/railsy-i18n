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
    let scopedPath = this._appendScope(path);

    let { translation, stoppedAt } = this._findTranslation(scopedPath);

    let paths = {original: originalPath, scoped: scopedPath, stoppedAt};

    if (typeof translation === "string") {
      let { interpolatedString, interpolation } = this._replacePlaceholders(translation, placeholders); 

      return { translation: interpolatedString, isTranslated: true, paths, interpolation };
    } else if (this._fallbackI18n) {
      return this._fallbackI18n.t(originalPath);
    } else {
      return { translation, isTranslated: false, paths, interpolation: noInterpolationResult() };
    }
  }

  _appendScope(path) {
    return this._scope ? `${this._scope}.${path}` : path;
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
    if (placeholders) {    
      let interpolatedString = string;
      let extraArguments = {};

      for (let k in placeholders) {
        let replaceTarget = `%{${k}}`;

        if (interpolatedString.includes(replaceTarget)) {
          interpolatedString = interpolatedString.replace(replaceTarget, placeholders[k]);
        } else {
          extraArguments[k] = placeholders[k];
        }
      }

      extraArguments = Object.keys(extraArguments).length === 0 ? undefined : extraArguments;
      let remainingPlaceholders = this._getRemainingPlaceholders(interpolatedString);

      return { interpolatedString, interpolation: {extraArguments, remainingPlaceholders} };
    } else {
      return { interpolatedString: string, interpolation: noInterpolationResult()};
    }
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

function noInterpolationResult() {
  return {};
}

function findFirstMatchGroupInString(string, regex) {
  let matches = [];

  let match = regex.exec(string);

  while (match != null) {
    matches.push(match[1]);
    match = regex.exec(string);
  }

  return matches;
}