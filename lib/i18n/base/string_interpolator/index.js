const PlaceholdersValidator = require("./placeholders_validator");

module.exports = class StringInterpolator {
  interpolate(string, replacements) {
    if (typeof string === "string") {
      let placeholders = this._findPlaceholdersInString(string);
      
      let filtered = new PlaceholdersValidator(placeholders).filter(replacements);
      let validation = filtered.validation;

      string = this._interpolate(string, filtered.filteredReplacements);

      return { 
        interpolated: string, 
        validation
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