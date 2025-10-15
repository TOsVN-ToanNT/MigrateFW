<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="SearchMultiSelectDialog.aspx.cs" Inherits="Tos.Web.Pages.SearchMultiSelectDialog" %>
<%@ MasterType VirtualPath="~/Site.Master" %>

    <script type="text/javascript">

        /**
         * 検索ダイアログのレイアウト構造に対応するオブジェクトを定義します。
         */
        var SearchMultiSelectDialog = {
            urls: {
                torihiki: "../Services/SampleService.svc/Torihiki"
            }
        };

        /**
         * 検索ダイアログの初期化処理を行います。
         */
        SearchMultiSelectDialog.initialize = function () {
            var element = $("#SearchMultiSelectDialog");

            element.on("hidden.bs.modal", SearchMultiSelectDialog.hidden);
            element.on("shown.bs.modal", SearchMultiSelectDialog.shown);
            element.on("click", ".select", SearchMultiSelectDialog.select);
            element.on("click", ".search-list tbody", SearchMultiSelectDialog.selectOne);
            element.find("[name='select_cd_all']").on("click", SearchMultiSelectDialog.selectAll);
            element.on("click", ".search", SearchMultiSelectDialog.search);
            SearchMultiSelectDialog.element = element;

            element.find(".alert-message").attr("title", App.ui.pagedata.lang(App.ui.page.lang).alertTitle.text);
            element.find(".info-message").attr("title", App.ui.pagedata.lang(App.ui.page.lang).infoTitle.text);

            SearchMultiSelectDialog.notifyInfo =
                App.ui.notify.info(element, {
                    container: "#SearchMultiSelectDialog .dialog-slideup-area .info-message",
                    bodyContainer: ".modal-body",
                    show: function () {
                        element.find(".info-message").show();
                    },
                    clear: function () {
                        element.find(".info-message").hide();
                    }
                });
            SearchMultiSelectDialog.notifyAlert =
                App.ui.notify.alert(element, {
                    container: "#SearchMultiSelectDialog .dialog-slideup-area .alert-message",
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
        SearchMultiSelectDialog.hidden = function (e) {

            //TODO:ダイアログ非表示時に、項目をクリアする処理をここに記述します。
            var element = SearchMultiSelectDialog.element,
                table = element.find(".search-list");

            element.find(":input").val("");
            element.find(":checked").prop("checked", false);
            table.find("tbody").not(".item-tmpl").remove();

            element.findP("data_count").text("");
            element.findP("data_count_total").text("");

            SearchMultiSelectDialog.notifyInfo.clear();
            SearchMultiSelectDialog.notifyAlert.clear();
        };

        /**
         * 検索ダイアログ表示時処理を実行します。
         */
        SearchMultiSelectDialog.shown = function (e) {

            SearchMultiSelectDialog.element.find(":input:not(button):first").focus();
        };

        /**
         * 検索ダイアログの検索処理を実行します。
         */
        SearchMultiSelectDialog.search = function () {
            var element = SearchMultiSelectDialog.element,
                loadingTaget = element.find(".modal-content"),
                table = element.find(".search-list"),
                filter = SearchMultiSelectDialog.createFilter(),
                query;

            query = {
                url: SearchMultiSelectDialog.urls.torihiki,
                filter: filter,
                orderby: "cd_torihiki",
                skip: 0,
                top: App.settings.base.dialogDataTakeCount,
                inlinecount: "allpages"
            };

            table.find("tbody:visible").remove();
            SearchMultiSelectDialog.notifyAlert.clear();

            App.ui.loading.show("", loadingTaget);

            //TODO: 検索処理をここに記述します。
            $.ajax(App.ajax.odata.get(App.data.toODataFormat(query)))
            .done(function (result) {

                SearchMultiSelectDialog.bind(result);
            }).always(function () {

                App.ui.loading.close(loadingTaget);
            });
        };

        /**
         * 検索ダイアログの検索条件を組み立てます
         */
        SearchMultiSelectDialog.createFilter = function () {
            var criteria = SearchMultiSelectDialog.element.find(".search-criteria").form().data(),
                filters = [];

            if (!App.isUndefOrNullOrStrEmpty(criteria.nm_torihiki)) {
                filters.push("substringof('" + encodeURIComponent(criteria.nm_torihiki) + "', nm_torihiki) eq true");
            }

            return filters.join(" and ");
        };

        /**
         * 検索ダイアログの一覧にデータをバインドします。
         */
        SearchMultiSelectDialog.bind = function (data) {
            var element = SearchMultiSelectDialog.element,
                table = element.find(".search-list"),
                count = data["odata.count"],
                items = data.value ? data.value : data,
                i, l, item, clone;

            element.findP("data_count").text(data.value.length);
            element.findP("data_count_total").text(count);

            SearchMultiSelectDialog.data = App.ui.page.dataSet();
            SearchMultiSelectDialog.data.attach(items);

            table.find("tbody:visible").remove();

            for (i = 0, l = items.length; i < l; i++) {
                item = items[i];
                clone = table.find(".item-tmpl").clone();
                clone.form().bind(item);
                clone.appendTo(table).removeClass("item-tmpl").show();
            }

            if (count && count > App.settings.base.dialogDataTakeCount) {
                SearchMultiSelectDialog.notifyInfo.message(App.messages.base.MS0011).show();
            }
        };

        /**
         * 一覧から行を選択された際の処理を実行します。
         */
        SearchMultiSelectDialog.select = function (e) {
            var element = SearchMultiSelectDialog.element,
                items;

            items = element.find(".search-list").find("input:checked[name='select_cd']").map(function (index, item) {
                var tbody = $(item).closest("tbody"),
                    id = tbody.attr("data-key"),
                    data = SearchMultiSelectDialog.data.entry(id);
                return data.cd_torihiki;
            }).toArray();

            if (items.length == 0) {
                SearchMultiSelectDialog.notifyAlert.message(App.messages.base.MS0020).show();
                return;
            }

            if (App.isFunc(SearchMultiSelectDialog.dataSelected)) {
                if (!SearchMultiSelectDialog.dataSelected(items)) {
                    element.modal("hide");
                }
            } else {
                element.modal("hide");
            }
        };

        /**
         * 一覧の行をクリックした際の処理を実行します。（複数セレクト用）
         */
        SearchMultiSelectDialog.selectOne = function (e) {
            var target = $(e.target),
                tr = target.closest("tr");

            if (target.is("[name='select_cd']")) {
                return;
            }

            var check = tr.find("[name='select_cd']");
            check.prop("checked", !check.is(":checked"));
        };

        /**
         * 一覧のヘッダ部のckeckbox(ALLチェック用）をクリックした際の処理を実行します。（複数セレクト用）
         */
        SearchMultiSelectDialog.selectAll = function (e) {
            var target = $(e.target);
            SearchMultiSelectDialog.element.find("[name='select_cd']:visible").prop("checked", target.is(":checked"));
        };

    </script>

    <div class="modal fade wide" tabindex="-1" id="SearchMultiSelectDialog">
    <div class="modal-dialog" style="height: 350px; width: 60%">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title">取引先一覧</h4>
            </div>

            <div class="modal-body">
                <div class="search-criteria">
                    <div class="row">
                        <div class="control-label col-xs-3">
                            <label>取引先名</label>
                        </div>
                        <div class="control col-xs-9">
                            <input type="text" class="ime-active" data-prop="nm_torihiki" />
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
                    <table class="table table-striped table-condensed" style="margin-bottom: 0px;">
                        <thead>
                            <tr>
                                <th style="width: 5%;">
                                    <input type="checkbox" name="select_cd_all" />
                                </th>
                                <th style="width: 15%;">取引先コード</th>
                                <th style="width: 25%;">取引先名</th>
                                <th style="width: 15%;">郵便番号</th>
                                <th style="width: 40%;">住所</th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div style="height: 252px; overflow: scroll; overflow-x: hidden;">
                    <table class="table table-striped table-condensed search-list">
                        <tbody class="item-tmpl" style="display: none;">
                            <tr>
                                <td style="width: 5%;">
                                    <input type="checkbox" name="select_cd" />
                                </td>
                                <td style="width: 15%;">
                                    <span data-prop="cd_torihiki"></span>
                                </td>
                                <td style="width: 25%;">
                                    <span data-prop="nm_torihiki"></span>
                                </td>
                                <td style="width: 15%;">
                                    <span data-prop="no_yubin"></span>
                                </td>
                                <td style="width: 40%;">
                                    <span data-prop="nm_jusho"></span>
                                </td>
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
                <button type="button" class="btn btn-success select" name="select" >選択</button>
                <button type="button" class="cancel-button btn btn-sm btn-default" data-dismiss="modal" name="close">閉じる</button>
            </div>
        </div>
    </div>
    </div>