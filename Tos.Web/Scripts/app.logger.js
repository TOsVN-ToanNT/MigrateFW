/** 最終更新日 : 2017-10-01 **/
; (function ($, App) {
    "use strict";

    var global = (new Function("return this;"))();
    var targetSinks = [];

    function toArray(args) {
        return Array.prototype.slice.call(args);
    }

    function suppressExceptionAction(action, context) {
        try {
            var args = toArray(arguments);
            args.shift();
            args.shift();
            action.apply(context, args);
        } catch (ex) {; }
    }

    function getBrowserSize() {
        var e = document.documentElement,
            g = document.getElementsByTagName('body')[0],
            x = window.innerWidth || e.clientWidth || g.clientWidth,
            y = window.innerHeight || e.clientHeight || g.clientHeight;
        return { width: x, height: y };
    }

    function createLogItem(message, error) {
        return {
            occurredOn: new Date(),
            message: message,
            error: error
        };
    }

    function createDetailLogItem(message, error) {
        var browserSize = getBrowserSize();
        var item = createLogItem(message, error);
        item.url = location.href;
        item.env = {
            language: navigator.language || navigator.userLanguage || navigator.browserLanguage,
            documentMode: document.documentMode,
            browserWidth: browserSize.width,
            browserHeight: browserSize.height,
            screenWidth: screen.width,
            screenHeight: screen.height,
            userAgent: navigator.userAgent,
            cookieEnabled: navigator.cookieEnabled,
            platform: navigator.platform
        };
        return item;
    };

    //logger

    var logLevels = Object.create(null, {
        all: { value: 0, enumerable: true },
        info: { value: 1, enumerable: true },
        debug: { value: 2, enumerable: true },
        trace: { value: 3, enumerable: true },
        warn: { value: 4, enumerable: true },
        error: { value: 5, enumerable: true },
        fatal: { value: 6, enumerable: true }
    });

    var sinks = Object.create(null, {
        createConsoleSink: {
            value: function () {
                return consoleSink();
            }
        },
        createServiceSink: {
            value: function (options) {
                var opts = options || opt;
                return serviceLogSink(opts);
            }
        }
    });

    var currentLevel = logLevels.all;

    // for IE 11
    function find(array, predicate) {
        if (array.find) {
            return array.find(predicate);
        }
        for (var i = 0; i < array.length; i++) {
            if (predicate(array[i])) {
                return array[i];
            }
        }
    }

    function write(level, item) {
        var data = item || {};
        if (currentLevel > level) {
            return;
        }
        data.level = find(Object.keys(logLevels), function (key) {
            return logLevels[key] === level;
        }) || "unknown";

        targetSinks.forEach(function (sink) {
            suppressExceptionAction(sink, null, item);
        });
    }

    var logger = Object.create(null, {
        sinks: {
            value: sinks
        },
        levels: {
            value: logLevels
        },
        addSink: {
            value: function (sink) {
                targetSinks.push(sink);
            }
        },
        level: {
            get: function () {
                return currentLevel;
            },
            set: function (value) {
                //TODO number check;
                currentLevel = value;
            }
        },
        createItem: {
            value: function (message, error) {
                return createLogItem(message, error);
            }
        },
        createDetailItem: {
            value: function (message, error) {
                return createDetailLogItem(message, error);
            }
        },
        info: {
            value: function (item) {
                write(logLevels.info, item);
            }
        },
        debug: {
            value: function (item) {
                write(logLevels.debug, item);
            }
        },
        trace: {
            value: function (item) {
                write(logLevels.trace, item);
            }
        },
        warn: {
            value: function (item) {
                write(logLevels.warn, item);
            }
        },
        error: {
            value: function (item) {
                write(logLevels.error, item);
            }
        },
        fatal: {
            value: function (item) {
                write(logLevels.fatal, item);
            }
        }
    });

    function consoleSink() {
        return function (item) {
            if (console[item.level]) {
                console[item.level](item);
            } else {
                console.log(item);
            }
        }
    }

    // Service log sink

    var storageName = "__local_logs__";

    var logLocalStorage = {
        get: function () {
            var ls = global.localStorage;
            var result = ls.getItem(storageName);
            if (result) {
                return JSON.parse(result);
            }
            return;
        },
        add: function (value) {
            var ls = global.localStorage;
            var current = logLocalStorage.get();
            if (current) {
                current.push(value);
            } else {
                current = [value];
            }
            ls.removeItem(storageName);
            ls.setItem(storageName, JSON.stringify(current));
        },
        remove: function () {
            var ls = global.localStorage;
            ls.removeItem(storageName);
        },
        replace: function (items) {
            var ls = global.localStorage;
            ls.removeItem(storageName);
            ls.setItem(storageName, JSON.stringify(items));
        }
    }

    function serviceLogSink(opt) {
        var options = opt || {};
        var url = options.url || "/log";
        var retryCount = (options.retryCount === 0 ? 0 :
                (options.retryCount || 3)) + 1;
        return function (item) {
            logLocalStorage.add(item);
            var items = logLocalStorage.get();
            logLocalStorage.remove();
            $.ajax({
                url: url,
                type: "post",
                data: JSON.stringify(items),
                contentType: "application/json; charset=UTF-8"
            }).then(function () { }, function (err) {
                var targetItems = [];
                items.forEach(function (item) {
                    item._retry = (item._retry || 0) + 1;
                    if (item._retry < retryCount) {
                        targetItems.push(item);
                    }
                });
                logLocalStorage.replace(targetItems);
            });
        }
    }

    global.App = global.App || {};
    global.App.logger = logger;

})(jQuery, App);