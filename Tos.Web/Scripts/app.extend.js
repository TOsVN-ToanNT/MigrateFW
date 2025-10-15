(function (global, $, undef) {

    "use strict";

    /**
    * 画面に関する共通関数を定義します。
    */
    //App.define("App.extend", {
        /**
        * 関数の説明。
        * @param {Number} num 引数の説明 
        */
        //originalFunction: function (num) {
        //    return num;
        //},

    //});

})(window, jQuery);

; (function (global, App, $, undef) {

    "use strict";

    /**
    * アプリケーションで利用する共通バリデーションを定義します。
    */
    //App.validation.addMethod("newMethodName", function (value, param, opts, done) {

    //    if (isEmpty(value)) {
    //        return done(true);
    //    }

    //    value = App.isNum(value) ? value + "" : value;
    //    var length = App.isArray(value) ? value.length : $.trim(value).length;

    //    done((((value || "") + "") === "") || (length >= param));

    //}, "input {param} or more characters");

    /**
    * アプリケーションで利用する共通Applierを定義します。
    */
    //App.ui.addFormApplier("point3digits", function (value, element) {
    //    var formated;

    //    if (value == null || value == "" || !value || value == -1) {
    //        formated = 0;
    //    } else {
    //        var str = App.isNum(value) ? value + "" : value,
    //            remain = (str.split(".")[1] ? "." + (str.split(".")[1] + "000").substr(0, 3) : ".000");
    //        formated = App.num.format(Number(value), "#,0") + remain;
    //    }

    //    if (element.is(":input")) {
    //        element.val(formated);
    //    } else {
    //        if (!App.isUndefOrNull(formated)) {
    //            element.text(formated);
    //        } else {
    //            element.text("");
    //        }
    //    }
    //    return true;
    //});

})(this, App, jQuery);
