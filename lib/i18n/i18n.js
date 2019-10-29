import * as objectUtils from "utils/object_utils";
import * as stringUtils from "utils/string_utils";
import * as arrayUtils from "utils/array_utils";

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
    let pathArray = this._pathToArray(this._scopedPath(path));
    let result = { success: false, value: null };

    let { success: isTranslationFound, value: translation } = objectUtils.accessNestedProperty(this._translations, pathArray);
    if (isTranslationFound && this._isCountable(translation, placeholders)) {
      translation = this._applyCount(translation, placeholders);
    }

    if (isTranslationFound && stringUtils.isString(translation)) {
      result.success = true;
      result.value = stringUtils.interpolate(translation, placeholders, this._delimeter);
    }

    if (result.success) {
      return this._handleSuccessfulTranslation(result.value, pathArray, placeholders);
    } else if (this._fallbackI18n) {
      return this._fallbackI18n.t(...arguments);
    } else {
      return this._handleMissingTranslation(pathArray, placeholders);
    }
  }

  scoped(scope) {
    return function(path, ...rest) {
      path = scope + PATH_DELIMETER + path;
      return this.t(path, ...rest);
    }.bind(this);
  }

  _scopedPath(path) {
    if (this._defaultScope) {
      path = this._defaultScope + PATH_DELIMETER + path;
    }

    return path;
  }

  _pathToArray(path) {
    return path.split(PATH_DELIMETER);
  }

  _arrayToPath(array) {
    return array.join(PATH_DELIMETER);
  }

  _isCountable(translation, placeholders) {
    return typeof translation === "object" && placeholders.hasOwnProperty("count");
  }

  _applyCount(translation, placeholders) {
    let count = placeholders.count;
    let countName = this._getCountName(count);

    return objectUtils.getValueByKeys(translation, countName);
  }

  _getCountName(count) {
    let result = this._pluralizationRule(count);
    if (result === "zero") {
      result = ["zero", "other"];
    }

    return result;
  }

  _handleSuccessfulTranslation(translation, _pathArray, _placeholders) {
    return translation;
  }

  _handleMissingTranslation(pathArray, _placeholders) {
    return stringUtils.humanize(arrayUtils.getLastElement(pathArray));
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