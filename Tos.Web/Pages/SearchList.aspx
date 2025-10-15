<%@ Page Language="C#" Title="999_検索（編集なし） テーブル（単一行）" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="SearchList.aspx.cs" Inherits="Tos.Web.Pages.SearchList" %>

<%@ MasterType VirtualPath="~/Site.Master" %>

<asp:Content ID="IncludeContent" ContentPlaceHolderID="IncludeContent" runat="server">

    <link media="all" rel="stylesheet" href="<%=ResolveUrl("~/Content/part.css") %>" type="text/css" />
    <link media="all" rel="stylesheet" href="<%=ResolveUrl("~/Content/headerdetail.css") %>" type="text/css" />

    <% #if DEBUG %>
    <script src="<%=ResolveUrl("~/Scripts/datatable.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/part.js") %>" type="text/javascript"></script>
    <% #else %>
    <script src="<%=ResolveUrl("~/Scripts/datatable.min.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/part.min.js") %>" type="text/javascript"></script>
    <% #endif %>
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
        var page = App.define("SearchList", {
            //TODO: ページのレイアウト構造に対応するオブジェクト定義を記述します。
            options: {
                skip: 0,                                // TODO:先頭からスキップするデータ数を指定します。
                top: App.settings.base.dataTakeCount,   // TODO:取得するデータ数を指定します。
                filter: ""
            },
            values: {
                transferDetail: "HeaderDetailScrollable.aspx?no_mitsumori={0}",
                transferPages: {}
            },
            urls: {
                mitsumori: "../api/SampleMitsumori",
                ajaxCsvdownload: "../api/MitsumoriCSVAjax",
                ajaxExceldownload: "../api/MitsumoriExcelAjax",
                csvdownload: "../api/MitsumoriCSV",
                exceldownload: "../api/MitsumoriExcel",
                searchDialog: "Dialogs/SearchDialog.aspx",
                uploadDialog: "Dialogs/UploadDialog.aspx",
                ajaxUploadDialog: "Dialogs/AjaxUploadDialog.aspx",
            },
            header: {
                options: {},
                values: {},
                urls: {
                    shiharaiJoken: "../Services/SampleService.svc/ShiharaiJoken"
                }
            },
            detail: {
                options: {},
                values: {}
            },
            dialogs: {
                columnsModal: {
                }
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
            page.dialogs.columnsModal.initialize();

            page.loadMasterData().then(function (result) {
                //TODO: 画面の初期化処理成功時の処理を記述します。
                return page.loadDialogs();
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
            //TODO: タブ間の通信を初期化します。
            page.options.tabComm = App.ui.tabComm.getOrCreate();
        };

        /**
         * コントロールへのイベントの紐づけを行います。
         */
        page.initializeControlEvent = function () {

            //TODO: 画面全体で利用するコントロールのイベントの紐づけ処理をここに記述します。
            $("#csv-download").on("click", page.commands.csvdownload);
            $("#excel-download").on("click", page.commands.exceldownload);
            $("#csv-upload").on("click", page.commands.csvupload);

            $("#csv-ajax-download").on("click", page.commands.ajaxCsvdownload);
            $("#excel-ajax-download").on("click", page.commands.ajaxExceldownload);
            $("#csv-ajax-upload").on("click", page.commands.ajaxCsvupload);

            //TODO: タブ間通信で子画面から発行されるイベントの紐づけ処理を記述します。
            page.options.tabComm.on("updateDetailData", page.detail.updateData);
            page.options.tabComm.on("removeDetailData", page.detail.removeData);
        };

        /**
         * CSV出力を行います。(file形式)
         */
        page.commands.csvdownload = function () {
            var query;

            page.header.validator.validate().then(function () {

                page.options.filter = page.header.createFilter();
                query = {
                    url: page.urls.csvdownload,
                    filter: page.options.filter,
                    orderby: "no_mitsumori"
                };

                // ローディング表示
                App.ui.loading.show();
                App.ui.page.notifyAlert.clear();

                // CSV出力（実体ファイルにアクセス）
                return $.ajax(App.ajax.webapi.get(App.data.toODataFormat(query))
                ).then(function (result) {
                    if (result == "") {
                        App.ui.page.notifyAlert.message(App.messages.base.MS0005).show();
                    }
                    else {
                        $(window).off("beforeunload");
                        window.open(decodeURIComponent(result), '_parent');
                    }

                }).fail(function (error) {
                    App.ui.page.notifyAlert.message(App.ajax.handleError(error).message).show();

                }).always(function () {
                    App.ui.loading.close();
                });
            });
        };

        /**
         * Excel出力を行います。(file形式)
         */
        page.commands.exceldownload = function () {
            var query;

            page.header.validator.validate().then(function () {

                page.options.filter = page.header.createFilter();
                query = {
                    url: page.urls.exceldownload,
                    filter: page.options.filter,
                    orderby: "no_mitsumori"
                };

                // ローディング表示
                App.ui.loading.show();
                App.ui.page.notifyAlert.clear();

                // Excel出力（実体ファイルにアクセスする場合）
                return $.ajax(App.ajax.webapi.get(App.data.toODataFormat(query))
                ).then(function (result) {
                    if (result == "") {
                        App.ui.page.notifyAlert.message(App.messages.base.MS0016).show();
                    }
                    else {
                        $(window).off("beforeunload");
                        window.open(decodeURIComponent(result), '_parent');
                    }

                }).fail(function (error) {
                    App.ui.page.notifyAlert.message(App.ajax.handleError(error).message).show();

                }).always(function () {
                    App.ui.loading.close();
                });
            });
        };

        /**
        * CSV出力を行います。(Stream形式))
        */
        page.commands.ajaxCsvdownload = function () {
            var query;

            page.header.validator.validate().then(function () {

                //page.options.filter = page.header.createFilter();
                //query = {
                //    url: page.urls.ajaxCsvdownload,
                //    filter: page.options.filter,
                //    orderby: "no_mitsumori"
                //};

                query = page.header.element.form().data();
//                query.url = page.urls.ajaxCsvdownload + "/GetCSV";  //POST
                query.url = page.urls.ajaxCsvdownload;  //GET
                // ローディング表示
                App.ui.loading.show();
                App.ui.page.notifyAlert.clear();

                // CSV出力（Ajax通信でファイルstreamを返却）
//                return $.ajax(App.ajax.file.download(App.data.toODataFormat(query))  //GET ODataQuery
               return $.ajax(App.ajax.file.download(App.data.toWebAPIFormat(query))  //GET dataなし
//                return $.ajax(App.ajax.file.download(App.data.toWebAPIFormat(query), null, "POST") //POST dataなし
//                return $.ajax(App.ajax.file.download(page.urls.ajaxCsvdownload, query)  //GET dataあり
//                return $.ajax(App.ajax.file.download(page.urls.ajaxCsvdownload + "/GetCSV", query, "POST") //POST dataあり
                ).then(function (response, status, xhr) {
                    if (status !== "success") {
                        App.ui.page.notifyAlert.message(App.messages.base.MS0005).show();
                    } else {
                        App.file.save(response, App.ajax.file.extractFileNameDownload(xhr) || "CSVFile.csv");
                    }
                }).fail(function (error) {
                    App.ui.page.notifyAlert.message(App.ajax.handleError(error).message).show();

                }).always(function () {
                    App.ui.loading.close();
                });
            });
        };

        /**
         * Excel出力を行います。(Stream形式)
         */
        page.commands.ajaxExceldownload = function () {
            var query;

            page.header.validator.validate().then(function () {

                page.options.filter = page.header.createFilter();
                query = {
                    url: page.urls.ajaxExceldownload,
                    filter: page.options.filter,
                    orderby: "no_mitsumori"
                };

                // ローディング表示
                App.ui.loading.show();
                App.ui.page.notifyAlert.clear();

                // Excel出力（Ajax通信でファイルstreamを返却）
                return $.ajax(App.ajax.file.download(App.data.toODataFormat(query))
                ).then(function (response, status, xhr) {
                    if (status !== "success") {
                        App.ui.page.notifyAlert.message(App.messages.base.MS0016).show();
                    } else {
                        App.file.save(response, App.ajax.file.extractFileNameDownload(xhr) || "ExcelFile.xlsx");
                    }

                }).fail(function (error) {
                    App.ui.page.notifyAlert.message(App.ajax.handleError(error).message).show();

                }).always(function () {
                    App.ui.loading.close();
                });
            });
        };

        /**
         * csvアップロードダイアログを起動します(file形式)
         */
        page.commands.csvupload = function () {

            page.dialogs.uploadDialog.element.modal("show");
        };

        /**
         * csvアップロードダイアログを起動します(Stream形式)
         */
        page.commands.ajaxCsvupload = function () {

            page.dialogs.ajaxUploadDialog.element.modal("show");
        };

        /**
         * マスターデータのロード処理を実行します。
         */
        page.loadMasterData = function () {

            //TODO: 画面内のドロップダウンなどで利用されるマスターデータを取得し、画面にバインドする処理を記述します。
            return $.ajax(App.ajax.odata.get(page.header.urls.shiharaiJoken)).then(function (result) {
                var cd_shiharai = page.header.element.findP("cd_shiharai");
                cd_shiharai.children().remove();
                App.ui.appendOptions(
                    cd_shiharai,
                    "cd_shiharai",
                    "nm_joken_shiharai",
                    result.value,
                    true,
                    null,
                    true
                );
            });
        };

        /**
         * 共有のダイアログのロード処理を実行します。
         */
        page.loadDialogs = function () {

            return App.async.all({

                searchDialog: $.get(page.urls.searchDialog),
                uploadDialog: $.get(page.urls.uploadDialog),
                ajaxUploadDialog: $.get(page.urls.ajaxUploadDialog)

            }).then(function (result) {

                $("#dialog-container").append(result.successes.searchDialog);
                page.dialogs.searchDialog = SearchDialog;
                page.dialogs.searchDialog.initialize();

                //検索ダイアログで選択が実行された時に呼び出される関数を設定しています。
                page.dialogs.searchDialog.dataSelected = page.header.setTorihiki;

                $("#dialog-container").append(result.successes.uploadDialog);
                page.dialogs.uploadDialog = UploadDialog;
                page.dialogs.uploadDialog.initialize();

                $("#dialog-container").append(result.successes.ajaxUploadDialog);
                page.dialogs.ajaxUploadDialog = AjaxUploadDialog;
                page.dialogs.ajaxUploadDialog.initialize();
            });

        }

        /**
         * 画面ヘッダーのバリデーションを定義します。
         */
        page.header.options.validations = {
            //TODO: 画面ヘッダーのバリデーションの定義を記述します。
            cd_torihiki: {
                rules: {
                    digits: true,
                    equallength: 6
                },
                options: {
                    name: "取引先コード",
                },
                messages: {
                    digits: App.messages.base.digits,
                    equallength: App.messages.base.equallength
                }
            },
            nm_hinmei: {
                rules: {
                    maxlength: 200
                },
                options: {
                    name: "品名"
                },
                messages: {
                    maxlength: App.messages.base.maxlength
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
            element.on("click", ".torihiki-select", page.header.showSearchDialog);

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
                    url: page.urls.mitsumori,
                    filter: page.options.filter,
                    orderby: "no_mitsumori",
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

            if (!App.isUndefOrNull(criteria.cd_shiharai)) {
                filters.push("cd_shiharai eq " + criteria.cd_shiharai);
            }
            if (!App.isUndefOrNullOrStrEmpty(criteria.cd_torihiki)) {
                    filters.push("cd_torihiki eq " + criteria.cd_torihiki);
            }
            if (!App.isUndefOrNullOrStrEmpty(criteria.nm_hinmei)) {
                    filters.push("substringof('" + encodeURIComponent(criteria.nm_hinmei) + "', nm_hinmei) eq true");
            }

            return filters.join(" and ");
        };

        //TODO: 以下の page.header の各宣言は画面仕様ごとにことなるため、
        //不要の場合は削除してください。

        /**
        * 画面ヘッダーにある取引先ダイアログ起動時の処理を定義します。
        */
        page.header.showSearchDialog = function () {

            page.dialogs.searchDialog.element.modal("show");
        };

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
                    height: 200,
                    resize: true,
                    sortable: true,
                    //fixedColumn: true,
                    //fixedColumns: 1,
                    //innerWidth: 1200,
                    onselect: page.detail.select
                });
            table = element.find(".datatable");         //列固定にした場合DOM要素が再作成されるため、変数を再取得

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
            element.on("click", ".transfer", page.detail.transfer);
            //element.on("click", ".datatable tbody", page.detail.transfer);
        };

        /**
         * 次のレコードを検索する処理を定義します。
         */
        page.detail.nextsearch = function () {

            var query = {
                url: page.urls.mitsumori,
                filter: page.options.filter,
                orderby: "no_mitsumori",
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
            }
        };

        /**
         * 画面明細で行がクリックされた場合の処理を記述します。
         */
        page.detail.transfer = function (e) {
            var elem = $(e.target).closest("tbody"),
                tbody, id, data, url, winObj;

            page.detail.dataTable.dataTable("getRow", elem, function (row) {
                tbody = row.element;
            });

            e.preventDefault();
            id = tbody.attr("data-key");
            if (App.isUndef(id)) {
                return;
            }

            data = page.detail.data.entry(id);
            url = App.str.format(page.values.transferDetail, data.no_mitsumori);

            winObj = App.ui.transfer(url, { wins: page.values.transferPages });
            page.values.transferPages[winObj.name] = winObj.win;
        };

        /**
         * 子画面でデータが更新されたときのイベント処理(タブ間通信利用)
         */
        page.detail.updateData = function (e) {

            // 更新されたデータのキーを取得します。
            var updatedKey = e.data.Header.no_mitsumori;
            // キーをもとに最新のデータを取得します。
            $.ajax(App.ajax.webapi.get(page.urls.mitsumori, "$filter=no_mitsumori eq " + updatedKey))
                .then(function (result) {
                    var newData = result.Items[0];
                    if (!newData) {
                        return;
                    }

                    page.detail.dataTable.dataTable("each", function (row, index) {
                        var entity = page.detail.data.entry(row.element.attr("data-key"));
                        if (entity.no_mitsumori == updatedKey) {
                            //対象データの各値を最新の値で更新します。
                            Object.keys(newData).forEach(function (key) {
                                if (key in entity) {
                                    entity[key] = newData[key];
                                }
                            });
                            //行にデータを再バインドします。
                            row.element.find("[data-prop]").val("").text("");
                            row.element.form(page.detail.options.bindOption).bind(entity);
                            return true;
                        }
                    })
                });
        };

        /**
         * 子画面でデータが削除されたときのイベント処理(タブ間通信利用)
         */
        page.detail.removeData = function (e) {

            // 削除されたデータのキーを取得します。
            var removedKey = e.data.no_mitsumori;
            // キーをもとに削除行を特定します。
            var deletedRow;
            page.detail.dataTable.dataTable("each", function (row, index) {
                var entity = page.detail.data.entry(row.element.attr("data-key"));
                if (entity.no_mitsumori == removedKey) {
                    deletedRow = row.element;
                    return true;
                }
            });

            page.detail.dataTable.dataTable("deleteRow", deletedRow, function (row) {
                var id = row.attr("data-key"),
                    newSelected;

                if (!App.isUndefOrNull(id)) {
                    var entity = page.detail.data.entry(id);
                    page.detail.data.remove(entity);
                }

                newSelected = row.next().not(".item-tmpl");
                if (!newSelected.length) {
                    newSelected = row.prev().not(".item-tmpl");
                }
                if (newSelected.length) {
                    $($(newSelected[page.detail.fixedColumnIndex]).closest("table")[0].querySelectorAll(".select-tab.selected")).removeClass("selected").addClass("unselected");
                    $(newSelected[page.detail.fixedColumnIndex].querySelectorAll(".select-tab")).removeClass("unselected").addClass("selected");

                    //選択行全体に背景色を付ける場合は以下のコメントアウトを解除します。
                    //if (!App.isUndefOrNull(page.detail.selectedRow)) {
                    //    page.detail.selectedRow.element.find("tr").removeClass("selected-row");
                    //}
                    //newSelected.find("tr").addClass("selected-row");
                    //page.detail.dataTable.dataTable("getRow", newSelected, function (row) {
                    //    page.detail.selectedRow = row;
                    //});
                }
            });

            page.detail.element.findP("data_count").text(parseFloat(page.detail.element.findP("data_count").text()) - 1);
            page.detail.element.findP("data_count_total").text(parseFloat(page.detail.element.findP("data_count_total").text()) - 1);
        };

        /**
         * 列表示非表示ダイアログの初期化処理を行います。
         */
        page.dialogs.columnsModal.initialize = function () {
            var element = $("#columns-dialog");

            element.on("shown.bs.modal", page.dialogs.columnsModal.shown);
            element.on("hidden.bs.modal", page.dialogs.columnsModal.hidden);
            element.on("click", ".select", page.dialogs.columnsModal.select);
            element.on("click", ".search-list tbody", page.dialogs.columnsModal.selectOne);

            page.dialogs.columnsModal.element = element;
        };

        /**
         * 列表示非表示ダイアログ非表示時処理を実行します。
         */
        page.dialogs.columnsModal.hidden = function (e) {

            //TODO:ダイアログ非表示時に、項目をクリアする処理をここに記述します。

            var element = page.dialogs.columnsModal.element,
                table = element.find(".search-list");

            table.find("tbody").not(".item-tmpl").remove();

        };

        /**
         * 列表示非表示ダイアログ表示時処理を実行します。
         */
        page.dialogs.columnsModal.shown = function (e) {

            //TODO:ダイアログ表示時に、項目をクリアする処理をここに記述します。

            var element = page.dialogs.columnsModal.element,
                table = element.find(".search-list");

            page.detail.dataTable.dataTable("columns", function (columns) {

                page.dialogs.columnsModal.bind(columns);
            });

        };

        /**
         * 列表示非表示ダイアログの一覧にデータをバインドします。
         */
        page.dialogs.columnsModal.bind = function (data) {
            var element = page.dialogs.columnsModal.element,
                table = element.find(".search-list"),
                count = data["odata.count"],
                items = data.value ? data.value : data,
                i, l, item, clone;

            table.find("tbody:visible").remove();

            page.dialogs.columnsModal.data = App.ui.page.dataSet();
            page.dialogs.columnsModal.data.attach(items);

            for (i = 0, l = items.length; i < l; i++) {
                item = items[i];
                clone = table.find(".item-tmpl").clone();
                clone.form().bind(item);
                clone.appendTo(table).removeClass("item-tmpl").show();
            }
        };

        /**
         * 一覧から行を選択された際の処理を実行します。
         */
        page.dialogs.columnsModal.select = function (e) {
            var element = page.dialogs.columnsModal.element,
                data;

            element.find(".search-list").find("tbody:not(.item-tmpl)").each(function (index, item) {
                var tbody = $(item);
                var id = tbody.attr("data-key");
                var data = page.dialogs.columnsModal.data.entry(id);

                var check = tbody.find("[data-prop='visible']");
                if (check.is(":checked")) {
                    page.detail.dataTable.dataTable("showColumn", data.index);

                } else {
                    page.detail.dataTable.dataTable("hideColumn", data.index);
                }
            });

            element.modal("hide");
        };

        page.dialogs.columnsModal.selectOne = function (e) {

            var target = $(e.target),
                tbody = target.closest("tbody");

            if (target.is("[data-prop='visible']")) {
                return;
            }

            var check = tbody.find("[data-prop='visible']");
            if (check.is(":checked")) {
                check.prop("checked", false);
            } else {
                check.prop("checked", true);
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
                        <label>取引先コード</label>
                    </div>
                    <div class="control col-xs-1 with-next-col">
                        <input type="tel" data-prop="cd_torihiki" class="number-right" />
                    </div>
                    <div class="control col-xs-3 with-next-col">
                        <label data-prop="nm_torihiki" style="white-space: nowrap;"></label>
                    </div>
                    <div class="control col-xs-1">
                        <button type="button" class="torihiki-select btn btn-info btn-xs">選択</button>
                    </div>
                    <div class="control-label col-xs-2">
                        <label>代金支払条件</label>
                    </div>
                    <div class="control col-xs-3">
                        <select data-prop="cd_shiharai" class="number">
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="control-label col-xs-2">
                        <label>品名</label>
                    </div>
                    <div class="control col-xs-10">
                        <input type="text" class="ime-active" data-prop="nm_hinmei" />
                    </div>
                </div>
                <div class="header-command">
                    <button type="button" id="search" class="btn btn-sm btn-primary">検索</button>
                </div>
            </div>
        </div>

        <div class="detail">
            <!--<div title="見積一覧" class="part">-->
            <div class="control-label toolbar">
                <i class="icon-th"></i>
                <div class="btn-group">
                    <a data-toggle="modal" href="#columns-dialog" class="btn btn-info btn-xs">列選択</a>
                </div>
                <span class="data-count">
                    <span data-prop="data_count"></span>
                    <span>/</span>
                    <span data-prop="data_count_total"></span>
                </span>
            </div>
            <table class="datatable">
                <thead>
                    <tr>
                        <th style="width: 10px;" class="dt-fix-column"></th>
                        <th style="width: 80px;" class="dt-fix-column">詳細</th>
                        <th style="width: 80px;" data-prop="no_mitsumori" class="number">見積番号</th>
                        <th style="width: 70px;" data-prop="cd_torihiki">取引先</th>
                        <th style="width: 10%;" data-prop="cd_shiharai">代金支払条件</th>
                        <th style="width: 30%;" data-prop="nm_hinmei">品名</th>
                        <th data-prop="nm_biko">備考</th>
                    </tr>
                </thead>
                <tbody class="item-tmpl" style="cursor: pointer; display: none;">
                    <tr>
                        <td>
                            <span class="select-tab unselected"></span>
                        </td>
                        <td>
                            <a href="#" target="_blank" class="transfer btn btn-info btn-xs">詳細画面</a>
                        </td>
                        <td>
                            <span data-prop="no_mitsumori" class="number-right number"></span>
                        </td>

                        <td>
                            <span data-prop="cd_torihiki"></span>
                        </td>
                        <td>
                            <span data-prop="cd_shiharai"></span>
                        </td>
                        <td>
                            <span data-prop="nm_hinmei"></span>
                        </td>
                        <td>
                            <span data-prop="biko"></span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="detail-command">
                <button type="button" id="nextsearch" class="btn btn-sm btn-primary btn-next-search" style="display: none">次を検索</button>
            </div>
            <div class="part-command">
            </div>
            <!--</div>-->
        </div>
        <div class="downloadfile"></div>
    </div>

</asp:Content>

<asp:Content ID="FooterContent" ContentPlaceHolderID="FooterContent" runat="server">
    <div class="command-left">
    </div>

    <div class="command">
        <button type="button" id="csv-ajax-upload" class="btn btn-sm btn-default">Ajax CSVアップロード</button>
        <button type="button" id="csv-ajax-download" class="btn btn-sm btn-default">Ajax CSVダウンロード</button>
        <button type="button" id="excel-ajax-download" class="btn btn-sm btn-default">Ajax Excelダウンロード</button>
        <button type="button" id="csv-upload" class="btn btn-sm btn-default">CSVアップロード</button>
        <button type="button" id="csv-download" class="btn btn-sm btn-default">CSVダウンロード</button>
        <button type="button" id="excel-download" class="btn btn-sm btn-default">Excelダウンロード</button>
    </div>

</asp:Content>

<asp:Content ID="DialogsContent" ContentPlaceHolderID="DialogsContent" runat="server">
    <div id="dialog-container"></div>

    <div class="modal fade wide" id="columns-dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">列の表示/非表示</h4>
                </div>

                <div class="modal-body">
                    <div style="height: 280px; overflow: scroll; overflow-x: hidden;">
                        <table class="table table-striped table-condensed search-list">
                            <thead>
                                <tr>
                                    <th style="width: 40px;"></th>
                                    <th>列名</th>
                                </tr>
                            </thead>
                            <tbody class="item-tmpl" style="display: none;">
                                <tr>
                                    <td>
                                        <input type="checkbox" data-prop="visible" value="true"/>
                                    </td>
                                    <td>
                                        <span data-prop="title"></span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-success select" name="select">選択</button>
                    <button type="button" class="cancel-button btn btn-sm btn-default" data-dismiss="modal" name="close">閉じる</button>
                </div>
            </div>
        </div>
    </div>

</asp:Content>

