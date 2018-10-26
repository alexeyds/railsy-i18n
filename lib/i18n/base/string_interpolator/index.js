const PlaceholdersValidator = require("./placeholders_validator");

module.exports = class StringInterpolator {
  interpolate(string, replacements) {
    if (typeof string === "string") {
      let placeholders = this._findPlaceholdersInString(string);
      let validation = new PlaceholdersValidator(placeholders).validate(replacements);

      string = this._interpolate(string, validation.filteredReplacements);

      return { 
        interpolated: string, 
        unusedReplacements: validation.unusedReplacements, remainingPlaceholders: validation.remainingPlaceholders, 
        undefinedReplacements: validation.undefinedReplacements
      };
    } else {
      return { interpolated: string };
    }
  }

  _findPlaceholdersInString(string) {
    let placeholders = {};
    let regex = /%{(.+?)}/g;
    let match = regex.exec(string);

    while (match != null) {
      placeholders[match[1]] = `%{${match[1]}}`;
      match = regex.exec(string);
    }

    return placeholders;
  }

  _interpolate(string, placeholderValues) {
    for (let k in placeholderValues) {
      string = string.replace(`%{${k}}`, placeholderValues[k]);
    }

    return string;
  }
};