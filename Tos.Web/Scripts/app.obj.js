/** 最終更新日 : 2016-10-17 **/
//prototype extends
; (function(global, App, undefined){

    "use strict";

    function Empty() { }
    var slice = Array.prototype.slice;

    // Function#bind
    if (!Function.prototype.bind) {
        Function.prototype.bind = function bind(context) {
            var target = this,
                args = slice.call(arguments, 1),
                bound = function () {
                    if (this instanceof bound) {
                        var result = target.apply(
                            this,
                            args.concat(slice.call(arguments))
                        );
                        /*jshint newcap: false*/
                        if (Object(result) === result) {
                            return result;
                        }
                        return this;
                    } else {
                        return target.apply(
                            context,
                            args.concat(slice.call(arguments))
                        );
                    }

                };
            if (target.prototype) {
                Empty.prototype = target.prototype;
                bound.prototype = new Empty();
                Empty.prototype = null;
            }
            return bound;
        };
    }

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function indexOf(item, fromIndex) {
            var self = this,
                i = 0, l;
            if (App.isNumeric(fromIndex)) {
                i = Math.max(0, parseInt(fromIndex, 10));
            }
            for (l = self.length; i < l; i++) {
                if (i in self && self[i] === item) {
                    return i;
                }
            }
            return -1;
        }
    }

    if (!Array.prototype.lastIndexOf) {
        Array.prototype.lastIndexOf = function lastIndexOf(item, fromIndex) {
            var self = this,
                start = fromIndex, l;

            if (arguments.length < 2) {
                start = self.length;
            }
            if (App.isNumeric(start)) {
                l = Math.max(Math.min(parseInt(start, 10) + 1, self.length), 0);
            }
            while (l--) {
                if (l in self && self[l] === item) {
                    return l;
                }
            }
            return -1;
        }
    }
    if (!Array.prototype.every) {
        Array.prototype.every = function (callback, context) {
            var i, l,
                self = this;
            if (!App.isFunc(callback)) {
                throw new TypeError();
            }
            for (i = 0, l = self.length; i < l; i++) {
                if (i in self && !callback.call(context, self[i], i, self)) {
                    return false;
                }
            }
            return true;
        }
    }
    if(!Array.prototype.some){
        Array.prototype.some = function (callback, context) {
            var i, l,
                self = this;
            if (!App.isFunc(callback)) {
                throw new TypeError();
            }
            for (i = 0, l = self.length; i < l; i++) {
                if (i in self && callback.call(context, self[i], i, self)) {
                    return true;
                }
            }
            return false;
        }
    }
    if (!Array.prototype.map) {
        Array.prototype.map = function (callback, context) {
            var result = [],
                i, l,
                self = this;
            if (!App.isFunc(callback)) {
                throw new TypeError();
            }
            for (i = 0, l = self.length; i < l; i++) {
                if (i in self) {
                    result.push(callback.call(context, self[i], i, self));
                }
            }
            return result;
        }
    }
    if (!Array.prototype.reduce) {
        Array.prototype.reduce = function (callback, initialValue) {
            var value, i, l, self = this;
            if (!App.isFunc(callback)) {
                throw new TypeError();
            }
            i = 0;
            value = initialValue;
            if (arguments.length < 2) {
                i = 1;
                value = self[0];
            }
            for (l = self.length; i < l; i++) {
                value = callback(value, self[i], i, self);
            }
            return value;
        }
    }
    if (!Array.prototype.reduceRight) {
        Array.prototype.reduceRight = function (callback, initialValue) {
            var value, l, self = this;
            if (!App.isFunc(callback)) {
                throw new TypeError();
            }
            l = self.length;
            value = initialValue;
            if (arguments.length < 2) {
                l--;
                value = self[l];
            }
            while (l--) {
                value = callback(value, self[l], l, self);
            }
            return value;
        }
    }

    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (iterator, context) {

            for (var i = 0, len = this.length; i < len; i++) {
                if (i in this) {
                    iterator.call(context, this[i], i, this);
                }
            }
        };
    }

})(this, App)

