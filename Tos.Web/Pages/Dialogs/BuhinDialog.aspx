<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="BuhinDialog.aspx.cs" Inherits="Tos.Web.Pages.Dialogs.BuhinDialog" %>
<%@ MasterType VirtualPath="~/Site.Master" %>

    <script type="text/javascript">

        var BuhinDialog = {
            urls: {
                buhin: "../Services/SampleService.svc/Buhin"
            }
        };

        /**
         * 検索ダイアログの初期化処理を行います。
         */
        BuhinDialog.initialize = function () {
            var element = $("#BuhinDialog");

            element.on("hidden.bs.modal", BuhinDialog.hidden);
            element.on("shown.bs.modal", BuhinDialog.shown);
            element.on("click", ".search", BuhinDialog.search);
            //単一セレクトの場合は、下の１行を使用します
            element.on("click", ".search-list tbody ", BuhinDialog.select);
            //複数セレクトの場合は、上の１行を削除し、下の３行をコメント解除します
            //element.on("click", ".select", BuhinDialog.select);
            //element.on("click", ".search-list tbody", BuhinDialog.selectOne);
            //element.find("[name='select_cd_all']").on("click", BuhinDialog.selectAll);
            BuhinDialog.element = element;

            element.find(".alert-message").attr("title", App.ui.pagedata.lang(App.ui.page.lang).alertTitle.text);
            element.find(".info-message").attr("title", App.ui.pagedata.lang(App.ui.page.lang).infoTitle.text);

            BuhinDialog.notifyInfo =
                 App.ui.notify.info(element, {
                     container: "#BuhinDialog .dialog-slideup-area .info-message",
                     bodyContainer: ".modal-body",
                     show: function () {
                         element.find(".info-message").show();
                     },
                     clear: function () {
                         element.find(".info-message").hide();
                     }
                 });
            BuhinDialog.notifyAlert =
                App.ui.notify.alert(element, {
                    container: "#BuhinDialog .dialog-slideup-area .alert-message",
                    bodyContainer: ".modal-body",
                    show: function () {
                        element.find(".alert-message").show();
                    },
                    clear: function () {
                        element.find(".alert-message").hide();
                    }
                });

            // draggable dialog
            element.find(".modal-dialog").draggable({
                drag: true,
            });
        };

        /**
         * 検索ダイアログ非表示時処理を実行します。
         */
        BuhinDialog.hidden = function (e) {

            //TODO:ダイアログ非表示時に、項目をクリアする処理をここに記述します。
            var element = BuhinDialog.element,
                table = element.find(".search-list");

            element.find(":input").val("");
            //複数セレクトの場合は、下の１行をコメント解除します。
            //element.find(":checked").prop("checked", false);
            table.find("tbody").not(".item-tmpl").remove();

            element.findP("data_count").text("");
            element.findP("data_count_total").text("");

            BuhinDialog.notifyInfo.clear();
            BuhinDialog.notifyAlert.clear();

        };

        /**
         * 検索ダイアログ表示時処理を実行します。
         */
        BuhinDialog.shown = function (e) {

            BuhinDialog.element.find(":input:not(button):first").focus();
        };

        /**
         * 検索ダイアログの検索処理を実行します。
         */
        BuhinDialog.search = function () {
            var element = BuhinDialog.element,
                loadingTaget = element.find(".modal-content"),
                table = element.find(".search-list"),
                filter = BuhinDialog.createFilter(),
                query;

            query = {
                url: BuhinDialog.urls.buhin,
                filter: filter,
                orderby: "cd_buhin",
                skip: 0,
                top: App.settings.base.dialogDataTakeCount,
                inlinecount: "allpages"
            };

            table.find("tbody:visible").remove();

            App.ui.loading.show("", loadingTaget);

            //TODO: 検索処理をここに記述します。
            $.ajax(App.ajax.odata.get(App.data.toODataFormat(query)))
            .done(function (result) {

                BuhinDialog.bind(result);

            }).always(function () {

                App.ui.loading.close(loadingTaget);

            });
        };

        /**
         * 検索ダイアログの検索条件を組み立てます
         */
        BuhinDialog.createFilter = function () {
            var criteria = BuhinDialog.element.find(".search-criteria").form().data(),
                filters = [];

            if (!App.isUndefOrNullOrStrEmpty(criteria.nm_buhin)) {
                filters.push("substringof('" + encodeURIComponent(criteria.nm_buhin) + "', nm_buhin) eq true");
            }

            return filters.join(" and ");
        };

        /**
         * 検索ダイアログの一覧にデータをバインドします。
         */
        BuhinDialog.bind = function (data) {
            var element = BuhinDialog.element,
                table = element.find(".search-list"),
                count = data["odata.count"],
                items = data.value ? data.value : data,
                i, l, item, clone;

            element.findP("data_count").text(data.value.length);
            element.findP("data_count_total").text(count);

            BuhinDialog.data = App.ui.page.dataSet();
            BuhinDialog.data.attach(items);

            table.find("tbody:visible").remove();

            for (i = 0, l = items.length; i < l; i++) {
                item = items[i];
                clone = table.find(".item-tmpl").clone();
                clone.form().bind(item);
                clone.appendTo(table).removeClass("item-tmpl").show();
            }

            if (count && count > App.settings.base.dialogDataTakeCount) {
                BuhinDialog.notifyInfo.message(App.messages.base.MS0011).show();
            }

        };

        /**
         * 一覧から行を選択された際の処理を実行します。（単一セレクト用）
         */
        BuhinDialog.select = function (e) {
            var element = BuhinDialog.element,
                button = $(e.target),
                tbody = button.closest("tbody"),
                id = tbody.attr("data-key"),
                data;


            if (App.isUndef(id)) {
                return;
            }

            data = BuhinDialog.data.entry(id);

            if (App.isFunc(BuhinDialog.dataSelected)) {
                if (!BuhinDialog.dataSelected(data)) {
                    element.modal("hide");
                }
            }
            else {
                element.modal("hide");
            }
    
        };

        //複数セレクトを使用する場合は、上の単一セレクト用select関数を削除し、下の複数セレクト用の関数をコメント解除します
        //単一セレクトの場合は、不要なコメント部分は削除してください

        /**
         * 一覧から行を選択された際の処理を実行します。（複数セレクト用）
         */
        //BuhinDialog.select = function (e) {
        //    var element = BuhinDialog.element,
        //        data;
        //    //選択された行から起動元画面に返却したい値を抽出します
        //    var items = element.find(".search-list").find("input:checked[name='select_cd']").map(function (index, item) {
        //        var tbody = $(item).closest("tbody");
        //        var id = tbody.attr("data-key");
        //        var data = BuhinDialog.data.entry(id);
        //        //return data.cd_torihiki;
        //    }).toArray();

        //    if (items.length == 0) {
        //        BuhinDialog.notifyAlert.message(App.messages.base.MS0020).show();
        //        return;
        //    }

        //    element.modal("hide");

        //    if (App.isFunc(BuhinDialog.dataSelected)) {
        //        BuhinDialog.dataSelected(items);
        //    }
        //};

        /**
         * 一覧の行をクリックした際の処理を実行します。（複数セレクト用）
         */
        //BuhinDialog.selectOne = function (e) {

        //    var target = $(e.target),
        //        tbody = target.closest("tbody");

        //    if (target.is("[name='select_cd']")) {
        //        return;
        //    }

        //    var check = tbody.find("[name='select_cd']");
        //    if (check.is(":checked")) {
        //        check.prop("checked", false);

        //    } else {
        //        check.prop("checked", true);
        //    }
        //};

        /**
         * 一覧のヘッダ部のチェックボックスをクリックした際の処理を実行します。（複数セレクト用）
         */
        //BuhinDialog.selectAll = function (e) {

        //    var $select_cd_all = $(e.target),
        //        isChecked = $select_cd_all.is(":checked");

        //    if (isChecked) {
        //        BuhinDialog.element.find("[name='select_cd']:visible").prop("checked", true);
        //    } else {
        //        BuhinDialog.element.find("[name='select_cd']:visible").prop("checked", false);
        //    }
        //    BuhinDialog.element.find("[name='select_cd']:visible").change();
        //};

    </script>

    <div class="modal fade wide" tabindex="-1" id="BuhinDialog">
    <div class="modal-dialog" style="height: 350px; width: 60%">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title">部品検索</h4>
            </div>

            <div class="modal-body">
                <div class="search-criteria">
                    <div class="row">
                        <div class="control-label col-xs-3">
                            <label>部品名</label>
                        </div>
                        <div class="control col-xs-9">
                            <input type="text" class="ime-active" data-prop="nm_buhin" />
                        </div>
                    </div>
                </div>
                <div style="position: relative; height: 50px;">
                    <button type="button" style="position: absolute; right: 5px; top: 5px;" class="btn btn-sm btn-primary search">検索</button>
                    <div class="data-count">
                        <span data-prop="data_count"></span>
                        <span>/</span>
                        <span data-prop="data_count_total"></span>
                    </div>
                </div>

                <div style="padding-right: 16px;">
                    <table class="table table-striped table-condensed " style="margin-bottom: 0px;">
                    <!--TODO: ダイアログのヘッダーを定義するHTMLをここに記述します。-->
                        <thead>
                            <tr>
                                <%--単一セレクトの場合は、以下の１行を使用する--%>
                                <th style="width: 15%;"></th>
                                <th style="width: 20%;">部品コード</th>
                                <th style="width: 45%;">部品名</th>
                                <th style="width: 5%;">単位</th>
                                <th style="width: 15%;">仕入単価</th>
                                <%--複数セレクトの場合は、上の１行をカットし、下の３行をコメント解除してください--%>
