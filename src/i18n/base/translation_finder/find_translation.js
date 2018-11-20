module.exports = function findTranslation(translations, steps, options) {
  let optionalStep = options && options.optionalStep;
  let iterator = new TranslationIterator(translations);

  for (let step of steps) {
    if (iterator.isDone()) {
      break;
    } else {
      iterator.next(step);
    }
  }

  let isOptionalStepTaken = shouldTakeOptionalStep(iterator, optionalStep) && 
    takeOptionalStep(iterator, optionalStep);

  return { translation: iterator.translation, stoppedAt: iterator.stoppedAt, isOptionalStepTaken };
};

function shouldTakeOptionalStep(iterator, step) {
  return step !== undefined && typeof iterator.translation === 'object';
}

function takeOptionalStep(iterator, step) {
  let isStepTaken = false;

  if (Array.isArray(step)) {
    for (let s of step) {
      isStepTaken = iterator.tryNext(s);
      if (isStepTaken) break;
    }
  } else {
    isStepTaken = iterator.tryNext(step);
  }

  return isStepTaken;
}

class TranslationIterator {
  constructor(translations) {
    this.translation = translations;
    this.stoppedAt = [];
  }

  tryNext(step) {
    let next = this.translation[step];

    if (next === undefined) {
      return false;
    } else {
      this.next(step);

      return true;
    }
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