//string
; (function (global, App) {

    "use strict";

    App.str = {
        /**
        * 第1引数に指定された文字列のプレースホルダーを第2引数以降に指定された値で置き換えます。
        * example:
        * プレースホルダーがインデックスの数値の場合は、第2引数を0として開始した引数に指定された値を利用
        * App.str.format("{0} to {1}", 1, 10); // "1 to 10"
        * 
        * プレースホルダーが名称の場合は、第2引数に指定された値のプロパティに設定された値を利用
        * App.str.format("{min} to {max}", {min: 10, max: 20}); // "10 to 20"
        */
        format: function (target) {
            var args = Array.prototype.slice.call(arguments);
            args.shift();

            if (!target) {
                return target;
            }
            if (args.length === 0) {
                return target;
            }

            return target.toString().replace(/\{?\{(.+?)\}\}?/g, function (match, arg1) {
                var val, splitPos, prop, rootProp, format, formatPos,
                    param = arg1;
                if (match.substr(0, 2) === "{{" && match.substr(match.length - 2) === "}}") {
                    return match.replace("{{", "{").replace("}}", "}");
                }

                splitPos = Math.min(param.indexOf(".") === -1 ? param.length : param.indexOf("."),
                    param.indexOf("[") === -1 ? param.length : param.indexOf("["));
                if (splitPos < param.length) {
                    rootProp = param.substr(0, splitPos);
                    prop = "['" + param.substr(0, splitPos) + "']" + param.substr(splitPos);
                } else {
                    rootProp = param;
                    prop = "['" + param + "']";
                }
                /*jshint evil:true*/
                val = (new Function("return arguments[0]" + prop + ";"))(App.isNumeric(rootProp) ? args : args[0]);
                val = App.isUndef(val) ? "" : (val + "");
                if (match.substr(0, 2) === "{{") {
                    val = "{" + val;
                }
                if (match.substr(match.length - 2) === "}}") {
                    val = val + "}";
                }
                return val;
            });
        },
        clipRight: function (target, length) {
            if (!App.isStr(target)) return;
            length = App.isNum(length) ? length < 0 ? 0 : length : 0;
            if (target.length <= length) return target;
            return target.substring(target.length - length, target.length);
        },
        clipLeft: function (target, length) {
            if (!App.isStr(target)) return;
            length = App.isNum(length) ? length < 0 ? 0 : length : 0;
            if (target.length <= length) return target;
            return target.substr(0, length);
        }
    };

})(window, App);

