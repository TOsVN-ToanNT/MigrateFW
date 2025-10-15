<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ConfirmDialog.aspx.cs" Inherits="Tos.Web.Templates.Pages.Dialogs.ConfirmDialog" %>

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
         *    cancel: Cancelボタン表示名
         */
        ConfirmDialog.confirm = function (options) {

            options = options || {};

            var ok = options.ok || "OK",
                cancel = options.cancel || "キャンセル",
                title = options.title || "確認",
                text = options.text,
                dialog = $("#ConfirmDialog"),
                header = dialog.find(".modal-header"),
                footer = dialog.find(".modal-footer"),
                defer = $.Deferred(),
                isOk = false,
                show = function (el, text) {
                    if (text) {
                        el.html(text); el.show();
                    } else {
                        el.hide();
                    }
                };

            show(dialog.find(".modal-body .item-label"), text);

            dialog.find(".modal-body").css("padding-bottom", 0);
            dialog.find(".modal-body .item-label").css("font-size", 14).css("height", "100%");
            show(dialog.find(".modal-header h4"), title);
            footer.find(".btn-ok").off("click").html(ok);
            footer.find(".btn-cancel").off("click").html(cancel);
            // draggable dialog
            dialog.find(".modal-dialog").draggable({
                drag: true,
            });
            dialog.modal("show");

            dialog.css("padding-top",
                ($(window).height() / 2) - (dialog.find(".modal-content").height() / 2));

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
