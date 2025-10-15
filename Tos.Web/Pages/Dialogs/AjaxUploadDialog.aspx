<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="AjaxUploadDialog.aspx.cs" Inherits="Tos.Web.Pages.Dialogs.AjaxUploadDialog" %>

<%@ MasterType VirtualPath="~/Site.Master" %>

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
    var AjaxUploadDialog = {
        options: {},
        urls: {
            ajaxCsvupload: "../api/MitsumoriCSVAjax",
        }
    };

    /**
     * アップロードダイアログの初期化処理を行います。
     */
    AjaxUploadDialog.initialize = function () {
        var element = $("#AjaxUploadDialog");
        AjaxUploadDialog.element = element;

        element.on("hidden.bs.modal", AjaxUploadDialog.hidden);
        element.find(".drop-zone").filedad({
            enableClickFileSelect: true,
            multiple: false
        }).on("selected", AjaxUploadDialog.execute);

        element.find(".alert-message").attr("title", App.ui.pagedata.lang(App.ui.page.lang).alertTitle.text);
        element.find(".info-message").attr("title", App.ui.pagedata.lang(App.ui.page.lang).infoTitle.text);

        AjaxUploadDialog.notifyInfo =
             App.ui.notify.info(element, {
                 container: "#AjaxUploadDialog .dialog-slideup-area .info-message",
                 bodyContainer: ".modal-body",
                 show: function () {
                     element.find(".info-message").show();
                 },
                 clear: function () {
                     element.find(".info-message").hide();
                 }
             });
        AjaxUploadDialog.notifyAlert =
            App.ui.notify.alert(element, {
                container: "#AjaxUploadDialog .dialog-slideup-area .alert-message",
                bodyContainer: ".modal-body",
                show: function () {
                    element.find(".alert-message").show();
                },
                clear: function () {
                    element.find(".alert-message").hide();
                }
            });

        AjaxUploadDialog.validator = element.validation(App.validation(AjaxUploadDialog.options.validations, {
            success: function (results, state) {
                var i = 0, l = results.length,
                    item, $target;

                for (; i < l; i++) {
                    item = results[i];
                    AjaxUploadDialog.setColValidStyle(item.element);

                    AjaxUploadDialog.notifyAlert.remove(item.element);
                }
            },
            fail: function (results, state) {

                var i = 0, l = results.length,
                    item, $target;

                for (; i < l; i++) {
                    item = results[i];
                    AjaxUploadDialog.setColInvalidStyle(item.element);
                    if (state && state.suppressMessage) {
                        continue;
                    }

                    AjaxUploadDialog.notifyAlert.message(item.message, item.element).show();
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
    AjaxUploadDialog.setColInvalidStyle = function (target) {
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
        $target.prev().addClass("control-required-label");
        $target.removeClass("control-success");
        $target.prev().removeClass("control-success-label");

        nextColStyleChange($target);
    };

    /**
     * 単項目要素をエラー無しのスタイルに設定します。
     * @param target 設定する要素
     */
    AjaxUploadDialog.setColValidStyle = function (target) {
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
        $target.prev().removeClass("control-required-label");
        $target.addClass("control-success");
        $target.prev().addClass("control-success-label");

        nextColStyleChange($target);
    };

    /**
     * アップロードダイアログ非表示時処理を実行します。
     */
    AjaxUploadDialog.hidden = function (e) {

        var element = AjaxUploadDialog.element;

        //TODO: ダイアログ非表示時に、項目をクリアする処理をここに記述します。

        AjaxUploadDialog.notifyInfo.clear();
        AjaxUploadDialog.notifyAlert.clear();
        var items = element.find(".modal-body :input");
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            AjaxUploadDialog.setColValidStyle(item);
        }

    };

    /**
     * アップロードダイアログ　バリデーションルールを定義します。
     */
    AjaxUploadDialog.options.validations = {
    };

    /**
     * CSV アップロードを実行します。
     */
    AjaxUploadDialog.execute = function (e, args) {
        //TODO:アップロード条件を取得して、アップロードを実行する処理をここに記述します。
        var element = AjaxUploadDialog.element,
            file, extension;

        AjaxUploadDialog.notifyAlert.clear();

        if (!args.selectedFiles.length) {
            AjaxUploadDialog.notifyAlert.message(App.messages.base.selectfile).show();
            return;
        }

        file = args.selectedFiles[0];
        extension = file.name.split(".").pop().toLowerCase();
        if (extension !== "csv") {
            AjaxUploadDialog.notifyAlert.message(App.messages.base.csvonly).show();
            return;
        }

        // ローディング表示        
        App.ui.loading.show();

        $.ajax(App.ajax.file.upload(AjaxUploadDialog.urls.ajaxCsvupload, file))
            .then(function (response, status, xhr) {
                //アップロードが成功した場合はダイアログを閉じます。              
                element.modal("hide");
                App.ui.page.notifyInfo.message(App.messages.base.uploadsuccess).show();
            }).fail(function (error) {
                if (error.responseType === "blob") {
                    App.file.save(error.response, App.ajax.file.extractFileNameDownload(error) || "CSVErrorFile.csv");
                    AjaxUploadDialog.notifyAlert.message(App.messages.base.uploaderror).show();
                } else {
                    if (error.status === App.settings.base.validationErrorStatus) {
                        AjaxUploadDialog.notifyAlert.message(App.ajax.handleError(error).message).show();
                    } else {
                        AjaxUploadDialog.notifyAlert.message(App.messages.base.uploadServerError).show();
                    }
                }
            }).always(function () {
                App.ui.loading.close();
            });
    };

</script>

<div class="modal fade wide" tabindex="-1" id="AjaxUploadDialog">
    <div class="modal-dialog" style="height: 400px; width: 45%;">
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
            </div>
            <div class="modal-message message-area dialog-slideup-area">
                <div class="alert-message" style="display: none">
                    <ul>
                    </ul>
                </div>
                <div class="info-message" style="display: none">
                    <ul>
                    </ul>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="cancel-button btn btn-sm btn-default" data-dismiss="modal" name="close">閉じる</button>
            </div>

        </div>
    </div>
</div>
