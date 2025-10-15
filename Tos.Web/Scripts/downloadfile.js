/** 最終更新日 : 2018-01-25 **/
; (function ($, undef) {


    var toAbsolutePath = function (rel) {
        if (/^https?:\/\//.test(rel)) {
            return rel;
        } else {
            var current = location.pathname,
                i, l, splited = [];
            current = current.substr(0, current.lastIndexOf("/"));
            current = current.split("/");

            for (i = 0, l = current.length; i < l; i++) {
                if (current[i] !== "") {
                    splited.push(current[i]);
                }
            }
            rel = rel.split("/");
            for (i = 0, l = rel.length; i < l; i++) {
                if (rel[i] === "..") {
                    splited.pop();
                } else if (rel[i] !== ".") {
                    splited.push(rel[i]);
                }
            }
            return location.protocol + "//" + location.host + "/" + splited.join("/");
        }
    };

    var getTargetOrigin = function (orgurl) {
        var url = toAbsolutePath(orgurl),
            a = $("<a href='" + url + "'></a>")[0],
            result = a.protocol + "//" + a.hostname;

        if ((a.protocol === "http:" && a.port !== "80") || (a.protocol === "https:" && a.port !== "443")) {
            result += a.port ? ":" + a.port : "";
        }

        return result;

    };

    var addEvent = function (event, func) {

        if (window.attachEvent) {
            window.attachEvent(event, func);
        } else {
            window.addEventListener(event, func, false);
        }
    };

    var removeEvent = function (event, func) {

        if (window.detachEvent) {
            window.detachEvent(event, func);
        } else {
            window.removeEventListener(event, func, false);
        }
    };

    /**
     * 引数で指定されたオプションを使用し、ファイルのダウンロードを行います。
     * @param {Object} options オプション
     * @returns {jqXHR} 
     */
    $.fn.downloadfile = function (options) {

        $("iframe[name^='file_download']").remove();

        var self = this;
        var inputs,
            key = (new Date()).getTime().toString(),
            iframeName = 'file_download' + key,
            iframe = $('<iframe name="' + iframeName + '" style="width: 0; height: 0; position:absolute;top:-9999px" />').appendTo('body'),
            form = '<form target="' + iframeName + '" method="get" accept-charset="UTF-8" />',
            deferr = $.Deferred(),
            targetOrigin;

        // options が指定されていない場合はデフォルト値を使用します。
        options = $.extend(true, {
            url: window.location.href,
            data: { __key: key }
        }, options);

        targetOrigin = getTargetOrigin(options.url);

        // IFrame 上の form タグに action 属性を追加し、ポストするパラメーターを追加します
        form = self.wrapAll(form).parent().attr('action', options.url);

        // オプションで指定された data を使って IFrame 上の form タグに hidden フィールドを追加します。
        inputs = createAndAppendInput(options.data, form);


        // IFrame 上で FORM タグのサブミットを実行します。
        form.on("submit",function () {
            var i = 0;
            var clienterror = {
                    result: false,
                    message: "ダウンロードの結果を取得できませんでした。"
                },
                handled = false,
                receiveMessage = function (ev) {
                    var result;
                    removeEvent("onmessage", receiveMessage);

                    if (handled) {
                        return;
                    }

                    handled = true;

                    if (ev.origin !== targetOrigin || !ev.data) {
                        deferr.reject(clienterror);
                        return cleanup();
                    }

                    try {
                        result = (new Function("return " + ev.data.replace(/\r?\n/g, " ") + ";"))();
                    } catch (ex) {
                        clienterror.message += ex;
                        deferr.reject(clienterror);
                        return cleanup();
                    }

                    if (!result || !result.key || result.key !== key) {
                        clienterror.message += "結果がない、もしくはキーが一致しません。";
                        deferr.reject(clienterror);
                        return cleanup();
                    }

                    cleanup();
                    deferr[result.result ? "resolve" : "reject"](result);
                },
                cleanup = function () {
                    var i = 0,
                        inputLength = inputs.length;
                    //作成した input および form と iframe の削除
                    for (i = 0; i < inputLength; i++) {
                        inputs[i].remove();
                    }
                    self.unwrap();
                    iframe.remove();
                };

//            iframe.load(function () {  jQuery3よりload関数は削除されたため、変更
            iframe.on("load", function () {
                    var contents,
                    downloadResult,
                    message,
                    data,
                    responseText,
                    success = true;

                addEvent("onmessage", receiveMessage);

                if (handled) {
                    return;
                }

                handled = true;

                try {
                    contents = iframe.contents();
                } catch (e) {
                    clienterror.message += e;
                    deferr.reject(clienterror);
                    return cleanup();
                }

                downloadResult = contents.find(".result").text();
                message = contents.find(".message").text();
                data = contents.find(".data").text();

                if (!downloadResult && !message && !data) {
                    downloadResult = false;
                    message = "予期しないエラーが発生しました。管理者に問い合わせてください。"
                    if (contents[0] && contents[0].documentElement) {
                        message += contents[0].title;
                        responseText = contents[0].documentElement.outerHTML || contents[0].documentElement.innerHTML;
                    }
                }

                cleanup();

                if (!downloadResult) {
                    success = false;
                } else {
                    success = downloadResult.toString().toUpperCase() === "TRUE";
                }
                if (!success && !message) {
                    message = "予期しないエラーが発生しました。管理者に問い合わせてください。"
                }
                if (data) {
                    data = JSON.parse(data);
                }

                if (success) {
                    deferr.resolve({
                        result: true,
                        message: message,
                        data: !!data ? data : undef
                    });
                } else {
                    deferr.reject({
                        result: false,
                        message: message,
                        data: !!data ? data : undef,
                        responseText: responseText
                    });
                }
            });

        });
        form.submit();

        return deferr.promise();
    };

    /**
    /* オプションで指定された data から hidden フィールドのタグを生成します。
     * @param {Object} data データが格納された JavaScript  オブジェクト
     * @param {jQuery} FORM 要素の jQuery オブジェクト
     */
    var createAndAppendInput = function (data, form) {
        var inputs = [],
            input;
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                input = $("<input type='hidden' name='" + key + "'>").attr("value", data[key]);
                form.append(input);
                inputs.push(input);
            }
        }
        return inputs;
    };

})(jQuery);
