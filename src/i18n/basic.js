import I18nBase from "./i18n_base";

export default class I18nBasic extends I18nBase {
  t() {
    let { paths, isTranslated, translation } = super.t(...arguments);

    if (isTranslated) {
      return translation;
    } else {
      return humanizePath(paths.scoped);
    }
  }
}

function humanizePath(path) {
  let splitPath = path.split(".");

  return humanize(lastElem(splitPath));
}

function lastElem(array) {
  return array[array.length-1];
}

function humanize(string) {
  return capitalize(string.split("_").join(" "));
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}