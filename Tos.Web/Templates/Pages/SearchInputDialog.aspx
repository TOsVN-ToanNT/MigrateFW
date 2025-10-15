<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="SearchInputDialog.aspx.cs" Inherits="Tos.Web.Templates.Pages.SearchInputDialog" %>
<%@ MasterType VirtualPath="~/Site.Master" %>
<%--created from 【SearchInputDialog(Ver2.1)】 Template--%>
    <script type="text/javascript">

        /**
         * 検索ダイアログのレイアウト構造に対応するオブジェクトを定義します。
         */
        var SearchInputDialog = {
            options: {
                skip: 0,                                // TODO:先頭からスキップするデータ数を指定します。
                top: App.settings.base.maxInputDataCount,   // TODO:取得するデータ数を指定します。
                filter: ""
            },
            values: {
                isChangeRunning: {}
            },
            urls: {},
            header: {
                options: {},
                values: {},
            },
            detail: {
                options: {},
                values: {}
            },
            commands: {},
            dialogs: {}
        };

        /**
         * バリデーション成功時の処理を実行します。
         */
        SearchInputDialog.validationSuccess = function (results, state) {
            var i = 0, l = results.length,
                item, $target;

            for (; i < l; i++) {
                item = results[i];
                if (state && state.isGridValidation) {
                    SearchInputDialog.detail.dataTable.dataTable("getRow", $(item.element), function (row) {
                        if (row && row.element) {
                            row.element.find("tr").removeClass("has-error");
                        }
                    });
                } else {
                    SearchInputDialog.setColValidStyle(item.element);
                }

                SearchInputDialog.notifyAlert.remove(item.element);
            }
        };

        /**
         * バリデーション失敗時の処理を実行します。
         */
        SearchInputDialog.validationFail = function (results, state) {

            var i = 0, l = results.length,
                item, $target;

            for (; i < l; i++) {
                item = results[i];
                if (state && state.isGridValidation) {
                    SearchInputDialog.detail.dataTable.dataTable("getRow", $(item.element), function (row) {
                        if (row && row.element) {
                            row.element.find("tr").addClass("has-error");
                        }
                    });
                } else {
                    SearchInputDialog.setColInvalidStyle(item.element);
                }

                if (state && state.suppressMessage) {
                    continue;
                }
                SearchInputDialog.notifyAlert.message(item.message, item.element).show();
            }
        };

        /**
         * バリデーション後の処理を実行します。
         */
        SearchInputDialog.validationAlways = function (results) {
            //TODO: バリデーションの成功、失敗に関わらない処理が必要な場合はここに記述します。
        };

        /**
          * 指定された定義をもとにバリデータを作成します。
          * @param target バリデーション定義
          * @param options オプションに設定する値。指定されていない場合は、
          *                画面の success/fail/always のハンドル処理が指定されたオプションが設定されます。
          */
        SearchInputDialog.createValidator = function (target, options) {
            return App.validation(target, options || {
                success: SearchInputDialog.validationSuccess,
                fail: SearchInputDialog.validationFail,
                always: SearchInputDialog.validationAlways
            });
        };

        /**
         * 単項目要素をエラーのスタイルに設定します。
         * @param target 設定する要素
         */
        SearchInputDialog.setColInvalidStyle = function (target) {
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
        SearchInputDialog.setColValidStyle = function (target) {
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
         * データの保存処理を実行します。
         */
        SearchInputDialog.commands.save = function () {
            var loadingTaget = SearchInputDialog.element.find(".modal-content");

            SearchInputDialog.notifyAlert.clear();
            SearchInputDialog.notifyInfo.clear();

            App.ui.loading.show("", loadingTaget);

            var sleep = 0;
            var condition = "Object.keys(SearchInputDialog.values.isChangeRunning).length == 0";
            App.ui.wait(sleep, condition, 100)
            .then(function () {
                SearchInputDialog.validateAll().then(function () {

                    var changeSets = SearchInputDialog.detail.data.getChangeSet();

                    //TODO: データの保存処理をここに記述します。
                    return $.ajax(App.ajax.webapi.post(/* TODO: データ保存サービスの URL を設定してください。, */changeSets))
                        .then(function (result) {

                            //TODO: データの保存成功時の処理をここに記述します。


                            //最後に再度データを取得しなおします。
                            return App.async.all([SearchInputDialog.header.search(false)]);
                        }).then(function () {
                            SearchInputDialog.notifyInfo.message(App.messages.base.MS0002).show();
                        }).fail(function (error) {

                            if (error.status === App.settings.base.conflictStatus) {
                                // TODO: 同時実行エラー時の処理を行っています。
                                // 既定では、メッセージを表示し、現在の入力情報を切り捨ててサーバーの最新情報を取得しています。
                                SearchInputDialog.header.search(false);
                                SearchInputDialog.notifyAlert.clear();
                                SearchInputDialog.notifyAlert.message(App.messages.base.MS0009).show();
                                return;
                            }

                            //TODO: データの保存失敗時の処理をここに記述します。
                            if (error.status === App.settings.base.validationErrorStatus) {
                                var errors = error.responseJSON;
                                $.each(errors, function (index, err) {
                                    SearchInputDialog.notifyAlert.message(
                                        err.Message +
                                        (App.isUndefOrNull(err.InvalidationName) ? "" : err.Data[err.InvalidationName])
                                    ).show();
                                });
                                return;
                            }

                            SearchInputDialog.notifyAlert.message(App.ajax.handleError(error).message).show();

                        });
                });
            }).fail(function () {
                SearchInputDialog.notifyAlert.message(App.messages.base.MS0006).show();
            }).always(function () {
                setTimeout(function () {
                    SearchInputDialog.header.element.find(":input:first").focus();
                }, 100);
                App.ui.loading.close(loadingTaget);
            });
        };

        /**
         * すべてのバリデーションを実行します。
         */
        SearchInputDialog.validateAll = function () {

            var validations = [];

            validations.push(SearchInputDialog.detail.validateList());

            //TODO: 画面内で定義されているバリデーションを実行する処理を記述します。

            return App.async.all(validations);
        };

        /**
         * ダイアログの初期化処理を行います。
         */
        SearchInputDialog.initialize = function () {

            var element = $("#SearchInputDialog"),
                contentHeight = $(window).height() * 80 / 100;

            SearchInputDialog.element = element;
            element.find(".modal-body").css("max-height", contentHeight);
            element.find(".alert-message").attr("title", App.ui.pagedata.lang(App.ui.page.lang).alertTitle.text);
            element.find(".info-message").attr("title", App.ui.pagedata.lang(App.ui.page.lang).infoTitle.text);

            SearchInputDialog.notifyInfo =
                 App.ui.notify.info(element, {
                     container: "#SearchInputDialog .dialog-slideup-area .info-message",
                     bodyContainer: ".modal-body .detail",
                     show: function () {
                         element.find(".info-message").show();
                     },
                     clear: function () {
                         element.find(".info-message").hide();
                     }
                 });
            SearchInputDialog.notifyAlert =
                App.ui.notify.alert(element, {
                    container: "#SearchInputDialog .dialog-slideup-area .alert-message",
                    bodyContainer: ".modal-body .detail",
                    show: function () {
                        element.find(".alert-message").show();
                    },
                    clear: function () {
                        element.find(".alert-message").hide();
                    }
                });

            element.find(".modal-dialog").draggable({
                drag: true,
            });

            SearchInputDialog.initializeControlEvent();
            SearchInputDialog.header.initialize();
            SearchInputDialog.loadMasterData();
            SearchInputDialog.loadDialogs();
        };

        /**
         * ダイアログコントロールへのイベントの紐づけを行います。
         */
        SearchInputDialog.initializeControlEvent = function () {
            var element = SearchInputDialog.element;

            //TODO: 画面全体で利用するコントロールのイベントの紐づけ処理をここに記述します。
            element.on("hidden.bs.modal", SearchInputDialog.hidden);
            element.on("shown.bs.modal", SearchInputDialog.shown);
            element.on("click", ".save", SearchInputDialog.commands.save);
        };

        /**
         * ダイアログ非表示時処理を実行します。
         */
        SearchInputDialog.hidden = function (e) {
            var element = SearchInputDialog.element;

            //TODO: ダイアログ非表示時に、項目をクリアする処理をここに記述します。
            element.find(":input:not([type='checkbox']):not([type='radio'])").val("");
            element.find("input[type='checkbox']").prop("checked", false);
            //TODO:radioボタンの初期表示は、画面要件に合わせて記述します。

            SearchInputDialog.detail.dataTable.dataTable("clear");

            element.findP("data_count").text("");
            element.findP("data_count_total").text("");

            var items = element.find(".search-criteria :input:not(button)");
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                SearchInputDialog.setColValidStyle(item);
            }

            SearchInputDialog.element.find(".save").prop("disabled", true);
            SearchInputDialog.notifyInfo.clear();
            SearchInputDialog.notifyAlert.clear();
        };

        /**
         * ダイアログ表示時処理を実行します。
         */
        SearchInputDialog.shown = function (e) {
            //初回起動時にdatatable作成
            if (App.isUndefOrNull(SearchInputDialog.detail.fixedColumnIndex)) {
                SearchInputDialog.detail.initialize();
            }

            SearchInputDialog.element.find(":input:not(button):first").focus();
        };

        /**
         * マスターデータのロード処理を実行します。
         */
        SearchInputDialog.loadMasterData = function () {

            //TODO: 画面内のドロップダウンなどで利用されるマスターデータを取得し、画面にバインドする処理を記述します。
            //return $.ajax(App.ajax.odata.get(/* マスターデータ取得サービスの URL */)).then(function (result) {
            //    var cd_shiharai = SearchInputDialog.element.findP("cd_shiharai");
            //    cd_shiharai.children().remove();
            //    App.ui.appendOptions(
            //        cd_shiharai,
            //        "cd_shiharai",
            //        "nm_joken_shiharai",
            //        result.value,
            //        true
            //    );
            //});

            //TODO: マスタデータのロード処理を実装後、下の1行を削除してください。
            return App.async.success();
        };

        /**
         * 共有のダイアログのロード処理を実行します。
         */
        SearchInputDialog.loadDialogs = function () {

            if ($.find("#ConfirmDialog").length == 0) {
                return App.async.all({
                    confirmDialog: $.get(SearchInputDialog.urls.confirmDialog)
                }).then(function (result) {
                    $("#dialog-container").append(result.successes.confirmDialog);
                    SearchInputDialog.dialogs.confirmDialog = ConfirmDialog;
                });
            } else {
                SearchInputDialog.dialogs.confirmDialog = ConfirmDialog;
            }
        };

        /**
         * ダイアログヘッダー　バリデーションルールを定義します。
         */
        SearchInputDialog.header.options.validations = {
        };

        /**
         * ダイアログヘッダーの初期化処理を行います。
         */
        SearchInputDialog.header.initialize = function () {

            var element = SearchInputDialog.element.find(".header");
            SearchInputDialog.header.validator = element.validation(SearchInputDialog.createValidator(SearchInputDialog.header.options.validations));
            SearchInputDialog.header.element = element;

            //TODO: 画面ヘッダーの初期化処理をここに記述します。
            //TODO: 画面ヘッダーで利用するコントロールのイベントの紐づけ処理をここに記述します。
            element.on("click", ".search", SearchInputDialog.header.search);
        };

        /**
         * ダイアログの検索処理を実行します。
         */
        SearchInputDialog.header.search = function (isLoading) {
            var element = SearchInputDialog.element,
                loadingTaget = element.find(".modal-content"),
                deferred = $.Deferred(),
                query;

            SearchInputDialog.header.validator.validate().done(function () {

                SearchInputDialog.options.filter = SearchInputDialog.header.createFilter();
                query = {
                    url: "TODO: 検索結果取得サービスの URL を設定してください。",
                    filter: SearchInputDialog.options.filter,
                    orderby: "TODO: ソート対象の列名",
                    top: SearchInputDialog.options.top,
                    inlinecount: "allpages"
                };

                SearchInputDialog.detail.dataTable.dataTable("clear");
                if (isLoading) {
                    App.ui.loading.show("", loadingTaget);
                    SearchInputDialog.notifyAlert.clear();
                }

                $.ajax(App.ajax.odata.get(App.data.toODataFormat(query)))
                .done(function (result) {

                    SearchInputDialog.detail.bind(result);
                    deferred.resolve();
                }).fail(function (error) {

                    SearchInputDialog.notifyAlert.message(App.ajax.handleError(error).message).show();
                    deferred.reject();
                }).always(function () {

                    if (isLoading) {
                        App.ui.loading.close(loadingTaget);
                    }
                    if (!element.find(".save").is(":disabled")) {
                        element.find(".save").prop("disabled", true);
                    }
                });
            });

            return deferred.promise();
        };

        /**
         * ダイアログの検索条件を組み立てます
         */
        SearchInputDialog.header.createFilter = function () {
            var criteria = SearchInputDialog.header.element.form().data(),
                filters = [];

            //TODO: 画面で設定された検索条件を取得し、データ取得サービスのフィルターオプションを組み立てます。
            //if (!App.isUndefOrNullOrStrEmpty(criteria.nm_torihiki)) {
            //    filters.push("substringof('" + encodeURIComponent(criteria.nm_torihiki) + "', nm_torihiki) eq true");
            //}

            return filters.join(" and ");
        };

        /**
         * ダイアログヘッダー　バリデーションルールを定義します。
         */
        SearchInputDialog.detail.options.validations = {
         };

        /**
         * 画面明細の初期化処理を行います。
         */
        SearchInputDialog.detail.initialize = function () {

            var element = SearchInputDialog.element.find(".detail"),
                table = element.find(".datatable"),
                offsetHeight = $(window).height() * 15 / 100,
                datatable = table.dataTable({
                    height: 300,
                    resize: true,
                    resizeOffset: offsetHeight,
                    //列固定横スクロールにする場合は、下記3行をコメント解除
                    //fixedColumn: true,               //列固定の指定
                    //fixedColumns: 1,                 //固定位置を指定（左端を0としてカウント）
                    //innerWidth: 530,                 //可動列の合計幅を指定
                    onselect: SearchInputDialog.detail.select,
                    onchange: SearchInputDialog.detail.change
                });
            table = element.find(".datatable");        //列固定にした場合DOM要素が再作成されるため、変数を再取得

            SearchInputDialog.detail.validator = element.validation(SearchInputDialog.createValidator(SearchInputDialog.detail.options.validations));
            SearchInputDialog.detail.element = element;
            SearchInputDialog.detail.dataTable = datatable;
            // 行選択時に利用するテーブルインデックスを指定します
            SearchInputDialog.detail.fixedColumnIndex = element.find(".fix-columns").length;

            //TODO: 画面明細で利用するコントロールのイベントの紐づけ処理をここに記述します。
            element.on("click", ".add-item", SearchInputDialog.detail.addNewItem);
            element.on("click", ".del-item", SearchInputDialog.detail.deleteItem);
            //element.on("click", ".select", SearchInputDialog.detail.selectData);

            //TODO: 画面明細の初期化処理をここに記述します。
            SearchInputDialog.detail.bind([], true);
        };

        /**
         * ダイアログ明細へのデータバインド処理を行います。
         */
        SearchInputDialog.detail.bind = function (data, isNewData) {
            var i, l, item, dataSet, dataCount;

            dataCount = data.Count ? data.Count : 0;
            data = (data.Items) ? data.Items : data;

            dataSet = App.ui.page.dataSet();
            SearchInputDialog.detail.data = dataSet;
            SearchInputDialog.detail.dataTable.dataTable("clear");

            SearchInputDialog.detail.dataTable.dataTable("addRows", data, function (row, item) {

                (isNewData ? dataSet.add : dataSet.attach).bind(dataSet)(item);
                row.form(SearchInputDialog.detail.options.bindOption).bind(item);
                return row;
            }, true);

            if (!isNewData) {
                SearchInputDialog.detail.element.findP("data_count").text(data.length);
                SearchInputDialog.detail.element.findP("data_count_total").text(dataCount);
            }

            if (dataCount >= App.settings.base.maxInputDataCount) {
                SearchInputDialog.notifyInfo.message(App.messages.base.MS0011).show();
            }

            //TODO: 画面明細へのデータバインド処理をここに記述します。


            //バリデーションを実行します。
            SearchInputDialog.detail.validateList(true);
        };

        /**
         * 明細の各行にデータを設定する際のオプションを定義します。
         */
        SearchInputDialog.detail.options.bindOption = {
            // TODO: 主キーが直接入力の場合には、修正の場合変更を不可とします。
            //appliers: {
            //    no_seq: function (value, element) {
            //        element.val(value);
            //        element.prop("readonly", true).prop("tabindex", -1);
            //        return true;
            //    }
            //}
        };

        /**
         * 一覧から行を選択された際の処理を実行します。（単一セレクト用）
         */
<%--        SearchInputDialog.detail.selectData = function (e) {
            var target = $(e.target),
                id, entity,
                selectData = function (entity) {
                    if (App.isFunc(SearchInputDialog.dataSelected)) {
                        if (!SearchInputDialog.dataSelected(entity)) {
                            SearchInputDialog.element.modal("hide");
                        }
                    } else {
                        SearchInputDialog.element.modal("hide");
                    }
                };

            SearchInputDialog.detail.dataTable.dataTable("getRow", target, function (row) {
                id = row.element.attr("data-key");
                entity = SearchInputDialog.detail.data.entry(id);
            });

            if (App.isUndef(id)) {
                return;
            }
            if (SearchInputDialog.detail.data.isUpdated(id)) {
                var options = {
                    text: App.messages.base.MS0024
                };
                SearchInputDialog.dialogs.confirmDialog.confirm(options)
                    .then(function () {
                        selectData(entity);
                    });
            } else {
                selectData(entity);
            }
        }; --%>

        /**
         * 明細の一覧の行が選択された時の処理を行います。
         */
        SearchInputDialog.detail.select = function (e, row) {
            $($(row.element[SearchInputDialog.detail.fixedColumnIndex]).closest("table")[0].querySelectorAll(".select-tab.selected")).removeClass("selected").addClass("unselected");
            $(row.element[SearchInputDialog.detail.fixedColumnIndex].querySelectorAll(".select-tab")).removeClass("unselected").addClass("selected");

            //選択行全体に背景色を付ける場合は以下のコメントアウトを解除します。
            //if (!App.isUndefOrNull(SearchInputDialog.detail.selectedRow)) {
            //    SearchInputDialog.detail.selectedRow.element.find(".selected-row").removeClass("selected-row");
            //}
            //row.element.find("tr").addClass("selected-row");
            //SearchInputDialog.detail.selectedRow = row;
        };

        /**
         * 明細の一覧の入力項目の変更イベントの処理を行います。
         */
        SearchInputDialog.detail.change = function (e, row) {
            var target = $(e.target),
                id = row.element.attr("data-key"),
                property = target.attr("data-prop"),
                entity = SearchInputDialog.detail.data.entry(id),
                options = {
                    filter: SearchInputDialog.detail.validationFilter
                };

            SearchInputDialog.values.isChangeRunning[property] = true;

            SearchInputDialog.detail.executeValidation(target, row)
            .then(function () {
                entity[property] = row.element.form().data()[property];
                SearchInputDialog.detail.data.update(entity);

                if (SearchInputDialog.element.find(".save").is(":disabled")) {
                    SearchInputDialog.element.find(".save").prop("disabled", false);
                }

                //入力行の他の項目のバリデーション（必須チェック以外）を実施します
                SearchInputDialog.detail.executeValidation(row.element.find(":input"), row, options);
            }).always(function () {
                delete SearchInputDialog.values.isChangeRunning[property];
            });
        };

        /**
         * 明細の一覧に新規データを追加します。
         */
        SearchInputDialog.detail.addNewItem = function () {
            //TODO:新規データおよび初期値を設定する処理を記述します。
            var newData = {
                //no_seq: page.values.no_seq
            };

            SearchInputDialog.detail.data.add(newData);
            SearchInputDialog.detail.dataTable.dataTable("addRow", function (row) {
                row.form(SearchInputDialog.detail.options.bindOption).bind(newData);
                return row;
            }, true);

            if (SearchInputDialog.element.find(".save").is(":disabled")) {
                SearchInputDialog.element.find(".save").prop("disabled", false);
            }
        };

        /**
         * 明細の一覧で選択されている行とデータを削除します。
         */
        SearchInputDialog.detail.deleteItem = function (e) {
            var element = SearchInputDialog.detail.element,
                selected = element.find(".datatable .select-tab.selected").closest("tbody");

            if (!selected.length) {
                return;
            }

            SearchInputDialog.detail.dataTable.dataTable("deleteRow", selected, function (row) {
                var id = row.attr("data-key"),
                    newSelected;

                row.find(":input").each(function (i, elem) {
                    SearchInputDialog.notifyAlert.remove(elem);
                });

                if (!App.isUndefOrNull(id)) {
                    var entity = SearchInputDialog.detail.data.entry(id);
                    SearchInputDialog.detail.data.remove(entity);
                }

                newSelected = row.next().not(".item-tmpl");
                if (!newSelected.length) {
                    newSelected = row.prev().not(".item-tmpl");
                }
                if (newSelected.length) {
                    for (var i = SearchInputDialog.detail.fixedColumnIndex; i > -1; i--) {
                        if ($(newSelected[i]).find(":focusable:first").length) {
                            $(newSelected[i]).find(":focusable:first").focus();
                            break;
                        }
                    }
                }
            });

            if (SearchInputDialog.element.find(".save").is(":disabled")) {
                SearchInputDialog.element.find(".save").prop("disabled", false);
            }

        };

         /**
         * 明細のバリデーションを実行します。
         */
        SearchInputDialog.detail.executeValidation = function (targets, row, options) {
            var defaultOptions = {
                targets: targets,
                state: {
                    tbody: row,
                    isGridValidation: true
                }
            },
                execOptions = $.extend(true, {}, defaultOptions, options);

            return SearchInputDialog.detail.validator.validate(execOptions);
        };

        /**
         * 明細のバリデーションフィルターを設定します。（必須チェックを行わない）
         */
        SearchInputDialog.detail.validationFilter = function (item, method, state, options) {
            return method !== "required";
        };

        /**
         * 明細の一覧全体のバリデーションを実行します。
         */
        SearchInputDialog.detail.validateList = function (suppressMessage) {
            var validations = [],
                options = {
                    state: {
                        suppressMessage: suppressMessage,
                    }
                };

            SearchInputDialog.detail.dataTable.dataTable("each", function (row, index) {
                validations.push(SearchInputDialog.detail.executeValidation(row.element.find(":input"), row.element, options));
            });

            return App.async.all(validations);
        };

    </script>

    <div class="modal fade wide" tabindex="-1" id="SearchInputDialog">
    <div class="modal-dialog" style="max-height: 85%; width: 55%;">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title">TODO: ダイアログのタイトルを設定します。</h4>
            </div>

            <div class="modal-body">
                <div class="modal-wrap">
                    <div class="header">
                        <div class="search-criteria">
                            <!--TODO: 検索条件を定義するHTMLをここに記述します。-->
<%--                            <div class="row">
                                <div class="control-label col-xs-3">
                                    <label>取引先名</label>
                                </div>
                                <div class="control col-xs-9">
                                    <input type="text" data-prop="nm_torihiki" />
                                </div>
                            </div>--%>
                        </div>
                        <div style="position: relative; height: 50px;">
                            <button type="button" style="position: absolute; right: 5px; top: 5px;" class="btn btn-sm btn-primary search">検索</button>
                        </div>
                    </div>
                    <div class="detail">
                        <div class="control-label toolbar">
                            <i class="icon-th"></i>
                            <div class="btn-group">
                                <button type="button" class="btn btn-default btn-xs add-item">追加</button>
                                <button type="button" class="btn btn-default btn-xs del-item">削除</button>
                            </div>
                            <span class="data-count">
                                <span data-prop="data_count"></span>
                                <span>/</span>
                                <span data-prop="data_count_total"></span>
                            </span>
                        </div>
                        <table class="datatable">
                            <!--TODO: 明細一覧のヘッダーを定義するHTMLをここに記述します。-->
                            <thead>
                                <tr>
                                <!--TODO: 単一行を作成する場合は、下記を利用します。-->
                                    <th style="width: 10px;"></th>
                                <!--TODO: 多段行を作成する場合は、以下を利用し、上記１行は削除します。
                                    <th rowspan="2" style="width: 10px"></th>
                       	        </tr>
                                <tr>
                                -->
                                </tr>
                            </thead>
                            <!--TODO: 明細一覧の明細行を定義するHTMLをここに記述します。-->
                            <tbody class="item-tmpl" style="cursor: default; display: none;">
                                <tr>
                                <!--TODO: 単一行を作成する場合は、以下を利用します。-->
                                    <td>
                                        <span class="select-tab unselected"></span>
                                    </td>
                                <!--TODO: 多段行を作成する場合は、以下を利用し、上記３行は削除します。
                                    <td rowspan="2">
                                        <span class="select-tab-2lines unselected"></span>
                                    </td>
                                </tr>
                                <tr> -->
<%--                                    <td>
                                        <button class="btn btn-xs btn-success select">選択</button>
                                    </td>--%>
                                </tr>
                            </tbody>
                        </table>
                    </div>
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
                <button type="button" class="btn btn-success save" name="save" disabled="disabled">保存</button>
                <button type="button" class="cancel-button btn btn-sm btn-default" data-dismiss="modal" name="close">閉じる</button>
            </div>

        </div>
    </div>
    </div>