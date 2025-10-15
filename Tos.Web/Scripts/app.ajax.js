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

