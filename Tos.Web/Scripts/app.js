///#source 1 1 /Scripts/app.base.js
/** 最終更新日 : 2018-06-01 **/
; (function (global) {

    "use strict";

    var App;
    
    // 階層のオブジェクトを生成します。
    var define = function (name, props, root) {
            if (!name) return;
            var parent = root || global,
                names = name.split("."),
                i = 0, l = names.length,
                prop;
            for (; i < l; i++) {
                parent = parent[names[i]] = parent[names[i]] || {};
            }
            if (props) {
                for (prop in props) {
                    if (props.hasOwnProperty(prop)) {
                        parent[prop] = props[prop];
                    }
                }
            }
            return parent;
        },
        toString = Object.prototype.toString;

    App = define("App", {
        /**
        * 第１引数に指定された文字列に従ってドットで区切られた階層上にオブジェクトを定義します。
        * 第２引数に指定されているオブジェクトのプロパティを作成したオブジェクトのプロパティに設定します。
        */
        define: define,
        /**
        * 指定された値が String 型かどうかを確認します。
        */
        isStr: function (target) {
            return toString.call(target) === "[object String]";
        },
        /**
        * 指定された値が Number 型かどうかを確認します。
        */
        isNum: function (target) {
            return toString.call(target) === "[object Number]";
        },
        /**
        * 指定された値が Boolean 型かどうかを確認します。
        */
        isBool: function (target) {
            return toString.call(target) === "[object Boolean]";
        },
        /**
        * 指定された値が Date 型かどうかを確認します。
        */
        isDate: function (target) {
            return toString.call(target) === "[object Date]";
        },
        /**
        * 指定された値が Function 型かどうかを確認します。
        */
        isFunc: function (target) {
            return toString.call(target) === "[object Function]";
        },
        /**
        * 指定された値が Array 型かどうかを確認します。
        */
        isArray: function (target) {
            return toString.call(target) === "[object Array]";
        },
        /**
        * 指定された値が undefined かどうかを確認します。
        */
        isUndef: function (target) {
            return typeof target === "undefined";
        },
        /**
        * 指定された値が null かどうかを確認します。
        */
        isNull: function (target) {
            return target === null;
        },
        /**
        * 指定された値が null もしくは undefined かどうかを確認します。
        */
        isUndefOrNull: function (target) {
            return (this.isUndef(target) || this.isNull(target));
        },
        /**
        * 指定された値が 数字 かどうかを確認します。
        */
        isNumeric: function (target) {
            return !isNaN(parseFloat(target)) && isFinite(target);
        },
        /** 
         * 指定された値が undefined かどうかによって戻す値を判断します。
         * @param {Object} target 判定する値
         * @param {Object} def undefined の場合に戻す値
         * @return {Object} undefinedの場合は def 、そうでない場合は target 
         */ 
        ifUndef: function(target, def){
            return App.isUndef(target) ? def : target;
        },
        /** 
         * 指定された値が null かどうかによって戻す値を判断します。
         * @param {Object} target 判定する値
         * @param {Object} def null の場合に戻す値
         * @return {Object} nullの場合は def 、そうでない場合は target 
         */ 
        ifNull: function(target, def){
            return App.isNull(target) ? def : target;
        },
        /** 
         * 指定された値が 利用可能かどうかを判断します。
         * @param {Object} target 判定する値
         * @return {Boolean}  利用不可能な場合は true 、そうでない場合は false 
         */ 
        isUnusable: function (target) {
            return App.isUndef(target) || App.isNull(target) ||
                   (App.isNum(target) ? isNaN(target) || !isFinite(target) : false);
        },
        /** 
         * 指定された値が 利用可能かどうかによって戻す値を判断します。
         * @param {Object} target 判定する値
         * @param {Object} def 利用不可能な場合に戻す値
         * @return {Object}  利用不可能な場合は def 、そうでない場合は target 
         */ 
        ifUnusable: function(target, def){
            return App.isUnusable(target) ? def : target;
        },
        /** 
         * 指定された値が undefined もしくは null かどうかによって戻す値を判断します。
         * @param {Object} target 判定する値
         * @param {Object} def undefined もしくは null の場合に戻す値
         * @return {Object}   undefined もしくは null の場合は def 、そうでない場合は target
         */ 
        ifUndefOrNull: function(target, def){
            return (App.isUndef(target) || App.isNull(target)) ? def : target;
        },
        /**
        * 指定された値が null もしくは undefined もしくは 空文字かどうかを確認します。
        */
        isUndefOrNullOrStrEmpty: function (target) {
            return this.isUndef(target) || this.isNull(target) || (this.isStr(target) && target.length === 0);
        },
        /**
        * 指定された値が null もしくは undefined もしくは 空の配列かどうかを確認します。
        */
        isUndefOrNullOrArrayEmpty: function (target) {
            return this.isUndef(target) || this.isNull(target) || (this.isArray(target) && target.length === 0);
        },
        /**
        * 指定された値が undefined もしくは null もしくは 空文字かどうかによって戻す値を判断します。
        * @param {Object} target 判定する値
        * @param {Object} def undefined もしくは null もしくは 空文字の場合に戻す値
        * @return {Object}   undefined もしくは null もしくは 空文字の場合は def 、そうでない場合は target
        */
        ifUndefOrNullOrStrEmpty: function (target, def) {
            return (this.isUndef(target) || this.isNull(target) || (this.isStr(target) && target.length === 0)) ? def : target;
        },
        /**
        * 指定された値が undefined もしくは null もしくは 空の配列かどうかによって戻す値を判断します。
        * @param {Object} target 判定する値
        * @param {Object} def undefined もしくは null もしくは 空の配列の場合に戻す値
        * @return {Object}   undefined もしくは null もしくは 空の配列の場合は def 、そうでない場合は target
        */
        ifUndefOrNullOrArrayEmpty: function (target, def) {
            return (this.isUndef(target) || this.isNull(target) || (this.isArray(target) && target.length === 0)) ? def : target;
        },

    });

    /**
    * 指定されたタイプの DOM ストレージにアクセスするオブジェクトを取得します。
    */
    App.storage = function (type) {
        var storage = type === "session" ? window.sessionStorage :
                      type === "local" ? window.localStorage : undefined;
        if (!storage) {
            return;
        }
        return {
            /**
            * 指定されたキーに対応する JSON でシリアライズされた文字列をデシリアライズした値を取得します。
            */
            get: function (key) {
                var value = storage.getItem(key);
                if (!App.isUndef(value)) {
                    return JSON.parse(value);
                }
            },
            /**
            *  指定されたキーで、指定された値を JSON でシリアライズしてDOMストレージに格納します。
            */
            set: function (key, value) {
                value = JSON.stringify(value);
                return storage.setItem(key, value);
            },
            /**
            * 指定されたキーに該当する値をDOMストレージから削除します。
            */
            remove: function (key) {
                storage.removeItem(key);
            },
            /**
            * 全ての値を削除します。
            */
            clear: function () {
                storage.clear();
            }
        };
    };
    /**
    * Session DOM ストレージにアクセスするオブジェクトを取得します。
    */
    App.storage.session = function () {
        return App.storage("session");
    };
    /**
    * Local DOM ストレージにアクセスするオブジェクトを取得します。
    */
    App.storage.local = function () {
        return App.storage("local");
    };

})(window);

