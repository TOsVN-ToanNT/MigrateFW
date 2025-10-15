/** 最終更新日 : 2018-08-17 **/
; (function ($, App) {
    "use strict";

    var ajax = App.define("App.ajax.file");
    ajax.upload = function (url, files) {

        var target = App.isArray(files) ? files : [files],
            formData = new FormData();
        Array.prototype.forEach.call(target, function (item, index) {
            formData.append(index, item);
        });

        return {
            url: url,
            type: "POST",
            cache: false,
            processData: false,
            contentType: false,
            dataType: "binary",
            responseType: 'binary',
            data: formData,
            converters: {
                "json binary": function (result) {
                    return JSON.parse(result);
                }
            }
        };
    };

    ajax.download = function (url, data, type) {
        var _type = App.isUndefOrNull(type) ? "GET" : type;

        return {
            url: url,
            type: _type,
            cache: false,
            contentType: "application/json; charset=utf-8",
            data: _type == "GET" ? data : JSON.stringify(data),
            dataType: "binary",
        };
    };

    function toArrayBuffer(str) {
        var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
        var bufView = new Uint16Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }

    $.ajaxTransport("binary", function (options, originalOptions, jqXHR) {
        return {
            send: function (headers, callback) {
                var xhr = new XMLHttpRequest();

                xhr.addEventListener("load", function () {
                    var resContentType = xhr.getResponseHeader("content-type") || "",
                        resContentDisposition = xhr.getResponseHeader("Content-Disposition") || "",
                        resTypeName = !xhr.response ? "" : Object.prototype.toString.call(xhr.response);

                    if (resTypeName === "[object Blob]") {
                        //if json
                        if ((xhr.response.type || "").toUpperCase().indexOf("APPLICATION/JSON") === 0) {
                            var reader = new FileReader();
                            reader.addEventListener("loadend", function (e) {
                                jqXHR.responseType = "json";
                                jqXHR.responseJSON = JSON.parse(reader.result);
                                jqXHR.responseText = reader.result;

                                if (xhr.status >= 400) {
                                    callback(xhr.status, xhr.statusText, { }, xhr.getAllResponseHeaders());
                                } else {
                                    callback(xhr.status, xhr.statusText, { json: jqXHR.responseText }, xhr.getAllResponseHeaders());
                                }
                            });
                            reader.readAsText(xhr.response);
                            return;
                        }
                        if (xhr.status >= 400) {
                            jqXHR.responseType = "blob";
                            jqXHR.response = xhr.response;

                            callback(xhr.status, xhr.statusText, {}, xhr.getAllResponseHeaders());
                            return;
                        } else {
                            var data = {};
                            data[options.dataType] = xhr.response;
                            callback(xhr.status, xhr.statusText, data, xhr.getAllResponseHeaders());
                            return;
                        }
                    }
                    if (App.isStr(xhr.response) && resContentDisposition.toUpperCase().indexOf("ATTACHMENT;") === 0) {
                        jqXHR.response = new Blob([toArrayBuffer(xhr.response)], { type: resContentType });
                        jqXHR.responseType = "blob";
                        callback(xhr.status, xhr.statusText, {}, xhr.getAllResponseHeaders());
                        return;
                    }


                    data[options.dataType] = xhr.response;
                    callback(xhr.status, xhr.statusText, data, xhr.getAllResponseHeaders());
                });

                xhr.open(options.type, options.url, options.async || true);

                for (var i in headers) {
                    xhr.setRequestHeader(i, headers[i]);
                }

                xhr.responseType = "blob";
                xhr.send(options.data || null);
            },
            abort: function () {
                jqXHR.abort();
            }
        };
    });

    ajax.extractFileNameDownload = function (xhr) {
        var filename = "";
        var disposition = xhr.getResponseHeader('Content-Disposition');
        if (disposition && disposition.indexOf('attachment') !== -1) {
            var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            var matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) {
                filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
            }
        }

        return filename;
    };


})(jQuery, App);
