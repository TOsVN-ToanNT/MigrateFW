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