//date
; (function (global, App) {

    "use strict";

    var proto = Date.prototype,
        getFullYear = proto.getFullYear,
        getMonth = proto.getMonth,
        getDate = proto.getDate,
        getHours = proto.getHours,
        getMinutes = proto.getMinutes,
        getSeconds = proto.getSeconds,
        getMilliseconds = proto.getMilliseconds,
        getTime = proto.getTime,
        getDay = proto.getDay,
        getTimezoneOffset = proto.getTimezoneOffset,
        tokenCache = {},
        formatterPool = {},
        langDef = {
            months: {
                shortNames: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
                names: "January February March April May June July August September October November December".split(" ")
            },
            meridiem: {
                shortNames: { ante: "A", post: "P" },
                names: { ante: "AM", post: "PM" }
            },
            weekdays: {
                shortNames: "Sun Mon Tue Wed Thu Fri Sat".split(" "),
                names: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" ")
            },
            dateChangeHour: 5
        };

    function tokenize(format, definition) {
        var i, l, ch,
            tokens = [],
            escaped = false,
            token, quote;

        function tokenizeLiteral(target, index) {
            var match = format.substr(index).match(new RegExp(target + "+"));
            if (match) {
                return match[0].length;
            }
            return 1;
        }

        if (tokenCache[format]) {
            return tokenCache[format];
        }
        for (i = 0, l = format.length; i < l; i++) {

            ch = format.charAt(i);
            if(escaped){
                tokens.push(ch);
                escaped = false;
                continue;
            }
            if(ch === "\\"){
                escaped = true;
                continue;
            }
            if(ch === "'" || ch === "\""){
                if(ch === quote){
                    quote = false;
                }else{
                    quote = ch;
                }
                continue;
            }
            if(quote){
                tokens.push(ch);
                continue;
            }
            switch (ch) {
                case "d":
                case "f":
                case "h":
                case "H":
                case "m":
                case "M":
                case "s":
                case "t":
                case "y":
                case "z":
                    token = {
                        type:ch,
                        length:tokenizeLiteral(ch, i)
                    };
                    tokens.push(token);
                    i += (token.length - 1);
                    break;
                case "/":
                case ":":
                    token = {
                        type:ch
                    };
                    tokens.push(token);
                    break;
                default:
                    tokens.push(ch);
            }
        }
        tokenCache[format] = tokens;
        return tokens;
    }

    function buildText(value, tokens, definition) {
        var tokenItem,
            type,
            tlength,
            meridiem,
            timezoneoffset,
            texts = [],
            clipRight = App.str.clipRight,
            i, l,
            getNonMilitaryHour = function () {
                var hour = getHours.call(value);
                return hour > 12 ? hour - 12 :
                       (hour || 12);
            },
            makeMd = function (l, division, addend, func, func2) {
                if (l === 1) {
                    texts.push(func.call(value) + addend);
                }
                if (l === 2) {
                    texts.push(clipRight("0" + (func.call(value) + addend), 2));
                }
                if (l >= 3) {
                    texts.push((tlength === 3 ? definition[division].shortNames : definition[division].names)[(func2 || func).call(value)]);
                }
            },
            makeHhms = function (l, func) {
                if (l === 1) {
                    texts.push(func(value));
                }
                if (l >= 2) {
                    texts.push(clipRight("0" + func(value), 2));
                }
            },
            isOver24 = (function () {
                var i, l, tokenItem;
                for (i = 0, l = tokens.length; i < l; i++) {
                    tokenItem = tokens[i];
                    if (tokenItem.type === "H" && tokenItem.length > 2) {
                        if (getHours.call(value) < (Math.max(Math.min(definition.dateChangeHour, 23), 0) || 0)) {
                            return true;
                        }
                    }
                }
                return false;
            })();

        //TODO:HHH or HHHH で29時間表記
        //HHH で指定されていて 10 未満だったら先頭 0 埋めなし
        //HHHH でしていされていて 10 未満だったら先頭 0 埋めあり
        //HHH が指定されている場合、表記の都合上 1 日マイナスする
        //TODO: 5時は29時なのか、5時なのか切り替わりの時間を要確認
        if(isOver24) {
            value = new Date(value.getTime() - (86400000)); //24 * 60 * 60 * 1000
        }

        for (i = 0, l = tokens.length; i < l; i++) {
            tokenItem = tokens[i];
            if (App.isStr(tokenItem)) {
                texts.push(tokenItem);
                continue;
            }
            type = tokenItem.type;
            tlength = tokenItem.length;
            if (type === "/" || type === ":") {
                texts.push(type);
            } else if (type === "y") {
                if (tlength === 1) {
                    texts.push(clipRight(parseInt(("" + getFullYear.call(value)), 10).toString(), 2));
                } else {
                    /*jshint newcap: false*/
                    texts.push(clipRight(Array(tlength + 1).join("0") + getFullYear.call(value), tlength));
                }
            } else if (type === "M") {
                makeMd(tlength, "months", 1, getMonth);
            } else if (type === "d") {
                makeMd(tlength, "weekdays", 0, getDate, getDay);
            } else if (type === "h") {
                makeHhms(tlength, getNonMilitaryHour);
            } else if (type === "H") {
                /*jshint loopfunc: true */
                //TODO: 29時間表記が不要な場合は削除
                if (isOver24) {
                    texts.push(getHours.call(value) + 24);
                } else {
                    //TODO: 29時間表記が不要な場合は削除
                    if (tlength > 2) {
                        tlength = tlength - 2;
                    }
                    makeHhms(tlength, function (s) {
                        return getHours.call(s);
                    });
                }
                
            } else if (type === "m") {
                /*jshint loopfunc: true */
                makeHhms(tlength, function (s) {
                    return getMinutes.call(s);
                });
            } else if (type === "s") {
                /*jshint loopfunc: true */
                makeHhms(tlength, function (s) {
                    return getSeconds.call(s);
                });
            } else if (type === "f") {
                texts.push(clipRight("00" + getMilliseconds.call(value), 3).substr(0, tlength));
            } else if (type === "t") {
                meridiem = tlength === 1 ? definition.meridiem.shortNames : definition.meridiem.names;
                texts.push(getHours.call(value) > 12 ? meridiem.post : meridiem.ante);
            } else if (type === "z") {
                timezoneoffset = getTimezoneOffset.call(value);
                texts.push((timezoneoffset < 0 ? "+" : "-") + (function () {
                    if (tlength === 1) {
                        return Math.floor(Math.abs(timezoneoffset / 60)).toString();
                    } else if (tlength === 2) {
                        return clipRight("0" + Math.floor(Math.abs(timezoneoffset / 60)).toString(), 2);
                    } else {
                        return clipRight("0" + Math.floor(Math.abs(timezoneoffset / 60)).toString(), 2) +
                            ":" +
                            clipRight("0" + Math.floor(Math.abs(timezoneoffset % 60)).toString(), 2);
                    }
                })());
            }
        }
        return texts.join("");
    }

    function toFormatedText(value, format, definition) {
        var tokens = tokenize(format, definition);
        return buildText(value, tokens, definition);
    }

    App.date = {
        /**
        * 第1引数に指定された日付を第2引数で指定されたフォーマット文字列でフォーマットした文字列を返します。
        * 基本的には.NETのフォーマット文字列に準拠します。
        * y, M, d, H, h, m, s, f, t, z が利用可能です。
        * http://msdn.microsoft.com/ja-jp/library/vstudio/8kb3ddd4.aspx
        *
        * javascript の場合、 f のミリ秒が3桁までになるため、 3つ以上の f の連続は無視されます。
        */
        format: function (value, format, definition) {
            var def;
            if (!App.isDate(value) || !App.isStr(format)) {
                return value;
            }
            def = $.extend({}, langDef, definition);
            if (format in formatterPool) {
                return formatterPool[format](value, def);
            }
            return toFormatedText(value, format, def);
        },
        namedFormat: function (name, formatter) {
            if (!App.isStr(name)) {
                return;
            }
            if (App.isFunc(formatter)) {
                formatterPool[name] = formatter;
            } else {
                return formatterPool[name];
            }
        },
        removeNamedFormat: function (name) {
            formatterPool[name] = void 0;
            delete formatterPool[name];
        }
    };

    App.date.namedFormat("ODataJSON", function (value) {
        return "/Date(" + getTime.call(value) + ")/";
    });

})(window, App);

