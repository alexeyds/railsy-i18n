module.exports = class I18nBase {
  constructor(translations) {
    this._translations = translations;
  }

  t(path, placeholders) {
    let { translation, stoppedAt } = this._findTranslation(path);
    let isTranslated;

    if (typeof translation === "string") {
      isTranslated = true;
      
      if (placeholders) { 
        translation = this._replacePlaceholders(translation, placeholders); 
      }
    } else {
      isTranslated = false;
    }

    return {translation, isTranslated, path, stoppedAt};
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

    for (let k in placeholders) {
      let replaceTarget = `%{${k}}`;

      result = result.replace(replaceTarget, placeholders[k]);
    }

    return result;
  }
};