<%--                                <th style="width: 5%;">
                                    <input type="checkbox" name="select_cd_all" />
                                </th>--%>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div style="height: 252px; overflow: scroll; overflow-x: hidden;">
                    <table class="table table-striped table-condensed search-list">
                    <!--TODO: ダイアログの明細行を定義するHTMLをここに記述します。-->
                        <tbody class="item-tmpl" style="display: none;">
                            <tr>
                                <%--単一セレクトの場合は、以下の３行を使用する--%>
                                <td style="width: 15%;">
                                    <button type="button" style="margin: 1px;padding: 1px;" class="btn btn-success btn-xs select">選択</button>
                                </td>
                                <td style="width: 20%">
                                    <span data-prop="cd_buhin"></span>
                                </td>
                                <td style="width: 45%">
                                    <span data-prop="nm_buhin"></span>
                                </td>
                                <td style="width: 5%">
                                    <span data-prop="nm_tani"></span>
                                </td>
                                <td style="width: 15%">
                                    <span data-prop="kin_shiire" class="number-right"></span>
                                </td>
                                <%--複数セレクトの場合は、上の３行をカットし、下の３行をコメント解除してください--%>
<%--                                <td style="width: 5%;">
                                    <input type="checkbox" name="select_cd" />
                                </td>--%>
                            </tr>
                        </tbody>
                    </table>
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
                <%--複数セレクトの場合は、下の１行をコメント解除してください--%>
                <%--<button type="button" class="btn btn-success select" name="select" >選択</button>--%>
                <button type="button" class="cancel-button btn btn-sm btn-default" data-dismiss="modal" name="close">閉じる</button>
            </div>
        </div>
    </div>
    </div>