import test from "tape";
import I18nBase from "i18n/i18n_base";

class MyI18n extends I18nBase {
  t() {
    return super.t(...arguments);
  }   
}

test("I18nBase basic usage", function(t) {
  t.test("delegates constructor and .t() to I18nCore", function(t) {
    let i18n = new MyI18n({a: {b: "foo"}});
    let result = i18n.t("a.b");
    
    t.equal(result.translation, "foo");
  
    t.end();
  });

  t.end();
});