//number
(function (global, App) {
    "use strict";

    var tokenCache = {},
        formatterPool = {},
        math = Math;

    function tokenize(format) {
        var i = 0, l = format.length, c,
            escaped = false,
            quote = false,
            result = {
                plus: {
                    ints: []
                }
            },
            current = result.plus.ints,
            section = result.plus,
            sectionPos = 0,
            sectionName,
            isInts = true,
            prepareSeparator = function (section) {
                var i = 0,
                    token,
                    holder = false,
                    separator = false,
                    ints = section.ints;
                /*jshint loopfunc: true */
                while ((function () {
                    if (ints.length && ints[ints.length - 1].type === ",") {
                        section.pows = (section.pows || 0) + 1;
                        ints.pop();
                        return true;
                    }
                    return false;
                })()) { }
                while (i < ints.length) {
                    token = ints[i];
                    if (!App.isStr(token)) {
                        if (token.holder) {
                            if (holder && separator) {
                                section.separate = true;
                            }
                            holder = true;
                        } else if (token.separator) {
                            separator = true;
                            ints.splice(i, 1);
                            i--;
                        } else {
                            holder = false;
                            separator = false;
                        }
                    }
                    i++;
                }

            };

        if (tokenCache[format]) {
            return tokenCache[format];
        }

        for (; i < l; i++) {

            c = format.charAt(i);
            if (escaped) {
                current.push(c);
                escaped = false;
            } else if (c === "\\") {
                escaped = true;
            } else if (c === "\"" || c === "'") {
                if (quote === c) {
                    quote = false;
                } else {
                    quote = c;
                }
            } else if (quote) {
                current.push(c);
            } else if (c === "0" || c === "#") {
                current.push({
                    type: c,
                    holder: true
                });
            } else if (c === ",") {
                if (isInts) {
                    current.push({
                        type: c,
                        separator: true
                    });
                }
            } else if (c === "%" || c === "‰") {
                current.push(c);
                if (c === "%") {
                    section.parcent = (section.parcent || 0) + 1;
                } else if (c === "‰") {
                    section.permil = (section.permil || 0) + 1;
                }
            } else if (c === ".") {
                if (isInts) {
                    isInts = false;
                    current = [];
                    result[(sectionPos === 0) ? "plus" : (sectionPos === 1 ? "minus" : "zero")].decs = current;
                }
            } else if (c === ";") {
                prepareSeparator(section);
                isInts = true;
                if (sectionPos < 2) {
                    sectionName = sectionPos === 0 ? "minus" : "zero";
                    result[sectionName] = { ints: [] };
                    section = result[sectionName];
                    current = section.ints;
                    sectionPos++;
                } else {
                    break;
                }
            } else {
                current.push(c);
            }
        }

        prepareSeparator(section);

        tokenCache[format] = result;
        return result;
    }

    function buildText(value, tokens) {
        var isMinus = value < 0,
            targetVal = value,
            targetStr,
            i, j, l,
            part, tokenPart, targetPart, tokenPartVal,
            result = { ints: "", decs: "" },
            dec,
            hasDec = false,
            hasToken = function (v) {
                if (!v) {
                    return false;
                }
                if (v.ints && v.ints.length) {
                    return v;
                }
                return false;
            },
            targetTokens = isMinus ? (hasToken(tokens.minus) || tokens.plus) : tokens.plus,
            hasDecPlaceholder = function (v) {
                var i, l;
                if (!v) {
                    return false;
                }
                for (i = 0, l = v.length; i < l; i++) {
                    if (v[i].holder) {
                        return true;
                    }
                }
                return false;
            },
            splitPart = function (val) {
                var splited = val.split(".");
                if (splited.length === 1) {
                    splited[1] = "";
                }
                return splited;
            },
            exponentToNumStr = function (val) {
                var ePos = val.indexOf("e");
                if (ePos < 0) {
                    return val;
                }
                var mantissa = val.substr(0, ePos);
                var exponent = parseInt(val.substr(ePos + 1), 10);
                var isMinus = val.charAt(0) === "-";
                if (isMinus) {
                    mantissa = mantissa(1);
                }
                var dotPos = mantissa.indexOf(".");
                mantissa = mantissa.replace(".", "");
                if (dotPos < 0) {
                    dotPos = mantissa.length;
                }
                dotPos = dotPos + exponent;
                if (dotPos <= 0) {
                    return "0." + (new Array(math.abs(dotPos))).join("0") + mantissa;
                } else if (mantissa.length <= dotPos) {
                    return mantissa + (new Array(dotPos - mantissa.length + 1)).join("0");
                }
                return mantissa.substr(0, dotPos) + "." + mantissa.substr(dotPos);
            },
            hasAllStrTokenPart = function (val, length) {
                var i = 0;
                for (; i < length; i++) {
                    if (!App.isStr(val[i])) {
                        return false;
                    }
                }
                return true;
            };

        if (targetTokens.parcent > 0) {
            targetVal = targetVal * math.pow(100, targetTokens.parcent);
        }
        if (targetTokens.permil > 0) {
            targetVal = targetVal * math.pow(1000, targetTokens.permil);
        }
        if (targetTokens.pows > 0) {
            targetVal = targetVal / math.pow(1000, targetTokens.pows);
        }

        targetStr = exponentToNumStr(math.abs(targetVal) + "");
        targetVal = parseFloat(targetStr);

        if (targetVal === 0) {
            targetTokens = hasToken(tokens.zero) || targetTokens;
            targetStr = "0";
        } else if (targetVal < 1 && !hasDecPlaceholder(targetTokens.decs)) {
            targetTokens = hasToken(tokens.zero) || targetTokens;
            targetStr = "0";
        }

        part = splitPart(targetStr);
        tokenPart = targetTokens.ints;
        targetPart = part[0];
        hasDec = false;

        for (i = tokenPart.length - 1; i > -1; i--) {
            tokenPartVal = tokenPart[i];
            if (App.isStr(tokenPartVal)) {
                result.ints = tokenPartVal + result.ints;
            } else {
                result.ints = (targetPart.length !== 0 ? targetPart.substr(targetPart.length - 1) :
                    tokenPartVal.type === "0" ? "0" : "") + result.ints;
                targetPart = targetPart.substr(0, targetPart.length - 1);
                if (targetTokens.separate) {
                    if ((part[0].length - targetPart.length) % 3 === 0 && targetPart.length !== 0) {
                        result.ints = "," + result.ints;
                    }
                }

                //!TypyArray(tokenPart).take(i).some(function (v) { return !isStr(v); })
                if (hasAllStrTokenPart(tokenPart, i)) {
                    if (targetTokens.separate) {
                        for (j = targetPart.length; j; j--) {
                            result.ints = targetPart.charAt(j - 1) + result.ints;
                            targetPart = targetPart.substr(0, targetPart.length - 1);
                            if ((part[0].length - targetPart.length) % 3 === 0 && targetPart.length !== 0) {
                                result.ints = "," + result.ints;
                            }
                        }
                    } else {
                        result.ints = targetPart + result.ints;
                    }
                }
            }
        }

        tokenPart = targetTokens.decs || [];
        targetPart = part[1];

        for (i = 0, l = tokenPart.length; i < l; i++) {
            tokenPartVal = tokenPart[i];
            if (App.isStr(tokenPartVal)) {
                result.decs += tokenPartVal;
            } else {
                dec = targetPart.charAt(0) ? targetPart.charAt(0) :
                    tokenPartVal.type === "0" ? "0" : "";
                if (dec) {
                    hasDec = true;
                }
                result.decs += dec;
                targetPart = targetPart.substr(1);
            }
        }
        return ((isMinus && targetTokens === tokens.plus) ? "-" : "") + result.ints + (hasDec ? "." + result.decs : result.decs);
    }

    function toFormatedText(value, format) {
        var tokens = tokenize(format);
        return buildText(value, tokens);
    }

    App.num = {
        format: function (value, format) {
            if (!App.isNum(value) || !App.isStr(format) || isNaN(value)) {
                return value;
            }
            if (App.isNum(value) && !isFinite(value)) {
                return value;
            }
            if (format in formatterPool) {
                return formatterPool[format](value);
            }
            return toFormatedText(value, format);
        },
        namedFormat: function (name, formatter) {
            if (!App.isStr(name)) {
                return;
            }
            if (App.isFunc(formatter)) {
                formatterPool[name] = formatter;
            } else {
                return formatterPool[name];
            }
        },
        removeNamedFormat: function (name) {
            formatterPool[name] = void 0;
            delete formatterPool[name];
        }
    };
})(window, App);


