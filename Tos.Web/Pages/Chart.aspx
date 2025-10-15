<%@ Page Title="999_チャート" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Chart.aspx.cs" Inherits="Tos.Web.Pages.Chart" %>
<%@ MasterType VirtualPath="~/Site.Master" %>

<asp:Content ID="IncludeContent" ContentPlaceHolderID="IncludeContent" runat="server">

    <link media="all" rel="stylesheet" href="<%=ResolveUrl("~/Content/part.css") %>" type="text/css" />
    <link media="all" rel="stylesheet" href="<%=ResolveUrl("~/Content/headerdetail.css") %>" type="text/css" />


    <% #if DEBUG %>
    <!--[if lt IE 9]>
        <script src="<%=ResolveUrl("~/Scripts/excanvas.js") %>" type="text/javascript"></script>
    <![endif]-->
    <script src="<%=ResolveUrl("~/Scripts/jquery.flot.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/jquery.flot.time.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/jquery.flot.stack.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/jquery.flot.resize.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/jquery.flot.orderBars.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/jquery.flot.dashes.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/jquery.flot.valuelabels.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/datatable.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/part.js") %>" type="text/javascript"></script>
    <% #else %>
    <!--[if lt IE 9]>
        <script src="<%=ResolveUrl("~/Scripts/excanvas.min.js") %>" type="text/javascript"></script>
    <![endif]-->
    <script src="<%=ResolveUrl("~/Scripts/jquery.flot.min.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/jquery.flot.time.min.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/jquery.flot.stack.min.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/jquery.flot.resize.min.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/jquery.flot.orderBars.min.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/jquery.flot.dashes.min.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/jquery.flot.valuelabels.min.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/datatable.min.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/part.min.js") %>" type="text/javascript"></script>
    <% #endif %>
</asp:Content>

