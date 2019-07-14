import { accessNestedProperty, getValue } from "utils/object_utils";
import { humanize, interpolate, isString } from "utils/string_utils";
import { getLastElement } from "utils/array_utils";

const PATH_DELIMETER = ".";

export default class I18n {
  constructor(translations, options) {
    options = options || {};
    this._defaultScope = options.scope;
    this._fallbackI18n = options.fallbackI18n;
    this._pluralizationRule = options.pluralizationRule || defaultPluralizationRule;

    this._translations = translations;
    this._delimeter = {start: "%{", end: "}"};
  }

  t(path, placeholders) {
    placeholders = placeholders || {};
    let pathArray = this._pathToArray(path);
    let result = { success: false, value: null };

    let { success: isTranslationFound, value: translation } = accessNestedProperty(this._translations, pathArray);
    if (isTranslationFound && this._isCountable(translation, placeholders)) {
      translation = this._applyCount(translation, placeholders);
    }

    if (isTranslationFound && isString(translation)) {
      result.success = true;
      result.value = interpolate(translation, placeholders, this._delimeter);
    }

    if (result.success) {
      return result.value;
    } else if (this._fallbackI18n) {
      return this._fallbackI18n.t(...arguments);
    } else {
      return humanize(getLastElement(pathArray));
    }
  }

  scoped(scope) {
    return function(path, ...rest) {
      path = scope + PATH_DELIMETER + path;
      return this.t(path, ...rest);
    }.bind(this);
  }

  _pathToArray(path) {
    let pathArray = path.split(PATH_DELIMETER);

    if (this._defaultScope) {
      pathArray.unshift(this._defaultScope);
    }

    return pathArray;
  }

  _isCountable(translation, placeholders) {
    return typeof translation === "object" && placeholders.hasOwnProperty("count");
  }

  _applyCount(translation, placeholders) {
    let count = placeholders.count;
    let countName = this._getCountName(count);

    return getValue(translation, countName);
  }

  _getCountName(count) {
    let result = this._pluralizationRule(count);
    if (result === "zero") {
      result = ["zero", "other"];
    }

    return result;
  }
}

function defaultPluralizationRule(count) {
  if (count === 0) {
    return "zero";
  } else if (count === 1) {
    return "one";
  } else {
    return "other";
  }
}