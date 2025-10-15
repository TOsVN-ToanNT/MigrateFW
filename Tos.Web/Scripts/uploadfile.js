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
    }

    /// <summary>
    /// 引数で指定されたオプションを使用し、ファイルのアップロードを行います。
    /// </summary>
    $.fn.uploadfile = function (options) {
        var self = this,
            inputs,
            key = (new Date()).getTime().toString(),
            iframeName = 'file_upload' + key,
            iframe,
            form,
            deferr = $.Deferred(),
            targetOrigin,
            handled = false,
            clienterror = {
                result: false,
                message: "アップロードの結果を取得できませんでした。"
            },
            cleanup = function () {
                var i = 0,
                    inputLength = inputs.length;
                //作成した input および form と iframe の削除
                for (i = 0; i < inputLength; i++) {
                    inputs[i].remove();
                }
                var parentForm = self.parent('form[target^="file_upload"]');
                if (parentForm.length) {
                    self.unwrap();
                }
                iframe.remove();
            },
            receiveMessage = function (ev) {
                var result;
                if (handled) {
                    return;
                }
                handled = true;
                if (window.detachEvent) {
                    window.detachEvent("onmessage", receiveMessage);
                } else {
                    window.removeEventListener("message", receiveMessage);
                }

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
                    return;
                }
                cleanup();

                if (result.result) {
                    deferr.resolve({
                        result: true,
                        message: result.message,
                        data: !!result.data ? result.data : undef
                    });
                } else {
                    deferr.reject({
                        result: false,
                        message: result.message,
                        data: !!result.data ? result.data : undef
                    });
                }
            };

        $('iframe[name^="file_upload"]').remove();
        var parentForm = self.parent('form[target^="file_upload"]');
        if (parentForm.length) {
            parentForm.find('input[name="__key"]' + 'input[type="hidden"]').remove();
            self.unwrap();
        }

        iframe = $('<iframe name="' + iframeName + '" style="width: 0; height: 0; position:absolute;top:-9999px" />').appendTo('body');
        form = '<form target="' + iframeName + '" method="post" enctype="multipart/form-data" accept-charset="UTF-8" />';

        // options が指定されていない場合はデフォルト値を使用します。
        options = $.extend(true, {
            url: window.location.href,
            data: {
                __key: key
            }
        }, options);

        targetOrigin = (function () {
            var url = toAbsolutePath(options.url),
                a = $("<a href='" + url + "'></a>")[0],
                result = a.protocol + "//" + a.hostname;
            if ((a.protocol === "http:" && a.port !== "80") || (a.protocol === "https:" && a.port !== "443")) {
                result += a.port ? ":" + a.port : "";
            }
            return result;
        })();

        // IFrame 上の form タグに action 属性を追加し、ポストするパラメーターを追加します
        form = self.wrapAll(form).parent().attr('action', options.url);

        // オプションで指定された data を使って IFrame 上の form タグに hidden フィールドを追加します。
        inputs = createAndAppendInput(options.data, form);

        // IFrame 上で FORM タグのサブミットを実行します。
        form.submit(function () {

            if (window.detachEvent) {
                window.detachEvent("onmessage", receiveMessage);
            } else {
                window.removeEventListener("message", receiveMessage);
            }

            if (window.attachEvent) {
                window.attachEvent("onmessage", receiveMessage);
            } else {
                window.addEventListener("message", receiveMessage, false);
            }

            //iframe.load(function () {
            iframe.on("load", function () {
                var contents, uploadResult, message, data, success = true, responseText;
                if (handled) {
                    return;
                }
                handled = true;

                try {
                    contents = iframe.contents();
                } catch (e) {
                    clienterror.message += e;
                    clienterror.responseText += e;
                    clienterror.status += 500;
                    clienterror.statusText += 500;
                    deferr.reject(clienterror);
                    return cleanup();
                }

                uploadResult = contents.find(".result").text();
                message = contents.find(".message").text();
                data = contents.find(".data").text();

                if (!uploadResult && !message && !data) {
                    uploadResult = false;
                    message = "予期しないエラーが発生しました。管理者に問い合わせてください。"
                    if (contents[0] && contents[0].documentElement) {
                        message += message = contents[0].title;
                        responseText = contents[0].documentElement.outerHTML || contents[0].documentElement.innerHTML;
                    }
                }
               
                cleanup();

                if (!uploadResult) {
                    success = false;
                } else {
                    success = uploadResult.toString().toUpperCase() === "TRUE";
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

        setTimeout(function () {
            form.submit();
        }, 500);

        return deferr.promise();
    };

    /// <summary>
    /// オプションで指定された data から hidden フィールドのタグを生成します。
    /// </summary>
    var createAndAppendInput = function (data, form) {
        var inputs = [],
            input;
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                input = $("<input type='hidden' name='" + key + "' value='" + data[key] + "'>");
                form.append(input);
                inputs.push(input);
            }
        }
        return inputs;
    };

})(jQuery);
