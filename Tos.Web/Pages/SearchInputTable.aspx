<%@ Page Title="999_検索＋明細直接編集" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="SearchInputTable.aspx.cs" Inherits="Tos.Web.Pages.SearchInputTable" %>
<%@ MasterType VirtualPath="~/Site.Master" %>

<asp:Content ID="IncludeContent" ContentPlaceHolderID="IncludeContent" runat="server">

    <link media="all" rel="stylesheet" href="<%=ResolveUrl("~/Content/part.css") %>" type="text/css" />
    <link media="all" rel="stylesheet" href="<%=ResolveUrl("~/Content/headerdetail.css") %>" type="text/css" />

    <% #if DEBUG %>
    <script src="<%=ResolveUrl("~/Scripts/datatable.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/part.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/select2.js") %>" type="text/javascript"></script>
    <% #else %>
    <script src="<%=ResolveUrl("~/Scripts/datatable.min.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/part.min.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/select2.min.js") %>" type="text/javascript"></script>
    <% #endif %>
    <script src="<%=ResolveUrl("~/Resources/select2-messages/" + Master.lang + ".js") %>"></script>
</asp:Content>

<asp:Content ID="HeadContent" ContentPlaceHolderID="HeadContent" runat="server">

    <style type="text/css">

        div .detail-command {
            text-align: center;
        }

    </style>

    <script type="text/javascript">

        /**
         * ページのレイアウト構造に対応するオブジェクトを定義します。
         */
        var page = App.define("SearchInputTable", {
            //TODO: ページのレイアウト構造に対応するオブジェクト定義を記述します。
            options: {
                skip: 0,                                // TODO:先頭からスキップするデータ数を指定します。
                top: App.settings.base.maxInputDataCount,   // TODO:取得するデータ数を指定します。
                filter: ""
            },
            values: {
                isChangeRunning: {}
            },
            urls: {
                mitsumori: "../api/SampleMitsumoriInputDetail",
                searchDialog: "Dialogs/SearchDialog.aspx",
                searchInputDialog: "Dialogs/SearchInputDialog.aspx",
                confirmDialog: "Dialogs/ConfirmDialog.aspx"
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
            dialogs: {},
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
                    return $.ajax(App.ajax.webapi.post(page.urls.mitsumori, changeSets))
                        .then(function (result) {

                            //TODO: データの保存成功時の処理をここに記述します。


                            //最後に再度データを取得しなおします。
                            return App.async.all([page.header.search(false)]);
                        }).then(function () {
                            App.ui.page.notifyInfo.message(App.messages.base.MS0002).show();
                        }).fail(function (error) {

                            if (error.status === App.settings.base.conflictStatus) {
                                // TODO: 同時実行エラー時の処理を行っています。
                                // 既定では、メッセージを表示し、現在の入力情報を切り捨ててサーバーの最新情報を取得しています。
                                page.header.search(false);
                                App.ui.page.notifyAlert.clear();
                                App.ui.page.notifyAlert.message(App.messages.base.MS0009).show();
                                return;
                            }

                            //TODO: データの保存失敗時の処理をここに記述します。
                            if (error.status === App.settings.base.validationErrorStatus) {
                                var errors = error.responseJSON;
                                $.each(errors, function (index, err) {
                                    var errRow;
                                    page.detail.dataTable.dataTable("each", function (row, index) {
                                        var entity = page.detail.data.entry(row.element.attr("data-key"));
                                        if (entity.no_mitsumori === err.Data.no_mitsumori
                                            && ((App.isUndefOrNull(entity.ts) && App.isUndefOrNull(err.Data.ts)) || entity.ts === err.Data.ts)) {
                                            errRow = row;
                                            return true;
                                        }
                                    });

                                    App.ui.page.notifyAlert.message(
                                        err.Message + 
                                        (App.isUndefOrNull(err.InvalidationName) ? "" : err.Data[err.InvalidationName]),
                                        App.isUndefOrNull(err.InvalidationName) || App.isUndefOrNull(errRow) ? "" : errRow.element.findP(err.InvalidationName)
                                    ).show();

                                    if (!App.isUndefOrNull(errRow)) {
                                        errRow.element.find("tr").addClass("has-error");
                                    }
                                });
                                return;
                            }

                            App.ui.page.notifyAlert.message(App.ajax.handleError(error).message).show();

                        });
                });
            }).fail(function () {
                App.ui.page.notifyAlert.message(App.messages.base.MS0006).show();
            }).always(function () {
                setTimeout(function () {
                    page.header.element.find(":input:first").focus();
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

            //select2 global設定
            $.fn.select2.defaults.set("language", App.ui.page.lang);
            $.fn.select2.defaults.set("selectOnClose", true);
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
            return $.ajax(App.ajax.odata.get(page.header.urls.shiharaiJoken)).then(function (result) {
                // ここでは明細内の支払い条件ドロップダウンにもデータを設定する必要があるため対応を $.findP を利用する。
                var cd_shiharai = $.findP("cd_shiharai");
                cd_shiharai.children().remove();
                App.ui.appendOptions(
                    cd_shiharai,
                    "cd_shiharai",
                    "nm_joken_shiharai",
                    result.value,
                    true
                );

                page.header.element.findP("cd_shiharai").css("width", "98%").select2();

                var cd_shiharai_multi = $.findP("cd_shiharai_multi");
                cd_shiharai_multi.children().remove();
                App.ui.appendOptions(
                    cd_shiharai_multi,
                    "cd_shiharai",
                    "nm_joken_shiharai",
                    result.value,
                    false
                );

                page.header.element.findP("cd_shiharai_multi").css("width", "98%").select2({
                    closeOnSelect: false,
                    selectOnClose: false
                });
            });
        };

        /**
         * 共有のダイアログのロード処理を実行します。
         */
        page.loadDialogs = function () {

            return App.async.all({

                searchDialog: $.get(page.urls.searchDialog),
                searchInputDialog: $.get(page.urls.searchInputDialog),
                confirmDialog: $.get(page.urls.confirmDialog),

            }).then(function (result) {
                $("#dialog-container").append(result.successes.confirmDialog);
                page.dialogs.confirmDialog = ConfirmDialog;

                $("#dialog-container").append(result.successes.searchDialog);
                page.dialogs.searchDialog = SearchDialog;
                page.dialogs.searchDialog.initialize();

                //検索ダイアログで選択が実行された時に呼び出される関数を設定しています。
                page.dialogs.searchDialog.dataSelected = page.header.setTorihiki;

                $("#dialog-container").append(result.successes.searchInputDialog);
                page.dialogs.searchInputDialog = SearchInputDialog;
                page.dialogs.searchInputDialog.initialize();

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
            element.on("click", ".torihiki-select", page.header.showSearchDialog);
            element.on("click", ".torihiki-input", page.header.showSearchInputDialog);

        };

        /**
         * 検索処理を定義します。
         */
        page.header.search = function (isLoading) {

            var deferred = $.Deferred(),
                query;

            page.header.validator.validate().done(function () {

                page.options.filter = page.header.createFilter();

                query = {
                    url: page.urls.mitsumori,
                    filter: page.options.filter,
                    orderby: "no_mitsumori",
                    top: page.options.top,
                    inlinecount: "allpages"
                };

                if (isLoading) {
                    App.ui.loading.show();
                    App.ui.page.notifyAlert.clear();
                }

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
                    deferred.resolve();
                }).fail(function (error) {
                    App.ui.page.notifyAlert.message(App.ajax.handleError(error).message).show();
                    deferred.reject();
                }).always(function () {
                    if (isLoading) {
                        App.ui.loading.close();
                    }
                    if (!$("#save").is(":disabled")) {
                        $("#save").prop("disabled", true);
                    }
                });
            });

            return deferred.promise();
        };


        /**
         * 検索条件のフィルターを定義します。
         */
        page.header.createFilter = function () {
            var criteria = page.header.element.form().data(),
                filters = [],
                composeOption = {
                    delimiter: " "
                    , isOR: true
                    , isStrict: false
                    , isNumber: false
                };

            if (!App.isUndefOrNull(criteria.cd_shiharai) && criteria.cd_shiharai > 0) {
                filters.push("cd_shiharai eq " + criteria.cd_shiharai);
            }

            if (!App.isUndefOrNull(criteria.cd_torihiki) && criteria.cd_torihiki.length > 0) {
                filters.push("cd_torihiki eq " + criteria.cd_torihiki);
            }

            if (!App.isUndefOrNull(criteria.nm_hinmei) && criteria.nm_hinmei.length > 0) {
                filters.push(App.data.getComposedFilter("nm_hinmei", criteria.nm_hinmei, composeOption));
            }

            return filters.join(" and ");
        };

        //TODO: 以下の page.header の各宣言は画面仕様ごとにことなるため、
        //不要の場合は削除してください。

        /**
         * 画面ヘッダーにある取引先ダイアログ起動時の処理を定義します。
         */
        page.header.showSearchDialog = function (e) {
            //検索ダイアログで選択が実行された時に呼び出される関数を設定しています。
            page.dialogs.searchDialog.dataSelected = page.header.setTorihiki;

            page.dialogs.searchDialog.element.modal("show");
        };

        /**
         * 画面ヘッダーにある取引先登録ダイアログ起動時の処理を定義します。
         */
        page.header.showSearchInputDialog = function (e) {
            page.dialogs.searchInputDialog.dataSelected = page.header.setTorihiki;

            page.dialogs.searchInputDialog.element.modal("show");
        };

        /**
         * 画面ヘッダーにある取引先コードと取引先名に値を設定します。
         */
        page.header.setTorihiki = function (data) {
            page.header.element.findP("cd_torihiki").val(data.cd_torihiki).change();
            page.header.element.findP("nm_torihiki").text(data.nm_torihiki);
        }

        /**
         * 画面明細のバリデーションを定義します。
         */
        page.detail.options.validations = {
            //TODO: 画面明細のバリデーションの定義を記述します。
            no_mitsumori: {
                rules: {
                    required: true,
                    digits: true,
                    range: [1, 999999999]
                },
                options: {
                    name: "見積番号"
                },
                messages: {
                    required: App.messages.base.required,
                    digits: App.messages.base.digits,
                    range: App.messages.base.range
                },
                groups: ["change"]
            },
            cd_torihiki: {
                rules: {
                    required: true,
                    digits: true,
                    equallength: 6
                },
                options: {
                    name: "取引先コード"
                },
                messages: {
                    required: App.messages.base.required,
                    digits: App.messages.base.digits,
                    equallength: App.messages.base.equallength,
                },
                groups: ["input"]
            },
            nm_hinmei: {
                rules: {
                    required: true,
                    maxlength: 200
                },
                options: {
                    name: "品名"
                },
                messages: {
                    required: App.messages.base.required,
                    maxlength: App.messages.base.maxlength,
                },
                groups: ["other"]
            },
            biko: {
                rules: {
                    requiredWhen_cd_shiharai_empty: function (value, opts, state, done) {
                        var tbody = state.tbody.element ? state.tbody.element : state.tbody;
                        var cd_shiharai = tbody.findP("cd_shiharai").val();

                        if (!App.isUndefOrNull(cd_shiharai) && cd_shiharai === "") {
                            done(value !== "");
                        }
                        else {
                            done(true);
                        }
                    }
                },
                options: {
                },
                messages: {
                    requiredWhen_cd_shiharai_empty: "代金支払条件が選択されていない場合、備考は入力必須です。"
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
                    height: 200,
                    resize: true,
                    //fixedColumn: true,
                    //fixedColumns: 2,
                    //innerWidth: 1200,
                    onselect: page.detail.select,
                    onchange: page.detail.change
                });
            table = element.find(".datatable"); //列固定にした場合DOM要素が再作成されるため、変数を再取得

            page.detail.validator = element.validation(page.createValidator(page.detail.options.validations));
            page.detail.element = element;
            page.detail.dataTable = datatable;

            element.on("click", "#add-item", page.detail.addNewItem);
            element.on("click", "#del-item", page.detail.deleteItem);
            element.on("click", "#insert-item-before", page.detail.insertNewItemBefore);
            element.on("click", "#insert-item-after", page.detail.insertNewItemAfter);

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
            page.detail.bind([], true);

            //TODO: 画面明細で利用するコントロールのイベントの紐づけ処理をここに記述します。

            table.on("click", ".torihiki-select", page.detail.showSearchDialog);
        };

        /**
         * 画面明細へのデータバインド処理を行います。
         */
        page.detail.bind = function (data, isNewData) {
            var i, l, item, dataSet, dataCount;

            dataCount = data.Count ? data.Count : 0;
            data = (data.Items) ? data.Items : data;

            dataSet = App.ui.page.dataSet();
            page.detail.data = dataSet;
            page.detail.dataTable.dataTable("clear");

            page.detail.dataTable.dataTable("addRows", data, function (row, item) {
                
                (isNewData ? dataSet.add : dataSet.attach).bind(dataSet)(item);
                row.form(page.detail.options.bindOption).bind(item);
                row.findP("cd_shiharai").css("width", "100%").select2();
                return row;
            }, true);

            if (!isNewData) {
                page.detail.element.findP("data_count").text(data.length);
                page.detail.element.findP("data_count_total").text(dataCount);
            }

            if (dataCount >= App.settings.base.maxInputDataCount) {
                App.ui.page.notifyInfo.message(App.messages.base.MS0011).show();
            }

            //TODO: 画面明細へのデータバインド処理をここに記述します。


            //バリデーションを実行します。
            page.detail.validateList(true);

        };

        /**
         * 画面明細の一覧の行が選択された時の処理を行います。
         */
        page.detail.select = function (e, row) {
            $($(row.element[page.detail.fixedColumnIndex]).closest("table")[0].querySelectorAll(".select-tab.selected")).removeClass("selected").addClass("unselected");
            $(row.element[page.detail.fixedColumnIndex].querySelectorAll(".select-tab")).removeClass("unselected").addClass("selected");

            //選択行全体に背景色を付ける場合は以下のコメントアウトを解除します。
            //if (!App.isUndefOrNull(page.detail.selectedRow)) {
            //    page.detail.selectedRow.element.find(".selected-row").removeClass("selected-row");
            //}
            //row.element.find("tr").addClass("selected-row");
            //page.detail.selectedRow = row;
        };

        /**
         * 画面明細の一覧の入力項目の変更イベントの処理を行います。
         */
        page.detail.change = function (e, row) {
            var target = $(e.target),
                id = row.element.attr("data-key"),
                property = target.attr("data-prop"),
                entity = page.detail.data.entry(id),
                options = {
                    filter: page.detail.validationFilter
                };

            page.values.isChangeRunning[property] = true;

            page.detail.executeValidation(target, row)
            .then(function () {
                entity[property] = row.element.form().data()[property];
                page.detail.data.update(entity);

                if ($("#save").is(":disabled")) {
                    $("#save").prop("disabled", false);
                }

                //入力行の他の項目のバリデーション（必須チェック以外）を実施します
                page.detail.executeValidation(row.element.find(":input"), row, options);
            }).always(function () {
                delete page.values.isChangeRunning[property];
            });
        };

        /**
         * 画面明細の一覧に新規データを追加します。
         */
        page.detail.addNewItem = function () {
            //TODO:新規データおよび初期値を設定する処理を記述します。
            var newData = {
                no_mitsumori: page.values.no_mitsumori
            };

            page.detail.data.add(newData);
            page.detail.dataTable.dataTable("addRow", function (tbody) {
                tbody.form(page.detail.options.bindOption).bind(newData);
                tbody.findP("cd_shiharai").css("width", "100%").select2();

                return tbody;
            }, true);

            if ($("#save").is(":disabled")) {
                $("#save").prop("disabled", false);
            }
        };

        /**
         * 画面明細の各行にデータを設定する際のオプションを定義します。
         */
        page.detail.options.bindOption = {
            // TODO: 主キーが直接入力の場合には、修正の場合変更を不可とします。
            appliers: {
                no_mitsumori: function (value, element) {
                    element.val(value);
                    element.prop("readonly", true).prop("tabindex", -1);
                    return true;
                }
            }
        };


        /**
         * 画面明細の一覧で選択されている行とデータを削除します。
         */
        page.detail.deleteItem = function (e) {
            var element = page.detail.element,
                selected = element.find(".datatable .select-tab.selected").closest("tbody");

            if (!selected.length) {
                return;
            }

            page.detail.dataTable.dataTable("deleteRow", selected, function (row) {
                var id = row.attr("data-key"),
                    newSelected;

                row.find(":input").each(function (i, elem) {
                    App.ui.page.notifyAlert.remove(elem);
                });

                if (!App.isUndefOrNull(id)) {
                    var entity = page.detail.data.entry(id);
                    page.detail.data.remove(entity);
                }

                newSelected = row.next().not(".item-tmpl");
                if (!newSelected.length) {
                    newSelected = row.prev().not(".item-tmpl");
                }
                if (newSelected.length) {
                    for (var i = page.detail.fixedColumnIndex; i > -1; i--) {
                        if ($(newSelected[i]).find(":focusable:first").length) {
                            $(newSelected[i]).find(":focusable:first").focus();
                            break;
                        }
                    }
                }
            });

            if ($("#save").is(":disabled")) {
                $("#save").prop("disabled", false);
            }
        };

        /**
         * 画面明細の一覧に対して、選択行の前に新規データを挿入します。
         */
        page.detail.insertNewItemBefore = function () {
            //TODO:新規データおよび初期値を設定する処理を記述します。
            var newData = {
                no_mitsumori: page.values.no_mitsumori
            };

            page.detail.data.add(newData);
            // 新規データを挿入（前）
            page.detail.insertRow(newData, true, false);
        };

        /**
         * 画面明細の一覧に対して、選択行の後に新規データを挿入します。
         */
        page.detail.insertNewItemAfter = function () {
            //TODO:新規データおよび初期値を設定する処理を記述します。
            var newData = {
                no_mitsumori: page.values.no_mitsumori
            };

            page.detail.data.add(newData);
            // 新規データを挿入（後）
            page.detail.insertRow(newData, true, true);
        };

        /**
        * 画面明細の一覧に、選択行の後に新しい行を挿入します。
        */
        page.detail.insertRow = function (data, isFocus, isInsertAfter) {
            var element = page.detail.element,
                selected = element.find(".datatable .select-tab.selected").closest("tbody");

            if (isInsertAfter) {
                selected = selected.next().not(".item-tmpl");
            }

            if (!selected.length) {
                // 選択行が無ければこれまでどおり追加
                page.detail.addNewItem();
                return;
            }

            page.detail.dataTable.dataTable("insertRow", selected, isInsertAfter, function (tbody) {
                tbody.form(page.detail.options.bindOption).bind(data);
                return tbody;
            }, isFocus);

            if ($("#save").is(":disabled")) {
                $("#save").prop("disabled", false);
            }
        };

        /**
         * 画面明細のバリデーションを実行します。
         */
        page.detail.executeValidation = function (targets, row, options) {
            var defaultOptions = {
                    targets: targets,
                    state: {
                        tbody: row,
                        isGridValidation: true
                    }
                },
                execOptions = $.extend(true, {}, defaultOptions, options);

            return page.detail.validator.validate(execOptions);
        };

        /**
         * 画面明細のバリデーションフィルターを設定します。（必須チェックを行わない）
         */
        page.detail.validationFilter = function (item, method, state, options) {
            return method !== "required";
        };

        /**
         * 画面明細の一覧全体のバリデーションを実行します。
         */
        page.detail.validateList = function (suppressMessage) {
            var validations = [],
                options = {
                    state: {
                        suppressMessage: suppressMessage,
                    }
                };

            page.detail.dataTable.dataTable("each", function (row, index) {
                validations.push(page.detail.executeValidation(row.element.find(":input"), row.element, options));
            });

            return App.async.all(validations);
        };

        //TODO: 以下の page.detail の各宣言は画面仕様ごとにことなるため、
        //不要の場合は削除してください。

        /**
         * 画面明細の一覧から取引先選択ダイアログを表示します。
         */
        page.detail.showSearchDialog = function (e) {
            var element = page.detail.element,
                target = $(e.target),
                selected = target.closest("tbody"),
                row;

            page.detail.dataTable.dataTable("getRow", selected, function (rowObject) {
                row = rowObject.element;
            });

            page.dialogs.searchDialog.element.modal("show");

            //部品検索ダイアログで部品選択が実行された時に呼び出される関数を設定しています。
            page.dialogs.searchDialog.dataSelected = function (data) {
                row.findP("cd_torihiki").val(data.cd_torihiki).change();
                row.findP("nm_torihiki").text(data.nm_torihiki);

                delete page.dialogs.searchDialog.dataSelected;
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
                    <div class="control col-xs-2 with-next-col">
                        <label data-prop="nm_torihiki" style="white-space: nowrap;" ></label>
                    </div>
                    <div class="control col-xs-2">
                        <button type="button" class="btn btn-info btn-xs torihiki-select">選択</button>
                        <button type="button" class="btn btn-success btn-xs torihiki-input">登録</button>
                    </div>
                    <div class="control-label col-xs-2">
                        <label >代金支払条件</label>
                    </div>
                    <div class="control col-xs-3">
                        <select data-prop="cd_shiharai" class="number"></select>
                    </div>
                </div>
                <div class="row">
                    <div class="control-label col-xs-2">
                        <label >代金支払条件</label>
                    </div>
                    <div class="control col-xs-10">
                        <select data-prop="cd_shiharai_multi" multiple="multiple"></select>
                    </div>
                </div>
                <div class="row">
                    <div class="control-label col-xs-2">
                        <label >品名</label>
                    </div>
                    <div class="control col-xs-10">
                        <input type="text" class="ime-active text-selectAll" data-prop="nm_hinmei" />
                    </div>
                </div>
                <div class="header-command">
                    <button type="button" id="search" class="btn btn-sm btn-primary" >検索</button>
                </div>
            </div>
        </div>

        <div class="detail">
            <div title="見積一覧" class="part">
                <div class="control-label toolbar">
                    <i class="icon-th"></i>
                    <div class="btn-group">
                        <button type="button" class="btn btn-default btn-xs" id="add-item">追加</button>
                        <button type="button" class="btn btn-default btn-xs" id="del-item">削除</button>
                        <button type="button" class="btn btn-default btn-xs" id="insert-item-before">上に行追加</button>
                        <button type="button" class="btn btn-default btn-xs" id="insert-item-after">下に行追加</button>
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
                            <th style="width: 10px;"></th>
                            <th style="width: 70px;">見積番号</th>
                            <th style="width: 100px;">取引先</th>
                            <th style="width: 250px;">取引先名</th>
                            <th style="width: 200px;">代金支払条件</th>
                            <th >品名</th>
                            <th style="width: 400px;">備考</th>
                        </tr>
                    </thead>
                    <tbody class="item-tmpl" style="cursor: default; display: none;">
                        <tr>
                            <td>
                                <span class="select-tab unselected"></span>
                            </td>
                            <td>
                                <input type="tel" data-prop="no_mitsumori" class="number-right number" />
                            </td>
                            <td>
                                <input type="tel" data-prop="cd_torihiki" style="width: 70px"/>
                                <button class="btn btn-info btn-xs torihiki-select" >  
                                    <span class="icon-search icon-white" aria-hidden="true"></span>
                                </button> 
                            </td>
                            <td>
                                <label data-prop="nm_torihiki" style="white-space: nowrap;" ></label>
                            </td>
                            <td>
                                <select data-prop="cd_shiharai" class="number" ></select>
                            </td>
                            <td>
                                <input type="text" class="ime-active text-selectAll" data-prop="nm_hinmei"  />
                            </td>
                            <td>
                                <input type="text" class="ime-active" data-prop="biko" />
                            </td>
                    </tbody>
                </table>
                <div class="part-command">
                </div>
            </div>
        </div>
    </div>

</asp:Content>

<asp:Content ID="FooterContent" ContentPlaceHolderID="FooterContent" runat="server">
    <div class="command-left">
    </div>

    <div class="command">
        <button type="button" id="save" class="btn btn-sm btn-primary" disabled="disabled">保存</button>
    </div>

</asp:Content>

<asp:Content ID="DialogsContent" ContentPlaceHolderID="DialogsContent" runat="server">
    <div id="dialog-container"></div>
</asp:Content>
