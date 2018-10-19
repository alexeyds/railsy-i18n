const I18nBase = require("./base");

module.exports = class I18nBasic extends I18nBase {
  t() {
    let { paths, isTranslated, translation } = super.t(...arguments);

    if (isTranslated) {
      return translation;
    } else {
      let splitPath = paths.scoped.split(".");
      return humanize( splitPath[splitPath.length-1] );
    }
  }
};

function humanize(string) {
  return capitalize(string.split("_").join(" "));
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}