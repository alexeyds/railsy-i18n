let { removeKeys, removeUndef } = require("../../../utils/object");
let NullArray = require("../../../utils/null_array");

module.exports = class PlaceholdersValidator {
  constructor(placeholders) {
    this._placeholders = placeholders;
  }

  filter(replacements, options) {
    let optionalReplacements = (options && options.optionalReplacements) || [];
    let validation = this._validate(replacements, optionalReplacements);
    let filteredReplacements = this._filterUndefined(replacements, validation.undefinedReplacements);

    return {validation, filteredReplacements};
  }

  _validate(replacements, optionalReplacements) {
    let { unusedReplacements, undefinedReplacements } = this._validateReplacements(replacements, optionalReplacements);
    let remainingPlaceholders = this._findRemainingPlaceholders(replacements);

    let result = removeUndef({ unusedReplacements, remainingPlaceholders, undefinedReplacements });
    return result;
  }


  _validateReplacements(replacements, optionalReplacements) {
    let unused = new NullArray();
    let undef = new NullArray();

    for (let key in replacements) {
      if (!this._placeholders.hasOwnProperty(key) && !optionalReplacements.some(e => e === key)) {
        unused.push(key);
      }

      if (replacements[key] === undefined) {
        undef.push(key);
      }
    }

    return { unusedReplacements: unused.value, undefinedReplacements: undef.value };
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

  _filterUndefined(replacements, keys) {
    return keys ? removeKeys(replacements, keys) : replacements;
  }
};