/** 最終更新日 : 2017-10-01 **/
; (function ($, App) {
    "use strict";

    var file = App.define("App.file");

    file.readAsArrayBuffer = function (file) {

        var reader = new FileReader();
        var deff = new $.Deferred();
        reader.onload = function (e) {
            deff.resolve(e.target.result);
        };
        reader.onerror = function (e) {
            deff.fail(e);
        }
        reader.readAsArrayBuffer(file);
        return deff.promise();

    };

    file.readAsText = function (file, enc) {

        var reader = new FileReader();
        var deff = new $.Deferred();
        reader.onload = function (e) {
            deff.resolve(e.target.result);
        };
        reader.onerror = function (e) {
            deff.fail(e);
        }
        reader.readAsText(file, enc);
        return deff.promise();
    };

    file.readAsUint8Array = function (file) {

        var reader = new FileReader();
        var deff = new $.Deferred();
        reader.onload = function (e) {

            var bytes = new Uint8Array(e.target.result);
            deff.resolve(bytes);
        };
        reader.onerror = function (e) {
            deff.fail(e);

        }
        reader.readAsArrayBuffer(file);
        return deff.promise();
    };

    file.readAsDataURL = function (file) {

        var reader = new FileReader();
        var deff = new $.Deferred();
        reader.onload = function (e) {
            deff.resolve(e.target.result);
        };
        reader.onerror = function (e) {
            deff.fail(e);

        }
        reader.readAsDataURL(file);
        return deff.promise();
    };

    file.save = function (blob, fileName) {
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileName);
        } else {
            var a = document.createElement('a');
            a.download = fileName;
            a.target = '_blank';
            a.href = window.URL.createObjectURL(blob);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

})(jQuery, App);
