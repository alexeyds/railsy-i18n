import { presentFunctionCall } from "utils/function_utils";
import I18n from "./i18n";

class MissingTranslationError extends Error {}
class InterpolationError extends Error {}

export default class I18nStrict extends I18n {
  _handleSuccessfulTranslation(translation, pathArray, placeholders) {
    let path = this._arrayToPath(pathArray);
    let functionCall = presentFunctionCall("t", path, placeholders);
    let unconsumedPlaceholders = this._getUnconsumedPlaceholders(translation);

    if (hasUndefinedValues(placeholders)) {
      throw new InterpolationError(`Encountered undefined interpolation variables for ${functionCall}`);
    } else if (unconsumedPlaceholders.length > 0) {
      throw new InterpolationError(
        `Missing interpolation variables: expected to receive ${unconsumedPlaceholders} for ${translation}, but got: ${functionCall}'`
      );
    }

    return translation;
  }

  _handleMissingTranslation(pathArray, placeholders) {
    let path = this._arrayToPath(pathArray);
    let functionCall = presentFunctionCall("t", path, placeholders);

    throw new MissingTranslationError(`Translation missing: ${functionCall}`);
  }

  _getUnconsumedPlaceholders(string) {
    let placeholders = [];
    let regexStr = this._delimeter.start + "(.+?)" + this._delimeter.end;
    let regex = new RegExp(regexStr, "g");
    let match = regex.exec(string);

    while (match != null) {
      placeholders.push(match[1]);
      match = regex.exec(string);
    }

    return placeholders;
  }
}

function hasUndefinedValues(obj) {
  return Object.values(obj).some(v => v === undefined);
}