//async
; (function (global, $, App) {

    "use strict";

    var prepare = function (value) {
            var p,
                isArray = App.isArray(value.successes);
            value.key = {
                successes: [],
                fails: []
            };
            for (p in value.successes) {
                if (value.successes.hasOwnProperty(p)) {
                    value.key.successes.push(isArray ? parseInt(p, 10) : p);
                }
            }
            for (p in value.fails) {
                if (value.fails.hasOwnProperty(p)) {
                    value.key.fails.push(isArray ? parseInt(p, 10) : p);
                }
            }
            return value;
        },
        prepareChainArgs = function (args, funcCount) {
            var key, func, coe = false;
            if (args.length === 0) {
                return {
                    key: funcCount,
                    continueOnError: false
                };
            }
            key = args[0];
            func = args[1];
            coe = !!args[2];
            if (App.isFunc(key)) {
                coe = !!func;
                func = key;
                key = funcCount;
            }
            return {
                key: key,
                func: func,
                continueOnError: coe
            };
        },
        wrapProc = function (value, wait, allwaysReject) {
            var defer = $.Deferred(),
                resolve = allwaysReject ? defer.reject : defer.resolve,
                timeout;

            function resolveResult(result) {
                if (result && App.isFunc(result.promise)) {
                    result.promise()
                        .done(resolve)
                        .fail(defer.reject)
                        .progress(defer.notify);
                } else {
                    resolve(result);
                }
            }

            if (App.isNum(wait) && wait > 0) {
                timeout = global.setTimeout;
            } else {
                timeout = global.setImmediate || global.setTimeout;
            }
            timeout(function () {
                var result;
                if (App.isFunc(value)) {
                    try {
                        result = value();
                    } catch (e) {
                        defer.reject(e);
                        return;
                    }
                    resolveResult(result);
                } else {
                    resolveResult(value);
                }
            }, App.isNum(wait) ? wait : 0);
            return defer.promise();
        },
        wrap = function(value, wait) {
            return wrapProc(value, wait, false);
        };

    App.async = {
        /**
        * jQuery Promise を利用して、指定された value を結果値とした非同期処理を実行します。
        * value が関数の場合は、関数の戻り値が結果値として利用されます。
        * また value の値または value に指定した関数の戻りの値が jQuery Promise の場合は、
        * その jQuery Promise の結果を待ちます。
        */
        wrap: wrap,
        /**
        * jQuery Promise を利用して引数で指定した時間待機します。
        */
        timeout: function (wait) {
            var defer = $.Deferred(),
                timeout;
            if (App.isNum(wait) && wait > 0) {
                timeout = global.setTimeout;
            } else {
                timeout = global.setImmediate || global.setTimeout;
            }
            timeout(function () {
                defer.resolve();
            }, App.isNum(wait) ? wait : 0);
            return defer.promise();
        },
        /**
        * reject される jQuery Promise を返します。
        */
        fail: function (value, wait) {
            return wrapProc(value, wait, true);;
        },

        /**
         * wrap のシノニムです。
         */
        success: wrap,

        all: function (args) {

            if (arguments.length > 1) {
                args = Array.prototype.slice.call(arguments);
            }
            var deferreds = App.isArray(args) ? [] : {},
                result = {
                    successes: App.isArray(args) ? [] : {},
                    fails: App.isArray(args) ? [] : {}
                },
                hasReject = false,
                remaining = 0,
                deferred = $.Deferred(),
                updateDeferreds = function (value, key, isResolve) {
                    var res = isResolve ? result.successes : result.fails;
                    hasReject = hasReject ? true : (isResolve ? false : true);
                    res[key] = value;
                    if (!(--remaining)) {
                        if (hasReject) {
                            deferred.reject(prepare(result));
                        } else {
                            deferred.resolve(prepare(result));
                        }
                    }
                };
            $.each(args, function (key, item) {
                if (App.isFunc(item)) {
                    try {
                        item = item();
                        if (!item || !App.isFunc(item.promise)) {
                            item = $.Deferred().resolve(item);
                        }
                    } catch (e) {
                        item = $.Deferred().reject(e);
                    }
                }
                if (!item || !App.isFunc(item.promise)) {
                    item = $.Deferred().resolve(item);
                }
                if (App.isFunc(item.promise)) {
                    deferreds[key] = item;
                    remaining++;
                }
            });

            if (remaining > 0) {
                $.each(deferreds, function (index, item) {
                    item.done(function (value) {
                        updateDeferreds(value, index, true);
                    }).fail(function (value) {
                        updateDeferreds(value, index, false);
                    });
                });
            } else {
                deferred.resolve({
                    successes: {},
                    fails: {},
                    key: {
                        successes: [],
                        fails: []
                    }
                });
            }

            return deferred.promise();
        },

        /**
         * 指定された $.Deferred オブジェクトを直列処理する機能を提供します。
         * @param {Function} args 戻り値が $.Deferred オブジェクトとなっている関数
         * @return プロミスオブジェクト
         */
        chain: function (root) {
            var funcs = [prepareChainArgs(arguments, 0)],
            results = { successes: {}, fails: {} },
            exec = function (defer, lastResult, prevSuccess) {
                var target,
                    subdefer,
                    preparedResult;
                if (!funcs.length) {
                    preparedResult = prepare(results);
                    (preparedResult.key.fails.length ? defer.reject : defer.resolve)(preparedResult);
                    return;
                }

                target = funcs.shift();
                if (!App.isFunc(target.func)) {
                    if (App.isFunc(target.func.promise)) {
                        subdefer = target.func;
                    } else {
                        subdefer = $.Deferred().resolve(target.func);
                    }
                } else {
                    try {
                        subdefer = target.func(lastResult, prevSuccess);
                    } catch (e) {
                        if (!target.continueOnError) {
                            results.fails[target.key] = e;
                            defer.reject(prepare(results));
                            return;
                        }
                        subdefer = $.Deferred().reject(e);
                    }
                    if (!subdefer || !App.isFunc(subdefer.promise)) {
                        subdefer = $.Deferred().resolve(subdefer);
                    }
                }
                subdefer.promise().done(function (result) {
                    results.successes[target.key] = result;
                    exec(defer, result, true);
                }).fail(function (result) {
                    results.fails[target.key] = result;
                    if (!target.continueOnError) {
                        defer.reject(prepare(results));
                        return;
                    }
                    exec(defer, result, false);
                });
            },
            self = {
                /**
                * 指定された $.Deferred オブジェクトを直列処理する機能を提供します。
                * @param {Function} args 戻り値が $.Deferred オブジェクトとなっている関数
                * @return プロミスオブジェクト
                */
                chain: function (func) {
                    funcs.push(prepareChainArgs(arguments, funcs.length));
                    return self;
                },
                /** 
                 * $.Deferred オブジェクトの処理結果を取得するためのプロミスオブジェクトを作成します。
                 * @return プロミスオブジェクト
                 */
                promise: function () {
                    var defer = $.Deferred();
                    if (!funcs.length) {

                        defer.resolve({
                            successes: {},
                            fails: {},
                            key: {
                                successes: [],
                                fails: []
                            }
                        });

                    } else {
                        exec(defer);
                    }
                    return defer.promise();
                },
                /** 
                 * $.Deferred オブジェクトの処理が成功した場合に実行する関数を設定します。
                 * @return プロミスオブジェクト
                 */
                 done: function (handler) {
                    return self.promise().done(handler);
                },
                /** 
                 * $.Deferred オブジェクトの処理が失敗した場合に実行する関数を設定します。
                 * @return プロミスオブジェクト
                 */
                fail: function (handler) {
                    return self.promise().fail(handler);
                },
                /** 
                 * $.Deferred オブジェクトの処理が完了した場合に実行する関数を設定します。
                 * @return プロミスオブジェクト
                 */
                always: function (handler) {
                    return self.promise().always(handler);
                }
            };
            return self;
        }
    };

    var uri = App.define("App.uri", {});

    uri.queryStrings = (function(a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i)
        {
            var p=a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'));

})(window, jQuery, App);
///#source 1 1 /Scripts/app.obj.js
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
///#source 1 1 /Scripts/app.ui.js
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
///#source 1 1 /Scripts/app.ajax.js
/** 最終更新日 : 2016-10-17 **/
// ajax
(function (global, $, undef) {

    $.ajaxSetup({
        cache: false
    });

    /**
     * Ajax リクエストに関する関数を定義します。
     * リクエストを実行する関数はプロミスオブジェクトを戻り値として返却するため、
     * 複数の非同期処理の待ち合わせや順次処理などの実装が可能となります。
     */
    var ajax = App.define("App.ajax"),
        errorMessageHandlers = [];

    var buildAjaxParameters = function (url, data, type, options) {

        // ajax settings の初期化を行います。
        var settings = {
            url: url,
            type: type,
            data: type == "GET" ? data : JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            converters: {},
            headers: {}
        };

        // options に E-TAG の設定がある場合にはヘッダーに e-tag の設定を行います。
        if (options && options.eTag) {
            setETag(method, options.eTag, settings.headers);
            delete options.eTag;
        }

        //TODO x-http-method を利用する必要がある場合はここを有効化
        if (options && options.enableXHTTP) {
            if (type === "PUT") {
                settings.type = "POST";
                settings.headers["x-http-method"] = "MERGE"
            }
        }

        if (type === "GET") {
            settings.converters["text json"] = function (data) {
                return JSON.parse(data, function (key, val) {
                    return val;
                });
            }
        }

        return $.extend({}, settings, options);
    };

    var srv;
    $.each(["odata", "webapi"], function (srvIndex, srvName) {
        
        srv = {};
        ajax[srvName] = srv;

        $.each(["get", "put", "post", "delete"], function (index, item) {

            srv[item] = function (url, data, options) {
                var method = item;
                return buildAjaxParameters(url, data, method.toUpperCase(), options);
            };

        });
    });

    var errorHandler = {
        "text/html": function (result) {
            var message = result.responseText.match(/\<title\>(.*)\<\/title\>/i);
            message = (message && message.length > 1) ? message[1] : undefined;
            return message;

        },
        "application/json": function (result) {
            var ret = JSON.parse(result.responseText),
                message = "raise error";
            if (ret.error && ret.error.message) {
                message = ret.error.message.value;
            } else if (ret["odata.error"] && ret["odata.error"].message) {
                message = ret["odata.error"].message.value;
            } else if (ret.Message) {
                message = ret.Message;
            }

            return message;
        }
    };


    /**
     * Ajax エラーの際のエラーハンドラーを追加します。 
     * @param {String} key エラーハンドラーのキー名 
     * @param {Function} handler 引数にメッセージ及び Ajax レスポンス、戻り値として message プロパティをもつオブジェクトを返すエラーハンドラー関数
     */
    ajax.addErrorMessageHandler = function (key, handler) {
        var i = 0,
            length = errorMessageHandlers.length,
            item;
        for (; i < length; i++) {
            item = errorMessageHandlers[i];
            if (item.key === key) {
                break;
            }
            item = undef;
        }
        if (item) {
            item.handler = handler;
        } else {
            errorMessageHandlers.push({
                key: key,
                handler: handler
            });
        }
    };

    /**
     * Ajax エラーの際のエラーハンドラーを削除します。
     * @param {String} key エラーハンドラーのキー名
     */
    ajax.removeErrorMessageHandler = function (key) {
        var i = 0,
            length = errorMessageHandlers.length,
            index;
        for (; i < length; i++) {
            index = i;
            item = errorMessageHandlers[i];
            if (item.key === key) {
                break;
            }
            item = undef;
        }
        if (item) {
            errorMessageHandlers.splice(index, 1);
        }
    }

    var handleMessage = function (message, response) {
        var i = 0,
            length = errorMessageHandlers.length,
            handler,
            handleResult;

        if (!App.isStr(message)) {
            if (typeof message === "undefined" || message == null) {
                message = "";
            }
            message = message.toString();
        }

        for (; i < length; i++) {
            handler = errorMessageHandlers[i].handler;
            if (handler) {
                handleResult = handler(message, response);
                if (handleResult) {
                    return handleResult;
                }
            }
        }
        return {
            message: message,
            type: "unknown",
            level: "critical"
        };
    };

    if (!ajax.handleError) {

        ajax.handleError = function (result) {

            if (!result.getResponseHeader) {
                return {
                    message: result.message ? result.message : "通信で不明なエラーが発生しました。",
                    status: 500
                };
            }

            var contentType = result.getResponseHeader("content-type"),
                mime = contentType ? contentType.split(";")[0] : contentType,
                message = "",
                messageHandleResult;

            if (mime && errorHandler[mime]) {
                message = errorHandler[mime](result);
            } else {
                if (result.statusText) {
                    message = result.statusText;
                }
            }

            messageHandleResult = handleMessage(message, result);

            return {
                message: messageHandleResult.message,
                rawText: result.responseText,
                status: result.status,
                statusText: result.statusText,
                response: result,
                type: messageHandleResult.type,
                level: messageHandleResult.level
            };
        };
    }


    var setETag = function (method, eTag, header) {
        if (eTag && (method === "put" || method === "delete")) {
            header["If-Match"] = eTag;
        }
    };


})(window, jQuery);


///#source 1 1 /Scripts/app.validation.js
/** 最終更新日 : 2016-10-17 **/
; (function (global, App, $, undef) {

    "use strict";

    /**
     * 定義を保持してバリデーションを実行するオブジェクトを定義します。
     */
    function Validator(definition, options) {
        this._context = {
            def: definition || {},
            options: options || {}
        };
    };

    var isEmpty = function (value) {
            return App.isUndef(value) || App.isNull(value) || (App.isStr(value) && value.length === 0);
        },
        //バリデーションメソッド
        methods = {
            //required は特別扱いのため、内部で定義
            required: {
                name: "required",
                handler: function (value, param, opts, done) {
                    if (!param) { //param が falsy だったら必須ではない
                        done(true);
                    }
                    done(!isEmpty(value));
                },
                priority: -1
            }
        },
        //メッセージの保持
        messages = {
            required: "this item required"
        },
        //validate関数に渡された引数を整形します。
        prepareValidateArgs = function (args) {
            var result = {
                values: {},
                options: {}
            };
            // 引数が2つで第１引数が文字列の場合は、 validate("item1", "value") のように
            // 項目名と値が渡されたとみなす
            if (args.length === 2 && App.isStr(args[0])) {
                result.values[args[0]] = args[1];
                result.options = args[2] || {};
                return result;
            } else {
                result.values = args[0] || {};
                if (App.isStr(args[1])) {
                    result.options = {
                        groups: [args[1]]
                    }
                } else if (App.isArray(args[1])) {
                    result.options = {
                        groups: args[1]
                    }
                } else {
                    result.options = args[1] || {};
                }
                return result;
            }
        },
        prepareExecuteTargets = function (targets, defs) {
            var result = {},
                i, l, defKey, def,
                groups,
                hasGroup,
                includeItems = [];

            if (!targets) {
                return defs;
            }
            if (App.isStr(targets)) {
                targets = [targets];
            }
            if (!App.isArray(targets)) {
                return defs;
            }
            for (defKey in defs) {
                if (!defs.hasOwnProperty(defKey)) {
                    continue;
                }
                def = defs[defKey];
                
                groups = App.isStr(def.groups) ? [def.groups] : 
                         App.isArray(def.groups) ? def.groups : [];
                hasGroup = targets.some(function (value, index) {
                    return groups.indexOf(value) > -1 || groups.length === 0;
                });
                if (hasGroup) {
                    result[defKey] = defs[defKey];
                }
            }
            return result;
            
        },
        //項目ごとのバリデーションを実行します。
        validateItem = function (item, values, options, defs) {
            var defer = $.Deferred(),
                value = values[item],
                def = defs[item],
                rules = def.rules || {},
                msgs = def.messages || {},
                opts = def.options || {},
                grps = def.groups,
                method, targetMethod,
                execMethods = [];

            for (method in rules) {
                if (!rules.hasOwnProperty(method)) {
                    continue;
                }
                targetMethod = methods[method];
                if (!targetMethod) {
                    if (!App.isFunc(rules[method])) {
                        throw new Error("custom method value must be function");
                    }
                    //methodが登録されておらず値が定義の値が関数の場合は
                    //カスタムmethodとして利用。但し優先度は最低に設定
                    targetMethod = {
                        isCustom: true,
                        name: method,
                        handler: rules[method],
                        priority: Number.MAX_VALUE
                    };
                }
                execMethods.push(targetMethod);
            }
            //優先度順にソートします。
            execMethods.sort(function (left, right) {
                if (left.priority < right.priority) return -1;
                if (left.priority > right.priority) return 1;
                return 0;
            });
            executeFirstMethod(item, defer, execMethods, value, rules, msgs, opts, grps, options);
            return defer.promise();
        },
        getMessage = function (item, value, method, rules, msgs, opts, isCustom) {
            var format = msgs[method] || messages[method] || "";
            return App.str.format(format, $.extend({}, opts, {
                value: value,
                item: item,
                method: method,
                param: isCustom ? "" : rules[method]
            }));
        },
        //バリデーションメソッドを順番に実行します。
        executeFirstMethod = function (item, defer, execMethods, value, rules, msgs, opts, grps, execOptions) {
            var execMethod,
                callback = function (result) {
                    if (!result) {
                        return defer.reject({
                            item: item,
                            message: getMessage(item, value, execMethod.name, rules, msgs, opts, execMethod.isCustom)
                        });
                    } else {
                        executeFirstMethod(item, defer, execMethods, value, rules, msgs, opts, grps, execOptions);
                    }
                },
                filter = execOptions.filter || function () { return true; };
            //バリデーションメソッドがない場合は、すべて完了してエラーがなかったとみなし
            //成功で完了する
            if (!execMethods.length) {
                return defer.resolve({
                    item: item
                });
            }

            execMethod = execMethods.shift();
            if (!execMethod || !App.isFunc(execMethod.handler)) {
                executeFirstMethod(item, defer, execMethods, value, rules, msgs, opts, grps, execOptions);
            } else {
                if(filter(item, execMethod.name, execOptions.state, {
                    item: item,
                    method: execMethod.name,
                    options: opts[execMethod.name],
                    groups: grps,
                    executeOptions: execOptions,
                    executeGroups: execOptions.groups
                })){
                    if (execMethod.isCustom) {
                        execMethod.handler(value, opts[execMethod.name], execOptions.state, callback);
                    } else {
                        execMethod.handler(value, rules[execMethod.name], opts[execMethod.name], callback);
                    }
                } else {
                    executeFirstMethod(item, defer, execMethods, value, rules, msgs, opts, grps, execOptions);
                }
            }
        },
        toNum = function (val) {
            if (isEmpty(val)) {
                return undef;
            }

            if (!App.isNum(val)) {
                if (App.isNumeric(val)) {
                    return parseFloat(val);
                } else {
                    return undef;
                }
            }
            return val;
        };

    Validator.prototype = {
        /**
        * 定義内に指定されたアイテム名があるかどうかを取得します。
        */
        hasItem: function (itemName) {
            if (!this._context) return false;
            var def = this._context.def;
            return !!def[itemName];
        },
        /**
        * 指定された値のバリデーションを実行します。
        */
        validate: function (values, options) {
            var self = this,
                defer = $.Deferred(),
                successes = [],
                fails = [],
                count = 0,
                completed = false,
                arg, defs, item, itemResult,
                keys = [], i, l,
                execTargets,
            //全てのvalidationItemの実行が完了したかをチェックして
            //完了していた場合、promise を完了させます。
                checkComplete = function () {
                    var result;
                    if (!completed && (successes.length + fails.length) >= count) {
                        completed = true;
                        result = {
                            successes: successes,
                            fails: fails
                        };
                        //validate のオプションに beforeReturnResult 関数が指定されている場合は、
                        //実行します。
                        if (App.isFunc(options.beforeReturnResult)) {
                            options.beforeReturnResult(result, options.state);
                        }
                        //validator のオプションに success 関数または fail 関数が指定されている場合は、
                        //success 関数には成功データ、fail 関数には失敗データを渡して実行します。
                        if (self._context && self._context.options) {
                            if (App.isFunc(self._context.options.success)) {
                                self._context.options.success(result.successes, options.state);
                            }
                            if (App.isFunc(self._context.options.fail)) {
                                self._context.options.fail(result.fails, options.state);
                            }
                            if (App.isFunc(self._context.options.always)) {
                                self._context.options.always(result.successes, result.fails, options.state);
                            }
                        }
                        //結果を deferred に設定します。
                        (result.fails.length ? defer.reject : defer.resolve)(result, options.state);

                    }
                };

            if (!this._context || !this._context.def) {
                return defer.resolve();
            }
            arg = prepareValidateArgs(Array.prototype.slice.call(arguments));
            defs = this._context.def;
            values = arg.values;
            options = arg.options;
            execTargets = prepareExecuteTargets(options.groups, defs);

            for (item in values) {
                if (!values.hasOwnProperty(item) || !(item in execTargets)) {
                    continue;
                }
                keys.push(item);
                count++;
            }

            for (i = 0, l = keys.length; i < l; i++) {
                item = keys[i];
                //validationItemを実行し、結果を保存します。
                /*jshint loopfunc: true */
                validateItem(item, values, options, execTargets).done(function (result) {
                    successes.push(result);
                    checkComplete();
                }).fail(function (result) {
                    fails.push(result);
                    checkComplete();
                });
            }
            //すべてのvalidationItemが完了しているかをチェックします。
            //非同期バリデーションが含まれていない場合は、この時点で完了されていますが、
            //非同期バリデーションが含まれている場合は、この時点では完了していません。
            checkComplete();

            return defer.promise();
        }
    };
    /**
    * Validation オブジェクトを指定された定義およびオプションで作成します。
    */
    App.validation = function (definition, options) {
        if (definition instanceof Validator) {
            definition._context.options = $.extend({}, options, definition._context.options);
            return definition;
        }
        return new Validator(definition, options);
    };

    /**
    * Validation 用の関数を追加します。
    */
    App.validation.addMethod = function (name, handler, message, priority) {
        methods[name] = {
            name: name,
            handler: handler,
            priority: (!App.isNum(priority) || isNaN(priority) || isFinite(priority)) ? 10 : Math.max(0, priority)
        };
        messages[name] = message || "";
    };

    /**
    * Validatin 用の関数を削除します。
    */
    App.validation.removeMethod = function (name) {
        if (name in methods) {
            delete methods[name];
        }
        if (name in messages) {
            delete messages[name];
        }
    };

    /**
    * 指定された値が空かどうかをチェックします。
    * これは required メソッドと同じチェックが実行されます。
    */
    App.validation.isEmpty = isEmpty;

    /**
    * 指定された値が数値のみかどうかを検証します。
    * 値が空の場合は、検証を実行しない為成功となります。
    */
    App.validation.addMethod("digits", function (value, param, opts, done) {
        if (!param) {
            return done(true);
        }
        if (isEmpty(value)) {
            return done(true);
        }

        value = "" + value;
        done(/^\d+$/.test(value));

    }, "digits only");

    App.validation.addMethod("integer", function (value, param, opts, done) {
        if (!param) {
            return done(true);
        }
        if (isEmpty(value)) {
            return done(true);
        }
        value = value.replace(/\,/g, "");

        if (App.isNum(value)) {
            return done(isFinite(value) && value > -9007199254740992 && value < 9007199254740992 && Math.floor(value) === value)
        }
        value = "" + value;
        done(value === "0" || /^\-?[1-9][0-9]*$/.test(value));
    }, "a invalid integer");

    /**
    * 指定された値が数値かどうかを検証します。
    * 値が空の場合は、検証を実行しない為成功となります。
    */
    App.validation.addMethod("number", function (value, param, opts, done) {
        if (!param) {
            return done(true);
        }
        if (isEmpty(value)) {
            return done(true);
        }
        value = value.replace(/\,/g, "");

        done(App.isNumeric(value));
    }, "a invalid number");

    /**
    * 指定された値が金額かどうかを検証します。
    * 値が空の場合は、検証を実行しない為成功となります。
    */
    App.validation.addMethod("currency", function (value, param, opts, done) {
        if (!param) {
            return done(true);
        }
        if (isEmpty(value)) {
            return done(true);
        }
        done(/^((-[1-9])?|0?|(?:[1-9]\d{0,2}(,\d{3})*)?(?:\.\d+)?|(?:-[1-9]\d{0,2}(,\d{3})*)?(?:\.\d+)?)$/.test(value));
    }, "a invalid currency");

    /**
    * 指定された値が金額かどうかを検証します。
    * 値が空の場合は、検証を実行しない為成功となります。
    */
    App.validation.addMethod("currencyjp", function (value, param, opts, done) {
        if (!param) {
            return done(true);
        }
        if (isEmpty(value)) {
            return done(true);
        }
        value = "" + value;
//        value = parseFloat(value.replace(/\,|\\/g, ""));
        value = value.replace(/\,|\\/g, "");
        done(/^\-?\d+$/.test(value));

    }, "a invalid currencyjp");

    /**
    * 指定された値がパラメーターで指定された値以下かどうかを検証します。
    * 値が空または数値に変換できない場合、およびパラメーターが数値に変換できない場合は
    * 検証を実行しない為成功となります。
    */
    App.validation.addMethod("currencyjpmax", function (value, param, opts, done) {

        if (isEmpty(value)) {
            return done(true);
        }

        value = "" + value;
//        value = parseFloat(value.replace(/\,|\\/g, ""));
        value = value.replace(/\,|\\/g, "");

        value = toNum(value);
        param = toNum(param);
        if (App.isUndef(value) || App.isUndef(param)) {
            return done(true);
        }
        return done(value <= param);
    }, "a invalid currencyjpmax");

    /**
    * 指定された値がパラメーターで指定された値以上かどうかを検証します。
    * 値が空または数値に変換できない場合、およびパラメーターが数値に変換できない場合は
    * 検証を実行しない為成功となります。
    */
    App.validation.addMethod("min", function (value, param, opts, done) {

        if (isEmpty(value)) {
            return done(true);
        }
        value = value.replace(/\,/g, "");

        value = toNum(value);
        param = toNum(param);
        if (App.isUndef(value) || App.isUndef(param)) {
            return done(true);
        }
        return done(value >= param);
    }, "a value greater than or equal to {param}");
    /**
    * 指定された値がパラメーターで指定された値以下かどうかを検証します。
    * 値が空または数値に変換できない場合、およびパラメーターが数値に変換できない場合は
    * 検証を実行しない為成功となります。
    */
    App.validation.addMethod("max", function (value, param, opts, done) {

        if (isEmpty(value)) {
            return done(true);
        }
        value = value.replace(/\,/g, "");

        value = toNum(value);
        param = toNum(param);
        if (App.isUndef(value) || App.isUndef(param)) {
            return done(true);
        }
        return done(value <= param);
    }, "a value less than or equal to {param}");
    /**
    * 指定された値がパラメーターで指定された配列のインデックス 0 に指定されている値以上、
    * インデックス 1 に指定されている値以下かどうかを検証します。
    * 値が空または数値に変換できない場合、およびパラメーターが配列でないもしくはインデックス 0 と 1 が数値に変換できない場合は
    * 検証を実行しない為成功となります。
    */
    App.validation.addMethod("range", function (value, param, opts, done) {

        if (isEmpty(value)) {
            return done(true);
        }

        if (!App.isArray(param)) {
            return done(true);
        }
        value = value.replace(/\,/g, "");

        value = toNum(value);
        param[0] = toNum(param[0]);
        param[1] = toNum(param[1]);
        if (App.isUndef(value) || App.isUndef(param[0]) || App.isUndef(param[1])) {
            return done(true);
        }
        return done(value >= param[0] && value <= param[1]);
    }, "a value between {param[0]} and {param[1]}");

})(window, App, jQuery);

(function (global, App, $, undef) {

    "use strict";

    var validatorDataKey = "app-validator-key",
        targetElements = "input, select, textarea";

    /**
    * jQuery 用のバリデーション拡張の実態を定義します。
    */
    function JqValidator(validator, target, options) {
        this._context = {
            validator: validator,
            target: target,
            options: options || {}
        };
    }

    JqValidator.prototype = {
        /**
        * 実際のバリデーションを実行する App.validator のオブジェクトを返します。
        */
        inner: function () {
            return this._context.validator;
        },
        /**
        * バリデーションを実行します。
        */
        validate: function (options) {
            var self, elems, elem, param = {}, elemHolder = {},
                i = 0, l,
                itemName, inner = this.inner(),
                result;

            if (!this._context || !this._context.target) {
                return;
            }
            //引数先頭が文字列の場合は、グループ名が指定されたとみなす
            if (App.isStr(options)) {
                options = {
                    groups: [options]
                };
            }
            //引数が配列の場合は、グループ名が指定されたとみなす
            if(App.isArray(options)){
                options = {
                    groups: options
                }
            }
            options = $.extend(options || {}, {
                //結果に element の値を付加するために beforeReturnResult を設定します。
                beforeReturnResult: function (result) {
                    var i, l, target;
                    for (i = 0, l = result.successes.length; i < l; i++) {
                        target = result.successes[i];
                        target.element = elemHolder[target.item];
                    }
                    for (i = 0, l = result.fails.length; i < l; i++) {
                        target = result.fails[i];
                        target.element = elemHolder[target.item];
                    }
                    return result;
                }
            });

            self = this._context.target;
            elems = (function () {
                var targets = options.targets,
                    jq, i = 0, l, target;
                if (targets) {
                    if (App.isArray(targets)) {
                        jq = $();
                        for (l = targets.length; i < l; i++) {
                            jq.add(targets[i]);
                        }
                    } else {
                        jq = $(targets);
                    }
                    return jq;

                }
                return self.find(targetElements);
            })();

                
            //対象となる要素を探し出してパラメーターを生成します。
            for (l = elems.length; i < l; i++) {
                elem = $(elems[i]);
                itemName = elem.attr("data-prop");
                if (!inner.hasItem(itemName)) {
                    itemName = elem.attr("name");
                }
                if (inner.hasItem(itemName)) {
                    param[itemName] = elem.val();
                    elemHolder[itemName] = elem[0];
                }
            }

            result = inner.validate(param, options);
            return result;
        }
    };

    /**
    * jQuery 用の validation 拡張を定義します。
    */
    $.fn.validation = function (define, options) {
        var self = $(this),
            validator, itemName;
        options = options || {};

        if (arguments.length === 0) {
            return self.data(validatorDataKey);
        }

        validator = new JqValidator(App.validation(define, options), self, options);
        self.data(validatorDataKey, validator);

        if (!options.immediate) {
            return validator;
        }

        self.on("change", targetElements, function (e) {
            var target = $(e.currentTarget),
                param = {},
                inner = validator.inner(),
                itemName = target.attr("data-prop");

            if (!itemName) {
                itemName = target.attr("name");
            }

            if (!inner.hasItem(itemName)) {
                return;
            }

            param[itemName] = target.val();
            inner.validate(param, {
                beforeReturnResult: function (result) {
                    if (result.successes.length) {
                        result.successes[0].element = target[0];
                    }
                    if (result.fails.length) {
                        result.fails[0].element = target[0];
                    }
                    return result;
                }
            });
        });

        return validator;
    };

})(window, App, jQuery);

///#source 1 1 /Scripts/app.validation.method.js
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

