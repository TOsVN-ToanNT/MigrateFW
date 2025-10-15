/** 最終更新日 : 2018-08-07 **/
//extend jquery
(function (global, $, undef) {

    $.findP = function (value) {
        return $("[data-prop='" + (value || "") + "']");
    };

    $.fn.findP = function (value) {
        return this.find("[data-prop='" + (value || "") + "']");
    };

    /**
     * @example
     * $(":p(propvalue)")
     */
    $.expr[':'].p = $.expr.createPseudo(function (text) {
        return function (elem) {
            var value = text || "";
            if (!elem.hasAttribute("data-prop")) {
                return false;
            }
            if (value === "") {
                return true;
            }
            return elem.getAttribute("data-prop") === value;
        };
    });

})(window, jQuery);

//form
(function (global, $, undef) {

    "use strict";

    var toJSONDefaultOptions = {
            /**
            * HTML フォーム要素の値からオブジェクトへの変換を行う際の変換を定義します。
            */
            converters: {},     // 適用されるコンバーター
            omitNames: []       // オブジェクトに変換対象としない name を指定します。
        },
        toFormDefaultOptions = {
            appliers: {}
        };

    /**
     *
     * @param {DOMElement} HTML 要素
     * @param {Object} options オプション 
     * @returns {Object} 変換されたオブジェクト。
     */
    function Form(element, options) {
        this.options = $.extend(true, {}, Form.DEFAULTS, options);
        this.element = $(element);
    };

    Form.DEFAULTS = {
        converters: {},
        omitNames: [],
        appliers: {}
    };

    /**
    * data-app-formatクラス が適用されたHTML フォーム要素の値からオブジェクトへの変換を行う際の変換を定義します。
    *
    * @param {DOMElement} element HTML 要素 
    * @param {Object} defaultvalue 規定値 
    * @retunrs 変換された結果の値。無効な場合は defaultvalue。
    */
    Form.DEFAULTS.converters["data-app-format"] = function (element, defaultValue) {
        if (typeof defaultValue === "string"
                && defaultValue.match(/^\d{4}\/\d{2}\/\d{2}/)) {
            return new Date(defaultValue);
        }
        return defaultValue;
    };

    /**
    * オブジェクトから data-app-formatクラス が適用されたHTML フォーム要素の値変換を行う際の変換を定義します。
    *
    * @param {Object} value オブジェクトのプロパティ値 
    * @param {DOMElement} element HTML 要素 
    * @return 変換された結果の値。無効な場合は defaultvalue。
    */
    Form.DEFAULTS.appliers["data-app-format"] = function (value, element) {
        value = parseJsonDate(value);
        var format = element.attr("data-app-format");

        if (!App.isUndefOrNull(format) && format === "date") {
            value = App.data.getDateString(value, true);
        } else {
            value = App.data.getDateTimeString(value, true);
        }

        if (element.is(":input")) {
            element.val(value);
        } else {
            if (!App.isUndefOrNull(value)) {
                element.text(value);
            } else {
                element.text("");
            }
        }

        return true;
    };

    Form.DEFAULTS.appliers["currency-jp"] = function (value, element) {

        if (!App.isNumeric(value)) {
            return false;
        }

        var formated = "\\" + App.num.format(Number(value), "#,0");

        if (element.is(":input")) {
            element.val(formated);
        } else {
            if (!App.isUndefOrNull(formated)) {
                element.text(formated);
            } else {
                element.text("");
            }
        }

        return true;
    };

    Form.DEFAULTS.appliers["comma-number"] = function (value, element) {

        if (!App.isNumeric(value)) {
            return false;
        }

        var formated;
        if (/^-?[0-9]+$/.test(value)) {
            formated = App.num.format(Number(value), "#,0");
        }
        else {
            formated = App.num.format(Number(value), "#,0.######");
        }

        if (element.is(":input")) {
            element.val(formated);
        } else {
            if (!App.isUndefOrNull(formated)) {
                element.text(formated);
            } else {
                element.text("");
            }
        }

        return true;
    };



    if ($.datepicker) {
        /**
        * jQuery UI Datepicker が適用されたHTML フォーム要素の値からオブジェクトへの変換を行う際の変換を定義します。
        *
        * @param {DOMElement} element HTML 要素 
        * @param {Object} defaultValue 規定値 
        * @returns {Object} 変換された結果の値。無効な場合は defaultvalue。
        */
        Form.DEFAULTS.converters[$.datepicker.markerClassName] = function (element, defaultValue) {
            var date = element.datepicker("getDate");
            return typeof date === "undefined" ? null : date;
        };

        /**
        * オブジェクトから jQuery UI Datepicker が適用されたHTML フォーム要素の値変換を行う際の変換を定義します。
        *
        * @param {Object} value オブジェクトのプロパティ値 
        * @param {DOMElement} element HTML 要素 
        * @returns 変換された結果の値。無効な場合は defaultvalue。
        */
        Form.DEFAULTS.appliers[$.datepicker.markerClassName] = function (value, element) {
            if (App.isDate(value)) {
                element.datepicker("setDate", value);
                return true;
            } else if (App.isDate(parseJsonDate(value))) {
                element.datepicker("setDate", parseJsonDate(value));
                return true;
            }
            return false;
        };
    }

    Form.DEFAULTS.converters["currency-jp"] = function (element, defaultValue) {
        var val = element.val() || "";
        val = parseFloat(defaultValue.replace(/[\\|,]+/g, ''));　
        if (isNaN(val)) {
            return undefined;
        }
        return val;
    }

    Form.DEFAULTS.converters["number"] = function (element, defaultValue) {
        var val = element.val() || "";
        val = parseFloat(val);
        if (isNaN(val)) {
            return undefined;
        }
        return val;
    }

    Form.DEFAULTS.converters["comma-number"] = function (element, defaultValue) {
        var val = element.val() || "";
        val = parseFloat(val.replace(/\,/g, ""));
        if (isNaN(val)) {
            return undefined;
        }
        return val;
    }

    Form.DEFAULTS.converters["boolean"] = function (element, defaultValue) {
        var val = element.val() || "";
        val = val.toUpperCase() === "TRUE" ? true :
              val.toUpperCase() === "FALSE" ? false :
              undefined;
        return val;
    }

    Form.DEFAULTS.appliers["boolean"] = function (value, element) {
        element.val((!!value).toString().toLowerCase());
        return true;
    };

    /**
     * HTML 要素からオブジェクトへ変換します。
     */
    Form.prototype.data = function () {
        var self = this,
            $controls = self.element.find("[data-prop]").not(":button"),
            result = {},
            i, key, $control, name, value, converter;

        // HTML フォーム内のコントロールごとにオブジェクトへの変換処理を実行します。
        $.each($controls, function () {

            $control = $(this);
            name = $control.attr("data-prop");

            if (!name) {
                name = this.name;
            }

            if (!name) {
                return;
            }

            // コントロールが省略（オブジェクトへの変換を除外する）かどうかを判定します。
            // 省略される場合は処理を終了します。
            if (self.options.omitNames && $.isArray(self.options.omitNames)) {
                for (key in self.options.omitNames) {
                    if (self.options.omitNames.hasOwnProperty(key) && self.options.omitNames[key] == name) {
                        return;
                    }
                }
            }

            // コントロールが input タグかどうかを判定し値を取得します。
            value = $control.is(":input") ? $control.val() : $control.text();
            converter = $control.data("formConverter");

            if (converter in self.options.converters) {
                result[name] = self.options.converters[converter]($control, value);
                return;
            }

            // name 属性をもとに適用されるコンバーターの対象になる場合はコンバーターの変換処理を適用します。
            if (name in self.options.converters) {
                result[name] = self.options.converters[name]($control, value);
                return;
            }

            // class 属性をもとに適用されるコンバーターの対象になる場合はコンバーターの変換処理を適用します。
            var classes = $control.attr("class");
            if (classes) {
                var classNames = classes.toString().split(" ");
                for (i = 0; i < classNames.length; i++) {
                    if (classNames[i] in self.options.converters) {
                        result[name] = self.options.converters[classNames[i]]($control, value);
                        return;
                    }
                }
            }

            // コントロールが checkbox, radio の場合にはチェックされていないコントロールの値を NULL に設定します。
            if ($control.is("input:checkbox") || $control.is("input:radio")) {
                if (!this.checked) {
                    if (typeof result[name] == "undefined") {
                        result[name] = null;
                    }
                    return;
                }
            }

            // 値がから文字列の場合には NULL を設定します。
            if (value == "") {
                result[name] = null;
                return;
            }

            // コンバーターによる変換処理が適用されなかった場合には値を設定します。
            result[name] = value;
        });

        // JSON オブジェクト内に日付フォーマット文字列が含まれている場合には日付型に変換します。
        // # AJAX によるサーバーへのデータ送信処理で日付型の認識をさせるため。
        $.each(result, function (index, value) {
            if (typeof value === "string"
                && value.match(/\/Date\((-?\d*)\)\//g)) {
                result[index] = (new Function("return " + value.replace(/\/Date\((-?\d*)\)\//g, "new Date($1)")))();
            }
            // 制御文字コードをカットする
            else if (typeof value === "string"
                    && !App.isUndefOrNull(value)) {
                result[index] = value.replace(/[\x00-\x09\x0b\x0c\x0e-\x1f\x7f]/g, "");
            }
             
        });

        return result;
    };

    var setText = function (element, text) {
        element.innerText = text;
    };

    /**
     * オブジェクトのプロパティを HTML にバインドします。
     */
    Form.prototype.bind = function (data) {
        var self = this,
            $target, target, applier, classes, $control;

        if (data.__id) {
            self.element.attr("data-key", data.__id);
        }

        // オブジェクトのプロパティごとに HTML フォーム要素への値設定処理を行います。

        var props, name, value, type, tagName,
            i, ilen, j, jlen;

        for (i = 0, ilen = self.element.length; i < ilen; i++) {

            var props = self.element[i].querySelectorAll("[data-prop]");

            for (j = 0, jlen = props.length; j < jlen; j++) {

                target = props[j];

                name = target.getAttribute("data-prop");
                value = data[name];

                if (typeof value === "undefined" || value === null) {
                    continue;
                }

                type = target.getAttribute("type");
                type = !type ? "" : type.toLowerCase();

                tagName = target.tagName;
                tagName = !tagName ? "" : tagName.toLowerCase();

                $target = $(target);

                if (name in self.options.appliers) {
                    if (self.options.appliers[name](value, $target)) {
                        continue;
                    }
                }

                var isClassAppied = false;
                classes = target.getAttribute("class");
                if (classes) {
                    var classNames = classes.toString().split(" ");
                    for (var k = 0; k < classNames.length; k++) {
                        if (classNames[k] in self.options.appliers) {
                            isClassAppied = self.options.appliers[classNames[k]](value, $target);
                            if (isClassAppied) {
                                break;
                            }
                        }
                    }
                }

                if (isClassAppied) {
                    continue;
                }

                // コントロールが select の場合にはコントロールの値を設定します。
                if (tagName == "select") {
                    if ($target.text().indexOf(value) === -1) {
                        $target.val(value);
                        continue;
                    }
                }

                // コントロールが checkbox, radio の場合にはコントロールの値を設定します。
                if (type === "checkbox" || type === "radio") {
                    if (!$.isArray(value)) {
                        $target.val([value]);
                        continue;
                    }
                }

                // コントロールが input タグかどうかを判定し値を設定します。
                if (tagName === "input" || tagName === "select" || tagName === "textarea") {
                    $target.val(value);
                }
                else {
                    if (!App.isUndefOrNull(value)) {
                        setText(target, value);
                    } else {
                        setText(target, "");
                    }
                }
            }
        }

        return self;
    };

    $.fn.form = function (options) {
        return new Form(this, options);
    };

    $.fn.form.Constructor = Form;

    App.define("App.ui", {
        addFormApplier: function (name, handler) {
            Form.DEFAULTS.appliers[name] = handler;
        },
        addFormConverter: function (name, handler) {
            Form.DEFAULTS.converters[name] = handler;
        }
    });

    /**
    * JSON フォーマットの文字列を Date オブジェクトに変換します。
    *
    * @param {String} jsonDate JSON フォーマットの文字列 
    * @returns {Date} 文字列から変換された Date オブジェクト
    */
    var parseJsonDate = function (jsonDate) {

        var odataV2Date = /\/Date\((\d+)\)\//gi,
            iso8601Date = /([0-9]{4})(-([0-9]{2})(-([0-9]{2})(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?/,
            matched, time;

        if (!App.isStr(jsonDate)) {
            return null;
        }

        if (odataV2Date.test(jsonDate)) {
            return eval(jsonDate.replace(odataV2Date, "new Date($1)"));
        }

        matched = jsonDate.match(iso8601Date);

        var offset = 0;
        var date = new Date(matched[1], 0, 1);

        if (matched[3]) {
            date.setMonth(matched[3] - 1);
        }

        if (matched[5]) {
            date.setDate(matched[5]);
        }

        if (matched[7]) {
            date.setHours(matched[7]);
        }

        if (matched[8]) {
            date.setMinutes(matched[8]);
        }

        if (matched[10]) {
            date.setSeconds(matched[10]);
        }

        if (matched[12]) {
            date.setMilliseconds(Number("0." + matched[12]) * 1000);
        }

        if (matched[14]) {
            offset = (Number(matched[16]) * 60) + Number(matched[17]);
            offset *= ((matched[15] === '-') ? 1 : -1);
        }

        offset -= date.getTimezoneOffset();
        time = (Number(date) + (offset * 60 * 1000));
        date.setTime(Number(time));

        return date;
    };

    /**
    * toJSON ファンクションで利用する converter を定義します。
    */
    App.define("App.data.converters", {

    });

    /**
    * toForm ファンクションで利用する Applier を定義します。
    */
    App.define("App.data.appliers", {

    });

    App.data.parseJsonDate = parseJsonDate;

})(this, jQuery);


(function (global, App, $, undef) {

    "use strict";

    //TODO: 大半 App.obj に移動/集約するべき

    App.define("App.data", {

        /**
        * 数値の0埋めを行います。
        * @param {Number} num 0埋め前の数値 
        */
        toDoubleDigits: function (num) {
            num += "";
            if (num.length === 1) {
                num = "0" + num;
            }
            return num;
        },

        /**
        * 日付時刻文字列を取得します。
        * @param {Date} date 日付 
        * @param {Boolean} isLocal ローカル日付かどうか 
        * @return {String} 日付時刻文字列
        */
        getDateTimeString: function (date, isLocal) {

            var utc = isLocal ? "" : "UTC",
                result = date["get" + utc + "FullYear"]() + "/" +
                    App.data.toDoubleDigits(date["get" + utc + "Month"]() + 1) + "/" +
                    App.data.toDoubleDigits(date["get" + utc + "Date"]()) + " " +
                    App.data.toDoubleDigits(date["get" + utc + "Hours"]()) + ":" +
                    App.data.toDoubleDigits(date["get" + utc + "Minutes"]()) + ":" +
                    App.data.toDoubleDigits(date["get" + utc + "Seconds"]());
            return result;
        },

        /**
        * 日付文字列を取得します。
        * @param {Date} date 日付 
        * @param {Boolean} isLocal ローカル日付かどうか 
        * @returns {String} 日付文字列
        */
        getDateString: function (date, isLocal) {
            var utc = isLocal ? "" : "UTC",
                result = date["get" + utc + "FullYear"]() + "/" +
                    App.data.toDoubleDigits(date["get" + utc + "Month"]() + 1) + "/" +
                    App.data.toDoubleDigits(date["get" + utc + "Date"]());
            return result;
        },

        /**
        * クエリのフィルタ用日付文字列を取得します。
        * @param {Date} date 日付 
        * @param {Boolean} isLocal ローカル日付かどうか 
        * @returns {String} クエリのフィルタ用日付文字列
        */
        getDateTimeStringForQuery: function (date, isLocal) {

            var utc = isLocal ? "" : "UTC",
                result = date["get" + utc + "FullYear"]() + "-" +
                    App.data.toDoubleDigits(date["get" + utc + "Month"]() + 1) + "-" +
                    App.data.toDoubleDigits(date["get" + utc + "Date"]()) + "T" +
                    App.data.toDoubleDigits(date["get" + utc + "Hours"]()) + ":" +
                    App.data.toDoubleDigits(date["get" + utc + "Minutes"]()) + ":" +
                    App.data.toDoubleDigits(date["get" + utc + "Seconds"]());
            return result;
        },

        /**
        * クエリのフィルタ用日付文字列を取得します。
        * @param {Date} date 日付 
        * @param {Boolean} isLocal ローカル日付かどうか 
        * @returns {String} クエリのフィルタ用日付文字列
        */
        getDateTimeStringForQueryNoTime: function (date, isLocal) {

            var utc = isLocal ? "" : "UTC",
                result = date["get" + utc + "FullYear"]() + "-" +
                    App.data.toDoubleDigits(date["get" + utc + "Month"]() + 1) + "-" +
                    App.data.toDoubleDigits(date["get" + utc + "Date"]()) + "T00:00:00";
            return result;
        },

        /**
        * クエリのフィルタ用日付文字列（FROM)を取得します。
        * @param {Date} date 日付 
        * @param {Boolean} isLocal ローカル日付かどうか 
        * @returns {String} クエリのフィルタ用日付文字列(FROM)
        */
        getFromDateStringForQuery: function (date, isLocal) {
            var result = date["getFullYear"]() + "/" +
                    App.data.toDoubleDigits(date["getMonth"]() + 1) + "/" +
                    App.data.toDoubleDigits(date["getDate"]()) + " " +
                    "00:00:00";

            isLocal = isLocal ? true : false;
            return App.data.getDateTimeStringForQuery(new Date(result), isLocal);
        },

        /**
        * クエリのフィルタ用日付文字列（To)を取得します。
        * @param {Date} date 日付 
        * @param {Boolean} isLocal ローカル日付かどうか 
        * @returns {String} クエリのフィルタ用日付文字列(TO)
        */
        getToDateStringForQuery: function (date, isLocal) {
            var result = date["getFullYear"]() + "/" +
                    App.data.toDoubleDigits(date["getMonth"]() + 1) + "/" +
                    App.data.toDoubleDigits(date["getDate"]()) + " " +
                    "23:59:59";

            isLocal = isLocal ? true : false;
            return App.data.getDateTimeStringForQuery(new Date(result), isLocal);
        },

        /**
        * OData フォーマットの日付を Date オブジェクトで取得します。
        * @param {String} value Date(シリアル値) 形式の文字列
        * @returns {Date} 日付
        */
        getDate: function (value) {
            var result;
            if (typeof value === "string" && value.match(/\/Date\((-?\d*)\)\//g)) {
                result = (new Function("return " + value.replace(/\/Date\((-?\d*)\)\//g, "new Date($1)")))();
            }
            return result;
        },

        /**
        * 日付入力項目の5桁目と8桁目に自動でスラッシュを追加します。
        * @param e イベントオブジェクト 
        */
        addSlashForDateString: function (e) {
            if (e) {
                if (e.keyCode != "8") {
                    if (e.target.value.length == 4) e.target.value = e.target.value + "/";
                    if (e.target.value.length == 7) e.target.value = e.target.value + "/";
                }
            }
        },

        /**
        * 数値項目をカンマ区切りに変換します。
        * @param {Number} value 数値 
        * @returns {String} カンマ区切りの数値
        */
        getCommaNumberString: function (value) {
            if (!App.isNumeric(value)) {
                return value;
            }

            var result;
            if (/^-?[0-9]+$/.test(value)) {
                return App.num.format(Number(value), "#,0");
            }
            else {
                return App.num.format(Number(value), "#,0.######");
            }
        },

        /**
        * 数値項目を金額形式（カンマ、通貨マーク）にします。
        * @param {Number} value 数値 
        * @returns {String} カンマ区切りの数値
        */
        getCurrencyJpString: function (value) {
            if (!App.isNumeric(value)) {
                return value;
            }

            var formated = "\\" + App.num.format(Number(value), "#,0");
            return formated;
        },

        /**
        * 文字列から制御文字を除去します。
        * @param value 文字列 
        * @returns 制御文字を除去した文字列)
        */
        removeControlCharacter: function (value) {

            var formated = value.replace(/[\x00-\x09\x0b\x0c\x0e-\x1f\x7f]/g, "");
            return formated;
        },
        /**
        * WCF Data Services の OData システムクエリオプションを生成します。
        * @param {Object} query クエリオブジェクト 
        * @returns {String} URL 文字列
        */
        toODataFormat: function (query) {
            var parameters = [],
                p;

            for (p in query) {
                if (!query.hasOwnProperty(p) || p === "url") {
                    continue;
                }
                if (!App.isUndefOrNull(query[p]) && query[p].toString().length > 0) {
                    parameters.push("$" + p + "=" + query[p]);
                }
            }

            return query.url + "?" + parameters.join("&");
        },

        /**
        * Web API Services のクエリオプションを生成します。
        * @param {Object} query クエリオブジェクト 
        * @returns {String} URL 文字列
        */
        toWebAPIFormat: function (query) {
            var parameters = [],
                p;

            for (p in query) {
                if (!query.hasOwnProperty(p) || p === "url") {
                    continue;
                }
                if (!App.isUndefOrNull(query[p]) && query[p].toString().length > 0) {
                    parameters.push(p + "=" + query[p]);
                }
            }

            return query.url + "?" + parameters.join("&");
        },

        /**
        * 半角に変換することが可能な文字を半角に変換します
        * @param {Object} value 変換元文字列
        * @returns {String} 変換後文字列
        */
        getHankakuString : function(value) {
            // ここに文字を追加したら全角カナ用正規表現にも追加すること
            // 全角カナ以外にASCII変換のルールで変換できない文字もセットする
            var kanaMap = {
                'ガ': 'ｶﾞ', 'ギ': 'ｷﾞ', 'グ': 'ｸﾞ', 'ゲ': 'ｹﾞ', 'ゴ': 'ｺﾞ',
                'ザ': 'ｻﾞ', 'ジ': 'ｼﾞ', 'ズ': 'ｽﾞ', 'ゼ': 'ｾﾞ', 'ゾ': 'ｿﾞ', 
                'ダ': 'ﾀﾞ', 'ヂ': 'ﾁﾞ', 'ヅ': 'ﾂﾞ', 'デ': 'ﾃﾞ', 'ド': 'ﾄﾞ',
                'バ': 'ﾊﾞ', 'ビ': 'ﾋﾞ', 'ブ': 'ﾌﾞ', 'ベ': 'ﾍﾞ', 'ボ': 'ﾎﾞ',
                'パ': 'ﾊﾟ', 'ピ': 'ﾋﾟ', 'プ': 'ﾌﾟ', 'ペ': 'ﾍﾟ', 'ポ': 'ﾎﾟ',
                'ヴ': 'ｳﾞ',
                'ア': 'ｱ', 'イ': 'ｲ', 'ウ': 'ｳ', 'エ': 'ｴ', 'オ': 'ｵ',
                'カ': 'ｶ', 'キ': 'ｷ', 'ク': 'ｸ', 'ケ': 'ｹ', 'コ': 'ｺ', 
                'サ': 'ｻ', 'シ': 'ｼ', 'ス': 'ｽ', 'セ': 'ｾ', 'ソ': 'ｿ',
                'タ': 'ﾀ', 'チ': 'ﾁ', 'ツ': 'ﾂ', 'テ': 'ﾃ', 'ト': 'ﾄ',
                'ナ': 'ﾅ', 'ニ': 'ﾆ', 'ヌ': 'ﾇ', 'ネ': 'ﾈ', 'ノ': 'ﾉ',
                'ハ': 'ﾊ', 'ヒ': 'ﾋ', 'フ': 'ﾌ', 'ヘ': 'ﾍ', 'ホ': 'ﾎ',
                'マ': 'ﾏ', 'ミ': 'ﾐ', 'ム': 'ﾑ', 'メ': 'ﾒ', 'モ': 'ﾓ',
                'ヤ': 'ﾔ', 'ユ': 'ﾕ', 'ヨ': 'ﾖ',
                'ラ': 'ﾗ', 'リ': 'ﾘ', 'ル': 'ﾙ', 'レ': 'ﾚ', 'ロ': 'ﾛ',
                'ワ': 'ﾜ', 'ヲ': 'ｦ', 'ン': 'ﾝ',
                'ァ': 'ｧ', 'ィ': 'ｨ', 'ゥ': 'ｩ', 'ェ': 'ｪ', 'ォ': 'ｫ',
                'ッ': 'ｯ', 'ャ': 'ｬ', 'ュ': 'ｭ', 'ョ': 'ｮ',
                '。': '｡', '、': '､', 'ー': 'ｰ', '「': '｢', '」': '｣',
                '・': '･', '゛': 'ﾞ', '゜': 'ﾟ', '”': '"', '’': '\'',
                '￥' : '\\', '／': '/'
            };
        
            // ひらがなを全角カナに変換
            var result = value.replace(/[\u3041-\u3096]/g, function (match) {
                var chr = match.charCodeAt(0) + 0x60;
                return String.fromCharCode(chr);
            });

            // 全角カナを半角カナに変換
            result = result.replace(/[ァ-ン。、ー「」・゛゜”’￥／]/g, function (match) {
                return kanaMap[match];
            });

            // 全角ＡＳＣＩＩを半角ＡＳＣＩＩに変換
            result = result.replace( /[Ａ-Ｚａ-ｚ０-９－！”＃＄％＆（）＝＜＞，．？＿［］｛｝＠＾～｜＊＋]/g, function(s) {
                return String.fromCharCode(s.charCodeAt(0) - 65248);
            });
            return result;
        },

        /**
         * ある文字で区切られた検索条件から、論理積/論理和条件を作成します
         * 区切り文字がスペースの場合に限り、全半角関係なく区切ります
         * @param {String} fieldName 検索対象フィールド名
         * @param {String} criteria 検索文字列
         * @param {Object} options 変換オプション
         * @param {String} options.delimiter 区切り文字(省略時はスペース)
         * @param {Boolean} options.isOR 論理和フラグ（true：論理和条件、falseまたは省略時：論理積条件）
         * @param {Boolean} options.isStrict true：完全一致検索、falseまたは省略時：あいまい検索
         * @param {Boolean} options.isNumber true：数値用検索文字列作成、falseまたは省略時：文字列用検索文字列作成
         * @return {String} 変換された文字列
         */
        getComposedFilter : function (fieldName, criteria, options) {

            var defaultOptions = {
                    delimiter: " "
                    , isOR: false
                    , isStrict: false
                    , isNumber: false
                },
                settings = $.extend(true, {}, defaultOptions, options),
                joinString = settings.isOR ? " or " : " and ",
                result;
            // 区切り文字が省略されている場合もしくは、全角スペースの場合は区切り文字を半角スペースにする
            settings.delimiter = !App.isUndefOrNull(settings.delimiter)
                                    && settings.delimiter.length > 0
                                    && settings.delimiter !== "　" ? settings.delimiter : " ";

            if (!App.isUndefOrNull(criteria) && criteria.length > 0) {
                // 区切り文字がスペースの場合、検索文字列のスペースを半角に統一する
                criteria = settings.delimiter === " " ? criteria.replace(/　/g, " ") : criteria;

                var criteriaList = criteria.split(settings.delimiter),
                    wrapString = settings.isNumber ? "" : "'",
                    subFilters = [],
                    filterString;

                for (var i = 0; i < criteriaList.length; i++) {
                    if (!App.isUndefOrNull(criteriaList[i]) && criteriaList[i].length > 0) {
                        // あいまい検索判断。数値項目の場合、常に完全一致検索を行う
                        filterString = settings.isStrict || settings.isNumber ?
                            fieldName + " eq " + wrapString + encodeURIComponent(criteriaList[i]) + wrapString
                            : "substringof(" + wrapString + encodeURIComponent(criteriaList[i]) + wrapString + ", " + fieldName + ") eq true";
                        subFilters.push(filterString);
                    }
                }

                result = subFilters.join(joinString);
            }
            else {
                result = criteria;
            }
            return result;
        }


    });

})(this, App, jQuery);

//ddlmenu
(function (global, $, undef) {

    "use strict";

    var ddlmenu = App.define("App.ui.ddlmenu", {

        setting: {},
        isShowed: false,
        context: {},
        settings: function (lang, title, setting) {
            ddlmenu.settingsObj[lang] = {
                title: title,
                setting: setting
            };
        },

        settingsObj: {},

        setup: function (lang, role, container, baseUrl) {

            var base = baseUrl.replace(/\/$/, "");

            ddlmenu.setting = ddlmenu.settingsObj[lang] || { setting: [], title: "" };

            role = App.ifUndefOrNull(role, "");

            var root = createTopElement(ddlmenu.setting.setting || [], 1001, role, base);

            $(container).append(root);
        }
    });

    var isVisibleRole = function (item, role) {

        var visible = false,
            i;

        if (!item.visible) {
            return true;
        }

        // visible が "*" 以外の文字列で指定されていて、 role と一致しない場合は表示しない
        if (App.isStr(item.visible) && item.visible !== "*" && item.visible !== role) {
            return visible;
        }
            // visible が 配列で role とどれも一致しない場合は表示しない
        else if (App.isArray(item.visible)) {

            for (i = 0; i < item.visible.length; i++) {
                if (item.visible[i] === role) {
                    visible = true;
                    break;
                }
            }

            return visible;
        }
            // visible が 関数で戻り値が false の場合は表示しない
        else if (App.isFunc(item.visible)) {
            return item.visible(role);
        }

        return true;
    };

    var createTopElement = function (items, zIndex, role, baseUrl) {

        var ul = $('<ul class="nav navbar-nav"></ul>'),
            li,
            i,
            item;

        for (i = 0; i < items.length; i++) {

            item = items[i];
            if (!isVisibleRole(item, role)) {
                continue;
            }

            li = $("<li></li>");

            if (item.items && item.items.length) {
                li.append("<a class='dropdown-toggle' data-toggle='dropdown' href='" + (item.url ? baseUrl + item.url : "#") + "'>" + item.display + "<b class='caret'></b></a>");
                var ddl = $('<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu"></ul>');
                createItemsElement(ddl, item.items, zIndex, role, baseUrl);
                li.append(ddl);
                li.addClass("dropdown");
            }
            else if (item.url) {
//                li.append("<a href='" + baseUrl + item.url + "'>" + item.display + "</a>");
                var $node = $("<a href='" + baseUrl + item.url + "'>" + item.display + "</a>");
                li.append($node);

                if (App.isFunc(item.click)) {
                    $node.on("click", item.click);
                }
            }

            ul.append(li);
        }

        return ul;
    };

    var createItemsElement = function (ul, items, zIndex, role, baseUrl) {

        var li,
            i, len,
            item;

        for (i = 0, len = items.length; i < len; i++) {

            item = items[i];
            if (!isVisibleRole(item, role)) {
                continue;
            }

            li = $("<li role='presentation'></li>");
            ul.append(li);

            if (item.items && item.items.length) {
                li.addClass("dropdown-header");
                li.text(item.display);

                createItemsElement(ul, item.items, zIndex, role, baseUrl);

                ul.append("<li role='presentation' class='divider'></li>");
            }
            else if (item.url) {
                var $node = $("<a href='" + baseUrl + item.url + "'>" + item.display + "</a>");
                li.append($node);

                if (App.isFunc(item.click)) {
                    $node.on("click", item.click);
                }
            }
        }

        return ul;
    };

})(this, jQuery);

//portalmenu
(function (global, $, undef) {

    "use strict";

    var portalmenu = App.define("App.ui.portalmenu", {

        setting: {},
        isShowed: false,
        context: {},
        settings: function (lang, title, setting) {
            portalmenu.settingsObj[lang] = {
                title: title,
                setting: setting
            };
        },

        settingsObj: {},

        setup: function (lang, role, container, baseUrl, path) {

            var base = baseUrl.replace(/\/$/, "");
            var settingPath = App.isUndefOrNull(path) ? App.ui.ddlmenu.settingsObj[lang] : path[lang];

            portalmenu.setting = settingPath || { setting: [], title: "" };

            role = App.ifUndefOrNull(role, "");

            var root = createTopElement(portalmenu.setting.setting || [], 1001, role, base);

            $(container).append(root);
        }
    });

    var isVisibleRole = function (item, role) {

        var visible = false,
            i;

        if (!item.visible) {
            return true;
        }

        // visible が "*" 以外の文字列で指定されていて、 role と一致しない場合は表示しない
        if (App.isStr(item.visible) && item.visible !== "*" && item.visible !== role) {
            return visible;
        }
            // visible が 配列で role とどれも一致しない場合は表示しない
        else if (App.isArray(item.visible)) {

            for (i = 0; i < item.visible.length; i++) {
                if (item.visible[i] === role) {
                    visible = true;
                    break;
                }
            }

            return visible;
        }
            // visible が 関数で戻り値が false の場合は表示しない
        else if (App.isFunc(item.visible)) {
            return item.visible(role);
        }

        return true;
    };

    var createTopElement = function (items, zIndex, role, baseUrl) {

        var row = $('<div class="menucontainer"><div class="row"></div></div>'),
            colWidth,
            i,
            topRow, topItem, topNode,
            item;

        for (i = 0; i < items.length; i++) {

            colWidth = (12 / items.length) < 6 ? 6 : 12;

            item = items[i];
            if (!isVisibleRole(item, role)) {
                continue;
            }

            topRow = $('<div class="col-sm-6 col-md-' + colWidth + '">');
            topItem = $('<div class="menu-control-success"></div>');
            topNode = $('<a href="' + (item.url ? baseUrl + item.url : "#") + '" class="btn btn-xs menu-item">' + item.display + '</a>');

            if (App.isFunc(item.load)) {
                item.load(topNode);
            }

            if (App.isFunc(item.click)) {
                topNode.on("click", item.click);
            } else if (item.url) {
                topNode.on("click", function () {
                    document.location.href = $(this).attr("href");
                    return false;
                });
            }

            topItem.append(topNode);

            if (item.items && item.items.length) {
                var childRow = $('<div class="row  menu-child-row">').css("padding-left", 15);
                createItemsElement(childRow, item.items, zIndex, role, baseUrl);
                topItem.append(childRow);
            }

            topRow.append(topItem);
            row.append(topRow);

        }

        return row;
    };

    var createItemsElement = function (childRow, items, zIndex, role, baseUrl) {

        var childItem, childNode,
            i, len,
            item;

        for (i = 0, len = items.length; i < len; i++) {

            item = items[i];
            if (!isVisibleRole(item, role)) {
                continue;
            }

            if (item.url) {
                childItem = $('<div class="menu-control-label col-md-12 menu-child-item"></div>');
            } else {
                childItem = $('<div class="menu-child-control-success col-md-12 "></div>');
            }

            if (item.items && item.items.length) {
                var grandChildRow = $('<div class="row  menu-child-row">').css("padding-left", childRow.css("padding-left")).css("padding-right", 0);
                createItemsElement(grandChildRow, item.items, zIndex, role, baseUrl);
                childItem.append(grandChildRow);
            }

            childNode = $('<a href="' + (item.url ? baseUrl + item.url : "#") + '" class="btn btn-xs menu-item">' + item.display + '</a>');
            if (App.isFunc(item.load)) {
                item.load(childNode);
            }

            if (App.isFunc(item.click)) {
                childNode.on("click", item.click);
            } else if (item.url) {
                childNode.on("click", function () {
                    document.location.href = $(this).attr("href");
                    return false;
                });
            }


            childItem.prepend(childNode);
            childRow.append(childItem);
        }

        return childRow;
    };

})(this, jQuery);

//treemenu
(function (global, $, undef) {

    "use strict";

    var treemenu = App.define("App.ui.treemenu", {

        setting: {},
        isShowed: false,
        context: {},
        settings: function (lang, title, setting) {
            treemenu.settingsObj[lang] = {
                title: title,
                setting: setting
            };
        },

        settingsObj: {},

        setup: function (lang, role, container, baseUrl, path) {

            var base = baseUrl.replace(/\/$/, "");
            var settingPath = App.isUndefOrNull(path) ? App.ui.ddlmenu.settingsObj[lang] : path[lang];

            treemenu.setting = settingPath || { setting: [], title: "" };

            role = App.ifUndefOrNull(role, "");

            var root = createElement(null, treemenu.setting.setting || [], 1001, role, base);

            $(container).append(root);

            $(container).find("li").click(function () {
                var self = $(this);
                var icon = self.children("div").children("a").children("i:visible");
                icon.toggleClass("icon-minus icon-plus");
                icon.closest("li").children("ul").slideToggle();

                document.location = self.children("div").children("a").attr("href");

                return false;
            });
        }
    });

    var isVisibleRole = function (item, role) {

        var visible = false,
            i;

        if (!item.visible) {
            return true;
        }

        // visible が "*" 以外の文字列で指定されていて、 role と一致しない場合は表示しない
        if (App.isStr(item.visible) && item.visible !== "*" && item.visible !== role) {
            return visible;
        }
            // visible が 配列で role とどれも一致しない場合は表示しない
        else if (App.isArray(item.visible)) {

            for (i = 0; i < item.visible.length; i++) {
                if (item.visible[i] === role) {
                    visible = true;
                    break;
                }
            }

            return visible;
        }
            // visible が 関数で戻り値が false の場合は表示しない
        else if (App.isFunc(item.visible)) {
            return item.visible(role);
        }

        return true;
    };

    var createElement = function (elem, items, zIndex, role, baseUrl) {

        var ul,
            li,
            i,
            item,
            node,
            div,
            minusicon = "<i class='icon-minus' style='margin-right:5px;'></i>";

        if (elem == null) {
            ul = $('<ul class="col-md-12 " ></ul>');
        } else {
            ul = elem;
        }
        ul.css("padding-left", 15);

        for (i = 0; i < items.length; i++) {

            item = items[i];
            if (!isVisibleRole(item, role)) {
                continue;
            }

            li = $("<li></li>");
            div = $("<div class='menu-control-label menu-child-item'></div>");
            node = $("<a class='btn btn-xs menu-item' href='" + (item.url ? baseUrl + item.url : "#") + "'>" + item.display + "</a>");

            if (App.isFunc(item.load)) {
                item.load(node);
            }
            if (App.isFunc(item.click)) {
                node.on("click", item.click);
            } else if (item.url) {
                node.on("click", function () {
                    document.location.href = $(this).attr("href");
                    return false;
                });
            }

            if (item.items && item.items.length) {
                node.prepend(minusicon);
                node.appendTo(div);
                li.append(div);
                var childmenu = $('<ul class="menu-child-row" ></ul>');
                li.append(childmenu);
                li.children("div").removeClass("menu-control-label").removeClass("menu-child-item").addClass("menu-child-control-success");
                createElement(childmenu, item.items, zIndex, role, baseUrl);
            }
            else if (item.url) {
                node.appendTo(div);
                li.append(div);
            }

            ul.append(li);
        }

        return ul;
    };


})(this, jQuery);

//pagedata
(function (global, $, undef) {

    "use strict";

    var pagedata = App.define("App.ui.pagedata"),
        settings = {
            defaultLangSetting: void 0,
            langSettings: {},
            defaultValidationSetting: void 0,
            validationSettings: {},
            defaultOperationSetting: void 0,
            operationSettings: {}
        },
        setup = function (defSettingName, settingsName, lang, setting) {
            var newSetting;
            if (arguments.length === 2) {
                return settings[defSettingName];
            } else if (arguments.length === 3) {
                if (App.isStr(lang)) {
                    return settings[settingsName][lang];
                } else {
                    settings[defSettingName] = lang;
                    return lang;
                }
            } else if (arguments.length === 4) {
                newSetting = $.extend({}, settings[settingsName][lang] || {}, setting);
                settings[settingsName][lang] = newSetting;
                return newSetting;
            }
        };


    pagedata.lang = function (lang, setting) {
        return setup.apply(null, ["defaultLangSetting", "langSettings"].concat(Array.prototype.slice.call(arguments)));
    };
    pagedata.validation = function (lang, setting) {
        return setup.apply(null, ["defaultValidationSetting", "validationSettings"].concat(Array.prototype.slice.call(arguments)));
    };
    pagedata.validation2 = function (lang, setting) {
        return setup.apply(null, ["defaultValidationSetting", "validationSettings"].concat(Array.prototype.slice.call(arguments)));
    };
    pagedata.operation = function (lang, setting) {
        return setup.apply(null, ["defaultOperationSetting", "operationSettings"].concat(Array.prototype.slice.call(arguments)));
    };

    pagedata.lang.applySetting = function (lang, root) {
        var setting = $.extend({}, settings.defaultLangSetting || {}, settings.langSettings[lang] || {}),
            namedElems = root ? $(root).find("[name]") : $("[name]"),
            textElems = root ? $(root).find("[data-app-text]") : $("[data-app-text]"),
            appliedTextElems = $(),
            p, i, l, targetElem, targetElemItem, text, attrVal,
            removeChildTextNode = function (node) {
                var children, i, l;
                node = node[0];
                for (i = 0, l = node.childNodes.length; i < l; i++) {
                    if (node.childNodes[i] && node.childNodes[i].nodeType === 3) { //TextNode
                        node.removeChild(node.childNodes[i]);
                    }
                }
            },
            applyText = function (elem, text, attr) {
                elem = $(elem);
                text = App.ifUndefOrNull(text, "");
                if (attr) {
                    elem.attr(attr, text);
                } else {
                    attr = elem.is("input, select, textarea") ? "value" : "text";
                    if (attr === "text") {
                        if (elem.children().length > 0) {
                            removeChildTextNode(elem);
                            elem.append(document.createTextNode(text));
                        } else {
                            elem.text(text);
                        }
                    } else if (attr === "value") {
                        elem.val(text);
                    }
                }
            };

        for (p in setting) {
            if (!setting.hasOwnProperty(p)) {
                continue;
            }
            //プロパティ名に一致する data-app-text 属性の値を持つ要素と
            //name の値が一致して、かつ data-app-text 属性を持たない要素
            targetElem = textElems.filter("[data-app-text='" + p + "']"); //.add(namedElems.filter("[name='" + p + "']").not("[data-app-text]")); 
            appliedTextElems = appliedTextElems.add(targetElem);
            for (i = 0, l = targetElem.length; i < l; i++) {
                applyText(targetElem[i], setting[p].text);
            }
        }
        targetElem = textElems.not(appliedTextElems);
        for (i = 0, l = targetElem.length; i < l; i++) {
            targetElemItem = $(targetElem[i]);
            attrVal = App.ifUndefOrNull(targetElemItem.attr("data-app-text"), "").split(":");
            if (attrVal.length > 1) {
                applyText(targetElem[i], setting[attrVal[1]] ? setting[attrVal[1]].text : "", attrVal[0]);
            } else {
                applyText(targetElem[i], setting[attrVal[0]] ? setting[attrVal[0]].text : "");
            }
        }

        //title 要素は属性を持てないため、_pageTitle というプロパティは固定的にウィンドウタイトルとして設定する
        if (setting["_pageTitle"]) {
            document.title = App.ifUndefOrNull(setting["_pageTitle"].text, "");
        }

    };

    pagedata.operation.applySetting = function (role, lang, root) {
        var setting = $.extend(true, {}, settings.defaultOperationSetting || {}, settings.operationSettings[lang] || {}),
            namedElems = root ? $(root).find("[name]") : $("[name]"),
            opElems = root ? $(root).find("[data-app-operation]") : $("[data-app-operation]"),
            p, i, l, targetElem, targetElemItem, item,
            pWith, type, key, child;

        for (p in setting) {
            if (!setting.hasOwnProperty(p)) {
                continue;
            }
            item = setting[p][role];
            if (!item) {
                continue;
            }

            pWith = p.split(":");
            type = "";
            child = "";
            if (pWith.length > 1) {
                type = pWith[0];
                p = pWith[1];
            }
            pWith = p.split(".");
            if (pWith.length > 1) {
                p = pWith[0];
                child = pWith[1];
            }

            targetElem = opElems.filter("[data-app-operation='" + p + "']").add(namedElems.filter("[name='" + p + "']").not("[data-app-operation]"));
            for (i = 0, l = targetElem.length; i < l; i++) {
                targetElemItem = $(targetElem[i]);
                if (type === "grid") { //grid only
                    if (!child) continue;
                    if ("enable" in item) {
                        targetElemItem.jqGrid("setColProp", child, {
                            editable: !!item.enable
                        });
                    }
                    if ("visible" in item) {
                        targetElemItem.jqGrid(item.visible ? "showCol" : "hideCol", child);
                    }
                } else {
                    if ("enable" in item) {
                        if (item.enable) {
                            targetElem.removeAttr("disabled");
                        } else {
                            targetElem.attr("disabled", "disabled");
                        }
                    }
                    if ("visible" in item) {
                        if (item.visible) {
                            targetElemItem.show();
                        } else {
                            targetElemItem.css("display", "none");
                        }
                    }
                }
            }
        }
    };
})(this, jQuery);

//notify
(function (global, $, undef) {

    "use strict";

    var notify = App.define("App.ui.notify"),
        alertNotifySetting = {
            containerClass: "alert-notify",
            textContainerClass: "alert-notify-text",
            labelClass: "error",
            clickableClass: "alert-clickable",
            targetElemData: "alert-target",
            targetElemClass: "error",
            defaultTimeout: 0
        },
        infoNotifySetting = {
            containerClass: "info-notify",
            textContainerClass: "info-notify-text",
            labelClass: "info",
            clickableClass: "info-clickable",
            targetElemData: "info-target",
            targetElemClass: "info",
            defaultTimeout: 3000
        },
        warnNotifySetting = {
            containerClass: "warn-notify",
            textContainerClass: "warn-notify-text",
            labelClass: "warn",
            clickableClass: "warn-clickable",
            targetElemData: "warn-target",
            targetElemClass: "warn",
            defaultTimeout: 0
        },
        setupSlideUpMessage = function (root, opts, notifySetting) {
            var root = $(root ? root : document.body),
                container, bodyContainer, footerContent,
                messagesContainer,
                clearTimeoutId = 0,
                notifyObj,
                titleHolder = $("<div class='notify-title-holder'>" +
                    "<div class='notify-title-open' style='display:inline-block;'><i class='icon-chevron-down'></i></div>" +
                    "<div class='notify-title-close' style='display:none;'><i class='icon-chevron-up'></i></div>" +
                    "<p class='notify-title-message-length badge' style='display:inline-block;'></p>" +
                    "<p class='notify-title-message' style='display:inline-block;'></p>" +
                    "</div>"),
                settings = {
                    container: "<div class='notify " + notifySetting.containerClass + "' style='display:none;'><ul></ul></div>",
                    messagesContainerQuery: "ul",
                    textContainer: "<li class='" + notifySetting.textContainerClass + "'></li>",
                    show: function () { },
                    clear: function () { }
                },
                closeButton = titleHolder.find(".notify-title-close"),
                openButton = titleHolder.find(".notify-title-open"),
                titleMessageLength = titleHolder.find(".notify-title-message-length"),
                hasTitle = false;

            settings = $.extend({}, settings, opts);
            container = $(settings.container);
            bodyContainer = $(settings.bodyContainer? settings.bodyContainer : ".wrap");
            footerContent = settings.footerContent? $(settings.footerContent) : "";

            titleHolder.insertBefore(container.children(":first"));
            if (container.attr("title")) {
                titleHolder.find(".notify-title-message").text(container.attr("title"));
                hasTitle = true;
                container.attr("title", "");
            }
            messagesContainer = container.find(settings.messagesContainerQuery);
            if (container.parent().length < 1) {
                root.append(container);
            }

            titleHolder.on("click", function () {
                if (closeButton.css("display") === "none") {
                    messagesContainer.hide();
                    closeButton.css("display", "inline-block");
                    openButton.css("display", "none");
                } else {
                    messagesContainer.show();
                    closeButton.css("display", "none");
                    openButton.css("display", "inline-block");
                }
                adjustBodyBottom();
            });

            var adjustBodyBottom = function () {
                var bottom = (footerContent? footerContent.outerHeight() : 0) + 15;
                if (container.parent().find("." + alertNotifySetting.labelClass).length
                    || container.parent().find("." + warnNotifySetting.labelClass).length) {
                    bottom += container.parent().height();
                }
                
                bodyContainer.css("padding-bottom", bottom);
            };

            notifyObj = {
                message: function (text, unique) {
                    var textElem, self = this;

                    //jquery を解除
                    if (unique && unique.jquery) {
                        unique = unique[0];
                    }

                    if (unique) {
                        messagesContainer.children().each(function (index, elem) {
                            var current = $(elem),
                                target = current.data(notifySetting.targetElemData);
                            if ((unique.nodeType && unique == target) || unique === target) {
                                current.off("click");
                                current.children().text(text);
                                textElem = current;
                            }
                        });
                    }

                    if (!textElem) {
                        textElem = $(settings.textContainer),
                        textElem.append("<pre class='" + notifySetting.labelClass + "'></pre>");
                        textElem.children().text(text);
                        messagesContainer.append(textElem);
                    }

                    if (unique) {
                        //if(unique.nodeType){ //if HTMLElement
                        textElem.addClass(notifySetting.clickableClass);
                        textElem.css("cursor", "pointer");
                        textElem.on("click", function () {
                            var arg = {
                                unique: unique,
                                handled: false
                            };
                            var a = $(self).trigger("itemselected", [arg]);
                            if (unique.nodeType && !arg.handled && $(unique).is(':visible') && $(unique).not(':disabled')) {
                               unique.focus();
                            }
                        });
                        $(unique).addClass(notifySetting.targetElemClass);
                        //}
                        textElem.data(notifySetting.targetElemData, unique);
                    }
                    if (hasTitle) {
                        titleMessageLength.text(messagesContainer.children().length)
                    }

                    return notifyObj;
                },

                show: function (timeout) {
                    timeout = timeout ? timeout : notifySetting.defaultTimeout;

                    if (messagesContainer.children().length > 0) {
                        container.show("slide", { direction: "down" }, 500);
                    }

                    if (clearTimeoutId !== 0) {
                        clearTimeout(clearTimeoutId);
                    }
                    clearTimeoutId = 0;

                    if (timeout > 0) {
                        clearTimeoutId = setTimeout(function () {
                            notifyObj.clear(true);
                        }, timeout);
                    }

                    if (App.isFunc(settings.show)) {
                        settings.show();
                    }
                    adjustBodyBottom();

                    return notifyObj;
                },

                remove: function (unique) {

                    //jquery を解除
                    if (unique && unique.jquery) {
                        unique = unique[0];
                    }

                    messagesContainer.children().each(function (index, elem) {
                        var current = $(elem),
                            target = current.data(notifySetting.targetElemData);
                        if (unique) {
                            if ((unique.nodeType && unique == target)) {
                                current.css("cursor", "default");
                                current.off("click");
                                $(unique).removeClass(notifySetting.targetElemClass);
                            }
                            if ((unique.nodeType && unique == target) || unique === target) {
                                current.remove();
                            }
                        } else if (App.isUndef(target)) {
                            current.remove();
                        }
                    });

                    if (hasTitle) {
                        titleMessageLength.text(messagesContainer.children().length)
                    }

                    if (messagesContainer.children().length < 1) {
                        messagesContainer.empty();
                        container.hide();
                        messagesContainer.show();
                        if (App.isFunc(settings.clear)) {
                            settings.clear();
                        }
                    }
                    adjustBodyBottom();

                    return notifyObj;
                },

                clear: function (useAnime) {
                    messagesContainer.children().each(function (index, elem) {
                        var target = $($(elem).data(notifySetting.targetElemData));
                        target.removeClass(notifySetting.targetElemClass);
                    });

                    if (useAnime) {
                        container.hide("slide", { direction: "down" }, 200, function () {
                            messagesContainer.empty();
                            messagesContainer.show();
                            adjustBodyBottom();
                        });
                    } else {
                        messagesContainer.empty();
                        container.hide();
                        messagesContainer.show();
                        adjustBodyBottom();
                    }
                    if (App.isFunc(settings.clear)) {
                        settings.clear();
                    }

                    return notifyObj;
                },

                count: function () {
                    return messagesContainer.children().length;
                }
            };
            return notifyObj;
        };

    /** 
    * 情報メッセージを表示する機能を提供します。
    * 戻りで返されるオブジェクトは message / show / clear メソッドをもち、メッセージの追加、表示、削除と非表示を制御します。 
    * 
    * @param {String} title タイトル 
    * @param {String} subtitle サブタイトル 
    * @return {Object} 情報メッセージを表示するためのオブジェクト
    */
    notify.info = function (root, opts) {
        return setupSlideUpMessage(root, opts, infoNotifySetting);
    };

    /**
    * 警告メッセージを表示する機能を提供します。 
    * 戻りで返されるオブジェクトは message / show / clear メソッドをもち、メッセージの追加、表示、削除と非表示を制御します。
    * 
    * @param title タイトル 
    * @param subtitle サブタイトル 
    * @return {Object} 警告メッセージを表示するためのオブジェクト
    */
    notify.warn = function (root, opts) {
        return setupSlideUpMessage(root, opts, warnNotifySetting);
    };

    /**
    * 警告メッセージを表示する機能を提供します。 
    * 戻りで返されるオブジェクトは message / show / clear メソッドをもち、メッセージの追加、表示、削除と非表示を制御します。
    * 
    * @param title タイトル 
    * @param subtitle サブタイトル 
    * @return {Object} 警告メッセージを表示するためのオブジェクト
    */
    notify.alert = function (root, opts) {
        return setupSlideUpMessage(root, opts, alertNotifySetting);
    };

})(this, jQuery);

// loading
(function (global, $, undef) {

    "use strict";

    /** 
    * データ取得など長時間にわたって行われる処理の間に表示するローディングを定義します。
    */
    var loading = App.define("App.ui.loading");

    /** 
    * ローディングを表示します。
    * 
    * @param {String} message 表示するメッセージ
    * @param {String} target 表示する要素。指定されていない場合は body 要素が利用されます。
    */
    loading.show = function (message, target) {

        var place = !!target ? $(target) : $(global.document.body),
            loading = place.children(".loading"),
            container, overlay, info,
            position = place.css("position");

        message = App.isUnusable(message) ? "" : message;

        if (loading.length > 0) {
            loading.find(".loading-message").text(message);
            return;
        }

        if (position) {
            place.css("position", "relative");
        }
        container = $("<div class='loading' style='position:" + (!!target ? "absolute" : "fixed") + "; top:0; right:0; bottom:0; left: 0; z-index:100000;'></div>");
        overlay = $("<div class='loading-overlay' style='width: 100%; height: 100%;'></div>");
        info = $("<div class='loading-holder' style='overflow: hidden;position:absolute;'><div class='loading-image'></div><div class='loading-message' unselectable='on'>" + message + "</div></div>");
        container.append(overlay);
        container.append(info);
        place.append(container);
        info.css("top", "50%");
        info.css("margin-top", -info.outerHeight() / 2);
    };

    /** 
    * ローディングのメッセージを設定します。 
    * 
    * @param {String} message 表示するメッセージ 
    * @param {String} target ローディングが表示されている要素。指定されていない場合は body 要素が利用されます。 
    */
    loading.message = function (message, target) {
        var place = !!target ? $(target) : $(global.document.body),
            loading = place.children(".loading");
        if (loading.length > 0) {
            loading.find(".loading-message").text(App.isUnusable(message) ? "" : message);
            return;
        }
    };

    /**
    * ローディングを閉じます。 
    * 
    * @param {String} target ローディングが表示されている要素。指定されていない場合は body 要素が利用されます。 
    */
    loading.close = function (target) {
        var place = !!target ? $(target) : $(global.document.body),
            loading = place.children(".loading");
        loading.remove();
    };

})(this, jQuery);

/* page */
(function (global, App, $, undef) {

    "use strict";

    var page = App.define("App.ui.page");

    /**
     * HTML ページのメッセージ通知処理を初期化します。
     *
     * @param {Object} info 情報メッセージの表示処理
     * @param {Object} alert エラーメッセージの表示処理
     */
    page.setNotify = function (info, alert, warn) {
        page.notifyInfo = info;
        page.notifyAlert = alert;
        page.notifyWarn = warn;
    };

    var slice = Array.prototype.slice,
        hasDontEnumBug = (function () {
            for (var key in { "toString": null }) {
                return false;
            }
            return true;
        })(),
        dontEnums = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor"
        ],
        dontEnumsLength = dontEnums.length,
        hasOwnProperty = Object.prototype.hasOwnProperty;

    function ObjectKeys(value) {
        var keys = [],
            i = 0, l = dontEnumsLength, dontEnum;

        if ((typeof value != "object" && typeof value != "function") || value === null) {
            throw new TypeError("Object.keys called on a non-object");
        }


        for (var key in value) {
            if (hasOwnProperty.call(value, key)) {
                keys.push(key);
            }
        }

        if (hasDontEnumBug) {
            for (; i < l; i++) {
                dontEnum = dontEnums[i];
                if (hasOwnProperty.call(value, dontEnum)) {
                    keys.push(dontEnum);
                }
            }
        }
        return keys;
    };
    //IE8でObject.keysがundefinedになってしまう対応
    if (!Object.keys) {
        Object.keys = ObjectKeys;
    }

    function getMime(err) {
        var contentType, mime;

        if (!err.getResponseHeader) {
            return;
        }
        contentType = err.getResponseHeader("content-type");
        return contentType ? contentType.split(";")[0] : contentType;
    }

    function buildErrorObj(err, message, type, level) {
        return {
            message: message,
            rawText: err.responseText,
            status: err.status,
            statusText: err.statusText,
            response: err,
            type: type,
            level: level
        }
    }
    //レスポンスがHTMLだった場合
    function createNormalizedErrorByHtml(err) {
        var mime = getMime(err),
            status = err.status,
            html = err.responseText,
            message = "";

        if (mime !== "text/html") {
            return;
        }
        if (status === 404) {
            return buildErrorObj(err,
                "サービスが見つからないため、アクセスできません。管理者に問い合わせてください。",
                "notfound", "critical");
        }
        if (status === 500) {
            //h1要素に設定されてる文字列を取得する
            message = html.match(/\<H1\>(.+)\</i);
            message = (message && message.length > 1) ? message[1] : undefined;
            if (!message) {
                //取得できなかった場合は title 要素を取得する
                message = html.match(/\<title\>(.*)\<\/title\>/i);
                message = (message && message.length > 1) ? message[1] : undefined;
            }
            if (!message) {
                message = "サーバーで予期しないエラーが発生しました。管理者に問い合わせてください。";
            }
            return buildErrorObj(err, message,
                    "servererror", "critical");
        }
    }
    //レスポンスがJSONで409だった場合
    function createNormalizedConflictError(err) {
        var json = err.responseJSON,
            status = err.status,
            message,
            result = buildErrorObj(err,
                "",
                "conflict", "critical");
        if (!json || status !== 409) {
            return;
        }

        result.message = App.messages.base.MS0009;

        return result;
    }

    function createNormalizedNotFoundErrorByJson(err) {
        var json = err.responseJSON,
                    status = err.status,
                    message,
                    result = buildErrorObj(err,
                        "サービスが見つからないため、アクセスできません。管理者に問い合わせてください。",
                        "notfound", "critical");
        if (!json || status !== 404) {
            return;
        }

        if (json.message) {
            //web api
            result.message = json.message;
        }
        else if (json.Message) {
            result.message = json.Message;
        }
        else if (json["odata.error"] && json["odata.error"].message) {
            //data service
            result.message = json["odata.error"].message.value;
        }
        else {
            result.message = App.messages.base.MS0015;
        }

        return result;
    }

    //レスポンスがサーバーバリデーションだった場合
    function createNormalizedErrorByServerValidation(err) {
        var json = err.responseJSON,
            status = err.status,
            results = [], result;
        //サーバーバリデーションは配列で返っている必要がある
        if (!json || !App.isArray(json)) {
            return;
        }
        json.forEach(function (item) {
            //各配列の要素はMessageとDataを持っている必要がある
            if (item.Message && item.Data) {
                result = buildErrorObj(err, item.Message, "servervalidation", "warn");
                result.Data = item.Data;
                result.InvalidationName = item.invalidationName;
                results.push(result);
            }
        });
        if (results.length) {
            return results;
        }
        return;
    }
    //An error has occured への対応
    function createNormalizedErrorByAnErrorHasOccurred(err) {
        var json = err.responseJSON,
            status = err.status;
        if (!json || status !== 500) {
            return;
        }
        if (ObjectKeys(json).length !== 1) {
            return;
        }
        if (!json.Message) {
            return;
        }
        if ((json.Message + "").indexOf("An error has occurred") !== 0) {
            return;
        }
        return buildErrorObj(err, "サーバーで予期しないエラーが発生しました。管理者に問い合わせてください。",
                "servererror", "critical");
    }

    //レスポンスがサーバーのアプリケーション例外だった場合
    function createNormalizedErrorByServerAppError(err) {
        var json = err.responseJSON,
            status = err.status,
            result;
        if (!json) {
            return;
        }

        //例外でMessageとClassNameプロパティがあればWeb APIとみなす
        if (json.Message && json.ClassName) {
            result = buildErrorObj(err, json.Message, 
                status === 409 ? "confilict" : "servererror",
                status === 409 ? "warn" : "critical");
            if (json.InnerException && json.InnerException.Message) {
                result.message += json.InnerException.Message;
            }
            ["ClassName", "StackTraceString", "Source", "InnerException"].forEach(function (propName) {
                result[propName] = json[propName];
            });
            return result;
        }
        if (json.Message) {
            result = buildErrorObj(err, json.Message,
                status === 409 ? "confilict" : "servererror",
                status === 409 ? "warn" : "critical");
            if (json.InnerException && json.InnerException.Message) {
                result.message += json.InnerException.Message;
            }
            return result;
        }
        //例外でodata.errorがあればWCF Data Serviceとみなす
        if (json["odata.error"]) {
            json = json["odata.error"];
            result = buildErrorObj(err, !json.message ?
                    "サーバーで予期しないエラーが発生しました。" : json.message.value,
                status === 409 ? "confilict" : "servererror",
                status === 409 ? "warn" : "critical");
            if (json.innererror && json.innererror.message) {
                result.message += json.innererror.message;
            }
            ["code", "innererror"].forEach(function (propName) {
                result[propName] = json[propName];
            });
            return result;
        }
    }

    //JavaScriptの例外
    function createNormalizedErrorByJsError(err) {
        if (err instanceof Error) {
            return buildErrorObj({}, err.message, "clienterror", "critical");
        }
    }
    //上記まで以外(ファイルエラーも含まれる
    function createNormalizedErrorByUnknown(err) {
        var e = App.isUnusable(err) ? {} : err,
            message = e + "";
        if (e.message || e.Message) {
            message = e.message || e.Message;
        }
        return buildErrorObj(e, message, "unknown", "critical");
    }


    function createNormalizedError(err) {
        var result;
        err = App.isUndefOrNull(err) ? {} : err;
        result = !result ? createNormalizedErrorByHtml(err) : result;
        result = !result ? createNormalizedNotFoundErrorByJson(err) : result;
        result = !result ? createNormalizedConflictError(err) : result;
        result = !result ? createNormalizedErrorByServerValidation(err) : result;
        result = !result ? createNormalizedErrorByAnErrorHasOccurred(err) : result;
        result = !result ? createNormalizedErrorByServerAppError(err) : result;
        result = !result ? createNormalizedErrorByJsError(err) : result;
        return !result ? createNormalizedErrorByUnknown(err) : result;
    }

    function retrievePromiseAllChainErrors(err) {
        var result = [];
        ObjectKeys(err.fails).forEach(function (key) {
            var item = err.fails[key];
            if (item.fails && item.successes) {
                result = result.concat(retrievePromiseAllChainErrors(item));
            } else {
                result = result.concat(createNormalizedError(item));
            }
        });
        return result;
    }

    page.normalizeError = function (error) {
        var errors = App.isArray(error) ? error : [error],
            i = 0, l = errors.length, err,
            results = [], result;

        for (; i < l; i++) {
            err = errors[i];
            if (err.fails && err.successes) {
                results = results.concat(retrievePromiseAllChainErrors(err));
            } else {
                results = results.concat(createNormalizedError(err));
            }
        }

        if (results.length < 1) {
            results.push(buildErrorObj({}, "処理できないエラーが発生しました。管理者に問い合わせてください。", "unhandle", "critical"));
        }

        //既存の処理の変更を発生させないように
        //先頭のエラーを代表として、その他のエラーをerrorsプロパティに設定する
        result = $.extend({}, results[0]);
        result.messages = results.map(function (item) {
            return item.message;
        });
        result.errors = results;
        return result;
    };

    if (App.ajax && App.ajax.handleError) {
        App.ajax.handleError = page.normalizeError;
    }

})(this, App, jQuery);

/**
 * 変更管理オブジェクトを定義します。
 */
(function (global, App, $, undef) {

    "use strict";

    var EntityState = {
        Unchanged: 2,
        Added: 4,
        Deleted: 8,
        Modified: 16
    };

    /**
     * 変更セットで追跡されるエンティティの状態を表します。
     */
    var EntityEntry = function (entity) {
        entity.__id = App.uuid();
        this.__id = entity.__id;
        this.original = $.extend({}, entity);
        this.current = entity;
        this.state = EntityState.Unchanged;
    };



    /**
     * 変更追跡を行うオブジェクトの定義です。
     */
    var DataSet = function () {
        this.entries = {};
    };

    /**
     * 変更管理にエンティティをアタッチします。
     * @param {Object, Array} entity 変更管理にアタッチされるエンティティ
     * @return {EntityEntry} 変更されるエンティティ状態オブジェクト
     */
    DataSet.prototype.attach = function (entities) {
        var data = App.isArray(entities) ? entities : [entities],
            i, len, entity, entry;

        for (i = 0, len = data.length; i < len; i++) {
            entity = data[i];
            entry = new EntityEntry(entity);
            this.entries[entry.__id] = entry;
        }

    };

    DataSet.prototype.dettach = function (id) {
        var entry = this.entries[id];

        if (entry) {
            delete this.entries[id];
        }

    };

    /**
     * 変更管理からエンティティを取得します。
     * 
     * @return {EntityEntry} ID に一致するエンティティ状態オブジェクト
     */
    DataSet.prototype.entry = function (id) {
        var entry = this.entries[id];

        if (entry.current) {
            return entry.current;
        }
    };

    /**
     * 変更管理にエンティティを追加します。
     * @param {Object} entity 変更管理に追加されるエンティティ
     * @return {EntityEntry} 変更されるエンティティ状態オブジェクト
     */
    DataSet.prototype.add = function (entity) {
        var entry = new EntityEntry(entity);
        entry.state = EntityState.Added;
        this.entries[entry.__id] = entry;

        return entry;
    };

    /**
     * 変更管理のエンティティを変更します。
     * @param {String} id 
     * @param {String} key 
     * @param {Object} value 
     * @return {EntityEntry} 変更されるエンティティ状態オブジェクト
     */
    DataSet.prototype.updateProperty = function (id, propertyName, value) {

        if (!id) {
            throw Error("__id is not contains.");
        }
        var entry = this.entries[id];
        if (entry.current.hasOwnProperty(propertyName)) {

            entry.current[propertyName] = value;

            switch (entry.state) {
                case EntityState.Unchanged:
                    entry.state = EntityState.Modified;
                    break;
                case EntityState.Added:
                    break;
                case EntityState.Deleted:
                    entry.state = EntityState.Modified;
                    break;
                case EntityState.Modified:
                    break;
                default:
                    break;
            }

            this.entries[entry.__id] = entry;
        }

        return entry;
    };

    /**
     * 変更管理のエンティティを変更します。
     * @param {Object} entity 変更管理で変更状態にされるエンティティ
     * @return {EntityEntry} 変更されるエンティティ状態オブジェクト
     */
    DataSet.prototype.update = function (entity) {

        if (!entity.__id) {
            throw Error("__id is not contains.");
        }
        var entry = this.entries[entity.__id];
        entry.current = entity;

        switch (entry.state) {
            case EntityState.Unchanged:
                entry.state = EntityState.Modified;
                break;
            case EntityState.Added:
                break;
            case EntityState.Deleted:
                throw Error("__id[" + entry.__id + "] is already removed.");
                break;
            case EntityState.Modified:
                break;
            default:
                break;
        }

        this.entries[entry.__id] = entry;

        return entry;
    };

    /**
     * 変更管理のエンティティを削除します。
     * @param {Object} entity 変更管理で変更状態にされるエンティティ
     * @return {EntityEntry} 変更されるエンティティ状態オブジェクト
     */
    DataSet.prototype.remove = function (entity) {

        if (!entity.__id) {
            throw Error("__id is not contains.");
        }
        var entry = this.entries[entity.__id];

        switch (entry.state) {
            case EntityState.Unchanged:
                entry.state = EntityState.Deleted;
                break;
            case EntityState.Added:
                delete this.entries[entry.__id];
                break;
            case EntityState.Deleted:
                break;
            case EntityState.Modified:
                this.reject(entity.__id);
                entry.state = EntityState.Deleted;
                break;
            default:
        }

        return entry;
    };

    /**
     * 変更管理のエンティティの状態をサーバーの最新版に合わせます。
     * @param {Object} entity 変更管理で変更状態にされるエンティティ
     * @return {EntityEntry} 変更されるエンティティ状態オブジェクト
     */
    DataSet.prototype.serverWin = function (id, server) {

        var entry = this.entries[id];

        server.__id = entry.__id;
        entry.current = server;
        entry.original = server;

        switch (entry.state) {
            case EntityState.Unchanged:
                break;
            case EntityState.Added:
                entry.state = EntityState.Unchanged;
                break;
            case EntityState.Deleted:
                entry.state = EntityState.Unchanged;
                break;
            case EntityState.Modified:
                entry.state = EntityState.Unchanged;
                break;
            default:
        }

        this.entries[entry.__id] = entry;

        return entry;
    };

    /**
     * 変更管理のエンティティの状態をサーバーの最新版に合わせます。
     * 
     * @param {Object} entity 変更管理で変更状態にされるエンティティ
     * @return {EntityEntry} 変更されるエンティティ状態オブジェクト
     */
    DataSet.prototype.originalWin = function (id) {

        var entry = this.entries[id];

        if (App.isNull(entry.original)) {
            entry.current = $.extend({}, entry.original);
            entry.original = entry.original;
        }

        switch (entry.state) {
            case EntityState.Unchanged:
                break;
            case EntityState.Added:
                break;
            case EntityState.Deleted:
                entry.state = EntityState.Unchanged;
                break;
            case EntityState.Modified:
                entry.state = EntityState.Unchanged;
                break;
            default:
        }

        this.entries[entry.__id] = entry;

        return entry;
    };

    // TODO: state 指定で変更セットを取得する

    /**
     * 変更セットを取得します。
     * 
     * @return {Object} 変更セットオブジェクト
     */
    DataSet.prototype.getChangeSet = function () {

        var changeSet = {
            created: [], updated: [], deleted: []
        };

        var self = this,
            key, entry, clone;
        for (key in self.entries) {
            if (!self.entries.hasOwnProperty(key)) {
                continue;
            }
            entry = self.entries[key];
            switch (entry.state) {
                case EntityState.Unchanged:
                    break;
                case EntityState.Added:
                    changeSet.created.push(copy(entry.current, true));
                    break;
                case EntityState.Deleted:
                    changeSet.deleted.push(copy(entry.current, true));
                    break;
                case EntityState.Modified:
                    changeSet.updated.push(copy(entry.current, true));
                    break;
                default:
            }
        }

        return changeSet;
    };

    /**
     * 変更されているエンティティがあるかどうかを取得します。
     *
     * @return {Boolean} 変更されている場合 True, されていない場合 False
     */
    DataSet.prototype.isChanged = function () {
        var entries = this.entries,
            key,
            entry;

        for (key in entries) {
            if (!entries.hasOwnProperty(key)) {
                continue;
            }
            entry = entries[key];
            if (entry.state !== EntityState.Unchanged) {
                return true;
            }
        }
        return false;
    };

    /**
     * 変更されたエンティティをアタッチされた時点の状態に復元します。
     *
     * @param {String} id アタッチされているエンティティの __id プロパティの値
     * @returns 復元されたエンティティ
     */
    DataSet.prototype.reject = function (id) {

        var self = this,
            entry = self.entries[id];

        if (!entry) {
            return;
        }

        entry.current = $.extend({}, entry.original);
        if (entry.state === EntityState.Added) {
            delete self.entries[id];
            return;
        }

        entry.state = EntityState.Unchanged;
        return entry.current;
    };

    /**
     * 指定された関数の実行結果が truthy になる一番最初のエンティティを返します。
     * @param callback エンティティの値をチェックする関数
     * @param context callback で指定された関数を実行する際のコンテキスト
     * @return 指定された関数の実行結果が truthy になる一番最初のエンティティ
     */
    DataSet.prototype.find = function (callback, context) {
        var key, entry, entries = this.entries;

        if (!App.isFunc(callback)) {
            return;
        }

        for (key in entries) {
            if (!entries.hasOwnProperty(key)) {
                continue;
            }
            entry = entries[key];

            if (callback.call(context || this, entry.current, entry)) {
                return entry.current;
            }
        }
    }
    /**
     * 指定された関数の実行結果が truthy になるすべてのエンティティを配列で返します。
     * @param callback エンティティの値をチェックする関数
     * @param context callback で指定された関数を実行する際のコンテキスト
     * @return 指定された関数の実行結果が truthy になるすべてのエンティティの配列
     */
    DataSet.prototype.findAll = function (callback, context) {
        var key, entry, entries = this.entries, results = [];

        if (!App.isFunc(callback)) {
            return;
        }

        for (key in entries) {
            if (!entries.hasOwnProperty(key)) {
                continue;
            }
            entry = entries[key];

            if (callback.call(context || this, entry.current, entry)) {
                results.push(entry.current);
            }
        }
        return results;
    };

    /** 
     * 変換管理オブジェクトからチャート用データを抽出します。 
     * 
     * @param {DataSet} data 変更管理オブジェクト
     * @param {String} key キー項目名
     * @param {String} value データ項目名 
     * @param {Function} options  データ変換用オペレーション
     * @return 抽出された2次元配列
     */
    DataSet.prototype.convertToChartData = function (key, value, operation) {

        if (!key || !value) {
            throw Error('Invalid of arguments');
        }

        var self = this,
            items = self.findAll(function (item, entity) {
                return entity.state !== App.ui.page.dataSet.status.Deleted;
            });

        return App.ui.chart.convertToChartData(items, key, value, operation);
    };

    /**
     * 指定された変更管理のエンティティの内容がデータ取得時と変更があるかどうかを返却します
     *
     * @param {String} id アタッチされているエンティティの __id プロパティの値
     * @return {Boolean} 変更されている場合 True, されていない場合 False
     */
    DataSet.prototype.isUpdated = function (id) {
        var entry = this.entries[id],
            current, original, isUpdate;

        switch (entry.state) {
            case EntityState.Unchanged:
                isUpdate = false;
                break;
            case EntityState.Added:
                isUpdate = true;
                break;
            case EntityState.Deleted:
                isUpdate = true;
                break;
            case EntityState.Modified:
                current = entry.current;
                original = entry.original;
                isUpdate = false;
                for (var key in current) {
                    if (!original.hasOwnProperty(key)) {
                        isUpdate = true;
                        break;
                    }
                    if ((App.isUndefOrNull(current[key]) || current[key] === "") && (App.isUndefOrNull(original[key]) || original[key] === "")) {
                        continue;
                    }

                    if (current[key] !== original[key]) {
                        isUpdate = true
                        break;
                    }
                }
                break;
            default:
                break;
        }

        return isUpdate;
    };

    /**
     * 値をコピーしたオブジェクトを作成します。
     * @param source コピー元のオブジェクト
     * @param removeSpecialProperties 管理用の特殊なプロパティを削除するかどうか
     */
    function copy(source, removeSpecialProperties) {
        var copy = $.extend({}, source);
        if (removeSpecialProperties) {
            copy = clean(copy);
        }
        return copy;
    }

    function clean(source) {
        var key, removes = [], i, l, remove;

        for (key in source) {
            if (source.hasOwnProperty(key)) {
                if (key.substr(0, 2) === "__") {
                    removes.push(key);
                }
            }
        }
        for (i = 0, l = removes.length; i < l; i++) {
            remove = removes[i];
            source[remove] = undefined;
            delete source[remove];
        }
        return source;
    }

    /**
     * 変更管理オブジェクトを初期化します。
     * 
     * @return {Object} 変更管理オブジェクト
     */
    App.ui.page.dataSet = function () {
        return new DataSet();
    }

    /**
     * 変更状態の列挙値を返します。
     */
    App.ui.page.dataSet.status = EntityState;

    App.ui.page.dataSet.clean = clean;
    App.ui.page.dataSet.copy = copy;

})(this, App, jQuery);

/**
 * 状態管理マネージャーを定義します。
 */
(function (global, App, $, undef) {


    "use strict";

    var defaultOptions = {
        events: [],
        roles: []
    };

    /**
     * 状態管理マネージャを初期化します。
     * 
     * @param {String} status 初期ステータス
     * @param {Object} options ステータス、権限によるコントロールの制御の設定オブジェクト
     */
    var StateManager = function (status, statusOptions) {
        this._status = status;
        this._statusEvents = [];
        var options = $.extend({}, defaultOptions, statusOptions);

        var statusid, statusObj, groupid, groupObj;

        if (options.rules) {

            if (!options.rules.base) {
                options.rules.base = {};
            }


            for (statusid in options.rules) {

                if (statusid === "base") {
                    continue;
                }

                statusObj = options.rules[statusid];

                if (!statusObj.base) {
                    statusObj.base = {};
                }

                for (groupid in statusObj) {

                    if (groupid === "base") {
                        continue;
                    }

                    groupObj = statusObj[groupid];
                    statusObj[groupid] = $.extend(true, {}, options.rules.base, statusObj.base, groupObj);
                }
            }
        }

        this._options = options;

        var event, i, len;
        for (i = 0, len = options.events.length; i < len; i++) {
            event = options.events[i];
            this.on(event.from, event.to, event.operation);
        }

        var rules = this._options.rules || {};
        changeControlState(this, rules[status] || {});
    };

    /**
     * 状態遷移時のイベントを登録します。
     * 
     * @param {String} from 初期ステータス
     * @param {String} to 完了後ステータス
     * @param {Function} operation 状態遷移時に実行されるイベント処理
     */
    StateManager.prototype.on = function (from, to, operation) {
        this._statusEvents.push({
            from: from,
            to: to,
            operation: App.isFunc(operation) ? operation : function (e) { e.done(); }
        });
    };

    /**
     * 現在のステータスを取得します。
     * @return 現在のステータス
     */
    StateManager.prototype.current = function () {
        return this._status;
    };

    /**
     * 状態遷移処理を実行します。
     * 
     * @param {String} state 完了後ステータス
     */
    StateManager.prototype.change = function (toStatus) {
        var self = this,
            event, i, len, trans;

        for (i = 0, len = this._statusEvents.length; i < len; i++) {
            trans = this._statusEvents[i];

            if (trans.from === this._status && trans.to === toStatus) {
                event = trans;
                break;
            }
        }

        // 状態に対応するイベントがなかった際にはエラーをスローする。
        if (App.isUndefOrNull(event)) {
            throw new Error("current state['" + this._status + "'] and to state ['" + toStatus + "'] is not defined.");
        }

        // イベントの結果を done メソッド のフラグで確認する。
        var ev = {
            from: this._status,
            to: toStatus,
            ruleGroup: this._options.rules[toStatus],
            done: function (isDone) {
                if (App.isBool(isDone) && !isDone) {
                    return;
                }

                changeControlState(self, ev.ruleGroup);
                self._status = toStatus;
            }
        };

        event.operation.call(this, ev);
    };

    function changeControlState(stateManager, groups) {
        var i, len, isInRole, control, children;

        $.each(groups, function (index, group) {
            isInRole = false;
            for (i = 0, len = stateManager._options.roles.length; i < len; i++) {
                isInRole = $.inArray(stateManager._options.roles[i], group.roles) > -1;
                if (isInRole) {
                    break;
                }
            }

            if (false === isInRole) {
                return;
            }

            $.each(group.rules, function (key, val) {

                control = $('[data-prop="' + key + '"]');
                children = control.find(":input");

                if (true === val.disable) {
                    control.prop("disabled", false);
                    if (children.length > 0) {
                        children.prop("disabled", true);
                    } else {
                        control.prop("disabled", true);
                    }
                } else if (false === val.disable) {
                    control.prop("disabled", false);
                    if (children.length > 0) {
                        children.prop("disabled", false);
                    }
                }

                if (true === val.readonly) {
                    control.prop("disabled", false);
                    if (children.length > 0) {
                        children.prop("disabled", false);
                        children.prop("readonly", true);
                    } else {
                        control.prop("readonly", true);
                    }
                } else if (false === val.readonly) {
                    control.prop("disabled", false);
                    if (children.length > 0) {
                        children.prop("disabled", false);
                        children.prop("readonly", false);
                    } else {
                        control.prop("readonly", false);
                    }
                }

                if (false === val.visible) {
                    control.hide();
                } else if (true === val.visible) {
                    control.show();
                }

                if (App.isFunc(val.custom)) {
                    val.custom(control, children);
                }
            });


            if (App.isFunc(group.transfered)) {
                group.transfered();
            }
        });
    }

    /**
     * 現在のステータスを取得します。
     */
    StateManager.prototype.current = function () {
        return this._status;
    };

    /**
     * 状態管理マネージャを初期化します。
     * 
     * @param {String} state 初期ステータス
     * @param {Object} stateOptions ステータス、権限によるコントロールの制御の設定オブジェクト
     * 
     */
    App.ui.page.stateManager = function (state, stateOptions) {
        return new StateManager(state, stateOptions);
    }

})(this, App, jQuery);


// option タグの追加
(function (global, $, undef) {

    "use strict";

    /**
    * 画面に関する共通関数を定義します。
    */
    App.define("App.ui", {

        /**
        * 指定された select コントロールに対して、 option タグを作成して設定します。
        * @param {Object} target select コントロールの jQuery Object もしくは、select コントロールの名前(name属性で検索）
        * @param {String} val option タグに設定するデータのキー項目
        * @param {String} label option タグに設定するデータの表示項目
        * @param {Array} data option タグに設定するデータ
        * @param {Boolean} isDefaultOption 先頭に空白項目を挿入するか
        * @param {Array} filter option タグに設定するデータのフィルタ
        * @param {Boolean} isNumColonText 表示項目に「val：label」で表示するかどうか
        */
        appendOptions: function (target, val, label, data, isDefaultOption, filter, isNumColonText) {
            var $control = target;
            // 文字列の場合には name 属性でセレクタを作成します。
            if (App.isStr(target)) {
                $control = $("[name=" + target + "]");
            }

            if (isDefaultOption) {
                $control.append("<option value=''></option>");
            }

            $.each(data, function (index, option) {
                if (!App.isUndefOrNull(filter) && filter.length > 0) {
                    for (var i = 0; filter.length > i; i++) {
                        if (filter[i] == option[val]) {
                            if (isNumColonText) {
                                $control.append("<option value='" + option[val] + "'>" + option[val]  + "：" + option[label] + "</option>");
                            } else {
                                $control.append("<option value='" + option[val] + "'>" + option[label] + "</option>");
                            }
                        }
                    }
                } else {
                    if (isNumColonText) {
                        $control.append("<option value='" + option[val] + "'>" + option[val] + "：" + option[label] + "</option>");
                    } else {
                        $control.append("<option value='" + option[val] + "'>" + option[label] + "</option>");
                    }
                }
            });
        },

        /**
        * 指定された URL に画面遷移を行います。
        *   features:デフォルトでは以下の表示設定をoffにします
        *       アドレスバー
        *       ステータスバー
        *       ツールバー
        */
        transfer: function (url, options) {
            var getTargetName = function () {
                var getFileName = function () {
                        var arr = url.split("?")[0].split("/"),
                            fileName = arr[arr.length - 1].split(".")[0];

                        return fileName;
                    },
                    getQuery = function () {
                        if (url == "") return "";
                        var queries = url.split("?").length > 1 ? url.split("?")[1] : "",
                            split = queries.split('&'),
                            i, result = "";

                        for (i = 0; i < split.length; ++i) {
                            var p = split[i].split('=');
                            if (p.length != 2) continue;
                            result = result + "_" + p[0] + "_" + decodeURIComponent(p[1].replace(/[\+@]/g, ""));
                        }
                        return result;
                    };

                return App.settings.app.systemNo + "_" + getFileName() + getQuery();
                },
                defaultSettings = {
                    target: getTargetName(),    //"_blank",
                    features: "location=no,status=no,toolbar=no,resizable=yes,left=0,top=0,scrollbars=yes"
                },
                settings = $.extend({}, defaultSettings, options),
                win;

            if (!App.isUndefOrNull(settings.wins) &&
                settings.wins[settings.target] && !(settings.wins[settings.target].closed)) {
                win = settings.wins[settings.target];
            } else {
                win = window.open(url, settings.target, settings.features);
            }

            if (win) {
                win.window.resizeTo(screen.availWidth, screen.availHeight);
                win.window.focus();
            }

            return {
                name: defaultSettings.target,
                win: win
            };
        },

        /**
          * 指定されたミリ秒ごとに条件確認し、条件が真になるまで繰り返します。
          * @param id インターバルID
          * @param condtion waitが終了する条件式
          * @param msec 条件確認する間隔（ミリ秒）
          */
        wait: function (id, condition, msec) {
            // Deferredのインスタンスを作成
            var deferred = $.Deferred(),
                count = 0;

            id = setInterval(function () {
                //終了条件式の確認
                if (eval(condition)) {
                    clearInterval(id);
                    deferred.resolve();
                }
                if (count * msec > 10000) {
                    clearInterval(id);
                    alert("上限を超えたので強制的にwait終了！サポートセンターに連絡してください。");
                    deferred.reject();
                }
                count++;
            }, msec);

            return deferred.promise();
        }
    });
})(window, jQuery);


/**
 *  コード値検索を行う jQuery Plugin を定義します。
 */
(function (global, $, undef) {

    var defaultOptions = {
        textLength: 1,
        ajax: function (val) {
        },
        success: function (data) {
        },
        error: function (error) {
        },
        clear: function () {
        },
        clearError: function (self) {
            App.ui.page.notifyAlert.remove(self);
        }
    };

    /**
     *  テキストボックスに入力された値をもとに、Ajax サービスを利用してコード値による検索を行います。
     */
    $.fn.complete = function (options) {
        var self = $(this);
        options = $.extend({}, defaultOptions, options);

        self.on("change", function (e) {

            options.clearError(self);

            var $target = $(e.target);
            var val = $target.val();

            if (val === "") {
                options.clear(self);

            } else if (val.length <= options.textLength) {
                if (self.data("lastVal") !== val) {
                    options.ajax(val)
                    .then(function (result) {
                        options.success(result, self);
                    })
                    .fail(function (error) {
                        options.error(error, self);
                    });
                }
            } else {
                options.clear(self);
            }

            self.data("lastVal", val);
        });
    };


})(window, jQuery);

// chart
(function (global, $, undef) {

    "use strict";

    /** 
    * Flotを利用したchart機能を定義します。
    */
    var chart = App.define("App.ui.chart");

    /** 
    * Flotを利用したchart機能のデフォルト設定を定義します。
    */
    var chartDefaultDefinition = {
        grid: true,                         // チャート背景設定のON/OFF
        gridBackgroundColor: "#ffffff",     // チャート背景色 
        gridBborderWidth: 0,                // 外枠線の太さ
        xaxisTickLength: 0,                 // 縦罫線の太さ
        legend: true,                       // 凡例の表示/非表示
        colors: [                           // チャートに設定されるデフォルトの色
            '#2f7ed8',                      // Strong blue
            '#0d233a',                      // Very dark blue
            '#8bbc21',                      // Strong green
            '#910000',                      // Dark red
            '#1aadce',                      // Strong cyan
            '#492970',                      // Very dark violet
            '#f28f43',                      // Bright orange
            '#77a1e5',                      // Soft blue
            '#c42525',                      // Strong red
            '#a6c96a'                       // Slightly desaturated green
        ]
    };


    /**
    * チャートを作成します。 
    * 
    * @param {Array} data チャート作成用データ 
    * @param {object} options チャート表示オプション 
    * @return 作成されたチャートのFlotオブジェクト
    */
    $.fn.createChart = function (data, options) {

        var self = this,
            plot,
            defaultOptions = {
                colors: chartDefaultDefinition.colors,
                grid: {
                    show: (App.settings.base.chart.grid) ? App.settings.base.chart.grid : chartDefaultDefinition.grid,
                    backgroundColor: (App.settings.base.chart.gridBackgroundColor) ? App.settings.base.chart.gridBackgroundColor : chartDefaultDefinition.gridBackgroundColor,
                    borderWidth: (App.settings.base.chart.gridBborderWidth) ? App.settings.base.chart.gridBborderWidth : chartDefaultDefinition.gridBborderWidth,
                },
                xaxis: {
                    tickLength: (App.settings.base.chart.xaxisTickLength) ? App.settings.base.chart.xaxisTickLength : chartDefaultDefinition.xaxisTickLength
                },
                legend: {
                    show: (App.settings.base.chart.legend) ? App.settings.base.chart.legend : chartDefaultDefinition.legend
                }
            },
            settings = $.extend(true, {}, defaultOptions, options),
            series, i;

        if (!App.isFunc($.plot)) {
            throw Error('Flot library is not loaded');
        }

        for (i = 0; i < data.length; i++) {
            series = data[i];
            if (series.bars && !series.bars.fillColor) {
                series.bars.fillColor = defaultOptions.colors[i];
            }
            if (i >= defaultOptions.colors.length) {
                break;
            }
        }
        
        plot = $.plot(self, data, settings);     

        plot.resize();
        plot.setupGrid();
        plot.draw();

        return plot;

    };

    /** 
    * JSONオブジェクトからチャート用データを抽出します。
    * 
    * @param {Array} data 配列
    * @param {String} key キー項目名 
    * @param {String} value データ項目名
    * @param {Function} operation  データ変換用オペレーション
    * @return 抽出された2次元配列
    */
    chart.convertToChartData = function (data, key, value, operation) {

        if (!data || !App.isArray(data) || !key || !value) {
            throw Error('Invalid of arguments');
        }

        var results = [], keyData, item;

        for (var i = 0, l = data.length; i < l; i++) {
            item = $.extend(true, {}, data[i]);

            if (App.isFunc(operation)) {
                item = operation(item, i);
            }

            if (item[key] && item[value]) {
                results.push([item[key], item[value]]);
            }
        }

        return results;
    };

})(this, jQuery);