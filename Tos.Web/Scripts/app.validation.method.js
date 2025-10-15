/** 最終更新日 : 2017-09-07 **/
/*!
 * バリデーションを拡張するメソッドを定義します。
 * 
 * Copyright(c) 2013 Archway Inc. All rights reserved.
 */
; (function (global, App, $, undef) {

    "use strict";

    var isEmpty = App.validation.isEmpty;

    /**
     * 指定された値がパラメーターで指定された値より長い文字列かどうかを検証します。
     * 値が空または数値に変換できない場合、およびパラメーターが数値に変換できない場合は
     * 検証を実行しない為成功となります。
     */
    App.validation.addMethod("minlength", function (value, param, opts, done) {

        if (isEmpty(value)) {
            return done(true);
        }

        value = App.isNum(value) ? value + "" : value;
        var length = App.isArray(value) ? value.length : value.length;

        done((((value || "") + "") === "") || (length >= param));

    }, "input {param} or more characters");

    /**
     * 指定された値がパラメーターで指定された値（バイト長）より長い文字列かどうかを検証します。
     * 値が空または数値に変換できない場合、およびパラメーターが数値に変換できない場合は
     * 検証を実行しない為成功となります。
     */
    App.validation.addMethod("minbytelength", function (value, param, opts, done) {

        if (isEmpty(value)) {
            return done(true);
        }

        var iret = 0;
        for (var i = 0; i < value.length; ++i) {
            var c = value.charCodeAt(i);
            if ((c >= 0x0 && c < 0x81) || (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
                iret = iret + 1;
            }
            else {
                iret = iret + 2;
            }
        }
        
        done(((value || "") + "") === "" || iret >= param);

    }, "input {param} or more characters");

    /**
     * 指定された値がパラメーターで指定された値より短い文字列かどうかを検証します。
     * 値が空または数値に変換できない場合、およびパラメーターが数値に変換できない場合は
     * 検証を実行しない為成功となります。
     */
    App.validation.addMethod("maxlength", function (value, param, opts, done) {

        if (isEmpty(value)) {
            return done(true);

        }
        value = App.isNum(value) ? value + "" : value;
        var length = App.isArray(value) ? value.length : value.length;
        
        done(((value || "") + "") === "" || length <= param);

    }, "input {param} characters or less");

    /**
     * 指定された値がパラメーターで指定された値（バイト長）より短い文字列かどうかを検証します。
     * 値が空または数値に変換できない場合、およびパラメーターが数値に変換できない場合は
     * 検証を実行しない為成功となります。
     */
    App.validation.addMethod("maxbytelength", function (value, param, opts, done) {

        if (isEmpty(value)) {
            return done(true);
        }

        var iret = 0;
        for (var i = 0; i < value.length; ++i) {
            var c = value.charCodeAt(i);
            if ((c >= 0x0 && c < 0x81) || (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
                iret = iret + 1;
            }
            else {
                iret = iret + 2;
            }
        }

        done(((value || "") + "") === "" || iret <= param);

    }, "input {param} characters or less");

    App.validation.addMethod("rangelength", function (value, param, opts, done) {

        if (isEmpty(value)) {
            return done(true);
        }

        value = App.isNum(value) ? value + "" : value;
        var length = App.isArray(value) ? value.length : value.length;
       
        done(((value || "") + "") === "" || (length >= param[0] && length <= param[1]));

    }, "a value between {param[0]} and {param[1]} characters long");

    App.validation.addMethod("rangebytelength", function (value, param, opts, done) {

        if (isEmpty(value)) {
            return done(true);
        }

        var iret = 0;
        for (var i = 0; i < value.length; ++i) {
            var c = value.charCodeAt(i);
            if ((c >= 0x0 && c < 0x81) || (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
                iret = iret + 1;
            }
            else {
                iret = iret + 2;
            }
        }

        done(((value || "") + "") === "" || (iret >= param[0] && iret <= param[1]));

    }, "a value between {param[0]} and {param[1]} characters long");

    // 入力引数： value[対象数値],beforePoint[整数部の桁数],
    //            afterPoint[小数点以下桁数],minus[マイナス可不可]
    App.validation.addMethod("pointlength", function (value, param, opts, done) {

        if (isEmpty(value)) {
            return done(true);
        }

        var beforePoint = param[0];
        var afterPoint = param[1];
        var minus = param[2];
        //文字列がnullの時はtrueを返す
        value = App.isNum(value) ? value + "" : value;
        //カンマがあったら削除
        value = value.toString();
        value = value.replace(/,/g, "");

        var isPoint = false;
        if (afterPoint > 0) {
            isPoint = true;
        }
        if (!App.isNumeric(value)) {
            return done(false);
        }
        afterPoint = parseFloat(afterPoint);
        beforePoint = parseFloat(beforePoint);

        //小数点以下の数をチェック
        var point = value.indexOf("."),
            after, before;
        if (point >= 0) {
            after = value.substring((point + 1));
            if (after.length > afterPoint) {
                return done(false);
            }
            before = value.substring(0, point);
        }
        else {
            before = value;
        }

        //整数部分から"-"を取り除く
        if (minus && before.match(/^-/)) {
            before = before.substring(1);
        }
        //整数部分のチェック
        if (before.length > beforePoint) {
            return done(false);
        }
        
        done(true);
    }, "integer {param[0]}-digit, entered in {param[1]} decimal places");

    App.validation.addMethod("date", function (value, param, opts, done) {

        if (isEmpty(value)) {
            return done(true);
        }

        value = App.isNum(value) ? value + "" : value;
        var regex = /Invalid|NaN/;
        
        done(((value || "") + "") === "" || !regex.test(new Date(value)));

    }, "a valid date");

    App.validation.addMethod("month", function (value, param, opts, done) {

        if (isEmpty(value)) {
            return done(true);
        }

        value = App.isNum(value) ? value + "" : value;
        var regex = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/;

        done(((value || "") + "") === "" || regex.test(value) && value >= 1 && value <= 12);
    
    }, "enter the month");

    /**
     * 全角のみかどうかのバリデーションを指定します。
     */
    App.validation.addMethod("zenkaku", function (value, param, opts, done) {
        value = App.isNum(value) ? value + "" : value;
        var regex = /^[^ -~｡-ﾟ]+$/;

        done(((value || "") + "") === "" || regex.test(value));

    }, "全角を入力してください");

    /**
     * 全角ひらがな･カタカナのみかどうかのバリデーションを指定します。
     */
    App.validation.addMethod("kana", function (value, param, opts, done) {

        if (isEmpty(value)) {
            return done(true);
        }

        value = App.isNum(value) ? value + "" : value;
        var regex = /^[ァ-ヶーぁ-ん]+$/;

        done(((value || "") + "") === "" || regex.test(value));

    }, "全角ひらがな･カタカナを入力してください");

    /** 
     * 全角ひらがなのみかどうかのバリデーションを指定します。
     */
    App.validation.addMethod("hiragana", function (value, param, opts, done) {

        if (isEmpty(value)) {
            return done(true);
        }

        value = App.isNum(value) ? value + "" : value;
        var regex = /^[ぁ-んー]+$/;

        done(((value || "") + "") === "" || regex.test(value));

    }, "全角ひらがなを入力してください");

    /**
     * 全角カタカナのみかどうかのバリデーションを指定します。
     */
    App.validation.addMethod("katakana", function (value, param, opts, done) {

        if (isEmpty(value)) {
            return done(true);
        }

        value = App.isNum(value) ? value + "" : value;
        var regex = /^[ァ-ヶー　]+$/;

        done(((value || "") + "") === "" || regex.test(value));

    }, "全角カタカナを入力してください");

    /**
     * 半角のみかどうかのバリデーションを指定します。
     */
    App.validation.addMethod("hankaku", function (value, param, opts, done) {

        if (isEmpty(value)) {
            return done(true);
        }

        value = App.isNum(value) ? value + "" : value;
        var regex = /^[ -~｡-ﾟ]+$/;

        done(((value || "") + "") == "" || regex.test(value));

    }, "半角を入力してください");

    /**
     * 半角文字のみで且つ半角カナが含まれていないかどうかのバリデーションを指定します。
     */
    App.validation.addMethod("haneisukigo", function (value, param, opts, done) {

        if (isEmpty(value)) {
            return done(true);
        }

        value = App.isNum(value) ? value + "" : value;
        var regex = /^[a-zA-Z0-9!-/:-@¥[-`{-~]+$/;

        done(((value || "") + "") == "" || regex.test(value));

    }, "enter the alphanumeric symbols");

    /**
     * 半角カタカナのみかどうかのバリデーションを指定します。
     */
    App.validation.addMethod("hankana", function (value, param, opts, done) {

        if (isEmpty(value)) {
            return done(true);
        }

        value = App.isNum(value) ? value + "" : value;
        var regex = /^[ｦ-ﾟ]+$/;

        done(((value || "") + "") === "" || regex.test(value));

    }, "半角カタカナを入力してください");

    /**
     * 半角アルファベット（大文字･小文字）のみかどうかのバリデーションを指定します。
     */
    App.validation.addMethod("alphabet", function (value, param, opts, done) {

        if (isEmpty(value)) {
            return done(true);
        }

        value = App.isNum(value) ? value + "" : value;
        var regex = /^[a-zA-Z\s]+$/;

        done(((value || "") + "") === "" || regex.test(value));

    }, "enter the alphabetic");

    /** 
     * 半角アルファベット（大文字･小文字）もしくは数字のみかどうかのバリデーションを指定します。
     */
    App.validation.addMethod("alphanum", function (value, param, opts, done) {

        if (isEmpty(value)) {
            return done(true);
        }

        value = App.isNum(value) ? value + "" : value;
        var regex = /^[a-zA-Z0-9]+$/;

        done(((value || "") + "") === "" || regex.test(value));

    }, "enter alphanumeric characters");

    /**
     * 郵便番号（例:012-3456）かどうかのバリデーションを指定します。
     */
    App.validation.addMethod("postnum", function (value, param, opts, done) {

        if (isEmpty(value)) {
            return done(true);
        }

        value = App.isNum(value) ? value + "" : value;
        var regex = /^\d{3}\-\d{4}$/;

        done(((value || "") + "") === "" || regex.test(value));

    }, "enter a zip code(e.g.:123-4567)");

    /**
     * 携帯番号（例:010-2345-6789）かどうかのバリデーションを指定します。
     */
    App.validation.addMethod("mobilenum", function (value, param, opts, done) {

        if (isEmpty(value)) {
            return done(true);
        }

        value = App.isNum(value) ? value + "" : value;
        var regex = /^0\d0-\d{4}-\d{4}$/;

        done(((value || "") + "") === "" || regex.test(value));

    }, "enter a mobile number (e.g.:010-2345-6789)");

    /** 
     * 電話番号（例:012-345-6789）かどうかのバリデーションを指定します。
     */
    App.validation.addMethod("telnum", function (value, param, opts, done) {

        if (isEmpty(value)) {
            return done(true);
        }

        value = App.isNum(value) ? value + "" : value;
        var regex = /^[0-9-]{12}$/;

        done(((value || "") + "") === "" || regex.test(value));

    }, "enter a phone number (e.g.:012-345-6789)");

    /** 
     * 禁則文字が含まれていないかどうかのバリデーションを指定します。
     */
    App.validation.addMethod("illegalchara", function (value, param, opts, done) {

        if (isEmpty(value)) {
            return done(true);
        }

        value = App.isNum(value) ? value + "" : value;
        var regex = /(['{]+)/;

        done(((value || "") + "") === "" || !regex.test(value));

    }, "not allowed input character has been input (e.g.:'{)");

    /** 
     * 日付文字列のバリデーションを指定します。
     */ 
    App.validation.addMethod("datestring", function (value, param, otps, done) {

        if (isEmpty(value)) {
            return done(true);
        }

        if (value === "") {
            return done(true);
        }

        if (!(/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/.test(value))) {
            return done(false);
        }

        var year = parseInt(value.substr(0, 4), 10);
        var month = parseInt(value.substr(5, 2), 10);
        var day = parseInt(value.substr(8, 2), 10);
        var inputDate = new Date(year, month - 1, day);

        done((inputDate.getFullYear() == year && inputDate.getMonth() == month - 1 && inputDate.getDate() == day));

    }, "enter in yyyy/mm/dd format");

    /** 
     * 日付文字列のバリデーションを指定します。(yyyy/mm)
     */
    App.validation.addMethod("datestringYM", function (value, param, otps, done) {

        if (isEmpty(value)) {
            return done(true);
        }

        if (value === "") {
            return done(true);
        }

        if (!(/^[0-9]{4}\/[0-9]{2}$/.test(value))) {
            return done(false);
        }

        var year = parseInt(value.substr(0, 4), 10);
        var month = parseInt(value.substr(5, 2), 10);
        var day = 1;
        var inputDate = new Date(year, month - 1, day);

        done((inputDate.getFullYear() == year && inputDate.getMonth() == month - 1 && inputDate.getDate() == day));

    }, "enter in yyyy/mm format");

    /** 
     * 指定された値より小さいかどうかのバリデーションを指定します。
     */
    App.validation.addMethod("lessdate", function (value, param, opts, done) {

        if (isEmpty(value)) {
            return done(true);
        }

        if (!value) {
            return done(true);
        }

        if (!(/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/.test(value))) {
            return done(false);
        }
        var year = parseInt(value.substr(0, 4), 10);
        var month = parseInt(value.substr(5, 2), 10);
        var day = parseInt(value.substr(8, 2), 10);
        var inputDate = new Date(year, month - 1, day);

        done(new Date(param.getFullYear(), param.getMonth(), param.getDate()) < inputDate);

    }, "enter the date of {param} after");

    /** 
     * 指定された値より大きいかどうかのバリデーションを指定します。
     */
    App.validation.addMethod("greaterdate", function (value, param, opts, done) {

        if (isEmpty(value)) {
            return done(true);
        }

        if (!value) {
            return done(true);
        }

        if (!(/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/.test(value))) {
            return done(false);
        }

        var year = parseInt(value.substr(0, 4), 10);
        var month = parseInt(value.substr(5, 2), 10);
        var day = parseInt(value.substr(8, 2), 10);
        var inputDate = new Date(year, month - 1, day);

        done(new Date(param.getFullYear(), param.getMonth(), param.getDate()) > inputDate);

    }, "enter the date of {param} previous");

    /**
     * 指定された数値と同じ文字数かどうかのバリデーションを指定します。
     */ 
    App.validation.addMethod("equallength", function (value, param, otps, done) {
        var length;

        if (isEmpty(value)) {
            return done(true);
        }

        if (!App.isNumeric(param)) {
            return done(true);
        }
        
        length = parseInt(param, 10);
        value = App.isUnusable(value) ? "" : (value + "");
        return done(value.length === length);

    }, "input {param} digits");

    /**
     * 拡張子がCSVかどうかのバリデーションを指定します。
     */
    App.validation.addMethod("csvonly", function (value, param, otps, done) {
        var length;

        if (isEmpty(value)) {
            return done(true);
        }

        var str = value.split(".");
        var extension = str[str.length - 1];
 
        return done(extension.toLowerCase() === "csv");

    }, "csv only");

})(this, App, jQuery);
