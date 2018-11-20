import findTranslation from "./find_translation";

export default class TranslationFinder {
  constructor(translations, options) {
    this._translations = translations;
    this._scope = options && options.scope;
  }

  find(path, options) {
    let scoped = this._appendScope(path);

    let { translation, stoppedAt, isOptionalStepTaken } = this._findTranslation(scoped, options);
    let paths = { original: path, scoped, stoppedAt };

    return { translation, paths, isOptionalStepTaken };
  }

  _appendScope(path) {
    return this._scope ? `${this._scope}.${path}` : path;
  }

  _findTranslation(path, options) {
    let steps = path.split(".");
    let result = findTranslation(this._translations, steps, options);

    return { 
      translation: result.translation, 
      stoppedAt: result.stoppedAt.join("."),
      isOptionalStepTaken: result.isOptionalStepTaken
    };
  }
};