<asp:Content ID="HeadContent" ContentPlaceHolderID="HeadContent" runat="server">

    <style type="text/css">
        .part div .detail-command
        {
            text-align: center;
        }

        .btn-next-search
        {
            width: 200px;
        }

        .chart .plot-container
        {
            height: 300px;
            width: 100%;
            padding: 5px 10px 5px 10px;
        }

        .chart .plot
        {
            height: 100%;
            width: 100%;
        }
    </style>

    <script type="text/javascript">

        /**
        * ページのレイアウト構造に対応するオブジェクトを定義します。
        */
        var page = App.define("chart", {
            //TODO: ページのレイアウト構造に対応するオブジェクト定義を記述します。
            options: {
                skip: 0,                                // TODO:先頭からスキップするデータ数を指定します。
                top: App.settings.base.dataTakeCount,   // TODO:取得するデータ数を指定します。
                filter: ""
            },
            values: {

            },
            urls: {
                product: "../api/SampleProduct"
            },
            header: {
                options: {},
                values: {},
                urls: {}
            },
            detail: {
                options: {},
                values: {}
            },
            chart: {
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
            validations.push(page.detail.validateList());

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

            page.chart.initialize();
            page.header.initialize();
            page.detail.initialize();

            //TODO: ヘッダー/明細以外の初期化の処理を記述します。

            page.loadMasterData().then(function (result) {
                //TODO: 画面の初期化処理成功時の処理を記述します。

            }).fail(function (error) {
                App.ui.page.notifyAlert.message(App.ajax.handleError(error).message).show();

            }).always(function (result) {

                //page.header.element.find(":input:first").focus();
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

            return App.async.success();
            //TODO: 画面内のドロップダウンなどで利用されるマスターデータを取得し、画面にバインドする処理を記述します。
        };

        /**
        * チャートの初期化処理を行います。
        */
        page.chart.initialize = function () {

            var element = $(".chart");
            page.chart.element = element;

            //TODO: 画面ヘッダーの初期化処理をここに記述します。
            page.chart.element.find(".part").part("close");

            //TODO: 画面ヘッダーで利用するコントロールのイベントの紐づけ処理をここに記述します。

            // 軸オプション(左右目盛)
            page.chart.options.xaxis = {
                mode: "time",
                timeformat: "%e日",//"%d日",
                tickSize: [1, "day"],
                timezone: "browser"
            };

            // 軸オプション(上下目盛)
            page.chart.options.yaxis = {
                min: -400,
                // 最大値の指定
                max: 1800,
                // 目盛間隔の指定
                ticks: [-400, -200, 0, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800]
            };

            page.chart.values.barWidth = (4 * 60 * 60 * 1000);  // 4時間
            page.chart.values.halfDay = (12 * 60 * 60 * 1000);  // 12 時間

        };

        /**
        * グラフを作成します。
        */
        page.chart.createChart = function (data) {

            var chartType = page.chart.element.findP("chart_Type").val(),
                chartDataType = page.chart.element.findP("chart_Data").val(),
                criteria = page.header.element.form().data(),
                chartData = (data.Items) ? data.Items : data;

            page.chart.element.find(".part").part("show");

            // 描画しているチャートを破棄します。
            if (page.chart.plot) {
                page.chart.plot.shutdown();
            }


            //TODO: X軸の最小・最大を設定します
            page.chart.options.xaxis.min = (new Date(criteria.dt_product_from)).getTime() - page.chart.values.halfDay;
            page.chart.options.xaxis.max = (new Date(criteria.dt_product_to)).getTime() + page.chart.values.halfDay;

            if (chartDataType !== "1") {
                chartData = undefined;
            }

            //TODO: 種別に応じたグラフを作成します
            switch (chartType) {
                case "1":
                    page.chart.createLineChart(chartData);
                    break;
                case "2":
                    page.chart.createBarChart(chartData);
                    break;
                default:
                    page.chart.createMultipleChart(chartData);
                    break;
            };

            page.chart.chartType = chartType;
            page.chart.chartDataType = chartDataType;
        };

        /**
        * 折れ線グラフを作成します。
        */
        page.chart.createLineChart = function (data) {

            var chart = page.chart.element.find(".plot"),
                criteria = page.header.element.form().data(),
                chartData = [],
                shukkaConverter = function (item) {
                    item.dt_product = new Date(App.data.getDateTimeString(App.data.parseJsonDate(item.dt_product))).getTime();
                    item.su_shukka = item.su_shukka * -1;
                    return item
                },
                converter = function (item) {
                    item.dt_product = new Date(App.data.getDateTimeString(App.data.parseJsonDate(item.dt_product))).getTime();
                    return item
                };

            chartData.push({
                label: "在庫数",
                data: data ?
                        App.ui.chart.convertToChartData(data, "dt_product", "su_zaiko", converter) :
                        page.detail.data.convertToChartData("dt_product", "su_zaiko", converter)
            });

            chartData.push({
                label: "出荷実績",
                data: data ?
                        App.ui.chart.convertToChartData(data, "dt_product", "su_shukka", shukkaConverter) :
                        page.detail.data.convertToChartData("dt_product", "su_shukka", shukkaConverter),
                dashes: {
                    show: true,
                    dashLength: 5
                }
            });

            chartData.push({
                data: [[new Date("2014/9/10").getTime(), page.chart.options.yaxis.min], [new Date("2014/9/10").getTime(), page.chart.options.yaxis.max]],
                color: "red",
                lines: {
                    lineWidth: 1
                }
            });
            chartData.push({
                data: [[page.chart.options.xaxis.min, 800], [page.chart.options.xaxis.max, 800]],
                color: "red",
                lines: {
                    lineWidth: 1
                }
            });

            page.chart.plot = chart.createChart(chartData, page.chart.options);

        };

        /**
        * 棒グラフを作成します。
        */
        page.chart.createBarChart = function (data) {

            var chart = page.chart.element.find(".plot"),
                criteria = page.header.element.form().data(),
                chartData = [],
                converter = function (item) {
                    item.dt_product = new Date(App.data.getDateTimeString(App.data.parseJsonDate(item.dt_product))).getTime();
                    return item
                };

            chartData.push({
                label: "生産計画",
                data: data ?
                        App.ui.chart.convertToChartData(data, "dt_product", "su_keikaku", converter) :
                        page.detail.data.convertToChartData("dt_product", "su_keikaku", converter),
                bars: {
                    show: true,
                    lineWidth: 1,
                    barWidth: page.chart.values.barWidth,
                    order: 1
                }
            });

            chartData.push({
                label: "生産実績",
                data: data ?
                        App.ui.chart.convertToChartData(data, "dt_product", "su_jisseki", converter) :
                        page.detail.data.convertToChartData("dt_product", "su_jisseki", converter),
                bars: {
                    show: true,
                    lineWidth: 1,
                    barWidth: page.chart.values.barWidth,
                    order: 2
                }
            });

            chartData.push({
                data: [[new Date("2014/9/10").getTime(), page.chart.options.yaxis.min], [new Date("2014/9/10").getTime(), page.chart.options.yaxis.max]],
                color: "red",
                lines: {
                    lineWidth: 1
                }
            });
            chartData.push({
                data: [[page.chart.options.xaxis.min, 800], [page.chart.options.xaxis.max, 800]],
                color: "red",
                lines: {
                    lineWidth: 1
                }
            });

            page.chart.plot = chart.createChart(chartData, page.chart.options);
        };

        /**
        * 複合グラフを作成します。
        */
        page.chart.createMultipleChart = function (data) {

            var chart = page.chart.element.find(".plot"),
                criteria = page.header.element.form().data(),
                chartData = [],
                shukkaConverter = function (item) {
                    item.dt_product = new Date(App.data.getDateTimeString(App.data.parseJsonDate(item.dt_product))).getTime();
                    item.su_shukka = item.su_shukka * -1;
                    return item
                },
                converter = function (item) {
                    item.dt_product = new Date(App.data.getDateTimeString(App.data.parseJsonDate(item.dt_product))).getTime();
                    return item
                };

            chartData.push({
                label: "在庫数",
                data: data ?
                        App.ui.chart.convertToChartData(data, "dt_product", "su_zaiko", converter) :
                        page.detail.data.convertToChartData("dt_product", "su_zaiko", converter)
            });

            chartData.push({
                label: "出荷実績",
                data: data ?
                        App.ui.chart.convertToChartData(data, "dt_product", "su_shukka", shukkaConverter) :
                        page.detail.data.convertToChartData("dt_product", "su_shukka", shukkaConverter),
                dashes: {
                    show: true,
                    dashLength: 5
                }
            });

            chartData.push({
                label: "生産計画",
                data: data ?
                        App.ui.chart.convertToChartData(data, "dt_product", "su_keikaku", converter) :
                        page.detail.data.convertToChartData("dt_product", "su_keikaku", converter),
                bars: {
                    show: true,
                    lineWidth: 1,
                    barWidth: page.chart.values.barWidth,
                    order: 1
                }
            });

            chartData.push({
                label: "生産実績",
                data: data ?
                        App.ui.chart.convertToChartData(data, "dt_product", "su_jisseki", converter) :
                        page.detail.data.convertToChartData("dt_product", "su_jisseki", converter),
                bars: {
                    show: true,
                    lineWidth: 1,
                    barWidth: page.chart.values.barWidth,
                    order: 2
                }
            });

            chartData.push({
                data: [[new Date("2014/9/10").getTime(), page.chart.options.yaxis.min], [new Date("2014/9/10").getTime(), page.chart.options.yaxis.max]],
                color: "red",
                lines: {
                    lineWidth: 1
                }
            });
            chartData.push({
                data: [[page.chart.options.xaxis.min, 800], [page.chart.options.xaxis.max, 800]],
                color: "red",
                lines: {
                    lineWidth: 1
                }
            });


            page.chart.plot = chart.createChart(chartData, page.chart.options);
        };

        /**
        * グラフを更新します。
        */
        page.chart.updateChart = function () {

            page.chart.element.find(".part").part("show");

            //TODO:変更管理オブジェクトが選択されている場合のみ反映を行います
            if (page.chart.chartDataType !== "2") {
                return;
            }

            //TODO: 種別に応じたグラフを作成します
            switch (page.chart.chartType) {
                case "1":
                    page.chart.updateLineChart();
                    break;
                case "2":
                    page.chart.updateBarChart();
                    break;
                default:
                    page.chart.updateMultipleChart();
                    break;
            };

        };

        /**
        * 折れ線グラフを更新します。
        */
        page.chart.updateLineChart = function () {

            var chartData = page.chart.plot.getData(),
                shukkaConverter = function (item) {
                    item.dt_product = new Date(App.data.getDateTimeString(App.data.parseJsonDate(item.dt_product))).getTime();
                    item.su_shukka = item.su_shukka * -1;
                    return item
                },
                converter = function (item) {
                    item.dt_product = new Date(App.data.getDateTimeString(App.data.parseJsonDate(item.dt_product))).getTime();
                    return item
                };

            chartData[0].data = page.detail.data.convertToChartData("dt_product", "su_zaiko", converter);
            chartData[1].data = page.detail.data.convertToChartData("dt_product", "su_shukka", shukkaConverter);

            page.chart.plot.setData(chartData);
            page.chart.plot.draw();

        };

        /**
        * 棒グラフを更新します。
        */
        page.chart.updateBarChart = function () {

            var chartData = page.chart.plot.getData(),
                converter = function (item) {
                    item.dt_product = new Date(App.data.getDateTimeString(App.data.parseJsonDate(item.dt_product))).getTime();
                    return item
                };


            chartData[0].data = page.detail.data.convertToChartData("dt_product", "su_keikaku", converter);
            chartData[1].data = page.detail.data.convertToChartData("dt_product", "su_jisseki", converter);

            page.chart.plot.setData(chartData);
            page.chart.plot.draw();
        };

        /**
        * 複合グラフを更新します。
        */
        page.chart.updateMultipleChart = function () {

            var chartData = page.chart.plot.getData(),
                shukkaConverter = function (item) {
                    item.dt_product = new Date(App.data.getDateTimeString(App.data.parseJsonDate(item.dt_product))).getTime();
                    item.su_shukka = item.su_shukka * -1;
                    return item
                },
                converter = function (item) {
                    item.dt_product = new Date(App.data.getDateTimeString(App.data.parseJsonDate(item.dt_product))).getTime();
                    return item
                };

            chartData[0].data = page.detail.data.convertToChartData("dt_product", "su_zaiko", converter);
            chartData[1].data = page.detail.data.convertToChartData("dt_product", "su_shukka", shukkaConverter);
            chartData[2].data = page.detail.data.convertToChartData("dt_product", "su_keikaku", converter);
            chartData[3].data = page.detail.data.convertToChartData("dt_product", "su_jisseki", converter);

            page.chart.plot.setData(chartData);
            page.chart.plot.draw();
        };

        /**
        * 画面ヘッダーのバリデーションを定義します。
        */
        page.header.options.validations = {
            //TODO: 画面ヘッダーのバリデーションの定義を記述します。
            dt_product_from: {
                rules: {
                    required: true,
                    datestring: true
                },
                options: {
                    name: "期間（開始）",
                },
                messages: {
                    required: App.messages.base.required,
                    datestring: App.messages.base.datestring
                }
            },
            dt_product_to: {
                rules: {
                    required: true,
                    datestring: true
                },
                options: {
                    name: "期間（終了）"
                },
                messages: {
                    required: App.messages.base.required,
                    datestring: App.messages.base.datestring
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

            element.find("input[data-role='date']").datepicker({ dateFormat: "yy/mm/dd" });
        };

        /**
        * 画面ヘッダーの変更時処理を定義します。
        */
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

            page.header.validator.validate().then(function () {

                page.options.skip = 0;
                page.options.filter = page.header.createFilter();

                query = {
                    url: page.urls.product,
                    filter: page.options.filter,
                    orderby: "dt_product",
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
                        page.chart.createChart(result);
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

            filters.push("dt_product ge datetime'" + App.date.format(criteria.dt_product_from, "yyyy-MM-dd") + "'");
            filters.push("dt_product le datetime'" + App.date.format(criteria.dt_product_to, "yyyy-MM-dd") + "'");

            return filters.join(" and ");
        };

        //TODO: 以下の page.header の各宣言は画面仕様ごとにことなるため、
        //不要の場合は削除してください。

        /**
        * 画面明細のバリデーションを定義します。
        */
        page.detail.options.validations = {
            //TODO: 画面明細のバリデーションの定義を記述します。
            su_shukka: {
                rules: {
                    required: true,
                    number: true
                },
                options: {
                    name: "出荷実績",
                },
                messages: {
                    required: App.messages.base.required,
                    number: App.messages.base.number
                }
            },
            su_keikaku: {
                rules: {
                    required: true,
                    number: true
                },
                options: {
                    name: "生産計画",
                },
                messages: {
                    required: App.messages.base.required,
                    number: App.messages.base.number
                }
            },
            su_jisseki: {
                rules: {
                    required: true,
                    number: true
                },
                options: {
                    name: "生産実績",
                },
                messages: {
                    required: App.messages.base.required,
                    number: App.messages.base.number
                }
            },
            su_zaiko: {
                rules: {
                    required: true,
                    number: true
                },
                options: {
                    name: "在庫数",
                },
                messages: {
                    required: App.messages.base.required,
                    number: App.messages.base.number
                }
            }
        };

        /**
        * 画面明細の初期化処理を行います。
        */
        page.detail.initialize = function () {

            var element = $(".detail"),
                table = element.find(".datatable"),
                datatable = table.dataTable({
                    height: 300,
                    resize: true,
                    //fixedColumn: true,
                    //fixedColumns: 1,
                    //innerWidth: 1200,
                    onselect: page.detail.select,
                    onchange: page.detail.change
                });

            //列固定にした場合DOM要素が再作成されるため、変数を再取得
            table = element.find(".datatable");

            page.detail.validator = element.validation(page.createValidator(page.detail.options.validations));
            page.detail.element = element;
            page.detail.dataTable = datatable;

            element.on("click", "#nextsearch", page.detail.nextsearch);
            // 行選択時に利用するテーブルインデックスを指定します
            page.detail.fixedColumnIndex = element.find(".fix-columns").length;

            // 明細パートオープン時の処理を指定します
            element.find(".part").on("expanded.aw.part", function () {
                page.detail.isClose = false;
                if (page.detail.searchData) {
                    App.ui.loading.show();
                    setTimeout(function () {
                        page.detail.bind(page.detail.searchData);
                        page.chart.createChart(page.detail.searchData);
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
                url: page.urls.product,
                filter: page.options.filter,
                orderby: "dt_product",
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
                row.form().bind(item);
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

        };

        /**
        * 画面明細の一覧の行が選択された時の処理を行います。
        */
        page.detail.select = function (e, row) {
            $($(row.element[page.detail.fixedColumnIndex]).closest("table")[0].querySelectorAll(".select-tab.selected")).removeClass("selected").addClass("unselected");
            $(row.element[page.detail.fixedColumnIndex].querySelectorAll(".select-tab")).removeClass("unselected").addClass("selected");

            //選択行全体に背景色を付ける場合は以下のコメントアウトを解除します。
            if (!App.isUndefOrNull(page.detail.selectedRow)) {
                page.detail.selectedRow.element.find("tr").removeClass("selected-row");
            }
            row.element.find("tr").addClass("selected-row");
            page.detail.selectedRow = row;
        };


        /**
        * 画面明細の一覧の入力項目の変更イベントの処理を行います。
        */
        page.detail.change = function (e, row) {
            var target = $(e.target),
                id = row.element.attr("data-key"),
                propertyName = target.attr("data-prop"),
                entity = page.detail.data.entry(id);

            page.detail.validator.validate({
                targets: row.element.find(":input"),
                state: {
                    tbody: row.element,
                    isGridValidation: true
                }
            }).then(function () {
                entity[propertyName] = row.element.form().data()[propertyName];
                page.detail.data.update(entity);

                // チャートデータの更新
                page.chart.updateChart();
            });

        };


        /**
        * 画面明細の一覧のバリデーションを実行します。
        */
        page.detail.validateList = function (suppressMessage) {

            var validations = [];

            //page.detail.dataTable.dataTable("each", function (row) {
            //    validations.push(page.detail.validator.validate({
            //        targets: row.element.find(":input"),
            //        state: {
            //            suppressMessage: suppressMessage,
            //            tbody: row.element,
            //            isGridValidation: true
            //        }
            //    }));
            //});

            return App.async.all(validations);
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
                        <label>期間</label>
                    </div>
                    <div class="control col-xs-2 with-next-col">
                        <input type="tel" data-prop="dt_product_from" data-role="date" value="2014/09/01" />
                    </div>
                    <div class="control col-xs-1 nolabel with-next-col">
                        <span>~</span>
                    </div>
                    <div class="control col-xs-2">
                        <input type="tel" data-prop="dt_product_to" data-role="date" value="2014/09/30" />
                    </div>
                    <div class="control col-xs-5">
                    </div>
                </div>
                <div class="header-command">
                    <button type="button" id="search" class="btn btn-sm btn-primary">検索</button>
                </div>
            </div>
        </div>

        <div class="chart">
            <div title="チャート" class="part">
                <div class="plot-container">
                    <div class="plot"></div>
                </div>
            </div>
            <div class="header-command">
                <select data-prop="chart_Type">
                    <option value="1">折れ線グラフ</option>
                    <option value="2">棒グラフ</option>
                    <option value="3">複合グラフ</option>
                </select>
                <select data-prop="chart_Data">
                    <option value="1">JSONオブジェクト</option>
                    <option value="2">変更管理オブジェクト</option>
                </select>
            </div>
        </div>

        <div class="detail">
            <div title="生産管理一覧" class="part">
                <table class="datatable">
                    <thead>
                        <tr>
                            <th style="width: 10px;" class="dt-fix-column"></th>
                            <th style="width: 150px;">日付</th>
                            <th style="width: 150px;">出荷実績</th>
                            <th style="width: 150px;">生産計画</th>
                            <th style="width: 150px;">生産実績</th>
                            <th>在庫数</th>
                        </tr>
                    </thead>
                    <tbody class="item-tmpl" style="cursor: default; display: none;">
                        <tr>
                            <td>
                                <span class="select-tab unselected"></span>
                            </td>
                            <td>
                                <span data-prop="dt_product" class="data-app-format product-input" data-role="date" data-app-format="date" />
                            </td>
                            <td>
                                <input type="tel" data-prop="su_shukka" class="number-right" />
                            </td>
                            <td>
                                <input type="tel" data-prop="su_keikaku" class="number-right" />
                            </td>
                            <td>
                                <input type="tel" data-prop="su_jisseki" class="number-right" />
                            </td>
                            <td>
                                <input type="tel" data-prop="su_zaiko" class="number-right" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="detail-command">
                    <button type="button" id="nextsearch" class="btn btn-sm btn-primary btn-next-search" style="display: none">次を検索</button>
                </div>
                <div class="part-command">
                    <div class="data-count">
                        <span data-prop="data_count"></span>
                        <span>/</span>
                        <span data-prop="data_count_total"></span>
                    </div>
                </div>
            </div>
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
