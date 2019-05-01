import I18nCore from "./base/index";

export default class I18nBase {
  constructor() {
    this._i18n = new I18nCore(...arguments);
  }

  t() {
    return this._i18n.t(...arguments);
  }
}
  