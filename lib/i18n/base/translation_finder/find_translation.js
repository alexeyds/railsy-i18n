module.exports = function findTranslation(translations, steps) {
  let iterator = new TranslationIterator(translations);

  for (let step of steps) {
    if (iterator.isDone()) {
      break;
    } else {
      iterator.next(step);
    }
  }

  return { translation: iterator.translation, stoppedAt: iterator.stoppedAt };
};

class TranslationIterator {
  constructor(translations) {
    this.translation = translations;
    this.stoppedAt = [];
  }

  next(step) {
    this.translation = this.translation[step];

    if (!this.isDone()) {
      this.stoppedAt.push(step);
    }
  }

  isDone() {
    return this.translation === undefined;
  }
}