(function (global) {
    
    /**
     * 指定された形式で一意識別子を作成します。
     * @param {String} format 指定するフォーマット形式。形式を省略した場合は"{0}{1}{2}{3}{4}{5}"の形式で作成
     *                        "N": "{0}{1}{2}{3}{4}{5}",
     *                        "D": "{0}-{1}-{2}-{3}{4}-{5}",
     *                        "B": "{{0}-{1}-{2}-{3}{4}-{5}}",
     *                        "P": "({0}-{1}-{2}-{3}{4}-{5})"
     * @return 作成された一意識別子
     */
    App.uuid = function (format) {
        var rand = function (range) {
                if (range < 0) return NaN;
                if (range <= 30) return Math.floor(Math.random() * (1 << range));
                if (range <= 53) return Math.floor(Math.random() * (1 << 30)) +
                        Math.floor(Math.random() * (1 << range - 30)) * (1 << 30);
                return NaN;
            },
            prepareVal = function (value, length) {
                var result = "000000000000" + value.toString(16);
                return result.substr(result.length - length);
            },
            formats = {
                "N": "{0}{1}{2}{3}{4}{5}",
                "D": "{0}-{1}-{2}-{3}{4}-{5}",
                "B": "{{0}-{1}-{2}-{3}{4}-{5}}",
                "P": "({0}-{1}-{2}-{3}{4}-{5})"
            },
            vals = [
                rand(32),
                rand(16),
                0x4000 | rand(12),
                0x80 | rand(6),
                rand(8),
                rand(48)
            ],
            result = formats[format];

        if (!result) {
            result = formats["N"];
        }
        result = result.replace("{0}", prepareVal(vals[0], 8));
        result = result.replace("{1}", prepareVal(vals[1], 4));
        result = result.replace("{2}", prepareVal(vals[2], 4));
        result = result.replace("{3}", prepareVal(vals[3], 2));
        result = result.replace("{4}", prepareVal(vals[4], 2));
        result = result.replace("{5}", prepareVal(vals[5], 12));
        return result;
    }
})(this);