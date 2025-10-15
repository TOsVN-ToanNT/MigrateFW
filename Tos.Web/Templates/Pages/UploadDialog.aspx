<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="UploadDialog.aspx.cs" Inherits="Tos.Web.Templates.Pages.UploadDialog" %>
<%@ MasterType VirtualPath="~/Site.Master" %>
<%--created from 【UploadDialog(Ver2.1)】 Template--%>
<style type="text/css">
    .drop-zone {
        border: 2px dashed #c5c5c5;
        text-align: center;
        position: relative;
        height: 100px;
    }

</style>

<script type="text/javascript">

    /**
    * アップロードダイアログのレイアウト構造に対応するオブジェクトを定義します。
    */
    var UploadDialog = {
        options: {},
        urls: {
            csvupload: "TODO：CSVアップロードサービスの URL "
        }
    };

    /**
    * アップロードダイアログの初期化処理を行います。
    */
    UploadDialog.initialize = function () {
        var element = $("#UploadDialog");
        UploadDialog.element = element;

        element.on("hidden.bs.modal", UploadDialog.hidden);
        element.find(".drop-zone").filedad({
            enableClickFileSelect: true,
            multiple: false
        }).on("selected", UploadDialog.execute);

        element.find(".alert-message").attr("title", App.ui.pagedata.lang(App.ui.page.lang).alertTitle.text);
        element.find(".info-message").attr("title", App.ui.pagedata.lang(App.ui.page.lang).infoTitle.text);

        UploadDialog.notifyInfo =
                App.ui.notify.info(element, {
                    container: "#UploadDialog .dialog-slideup-area .info-message",
                    bodyContainer: ".modal-body",
                    show: function () {
                        element.find(".info-message").show();
                    },
                    clear: function () {
                        element.find(".info-message").hide();
                    }
                });
        UploadDialog.notifyAlert =
            App.ui.notify.alert(element, {
                container: "#UploadDialog .dialog-slideup-area .alert-message",
                bodyContainer: ".modal-body",
                show: function () {
                    element.find(".alert-message").show();
                },
                clear: function () {
                    element.find(".alert-message").hide();
                }
            });

        UploadDialog.validator = element.validation(App.validation(UploadDialog.options.validations, {
            success: function (results, state) {
                var i = 0, l = results.length,
                    item, $target;

                for (; i < l; i++) {
                    item = results[i];
                    UploadDialog.setColValidStyle(item.element);

                    UploadDialog.notifyAlert.remove(item.element);
                }
            },
            fail: function (results, state) {

                var i = 0, l = results.length,
                    item, $target;

                for (; i < l; i++) {
                    item = results[i];
                    UploadDialog.setColInvalidStyle(item.element);
                    if (state && state.suppressMessage) {
                        continue;
                    }

                    UploadDialog.notifyAlert.message(item.message, item.element).show();
                }
            },
            always: function (results) {
                //TODO: バリデーションの成功、失敗に関わらない処理が必要な場合はここに記述します。
            }
        }));

        element.find(".modal-dialog").draggable({
            drag: true,
        });
    };

    /**
    * 単項目要素をエラーのスタイルに設定します。
    * @param target 設定する要素
    */
    UploadDialog.setColInvalidStyle = function (target) {
        var $target,
            nextColStyleChange = function (target) {
                var next;
                if (target.hasClass("with-next-col")) {
                    next = target.next();
                    if (next.length) {
                        next.addClass("control-required");
                        next.removeClass("control-success");
                        nextColStyleChange(next);
                    }
                }
            };

        $target = $(target).closest("div");
        $target.addClass("control-required");
        $target.removeClass("control-success");

        // control-labelまで対象の前の項目にクラスをセットする
        var element = $target;
        while (element.prev().length > 0) {
            element = element.prev();
            if (element.hasClass("control-label")) {
                element.addClass("control-required-label");
                element.removeClass("control-success-label");
                break;
            }
            else if (element.hasClass("control-required-label")) {
                element.removeClass("control-success-label");
                break;
            }
            else if (element.hasClass("control")) {
                element.addClass("control-required");
                element.removeClass("control-success");
            }
        }
        nextColStyleChange($target);
    };

    /**
    * 単項目要素をエラー無しのスタイルに設定します。
    * @param target 設定する要素
    */
    UploadDialog.setColValidStyle = function (target) {
        var $target,
            nextColStyleChange = function (target) {
                var next;
                if (target.hasClass("with-next-col")) {
                    next = target.next();
                    if (next.length) {
                        next.removeClass("control-required");
                        next.addClass("control-success");
                        nextColStyleChange(next);
                    }
                }
            };
        $target = $(target).closest("div");
        $target.removeClass("control-required");
        $target.addClass("control-success");

        // control-labelまで対象の前の項目にクラスをセットする
        var element = $target;
        while (element.prev().length > 0) {
            element = element.prev();
            if (element.hasClass("control-label")) {
                element.removeClass("control-required-label");
                element.addClass("control-success-label");
                break;
            }
            else if (element.hasClass("control-required-label")) {
                element.removeClass("control-required-label");
                element.addClass("control-success-label");
                element.addClass("control-label");
                break;
            }
            else if (element.hasClass("control")) {
                element.removeClass("control-required");
                element.addClass("control-success");
            }
        }
        nextColStyleChange($target);
    };

    /**
    * アップロードダイアログ非表示時処理を実行します。
    */
    UploadDialog.hidden = function (e) {

        var element = UploadDialog.element;

        //TODO: ダイアログ非表示時に、項目をクリアする処理をここに記述します。

        UploadDialog.notifyInfo.clear();
        UploadDialog.notifyAlert.clear();
        var items = element.find(".modal-body :input:not(button)");
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            UploadDialog.setColValidStyle(item);
        }

    };

    /**
    * アップロードダイアログ　バリデーションルールを定義します。
    */
    UploadDialog.options.validations = {
    };

    /**
    * CSV アップロードを実行します。
    */
    UploadDialog.execute = function (e, args) {
        //TODO:アップロード条件を取得して、アップロードを実行する処理をここに記述します。
        var element = UploadDialog.element,
            file, extension;

        UploadDialog.notifyAlert.clear();

        if (!args.selectedFiles.length) {
            UploadDialog.notifyAlert.message(App.messages.base.selectfile).show();
            return;
        }

        file = args.selectedFiles[0];
        extension = file.name.split(".").pop().toLowerCase();
        if (extension !== "csv") {
            UploadDialog.notifyAlert.message(App.messages.base.csvonly).show();
            return;
        }

        // ローディング表示        
        App.ui.loading.show();

        $.ajax(App.ajax.file.upload(UploadDialog.urls.csvupload, file))
            .then(function (response, status, xhr) {
                //アップロードが成功した場合はダイアログを閉じます。              
                element.modal("hide");
                App.ui.page.notifyInfo.message(App.messages.base.uploadsuccess).show();
            }).fail(function (error) {
                if (error.responseType === "blob") {
                    App.file.save(error.response, App.ajax.file.extractFileNameDownload(error) || "CSVErrorFile.csv");
                    UploadDialog.notifyAlert.message(App.messages.base.uploaderror).show();
                } else {
                    if (error.status === App.settings.base.validationErrorStatus) {
                        UploadDialog.notifyAlert.message(App.ajax.handleError(error).message).show();
                    } else {
                        UploadDialog.notifyAlert.message(App.messages.base.uploadServerError).show();
                    }
                }
            }).always(function () {
                App.ui.loading.close();
            });
    };

</script>

<div class="modal fade wide" tabindex="-1" id="UploadDialog">
<div class="modal-dialog" style="height: 400px; width: 45%">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title">アップロードファイル選択</h4>
        </div>

        <div class="modal-body">
            <!--TODO: 検索条件を定義するHTMLをここに記述します。-->
            <div class="row">
                    <section class="content_drop">
                        <div class="drop-zone">
                            <div class="drop-description">
                                <p>ここにアップロードするファイルをドラッグ＆ドロップしてください。</p>
                            </div>
                        </div>
                    </section>
            </div>
            <div class="message-area dialog-slideup-area">
                <div class="alert-message" style="display: none">
                    <ul>
                    </ul>
                </div>
                <div class="info-message" style="display: none">
                    <ul>
                    </ul>
                </div>
            </div>
        </div>

        <div class="modal-footer">
            <button type="button" class="cancel-button btn btn-sm btn-default" data-dismiss="modal" name="close">閉じる</button>
        </div>

    </div>
</div>
</div>