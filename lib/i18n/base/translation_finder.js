module.exports = class TranslationFinder {
  constructor(translations, options) {
    this._translations = translations;
    this._scope = options && options.scope;
  }

  find(path) {
    let paths = {original: path, scoped: this._appendScope(path)};
    let result = {paths};

    let { translation, stoppedAt } = this._findTranslation(paths.scoped);

    paths.stoppedAt = stoppedAt;
    result.translation = translation;

    return result;
  }

  _appendScope(path) {
    return this._scope ? `${this._scope}.${path}` : path;
  }

  _findTranslation(path) {
    let splitPath = path.split(".");
    let translation = this._translations;
    let stoppedAt = [];

    for (let key of splitPath) {
      translation = translation[key];

      if (translation === undefined) { 
        break; 
      } else {
        stoppedAt.push(key);
      }
    }

    return {translation, stoppedAt: stoppedAt.join(".")};
  }
};