<%@ Page Title="999_オプションパターン 小計" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="SearchListSubtotal.aspx.cs" Inherits="Tos.Web.Pages.SearchListSubtotal" %>
<%@ MasterType VirtualPath="~/Site.Master" %>

<asp:Content ID="IncludeContent" ContentPlaceHolderID="IncludeContent" runat="server">

    <link media="all" rel="stylesheet" href="<%=ResolveUrl("~/Content/part.css") %>" type="text/css" />
    <link media="all" rel="stylesheet" href="<%=ResolveUrl("~/Content/headerdetail.css") %>" type="text/css" />

    <% #if DEBUG %>
    <script src="<%=ResolveUrl("~/Scripts/datatable.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/part.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/subtotal.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/jquery.ui.monthpicker.js") %>" type="text/javascript"></script>
    <% #else %>
    <script src="<%=ResolveUrl("~/Scripts/datatable.min.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/part.min.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/subtotal.min.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/jquery.ui.monthpicker.min.js") %>" type="text/javascript"></script>
    <% #endif %>
    <script src="<%=ResolveUrl("~/Scripts/jquery.ui.monthpicker.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/jquery.ui.monthpicker-ja.js") %>" type="text/javascript"></script>

</asp:Content>

<asp:Content ID="HeadContent" ContentPlaceHolderID="HeadContent" runat="server">

    <style type="text/css">

        div .detail-command {
            text-align: center;
        }

        .btn-next-search {
            width: 200px;
        }

       
    </style>

    <script type="text/javascript">

        /**
         * ページのレイアウト構造に対応するオブジェクトを定義します。
         */
        var page = App.define("SearchListSubtotal", {
            //TODO: ページのレイアウト構造に対応するオブジェクト定義を記述します。
            options: {
                skip: 0,                                // TODO:先頭からスキップするデータ数を指定します。
                top: App.settings.base.dataTakeCount,   // TODO:取得するデータ数を指定します。
                filter: ""
            },
            values: {
            },
            urls: {
                mitsumori: "../api/SampleBuhinCalendar"
            },
            header: {
                options: {},
                values: {},
                urls: {
                }
            },
            detail: {
                options: {},
                values: {}
            },
            dialogs: {
            },
            commands: {}
        });

        /**
         * 単項目要素をエラーのスタイルに設定します。
         * @param target 設定する要素
         */
        page.setColInvalidStyle = function (target) {
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
        page.setColValidStyle = function (target) {
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
         * バリデーション成功時の処理を実行します。
         */
        page.validationSuccess = function (results, state) {
            var i = 0, l = results.length,
                item, $target;

            for (; i < l; i++) {
                item = results[i];
                if (state && state.isGridValidation) {
                    page.detail.dataTable.dataTable("getRow", $(item.element), function (row) {
                        if (row && row.element) {
                            row.element.find("tr").removeClass("has-error");
                        }
                    });
                } else {
                    page.setColValidStyle(item.element);
                }

                App.ui.page.notifyAlert.remove(item.element);
            }
        };

        /**
         * バリデーション失敗時の処理を実行します。
         */
        page.validationFail = function (results, state) {

            var i = 0, l = results.length,
                item, $target;

            for (; i < l; i++) {
                item = results[i];
                if (state && state.isGridValidation) {
                    page.detail.dataTable.dataTable("getRow", $(item.element), function (row) {
                        if (row && row.element) {
                            row.element.find("tr").addClass("has-error");
                        }
                    });
                } else {
                    page.setColInvalidStyle(item.element);
                }

                if (state && state.suppressMessage) {
                    continue;
                }
                App.ui.page.notifyAlert.message(item.message, item.element).show();
            }
        };

        /**
         * バリデーション後の処理を実行します。
         */
        page.validationAlways = function (results) {
            //TODO: バリデーションの成功、失敗に関わらない処理が必要な場合はここに記述します。
        };

        /**
          * 指定された定義をもとにバリデータを作成します。
          * @param target バリデーション定義
          * @param options オプションに設定する値。指定されていない場合は、
          *                画面の success/fail/always のハンドル処理が指定されたオプションが設定されます。
          */
        page.createValidator = function (target, options) {
            return App.validation(target, options || {
                success: page.validationSuccess,
                fail: page.validationFail,
                always: page.validationAlways
            });
        };

        /**
         * すべてのバリデーションを実行します。
         */
        page.validateAll = function () {

            var validations = [];

            validations.push(page.header.validator.validate());

            //TODO: 画面内で定義されているバリデーションを実行する処理を記述します。
            return App.async.all(validations);
        };

        /**
        * 画面の初期化処理を行います。
        */
        page.initialize = function () {

            App.ui.loading.show();

            page.initializeControl();
            page.initializeControlEvent();

            page.header.initialize();
            page.detail.initialize();


            //TODO: ヘッダー/明細以外の初期化の処理を記述します。

            page.loadMasterData().then(function (result) {
                //TODO: 画面の初期化処理成功時の処理を記述します。

            }).fail(function (error) {
                App.ui.page.notifyAlert.message(App.ajax.handleError(error).message).show();

            }).always(function (result) {

                page.header.element.find(":input:first").focus();
                App.ui.loading.close();
            });
        };

        /**
         * 画面コントロールの初期化処理を行います。
         */
        page.initializeControl = function () {

            //TODO: 画面全体で利用するコントロールの初期化処理をここに記述します。
            $(".part").part();

        };

        /**
         * コントロールへのイベントの紐づけを行います。
         */
        page.initializeControlEvent = function () {

            //TODO: 画面全体で利用するコントロールのイベントの紐づけ処理をここに記述します。

        };

        /**
         * マスターデータのロード処理を実行します。
         */
        page.loadMasterData = function () {

            //TODO: 画面内のドロップダウンなどで利用されるマスターデータを取得し、画面にバインドする処理を記述します。
            return App.async.success();
        };

        /**
         * 画面ヘッダーのバリデーションを定義します。
         */
        page.header.options.validations = {
            //TODO: 画面ヘッダーのバリデーションの定義を記述します。
            dt_month: {
                rules: {
                    required: true,
                    datestringYM: true
                },
                options: {
                    name: "作成年月",
                },
                messages: {
                    required: App.messages.base.required,
                    datestringYM: App.messages.base.datestringYM
                }
            }
        };

        /**
         * 画面ヘッダーの初期化処理を行います。
         */
        page.header.initialize = function () {

            var element = $(".header");
            page.header.validator = element.validation(page.createValidator(page.header.options.validations));
            page.header.element = element;

            //TODO: 画面ヘッダーの初期化処理をここに記述します。
            //TODO: 画面ヘッダーで利用するコントロールのイベントの紐づけ処理をここに記述します。
            element.on("click", "#search", page.header.search);
            element.on("change", ":input", page.header.change);

            element.find("input[data-prop='dt_month']").monthpicker();
            ////デフォルト年月設定
            var datetime = new Date("2015/04/01");
            element.find("input[data-prop='dt_month']").monthpicker("setDate", datetime);

        };

        page.header.change = function () {
            if ($("#nextsearch").hasClass("show-search")) {
                $("#nextsearch").removeClass("show-search").hide();
                App.ui.page.notifyInfo.message(App.messages.base.MS0010).show();
            }
            else if (page.detail.searchData) {
                // 保持検索データの消去
                page.detail.searchData = undefined;
                App.ui.page.notifyInfo.message(App.messages.base.MS0010).show();
            }
        };

        /**
         * 検索処理を定義します。
         */
        page.header.search = function () {

            var query;

            page.validateAll().then(function () {

                page.options.skip = 0;
                page.options.filter = page.header.createFilter();

                query = {
                    url: page.urls.mitsumori,
                    filter: page.options.filter,
                    orderby: "cd_buhin, dt_sakusei",
                    skip: page.options.skip,
                    top: page.options.top,
                    inlinecount: "allpages"
                };

                App.ui.loading.show();
                App.ui.page.notifyAlert.clear();

                return $.ajax(App.ajax.webapi.get(App.data.toODataFormat(query)))
                .done(function (result) {
                    // パーツ開閉の判断
                    if (page.detail.isClose) {
                        // 検索データの保持
                        page.detail.searchData = result;
                    } else {
                        // データバインド
                        page.detail.bind(result);
                    }

                }).fail(function (error) {
                    App.ui.page.notifyAlert.message(App.ajax.handleError(error).message).show();

                }).always(function () {
                    App.ui.loading.close();

                });

            });
        };

        /**
         * 検索条件のフィルターを定義します。
         */
        page.header.createFilter = function () {
            var criteria = page.header.element.form().data(),
                filters = [];
            
            var date = page.header.element.find("input[data-prop='dt_month']").monthpicker("getDate");

            //作成年月（1日<= [作成日] <= 末日）
            if (!App.isUndefOrNull(criteria.dt_month)) {
                var dt_month = criteria.dt_month.split("/");
                var from = new Date(dt_month[0], dt_month[1] - 1, 1),
                    to = new Date(from.getFullYear(), from.getMonth() + 1, 1); //翌月１日を求めて、＜未満とする

                filters.push("dt_sakusei ge datetime'" + App.data.getDateTimeStringForQueryNoTime(from) + "'");
                filters.push("dt_sakusei lt datetime'" + App.data.getDateTimeStringForQueryNoTime(to) + "'");
            }

            return filters.join(" and ");
        };

        //TODO: 以下の page.header の各宣言は画面仕様ごとにことなるため、
        //不要の場合は削除してください。

        /**
         * 画面ヘッダーにある取引先コードに値を設定します。
         */
        page.header.setTorihiki = function (data) {
            page.header.element.findP("cd_torihiki").val(data.cd_torihiki).change();
            page.header.element.findP("nm_torihiki").text(data.nm_torihiki);
        }


        /**
         * 画面明細の初期化処理を行います。
         */
        page.detail.initialize = function () {

            var element = $(".detail"),
                table = element.find(".datatable"),
                datatable = table.dataTable({
                    //fixedColumn: true,
                    //fixedColumns: 2,
                    //innerWidth: 1200,
                    height: 200,
                    resize: true,
                    onselect: page.detail.select
                });

            table = element.find(".datatable");         //列固定にした場合DOM要素が再作成されるため、変数を再取得
            element.on("click", "#nextsearch", page.detail.nextsearch);
            // 行選択時に利用するテーブルインデックスを指定します
            page.detail.fixedColumnIndex = element.find(".fix-columns").length;

            page.detail.element = element;
            page.detail.dataTable = datatable;

            // 明細パートオープン時の処理を指定します
            element.find(".part").on("expanded.aw.part", function () {
                page.detail.isClose = false;
                if (page.detail.searchData) {
                    App.ui.loading.show();
                    setTimeout(function () {
                        page.detail.bind(page.detail.searchData);
                        page.detail.searchData = undefined;
                        App.ui.loading.close();
                    }, 5);
                };
            });

            // 明細パートクローズ時の処理を指定します
            element.find(".part").on("collapsed.aw.part", function () {
                page.detail.isClose = true;
            });

            //TODO: 画面明細の初期化処理をここに記述します。
            //TODO: 画面明細で利用するコントロールのイベントの紐づけ処理をここに記述します。
        };

        /**
         * 次のレコードを検索する処理を定義します。
         */
        page.detail.nextsearch = function () {

            var query = {
                url: page.urls.mitsumori,
                filter: page.options.filter,
                orderby: "cd_buhin, dt_sakusei",
                skip: page.options.skip,
                top: page.options.top,
                inlinecount: "allpages"
            };

            App.ui.loading.show();
            App.ui.page.notifyAlert.clear();

            return $.ajax(App.ajax.webapi.get(App.data.toODataFormat(query)))
            .done(function (result) {
                page.detail.bind(result);
            }).fail(function (error) {
                App.ui.page.notifyAlert.message(App.ajax.handleError(error).message).show();
            }).always(function () {
                App.ui.loading.close();
            });

        };

        /**
         * 画面明細へのデータバインド処理を行います。
         */
        page.detail.bind = function (data, isNewData) {
            var i, l, item, dataSet, dataCount, offsetHeight;

            dataCount = data.Count;
            data = (data.Items) ? data.Items : data;

            if (page.options.skip === 0) {
                dataSet = App.ui.page.dataSet();
                page.detail.dataTable.dataTable("clear");
            } else {
                dataSet = page.detail.data;
            }
            page.detail.data = dataSet;

            page.detail.dataTable.dataTable("addRows", data, function (row, item) {
                (isNewData ? dataSet.add : dataSet.attach).bind(dataSet)(item);
                row.form(page.detail.options.bindOption).bind(item);
                return row;
            }, true);

            page.options.skip += data.length;
            page.detail.element.findP("data_count").text(page.options.skip);
            page.detail.element.findP("data_count_total").text(dataCount);

            if (dataCount <= page.options.skip) {
                $("#nextsearch").hide();
            }
            else {
                $("#nextsearch").show();
            }

            if (page.options.skip >= App.settings.base.maxSearchDataCount) {
                App.ui.page.notifyInfo.message(App.messages.base.MS0011).show();
                $("#nextsearch").hide();
            }

            offsetHeight = $("#nextsearch").is(":visible") ? $("#nextsearch").addClass("show-search").outerHeight() : 0;
            page.detail.dataTable.dataTable("setAditionalOffset", offsetHeight);
            //TODO: 画面明細へのデータバインド処理をここに記述します。
            $(".datatable tbody").subtotal("cd_buhin", ["su_suryo","kin_shiire_tanka"]);

        };

        /**
         * 画面明細の一覧の行が選択された時の処理を行います。
         */
        page.detail.select = function (e, row) {
            $($(row.element[page.detail.fixedColumnIndex]).closest("table")[0].querySelectorAll(".select-tab.selected")).removeClass("selected").addClass("unselected");
            $(row.element[page.detail.fixedColumnIndex].querySelectorAll(".select-tab")).removeClass("unselected").addClass("selected");

            //選択行全体に背景色を付ける場合は以下のコメントアウトを解除します。
            //if (!App.isUndefOrNull(page.detail.selectedRow)) {
            //    page.detail.selectedRow.element.find("tr").removeClass("selected-row");
            //}
            //row.element.find("tr").addClass("selected-row");
            //page.detail.selectedRow = row;
        };

        /**
         * 画面明細のデータを設定する際のオプションを定義します。
         */
        page.detail.options.bindOption = {
            appliers: {
                dt_sakusei: function (value, element) {
                    element.text(App.data.getDateString(App.data.parseJsonDate(value)));
                    return true;
                }
            }
        };

        /**
         * jQuery イベントで、ページの読み込み処理を定義します。
         */
        $(function () {
            // ページの初期化処理を呼び出します。
            page.initialize();
        });

    </script>

</asp:Content>

<asp:Content ID="MainContent" ContentPlaceHolderID="MainContent" runat="server">

    <div class="content-wrap">
        <div class="header">
            <div title="検索条件" class="part">
                <div class="row">
                    <div class="control-label col-xs-2">
                        <label>作成年月</label>
                    </div>
                    <div class="control col-xs-2">
                        <input type="tel" data-prop="dt_month" />
                    </div>
                    <div class="control col-xs-8">
                    </div>
                </div>
                <div class="header-command">
                    <button type="button" id="search" class="btn btn-sm btn-primary" >検索</button>
                </div>
            </div>
        </div>

        <div class="detail">
            <!--<div title="部品一覧" class="part">-->
                <div class="control toolbar">
                    <div class="data-count">
                        <span data-prop="data_count"></span>
                        <span>/</span>
                        <span data-prop="data_count_total"></span>
                    </div>
                </div>
                <table class="datatable">
                    <thead>
                        <tr>
                            <th style="width: 10px;"></th>
                            <th style="width: 80px;">発注番号</th>
                            <th style="width: 80px;">部品番号</th>
                            <th >部品名</th>
                            <th style="width: 100px;">作成日</th>
                            <th style="width: 80px;">数量</th>
                            <th style="width: 100px;">支払単価</th>
                        </tr>
                    </thead>
                    <tbody class="item-tmpl" style="cursor:default; display: none;">
                        <tr>
                            <td>
                                <span class="select-tab unselected"></span>
                            </td>
                            <td>
                                <span data-prop="no_buhin_calendar" class="number-right number"></span>
                            </td>
                            <td>
                                <span data-prop="cd_buhin" class="number-right number"></span>
                            </td>
                            <td>
                                <span data-prop="nm_komoku"></span>
                            </td>
                            <td>
                                <span data-prop="dt_sakusei"></span>
                            </td>
                            <td>
                                <span data-prop="su_suryo" class="number-right number"></span>
                            </td>
                            <td>
                                <span data-prop="kin_shiire_tanka" class="number-right number"></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="detail-command">
                    <button type="button" id="nextsearch" class="btn btn-sm btn-primary btn-next-search" style="display:none" >次を検索</button>
                </div>
                <div class="part-command">
                    <!--
                    <div class="data-count">
                        <span data-prop="data_count"></span>
                        <span>/</span>
                        <span data-prop="data_count_total"></span>
                    </div>
                    -->
                </div>
            <!--</div>-->
        </div>
    </div>

</asp:Content>

<asp:Content ID="FooterContent" ContentPlaceHolderID="FooterContent" runat="server">
    <div class="command-left">
    </div>

    <div class="command">

    </div>

</asp:Content>

<asp:Content ID="DialogsContent" ContentPlaceHolderID="DialogsContent" runat="server">

</asp:Content>

