module.exports = class PlaceholdersValidator {
  constructor(placeholders) {
    this._placeholders = placeholders;
  }

  validate(replacements) {
    replacements = replacements || {};

    let unusedReplacements = this._findUnusedReplacemenets(replacements);
    let remainingPlaceholders = this._findRemainingPlaceholders(replacements);
    let undefinedReplacements = this._findUndefinedPlaceholders(replacements);

    let filteredReplacements = removeFrom(replacements, undefinedReplacements);

    return {unusedReplacements, remainingPlaceholders, undefinedReplacements, filteredReplacements};
  }

  _findUnusedReplacemenets(replacements) {
    let result;

    for (let key in replacements) {
      if (!this._placeholders.hasOwnProperty(key)) {
        result = result || [];
        result.push(key);
      }
    }

    return result;
  }

  _findRemainingPlaceholders(replacements) {
    let result;

    for (let key in this._placeholders) {
      if(!replacements.hasOwnProperty(key)) {
        result = result || [];
        result.push(key);
      }
    }

    return result;
  }

  _findUndefinedPlaceholders(replacements) {
    let result;

    for (let key in replacements) {
      if (replacements[key] === undefined) {
        result = result || [];
        result.push(key);
      }
    }

    return result;
  }
};

function removeFrom(object, keys) {
  if (keys === undefined) {
    return object;
  }

  let result = {};

  for (let key in object) {
    if (!keys.includes(key)) {
      result[key] = object[key];
    }
  }

  return result;
}