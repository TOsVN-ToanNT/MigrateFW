<%@ Page Title="999_検索＋明細直接編集（列可変）" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="SearchInputFlexMultiColumn.aspx.cs" Inherits="Tos.Web.Pages.SearchInputFlexMultiColumn" %>
<%@ MasterType VirtualPath="~/Site.Master" %>

<asp:Content ID="IncludeContent" ContentPlaceHolderID="IncludeContent" runat="server">

    <link media="all" rel="stylesheet" href="<%=ResolveUrl("~/Content/part.css") %>" type="text/css" />
    <link media="all" rel="stylesheet" href="<%=ResolveUrl("~/Content/headerdetail.css") %>" type="text/css" />

    <% #if DEBUG %>
    <script src="<%=ResolveUrl("~/Scripts/datatable.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/part.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/flexmulticolumns.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/entertotab.js") %>" type="text/javascript"></script>
    <% #else %>
    <script src="<%=ResolveUrl("~/Scripts/datatable.min.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/part.min.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/flexmulticolumns.min.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/entertotab.min.js") %>" type="text/javascript"></script>
    <% #endif %>

</asp:Content>

<asp:Content ID="HeadContent" ContentPlaceHolderID="HeadContent" runat="server">

    <style type="text/css">

        table.datatable th.selected {
            font-weight: bold;
        }

    </style>

    <script type="text/javascript">

        /**
         * ページのレイアウト構造に対応するオブジェクトを定義します。
         */
        var page = App.define("SearchInputFlexMultiColumn", {
            //TODO: ページのレイアウト構造に対応するオブジェクト定義を記述します。
            options: {
                filter: ""
            },
            values: {
                isChangeRunning: {}
            },
            urls: {
                flexColumn: "../api/FlexColumn",
                addNewDialog: "Dialogs/BuhinDialog.aspx"
            },
            header: {
                options: {},
                values: {},
                urls: {}
            },
            detail: {
                options: {},
                values: {},
            },
            dialogs: {
            },
            commands: {}
        });

        /**
         * 単項目要素をエラーのスタイルに設定します。
         * @param target 設定する要素
         * @param isGrid 設定する要素がグリッドかどうか
         */
        page.setColInvalidStyle = function (target, isGrid) {
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

            if (isGrid) {
                $target = $(target).closest("td");
                $target.addClass("has-error");
            } else {
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
            }
        };

        /**
         * 単項目要素をエラー無しのスタイルに設定します。
         * @param target 設定する要素
         * @param isGrid 設定する要素がグリッドかどうか
         */
        page.setColValidStyle = function (target, isGrid) {
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

            if (isGrid) {
                $target = $(target).closest("td");
                $target.removeClass("has-error");
            } else {
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
            }
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
                    //列可変はグリッドでもセル単位で色付けを行う
                    page.setColValidStyle(item.element, state.isGridValidation);
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
                    //列可変はグリッドでもセル単位で色付けを行う
                    page.setColInvalidStyle(item.element, state.isGridValidation);
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
         * データの保存処理を実行します。
         */
        page.commands.save = function () {

            App.ui.page.notifyWarn.clear();
            App.ui.page.notifyAlert.clear();
            App.ui.page.notifyInfo.clear();

            App.ui.loading.show();

            var sleep = 0;
            var condition = "Object.keys(page.values.isChangeRunning).length == 0";
            App.ui.wait(sleep, condition, 100)
            .then(function () {
                page.validateAll().then(function () {

                    var changeSets = page.detail.data.getChangeSet();
                    //TODO: データの保存処理をここに記述します。
                    return $.ajax(App.ajax.webapi.post(page.urls.flexColumn, changeSets))
                        .then(function (result) {

                            //最後に再度データを取得しなおします。
                            return App.async.all([page.header.search(false)]);
                        }).then(function () {
                            App.ui.page.notifyInfo.message(App.messages.base.MS0002).show();
                        }).fail(function (error) {

                            if (error.status === App.settings.base.conflictStatus) {
                                // TODO: 同時実行エラー時の処理を行っています。
                                // 既定では、メッセージを表示し、現在の入力情報を切り捨ててサーバーの最新情報を取得しています。
                                page.header.search(false)
                                App.ui.page.notifyAlert.clear();
                                App.ui.page.notifyAlert.message(App.messages.base.MS0009).show();
                                return;
                            }

                            //TODO: データの保存失敗時の処理をここに記述します。
                            if (error.status === App.settings.base.validationErrorStatus) {
                                var errors = error.responseJSON;
                                $.each(errors, function (index, err) {
                                    App.ui.page.notifyAlert.message(
                                        err.Message +
                                        (App.isUndefOrNull(err.InvalidationName) ? "" : err.Data[err.InvalidationName])
                                    ).show();
                                });
                                return;
                            }
                            //TODO: データの保存失敗時の処理をここに記述します。
                            App.ui.page.notifyAlert.message(App.ajax.handleError(error).message).show();

                        });
                });
            }).fail(function () {
                App.ui.page.notifyAlert.message(App.messages.base.MS0006).show();
            }).always(function () {
                setTimeout(function () {
                    page.header.element.find("search").focus();
                }, 100);
                App.ui.loading.close();
            });
        };

        /**
         * すべてのバリデーションを実行します。
         */
        page.validateAll = function () {

            var validations = [];

            validations.push(page.detail.validateList());

            //TODO: 画面内で定義されているバリデーションを実行する処理を記述します。
            return App.async.all(validations);
        };

        /**
         * Windows閉じる際のイベントを定義します。
         * @return 文字列を返却した場合に確認メッセージが表示されます。
         */
        App.ui.page.onclose = function () {

            var detail,
                closeMessage = App.messages.base.exit;

            if (page.detail.data) {
                detail = page.detail.data.getChangeSet();
                if (detail.created.length || detail.updated.length || detail.deleted.length) {
                    return closeMessage;
                }
            }
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
                page.loadDialogs();
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
            // エンターキー移動
            $("div.wrap, div.footer").enterToTab();

        };

        /**
         * コントロールへのイベントの紐づけを行います。
         */
        page.initializeControlEvent = function () {

            //TODO: 画面全体で利用するコントロールのイベントの紐づけ処理をここに記述します。
            $("#save").on("click", page.commands.save);

        };

        /**
         * マスターデータのロード処理を実行します。
         */
        page.loadMasterData = function () {

            //TODO: 画面内のドロップダウンなどで利用されるマスターデータを取得し、画面にバインドする処理を記述します。
            //return $.ajax(App.ajax.odata.get(/* マスターデータ取得サービスの URL */)).then(function (result) {

                //var cd_shiharai = page.header.element.findP("cd_shiharai");
                //cd_shiharai.children().remove();
                //App.ui.appendOptions(
                //    cd_shiharai,
                //    "cd_shiharai",
                //    "nm_joken_shiharai",
                //    result.value,
                //    true
                //);
            //});

            return App.async.success();

        };

        /**
         * 外だしダイアログのロード処理を実行します。
         */
        page.loadDialogs = function () {
            return $.get(page.urls.addNewDialog).then(function (result) {
                $("#dialog-container").append(result);
                page.dialogs.addNewDialog = BuhinDialog;
                page.dialogs.addNewDialog.initialize();
            });

        };


        /**
         * 画面ヘッダーのバリデーションを定義します。
         */
        page.header.options.validations = {
            //TODO: 画面ヘッダーのバリデーションの定義を記述します。
            dt_nohin: {
                rules: {
                    required: true,
                    datestring: true
                },
                options: {
                    name: "納品日"
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

            element.find("input[data-role='date']").datepicker({ dateFormat: "yy/mm/dd" });
            element.findP("dt_nohin").datepicker("setDate", "2015/10/26");
        };

        page.header.change = function () {
        };

        /**
         * 検索処理を定義します。
         */
        page.header.search = function () {

            page.header.validator.validate().done(function () {

                page.options.filter = page.header.createFilter();

                //TODO: データ取得サービスの URLとオプションを記述します。
                query = {
                    url: page.urls.flexColumn,
                    filter: page.options.filter,
                    orderby: "cd_buhin, cd_torihiki",       //行のキー項目、列のキー項目の並びとする
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
                        page.detail.bind(result);
                    }
                    $("#add-item, #del-item").prop("disabled", false);

                }).fail(function (error) {
                    App.ui.page.notifyAlert.message(App.ajax.handleError(error).message).show();

                }).always(function () {
                    App.ui.loading.close();
                    if (!$("#save").is(":disabled")) {
                        $("#save").prop("disabled", true);
                    }
                });

            });
        };

        /**
         * 検索条件のフィルターを定義します。
         */
        page.header.createFilter = function () {
            var criteria = page.header.element.form().data(),
                filters = [];

            /* TODO: 検索条件のフィルターを定義してください。*/
            filters.push("dt_nohin eq DateTimeOffset'" + App.date.format(criteria.dt_nohin, "yyyy-MM-dd") + "'");
            page.values.dt_nohin = criteria.dt_nohin;

            return filters.join(" and ");
        };

        //TODO: 以下の page.header の各宣言は画面仕様ごとにことなるため、
        //不要の場合は削除してください。

        /**
         * 画面明細のバリデーションを定義します。
         */
        page.detail.options.validations = {
            //TODO: 画面明細のバリデーションの定義を記述します。
            su_yotei: {
                rules: {
                    integer: true
                },
                options: {
                    name: "予定数量"
                },
                messages: {
                    integer: App.messages.base.integer
                }
            },
            su_hiritsu_yotei: {
                rules: {
                    integer: true
                },
                options: {
                    name: "予定比率"
                },
                messages: {
                    integer: App.messages.base.integer
                }
            },
            su_jisseki: {
                rules: {
                    integer: true
                },
                options: {
                    name: "実績数量"
                },
                messages: {
                    integer: App.messages.base.integer
                }
            },
            su_hiritsu_jisseki: {
                rules: {
                    integer: true
                },
                options: {
                    name: "実績比率"
                },
                messages: {
                    integer: App.messages.base.integer
                }
            }
        };

        /**
         * 画面明細の初期化処理を行います。
         */
        page.detail.initialize = function () {

            var element = $(".detail"),
                table = element.find(".datatable");

            page.detail.validator = element.validation(page.createValidator(page.detail.options.validations));

            page.detail.element = element;

            element.on("click", "#add-item", page.detail.addNewItem);
            element.on("click", "#del-item", page.detail.deleteItem);

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
         * 画面明細の各行にデータを設定する際のオプションを定義します。
         */
        page.detail.options.bindOption = {
            appliers: {
                dt_nohin: function (value, element) {
                    element.text(App.date.format(App.data.parseJsonDate(value), "M/d(ddd)", App.settings.base.dateDefinitions));
                    return true;
                },
            }
        };

        /**
         * 画面明細へのデータバインド処理を行います。
         */
        page.detail.bind = function (data, isNewData) {
            var rowKey, colKey, cells, dataHeader, dataSet,
                flexList = [], flexData, flexItem, flexcolumn;

            dataHeader = (data.Header) ? data.Header : data;
            data = (data.Detail) ? data.Detail : data;

            dataSet = App.ui.page.dataSet();
            page.detail.data = dataSet;

            var $flexcolumn = $("#flexcolumn");
            $flexcolumn.empty();
            page.detail.element.find("table.datatable").clone().appendTo($flexcolumn).show();
            var table = $flexcolumn.find("table.datatable");

            // TODO: カレンダー、および DataTable の作成を実行します。
            table.multiColumnFlex({
                header: dataHeader,               // header: 可変部ヘッダを作成するためのデータ
                colWidth: 150,                    // colWidth: 繰り返すカラムの幅
                headerName: "nm_torihiki",        // headerName: 可変カラムに表示する項目名
                subKey: "cd_torihiki",            // subKey: 可変カラムを横に伸ばすためのキー項目名
                colSpan: 2,                       // colSpan: 可変カラムを横に結合する数
                headerLowerControls: ["<th colspan=2 data-prop='no_tel'></th>","<th>数量</th><th>比率</th>"],   // headerLowerControls: 可変カラムヘッダ部２段目以下のレイアウト。多段にできるので配列で指定する
                // controls: 可変カラム明細部のレイアウト。多段にできるので配列で指定する
                controls: ["<td><input type='tel' data-prop='su_yotei' class='number-right comma-number'/></td><td><input type='tel' data-prop='su_hiritsu_yotei' class='number-right comma-number'/></td>",
                "<td><input type='tel' data-prop='su_jisseki' class='number-right comma-number'/></td><td><input type='tel' data-prop='su_hiritsu_jisseki' class='number-right comma-number'/></td>"],
                initialized: function () {
                    var self = this;
                    page.detail.dataTable = table.dataTable({
                        height: 350,
                        onselect: page.detail.select,
                        onchange: page.detail.change,
                        fixedColumn: true,
                        fixedColumns: 4,
                        innerWidth: self.width,
                        resize: true
                    });

                    // 行選択時に利用するテーブルインデックスを指定します
                    page.detail.fixedColumnIndex = page.detail.element.find(".fix-columns").length;
                }
            });

            // TODO: 可変列用のデータ作成を行います。
            for (i = 0; i < data.length; i++) {
                flexItem = data[i];
                flexData = {
                    //TODO:固定列にバインドする項目を指定します
                    fixcolumn: {
                        dt_nohin: flexItem.dt_nohin,
                        cd_buhin: flexItem.cd_buhin,
                        nm_buhin: flexItem.nm_buhin,
                    },
                    flexcolumn: []
                };

                rowKey = flexItem.cd_buhin;        //行のキーとなる項目
                while (rowKey === flexItem.cd_buhin) {
                    flexData.flexcolumn.push(flexItem);
                    flexItem = data[++i];
                    if (typeof flexItem === "undefined") {
                        break;
                    }
                }
                i--;

                flexList.push(flexData);
            }

            // 取得したデータをもとに画面項目に DataTable にデータを設定します。
            page.detail.dataTable.dataTable("addRows", flexList, function (row, item) {
                //固定列項目の値をバインドします
                row.form(page.detail.options.bindOption).bind(item.fixcolumn);

                // TODO：データの形状に応じて値をセルに設定します。
                for (i = 0; i < item.flexcolumn.length; i++) {
                    flexcolumn = item.flexcolumn[i];
                    colKey = flexcolumn.cd_torihiki;       //列のキーとなる項目
                    cells = row.findP(colKey);
                    page.detail.data.attach(flexcolumn);
                    cells.form(page.detail.options.bindOption).bind(flexcolumn);
                    cells.children().attr("data-key", flexcolumn.__id);
                }
                return row;
            }, true);

            //TODO: 画面明細へのデータバインド処理をここに記述します。

            //バリデーションを実行します。
            page.detail.validateList(true);

        };

        /**
         * 画面明細の一覧の行が選択された時の処理を行います。
         */
        page.detail.select = function (e, row) {

            // 選択されたセルの該当する列 TH に class を設定します。
            var prop = $(e.target).parent().attr("data-prop");
            $(".dt-container thead th").removeClass("selected");
            $(".dt-container thead ." + prop).addClass("selected");

            $($(row.element[page.detail.fixedColumnIndex]).closest("table")[0].querySelectorAll(".select-tab-2lines.selected")).removeClass("selected").addClass("unselected");
            $(row.element[page.detail.fixedColumnIndex].querySelectorAll(".select-tab-2lines")).removeClass("unselected").addClass("selected");

            //選択行全体に背景色を付ける場合は以下のコメントアウトを解除します。
            //if (!App.isUndefOrNull(page.detail.selectedRow)) {
            //    page.detail.selectedRow.element.find("tr").removeClass("selected-row");
            //}
            //row.element.find("tr").addClass("selected-row");
            //page.detail.selectedRow = row;
        };

        /**
         * 画面明細の一覧の入力項目の変更イベントの処理を行います。
         */
        page.detail.change = function (e, row) {
            var target = $(e.target),
                id = target.attr("data-key"),
                property = target.attr("data-prop"),
                colKey = target.parent().attr("data-prop"),    //列のキー項目の値を取得する
                entity,
                validate = function (targets) {
                    return page.detail.validator.validate({
                        targets: targets,
                        state: {
                            tbody: row,
                            isGridValidation: true
                        }
                    });
                };

            page.values.isChangeRunning[property] = true;

            if (!App.isUndefOrNull(id)) {
                entity = page.detail.data.entry(id);
            }
            else {
                // セルの要素にマップされた id がない場合には entity を作成します
                // TODO: 作成する entity の型は画面ごとにことなるため、キーとなる項目を設定します。
                entity = {
                    cd_buhin: row.element.findP("cd_buhin").text(),
                    nm_buhin: row.element.findP("nm_buhin").text(),
                    dt_nohin: page.values.dt_nohin,         
                    cd_torihiki: colKey
                };
                page.detail.data.add(entity);
                row.element.findP(colKey).children().attr("data-key", entity.__id);    //同一列キー項目に紐づく全ての入力セルに対してdata-keyを紐付
            }

            validate(target)
            .then(function () {
                var val = target.parent().form().data()[property];
                // 同一列キー項目に関連するすべての入力セルがブランクの場合、データを削除する
                if (target.val() === "") {
                    var isDelete = true;
                    row.element.findP(colKey).children().each(function (index, element) {
                        if ($(element).val()) {
                            isDelete = false;
                        }
                    });

                    if (isDelete) {
                        page.detail.data.remove(entity);
                        row.element.findP(colKey).children().removeAttr("data-key");
                    } else {
                        entity[property] = val;
                        page.detail.data.update(entity);
                    }
                } else {
                    entity[property] = val;
                    page.detail.data.update(entity);
                }

                $("#save").prop("disabled", false);
            }).always(function () {
                delete page.values.isChangeRunning[property];
            });
        };

        /**
         * 画面明細の一覧のバリデーションを実行します。
         */
        page.detail.validateList = function (suppressMessage) {

            var validations = [];

            page.detail.dataTable.dataTable("each", function (row, index) {
                // セルに対してバリデーションを実行します。
                row.element.find(":input").each(function (index, elem) {

                    validations.push(page.detail.validator.validate({
                        targets: $(elem),
                        state: {
                            suppressMessage: suppressMessage,
                            tbody: row.element,
                            isGridValidation: true
                        }
                    }));

                });
            });
            return App.async.all(validations);
        };

        /**
        * 行の追加を行います。
        */
        page.detail.addNewItem = function () {
            page.dialogs.addNewDialog.element.modal("show");

            // 新規追加ダイアログで選択が実行された時に呼び出される関数を設定しています。
            // 選択したデータのチェックがあるので、エラーの場合はtrueをreturnします
            page.dialogs.addNewDialog.dataSelected = function (data) {

                var isError = false;
                page.dialogs.addNewDialog.notifyAlert.clear();

                page.detail.dataTable.dataTable("each", function (row, index) {
                    if (row.element.findP("cd_buhin").text() == data.cd_buhin) {
                        page.dialogs.addNewDialog.notifyAlert.message(App.messages.base.MS0013).show();
                        isError = true;
                        return true;
                    }
                });

                if (isError) {
                    return true;
                }

                data.dt_nohin = App.data.getDateTimeStringForQuery(page.values.dt_nohin, true);
                page.detail.dataTable.dataTable("addRow", function (tbody) {
                    tbody.form(page.detail.options.bindOption).bind(data);
                    return tbody;
                }, true);

                return false;
            }

        };

        /**
        * 行の削除を行います。
        */
        page.detail.deleteItem = function () {
            var element = page.detail.element,
                selected = element.find(".datatable .select-tab-2lines.selected").closest("tbody"),
                $elem;

            if (!selected.length) {
                return;
            }

            // TODO: 選択行の入力項目の空白への変更を実行します。
            page.detail.dataTable.dataTable("getRow", selected, function (row, index) {
                row.element.find(":input").each(function (i, elem) {
                    $elem = $(elem);
                    if ($elem.val()) {
                        $elem.val("").change();
                    }
                    App.ui.page.notifyAlert.remove(elem);
                });
            });

            $("#save").prop("disabled", false);
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
                        <label>納品日</label>
                    </div>
                    <div class="control col-xs-1">
                        <input type="tel" data-prop="dt_nohin" data-role="date" />
                    </div>
                    <div class="control col-xs-9">
                    </div>
                </div>
                <div class="header-command">
                    <button type="button" id="search" class="btn btn-sm btn-primary" >検索</button>
                </div>
            </div>
        </div>

        <div class="detail">
            <!--<div title="数量予実一覧" class="part">-->
                <div class="control-label toolbar">
                    <i class="icon-th"></i>
                    <div class="btn-group">
                        <button type="button" class="btn btn-default btn-xs" id="add-item" disabled="disabled">追加</button>
                        <button type="button" class="btn btn-default btn-xs" id="del-item" disabled="disabled">削除</button>
                    </div>
                </div>
                <div id="flexcolumn"></div>
                <table class="datatable" style="display:none;">
                    <!--TODO: 明細一覧のヘッダーを定義するHTMLをここに記述します。-->
                    <thead>
                        <tr>
                            <th rowspan="3" style="width: 10px;"></th>
                            <th rowspan="3" style="width: 80px;">日付</th>
                            <th rowspan="3" style="width: 60px;">部品ｺｰﾄﾞ</th>
                            <th rowspan="3" style="width: 200px;">品名</th>
                            <th rowspan="3" style="width: 40px;"></th>
                        </tr>
                        <tr></tr>
                        <tr></tr>
                    </thead>
                    <tbody class="item-tmpl" style="cursor:default; display: none;">
                        <tr>
                            <td rowspan="2">
                                <span class="select-tab-2lines unselected"></span>
                            </td>
                            <td rowspan="2" class="center">
                                <span data-prop="dt_nohin" ></span>
                            </td>
                            <td rowspan="2" >
                                <span class="number-right" data-prop="cd_buhin" ></span>
                            </td>
                            <td rowspan="2" >
                                <span data-prop="nm_buhin" ></span>
                            </td>
                            <td class="center">
                                <span>予定</span>
                            </td>
                        </tr>
                        <tr>
                            <td class="center">
                                <span>実績</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="detail-command">
                </div>
                <div class="part-command">
                </div>
            <!--</div>-->
        </div>
    </div>

</asp:Content>

<asp:Content ID="FooterContent" ContentPlaceHolderID="FooterContent" runat="server">
    <div class="command-left">
    </div>

    <div class="command">
        <button type="button" id="save" class="btn btn-sm btn-primary" disabled="disabled" >保存</button>
    </div>

</asp:Content>

<asp:Content ID="DialogsContent" ContentPlaceHolderID="DialogsContent" runat="server">
    <div id="dialog-container"></div>

</asp:Content>