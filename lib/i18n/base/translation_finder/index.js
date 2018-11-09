const findTranslation = require("./find_translation");

module.exports = class TranslationFinder {
  constructor(translations, options) {
    this._translations = translations;
    this._scope = options.scope;
  }

  find(path) {
    let scoped = this._appendScope(path);

    let { translation, stoppedAt } = this._findTranslation(scoped);
    let paths = { original: path, scoped, stoppedAt };

    return { translation, paths };
  }

  _appendScope(path) {
    return this._scope ? `${this._scope}.${path}` : path;
  }

  _findTranslation(path) {
    let steps = path.split(".");
    let result = findTranslation(this._translations, steps);

    return {translation: result.translation, stoppedAt: result.stoppedAt.join(".")};
  }
};