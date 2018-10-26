let { removeKeys } = require("../../../utils/object");

module.exports = class PlaceholdersValidator {
  constructor(placeholders) {
    this._placeholders = placeholders;
  }

  filter(replacements) {
    replacements = replacements || {};

    let unusedReplacements = this._findUnusedReplacemenets(replacements);
    let remainingPlaceholders = this._findRemainingPlaceholders(replacements);
    let undefinedReplacements = this._findUndefinedPlaceholders(replacements);

    let filteredReplacements;
    
    if (undefinedReplacements) {
      filteredReplacements = removeKeys(replacements, undefinedReplacements);
    } else {
      filteredReplacements = replacements;
    }

    return {unusedReplacements, remainingPlaceholders, undefinedReplacements, filteredReplacements};
  }

  _findUnusedReplacemenets(replacements) {
    let result = new NullArray();

    for (let key in replacements) {
      if (!this._placeholders.hasOwnProperty(key)) {
        result.push(key);
      }
    }

    return result.value;
  }

  _findRemainingPlaceholders(replacements) {
    let result = new NullArray();

    for (let key in this._placeholders) {
      if(!replacements.hasOwnProperty(key)) {
        result.push(key);
      }
    }

    return result.value;
  }

  _findUndefinedPlaceholders(replacements) {
    let result = new NullArray();

    for (let key in replacements) {
      if (replacements[key] === undefined) {
        result.push(key);
      }
    }

    return result.value;
  }
};

class NullArray {
  push(item) {
    this.value = this.value || [];
    this.value.push(item);
  }
}