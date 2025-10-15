<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="UploadDialog.aspx.cs" Inherits="Tos.Web.Pages.Dialogs.UploadDialog" %>
<%@ MasterType VirtualPath="~/Site.Master" %>

    <script src="<%=ResolveUrl("~/Scripts/uploadfile.js") %>" type="text/javascript"></script>
    <script type="text/javascript">

        /**
         * アップロードダイアログのレイアウト構造に対応するオブジェクトを定義します。
         */
        var UploadDialog = {
            options: {},
            urls: {
                csvupload: "../api/MitsumoriCSV"
            }
        };

        /**
         * アップロードダイアログの初期化処理を行います。
         */
        UploadDialog.initialize = function () {
            var element = $("#UploadDialog");

            element.on("hidden.bs.modal", UploadDialog.hidden);
            element.on("click", ".file-upload", UploadDialog.execute);
            UploadDialog.element = element;

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
            $target.prev().addClass("control-required-label");
            $target.removeClass("control-success");
            $target.prev().removeClass("control-success-label");

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
            $target.prev().removeClass("control-required-label");
            $target.addClass("control-success");
            $target.prev().addClass("control-success-label");

            nextColStyleChange($target);
        };

        /**
         * アップロードダイアログ非表示時処理を実行します。
         */
        UploadDialog.hidden = function (e) {

            var element = UploadDialog.element;

            //TODO: ダイアログ非表示時に、項目をクリアする処理をここに記述します。
            element.find("[name='uploadfile']").replaceWith('<input type="file" name="uploadfile" data-prop="uploadfile" />');

            UploadDialog.notifyInfo.clear();
            UploadDialog.notifyAlert.clear();
            var items = element.find(".modal-body :input");
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                UploadDialog.setColValidStyle(item);
            }

        };

        /**
         * アップロードダイアログ　バリデーションルールを定義します。
         */
        UploadDialog.options.validations = {
            uploadfile: {
                rules: {
                    required: true,
                    csvonly: true
                },
                options: {
                    name: "ファイル"
                },
                messages: {
                    required: App.messages.base.selectfile,
                    csvonly: App.messages.base.csvonly
                }
            }
        };

        /**
         * CSV アップロードを実行します。
         */
        UploadDialog.execute = function () {

            //TODO:アップロード条件を取得して、アップロードを実行する処理をここに記述します。

            var element = UploadDialog.element;
            UploadDialog.notifyAlert.clear();

            UploadDialog.validator.validate()
            .then(function () {
                // ローディング表示
                App.ui.loading.show();

                element.find(":file").uploadfile({
                    url: UploadDialog.urls.csvupload
                }).done(function (result) {
                    //アップロードが成功した場合はダイアログを閉じます。
                    element.modal("hide");
                    App.ui.page.notifyInfo.message(App.messages.base.uploadsuccess).show();
                })
                .fail(function (error) {
                    if (error.data && error.data.url) {
                        UploadDialog.notifyAlert.message(App.messages.base.uploaderror).show();
                        $(window).off("beforeunload");
                        window.open(decodeURIComponent(error.data.url), "_parent");
                    }
                    else {
                        UploadDialog.notifyAlert.message(error.message).show();
                    }
                })
                .always(function () {
                    App.ui.loading.close();
                });
            });
        };

    </script>

    <div class="modal fade wide" tabindex="-1" id="UploadDialog">
    <div class="modal-dialog" style="height: 350px; width: 45%">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title">アップロードファイル選択</h4>
            </div>

            <div class="modal-body">
                <!--TODO: 検索条件を定義するHTMLをここに記述します。-->
                <div class="row">
                </div>
                <div class="row">
                    <div class="control-label col-xs-3">
                        <label>ファイル</label>
                    </div>
                    <div class="control col-xs-9">
                        <input type="file" data-prop="uploadfile" name="uploadfile"/>
                    </div>
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
                <button type="button" class="btn btn-success file-upload" name="select" >アップロード</button>
                <button type="button" class="cancel-button btn btn-sm btn-default" data-dismiss="modal" name="close">閉じる</button>
            </div>

        </div>
    </div>
    </div>