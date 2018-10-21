module.exports = class StringInterpolator {
  interpolate(string, placeholders) {
    if (typeof string === "string") {
      let result = this._replacePlaceholders(string, placeholders);
      let remainingPlaceholders = this._getRemainingPlaceholders(result.string);

      return { 
        interpolated: result.string, 
        unusedPlaceholders: result.unusedPlaceholders, remainingPlaceholders, 
        undefinedPlaceholders: result.undefinedPlaceholders 
      };
    } else {
      return { interpolated: string };
    }
  }

  _replacePlaceholders(string, placeholders) {
    let unusedPlaceholders;
    let undefinedPlaceholders;

    for (let k in placeholders) {
      let placeholder = `%{${k}}`;
      let placeholderValue = placeholders[k];

      if (placeholderValue === undefined) {
        undefinedPlaceholders = undefinedPlaceholders || [];
        undefinedPlaceholders.push(k);
      } else if (string.includes(placeholder)) {
        string = string.replace(placeholder, placeholderValue);
      } else {
        unusedPlaceholders = unusedPlaceholders || [];
        unusedPlaceholders.push(placeholder);
      }
    }

    return {string, unusedPlaceholders, undefinedPlaceholders};
  }

  _getRemainingPlaceholders(string) {
    let matches = findFirstMatchGroupInString(string, /%{(.+?)}/g);

    if (matches.length !== 0) {
      let result = [];
      matches.forEach(m => result.push(m));

      return result;
    }
  }
};

function findFirstMatchGroupInString(string, regex) {
  let matches = [];

  let match = regex.exec(string);

  while (match != null) {
    matches.push(match[1]);
    match = regex.exec(string);
  }

  return matches;
}