<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ConfirmDialog.aspx.cs" Inherits="Tos.Web.Pages.Dialogs.ConfirmDialog" %>
<%@ MasterType VirtualPath="~/Site.Master" %>
<%--/** 最終更新日 : 2018-01-25 **/--%>

    <script type="text/javascript">
        var ConfirmDialog = {
            urls: {}
        };

        /**
         * 確認ダイアログを表示します
         * param options 
         *    title: タイトル,
         *    text: 確認メッセージ,
         *    ok: OKボタン表示名,
         *    cancel: Cancelボタン表示名,
         *    hideCanel: Cancelボタンを非表示にする場合はtrue,
         *    backdrop: 背景クリックでダイアログ閉じる挙動をさせない場合、"static",
         *    keyboard: escapeでダイアログ閉じる挙動をさせない場合、false
         */
        ConfirmDialog.confirm = function (options) {
            options = options || {};

            var ok = options.ok || "OK",
                cancel = options.cancel || "キャンセル",
                title = options.title || "確認",
                text = options.text,
                _backdrop = options.backdrop === undefined ? true : options.backdrop,
                _keyboard = options.keyboard === undefined ? true : options.keyboard,
                _hideCancel = options.hideCancel === true ? true: false,
                dialog = $("#ConfirmDialog"),
                header = dialog.find(".modal-header"),
                footer = dialog.find(".modal-footer"),
                defer = $.Deferred(),
                isOk = false,
                show = function (el, text) {
                    if (text) {
                        el.html(text).show();
                    } else {
                        el.hide();
                    }
                };

            dialog.find(".modal-body").css("padding-bottom", 0);
            dialog.find(".modal-body .item-label").css("font-size", 14).css("height", "100%");

            show(dialog.find(".modal-header h4"), title);
            show(dialog.find(".modal-body .item-label"), text);
            footer.find(".btn-ok").off("click").html(ok);
            footer.find(".btn-cancel").off("click").html(cancel);
            dialog.find(".modal-dialog").draggable({
                drag: true,
            });

            if (_hideCancel) {
                footer.find(".btn-cancel").hide();
            } else {
                footer.find(".btn-cancel").show();
            }

            dialog.on("shown.bs.modal", function () {
                footer.find(".btn-ok").focus();
            });
            //dialog.modal("show")時にoption指定
            dialog.modal({
                show: true,
                backdrop: _backdrop,
                keyboard: _keyboard
            });
            dialog.css("padding-top", "15%").css("z-index", 1060);

            footer.find(".btn-ok").on("click", function (e) {
                isOk = true;
                dialog.modal("hide");
            });
            footer.find(".btn-cancel").on("click", function (e) {
                isOk = false;
                dialog.modal("hide");
            });
            dialog.on("hide.bs.modal", function () {
                (isOk ? defer.resolve : defer.reject)();
            });

            return defer.promise();
        };
    </script>

    <!-- 確認ダイアログ-->
    <div class="modal fade confirm" tabindex="-1" id="ConfirmDialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title"></h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="control-success-label col-xs-12">
                            <label class="item-label"></label>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-sm btn-primary btn-ok"></button>
                    <button type="button" class="btn btn-sm btn-cancel" data-dismiss="modal"></button>
                </div>

            </div>
        </div>
    </div>
