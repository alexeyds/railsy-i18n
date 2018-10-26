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
    let iterator = new TranslationIterator(this._translations);

    iterator.iterateThrough(path.split("."));

    return {translation: iterator.translation, stoppedAt: iterator.stoppedAt.join(".")};
  }
};

class TranslationIterator {
  constructor(translations) {
    this.translation = translations;
    this.stoppedAt = [];
  }

  iterateThrough(steps) {
    for (let step of steps) {
      if (this._isTranslationUndefined()) {
        break;
      } else {
        this._next(step);
      }
    }
  }

  _next(step) {
    this.translation = this.translation[step];

    if (!this._isTranslationUndefined()) {
      this.stoppedAt.push(step);
    }
  }

  _isTranslationUndefined() {
    return this.translation === undefined;
  }
}