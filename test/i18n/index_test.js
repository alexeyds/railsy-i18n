import test from "tape";
import I18n from "i18n";
import I18nStrict from "i18n/strict";
import I18nBasic from "i18n/basic";
  
test("I18n", function(t) {
  t.equal(I18n, I18nBasic);
  t.equal(I18n.Strict, I18nStrict);

  t.end();
});