let { removeKeys } = require("../../../utils/object");

module.exports = class PlaceholdersValidator {
  constructor(placeholders) {
    this._placeholders = placeholders;
  }

  filter(replacements) {
    let validation = this._validate(replacements);
    let filteredReplacements = this._filterUndefined(replacements, validation.undefinedReplacements);

    return {validation, filteredReplacements};
  }

  _validate(replacements) {
    let { unusedReplacements, undefinedReplacements } = this._validateReplacements(replacements);
    let remainingPlaceholders = this._findRemainingPlaceholders(replacements);

    let result = removeUndef({ unusedReplacements, remainingPlaceholders, undefinedReplacements });
    return result;
  }


  _validateReplacements(replacements) {
    let unused = new NullArray();
    let undef = new NullArray();

    for (let key in replacements) {
      if (!this._placeholders.hasOwnProperty(key)) {
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

class NullArray {
  push(item) {
    this.value = this.value || [];
    this.value.push(item);
  }
}

function removeUndef(obj) {
  let result = Object.assign({}, obj);
  
  for (let key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] === undefined) {
      delete result[key];
    }
  }

  return result;
}