// Example solution using generators instead of Iterator pattern. Not used in the project

module.exports = function findTranslation(translations, steps) {
  let gen = translationGenerator(translations, steps[0]);
  let result = gen.next().value;

  for (let step of steps) {
    let { done, value } = gen.next(step);

    if (done) {
      break;
    } else {
      result = value;
    }
  }

  return result;
};


function* translationGenerator(translation, step) {
  let stoppedAt = [];

  yield { translation, stoppedAt };

  let isDone = () => translation === undefined;

  while(true) {
    translation = translation[step];

    if (!isDone()) {
      stoppedAt.push(step);
    } 

    step = yield { translation, stoppedAt };

    if (isDone()) {
      break;
    }
  }
}