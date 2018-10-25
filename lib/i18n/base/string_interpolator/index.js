module.exports = class StringInterpolator {
  interpolate(string, placeholders) {
    placeholders = placeholders || {};

    if (typeof string === "string") {
      let result = this._replacePlaceholders(string, placeholders);

      return { 
        interpolated: result.string, 
        unusedPlaceholders: result.unusedPlaceholders, remainingPlaceholders: result.remainingPlaceholders, 
        undefinedPlaceholders: result.undefinedPlaceholders 
      };
    } else {
      return { interpolated: string };
    }
  }

  _replacePlaceholders(string, placeholderValues) {
    let { unusedPlaceholders, remainingPlaceholders, undefinedPlaceholders, filteredPlaceholderValues } = this._validatePlaceholders(string, placeholderValues);

    string = this._interpolate(string, filteredPlaceholderValues);

    return { unusedPlaceholders, undefinedPlaceholders, remainingPlaceholders, string };
  }

  _validatePlaceholders(string, placeholderValues) {
    let placeholdersInString = this._findPlaceholdersInString(string);

    let unusedPlaceholders = this._findUnusedPlaceholders(placeholdersInString, placeholderValues);
    let remainingPlaceholders = this._findRemainingPlaceholders(placeholdersInString, placeholderValues);
    let undefinedPlaceholders = this._findUndefinedPlaceholders(placeholderValues);

    let filteredPlaceholderValues = removeFrom(placeholderValues, undefinedPlaceholders);

    return { undefinedPlaceholders, remainingPlaceholders, unusedPlaceholders, filteredPlaceholderValues };
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

  _findUnusedPlaceholders(placeholdersInString, placeholderValues) {
    let unusedPlaceholders = undefined;

    for (let key in placeholderValues) {
      if (!placeholdersInString.hasOwnProperty(key)) {
        unusedPlaceholders = unusedPlaceholders || [];
        unusedPlaceholders.push(`%{${key}}`);
      }
    }

    return unusedPlaceholders;
  }

  _findRemainingPlaceholders(placeholdersInString, placeholderValues) {
    let remainingPlaceholders = undefined;

    for (let key in placeholdersInString) {
      if(!placeholderValues.hasOwnProperty(key)) {
        remainingPlaceholders = remainingPlaceholders || [];
        remainingPlaceholders.push(key);
      }
    }

    return remainingPlaceholders;
  }

  _findUndefinedPlaceholders(placeholderValues) {
    let undefinedPlaceholders;

    for (let key in placeholderValues) {
      if (placeholderValues[key] === undefined) {
        undefinedPlaceholders = undefinedPlaceholders || [];
        undefinedPlaceholders.push(key);
      }
    }

    return undefinedPlaceholders;
  }

  _interpolate(string, placeholderValues) {
    for (let k in placeholderValues) {
      string = string.replace(`%{${k}}`, placeholderValues[k]);
    }

    return string;
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