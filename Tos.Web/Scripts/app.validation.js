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
