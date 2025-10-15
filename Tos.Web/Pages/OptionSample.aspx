<%@ Page Title="999_ヘッダー＋明細（伝票入力）単一行" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="OptionSample.aspx.cs" Inherits="Tos.Web.Pages.OptionSample" %>
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
    <title></title>
    <style type="text/css">
        .part td .center
        {
            text-align: center;
        }

        .part-command .money
        {
            border: 1px solid #cccccc;
            background-color: #ffffff;
            font-weight: bold;
            font-size: 10pt;
        }

    </style>

    <script type="text/javascript">

        /**
         * ページのレイアウト構造に対応するオブジェクトを定義します。
         */
        var page = App.define("OptionSample", {
            //TODO: ページのレイアウト構造に対応するオブジェクト定義を記述します。
            options: {},
            values: {
                isChangeRunning: {}
            },
            urls: {
                mitsumori: "../api/SampleMitsumori",
                mitsumoriRemove: "../api/SampleMitsumori/Remove",
                Fixed: "../api/SampleFixed",
                searchDialog: "Dialogs/SearchDialog.aspx",
                buhinDialog: "Dialogs/BuhinDialog.aspx",
                confirmDialog: "Dialogs/ConfirmDialog.aspx",
            },
            header: {
                options: {},
                values: {},
                urls: {
                    shiharaiJoken: "../Services/SampleService.svc/ShiharaiJoken",
                    torihiki: "../Services/SampleService.svc/Torihiki"
                }
            },
            detail: {
                options: {},
                values: {}
            },
            fileAttach: {
                options: {},
                values: {},
                urls: {
                    tenpu: "../api/Tenpu",
                    tenpuList: "../api/Tenpu/GetList"
                }
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
         * 明細に1件以上追加されているかどうかを検証します。
         */
        page.validateListCount = function () {
            var rowCount = 0;
            page.detail.dataTable.dataTable("enableRowCount", function (length) {
                rowCount = length;
            });

            if (rowCount === 0) {
                App.ui.page.notifyAlert.message(App.messages.app.AP0002).show();
                return App.async.fail();
            }
            else if (rowCount > 999) {
                App.ui.page.notifyAlert.message(App.str.format(App.messages.app.AP0003, 999)).show();
                return App.async.fail();
            }

            return App.async.success();
        };

        /**
         * データの保存処理を実行します。
         */
        page.commands.save = function () {
            var file, maxUploadFileSize, message;

            App.ui.page.notifyWarn.clear();
            App.ui.page.notifyAlert.clear();
            App.ui.page.notifyInfo.clear();

            App.ui.loading.show();

            var sleep = 0;
            var condition = "Object.keys(page.values.isChangeRunning).length == 0";
            App.ui.wait(sleep, condition, 100)
            .then(function () {
                page.validateAll()
                .then(function () {
                    return page.validateListCount();
                }).then(function () {

                    var id = page.header.element.attr("data-key"),
                        entity = page.header.data.entry(id),
                        changeSets;

                    page.header.data.update(entity);

                    // 明細に表示順で番号をセットする
                    page.detail.dataTable.dataTable("eachSorted", function (row, index) {
                        id = row.element.attr("data-key"),
                        entity = page.detail.data.entry(id);
                        entity["no_komoku"] = index;
                        page.detail.data.update(entity);
                    });

                    changeSets = {
                        Header: page.header.data.getChangeSet(),
                        Detail: page.detail.data.getChangeSet(),
                        FileAttach: page.fileAttach.data.getChangeSet()
                    };

                    //TODO: データの保存処理をここに記述します。
                    return $.ajax(App.ajax.webapi.post(page.urls.mitsumori, changeSets)).then(function (result) {

                        //TODO: データの保存成功時の処理をここに記述します。

                        if (result.Header) {
                            page.values.no_mitsumori = result.Header.no_mitsumori;
                        } else {
                            page.values.no_mitsumori = page.header.data.find(function () { return true; }).no_mitsumori;
                        }

                        //最後に再度データを取得しなおします。
                        return page.loadData();
                    }).then(function () {

                        if (page.fileAttach.options.uploadfiles.length > 0) {
                            //保存可能なファイルサイズかどうかの確認
                            maxUploadFileSize = <%= MaxUploadFileSize %>;
                            for (var i = 0; i < page.fileAttach.options.uploadfiles.length; i++) {
                                file = page.fileAttach.options.uploadfiles[i];
                                if (!App.isUndefOrNull(file.size) && file.size === 0) {
                                    message = App.str.format(App.messages.base.MS0022, {nm_file : file.name});
                                    App.ui.page.notifyAlert.message(message).show();
                                    return App.async.fail();
                                } else if (!App.isUndefOrNull(file.size) && Math.floor(file.size/1024) > maxUploadFileSize) {
                                    message = App.str.format(App.messages.base.MS0023, {size: maxUploadFileSize,  nm_file : file.name});
                                    App.ui.page.notifyAlert.message(message).show();
                                    return App.async.fail();
                                }
                            }

                            return $.ajax(App.ajax.file.upload(page.fileAttach.urls.tenpu + "?no_mitsumori=" + page.values.no_mitsumori, page.fileAttach.options.uploadfiles));
                        } else {
                            return App.async.success();
                        }
                    }).then(function (response, status, xhr) {

                        App.ui.page.notifyInfo.message(App.messages.base.MS0002).show();
                        if (page.fileAttach.options.uploadfiles.length > 0) {
                            App.ui.page.notifyInfo.message(App.messages.base.uploadsuccess).show();
                        }
                        return page.loadFileAttach();
                    }).fail(function (error) {

                        if (!App.isUndefOrNull(error) && error.status === App.settings.base.conflictStatus) {
                            // TODO: 同時実行エラー時の処理を行っています。
                            // 既定では、メッセージを表示し、現在の入力情報を切り捨ててサーバーの最新情報を取得しています。
                            page.loadData().done(function () {
                                page.loadFileAttach();
                            });
                            App.ui.page.notifyAlert.clear();
                            App.ui.page.notifyAlert.message(App.messages.base.MS0009).show();
                            return;
                        }

                        //TODO: データの保存失敗時の処理をここに記述します。
                        if (!App.isUndefOrNull(error) && error.status === App.settings.base.validationErrorStatus) {

                            var errors = error.responseJSON;
                            $.each(errors, function (index, err) {
                                App.ui.page.notifyAlert.message(
                                    err.Message +
                                    (App.isUndefOrNull(err.InvalidationName) ? "" : err.Data[err.InvalidationName])
                                ).show();
                            });
                            return;
                        }

                        if (!App.isUndefOrNull(error)) {
                            App.ui.page.notifyAlert.message(App.ajax.handleError(error).message).show();
                        }
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
         * データの削除処理を実行します。
         */
        page.commands.remove = function () {
            var options = {
                text: App.messages.base.MS0003
            };

            page.dialogs.confirmDialog.confirm(options)
            .then(function () {

                var id = page.header.element.attr("data-key"),
                    entity = page.header.data.entry(id),
                    changeSets;

                entity.flg_del = true;
                page.header.data.update(entity);
                changeSets = page.header.data.getChangeSet();

                App.ui.loading.show();

                //TODO: データの削除処理をここに記述します。
                $.ajax(App.ajax.webapi.post(page.urls.mitsumoriRemove, changeSets))
                .done(function (result) {

                    App.ui.page.notifyAlert.clear();
                    App.ui.page.notifyInfo.clear();

                    App.ui.page.notifyInfo.message(App.messages.base.MS0008).show();

                    setTimeout(function () {
                        //TODO: 画面遷移処置をここに記述します。 
                        //既定の処理では、次画面の新規登録の状態に画面遷移します。
                        $(window).off("beforeunload");
                        var paramIndex = top.location.href.indexOf('?');
                        var shortURL = paramIndex < 0 ? window.location.href : window.location.href.substring(0, paramIndex);
                        window.location = shortURL;

                    }, 100);

                }).fail(function (error) {
                    //TODO: データの削除失敗時の処理をここに記述します。
                    App.ui.page.notifyAlert.message(App.ajax.handleError(error).message).show();

                }).always(function () {
                    setTimeout(function () {
                        page.header.element.find(":input:first").focus();
                    }, 100);
                    App.ui.loading.close();
                });
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
         * Window を閉じる際のイベントを定義します。
         * @return 文字列を返却した場合に確認メッセージが表示されます。
         */
        App.ui.page.onclose = function () {

            var header, detail,
                closeMessage = App.messages.base.exit;

            if (page.header.data) {
                header = page.header.data.getChangeSet();
                if (header.created.length || header.updated.length || header.deleted.length) {
                    return closeMessage;
                }
            }
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

            //TODO: URLパラメーターで渡された値を取得し、保持する処理を記述します。
            if (!App.isUndefOrNull(App.uri.queryStrings.no_mitsumori)) {
                page.values.no_mitsumori = parseFloat(App.uri.queryStrings.no_mitsumori);
            } else {
                page.values.no_mitsumori = 0;
            }

            if (!App.isUndefOrNull(App.uri.queryStrings.no_fixed)) {
                page.values.no_fixed = parseFloat(App.uri.queryStrings.no_fixed);
            } else {
                page.values.no_fixed = 0;
            }

            page.initializeControl();
            page.initializeControlEvent();

            page.header.initialize();
            page.detail.initialize();

            //TODO: ヘッダー/明細以外の初期化の処理を記述します。
            page.fileAttach.initialize();

            page.loadMasterData().then(function (result) {
                return page.loadDialogs();

            }).then(function (result) {
                return page.loadData();

            }).then(function (result) {
                //TODO: 画面の初期化処理成功時の処理を記述します。
                return page.loadFileAttach();

            }).fail(function (error) {

                if (error.status === 404) {
                    App.ui.page.notifyWarn.message(App.ajax.handleError(error).message).show();
                }
                else {
                    App.ui.page.notifyAlert.message(App.ajax.handleError(error).message).show();
                }

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
            $("#save").on("click", page.commands.save);
            $("#remove").on("click", page.commands.remove);
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
                    result.value
                );
            });
        };

        /**
         * 共有のダイアログのロード処理を実行します。
         */
        page.loadDialogs = function () {

            return App.async.all({

                searchDialog: $.get(page.urls.searchDialog),
                buhinDialog: $.get(page.urls.buhinDialog),
                confirmDialog: $.get(page.urls.confirmDialog)

            }).then(function (result) {
                $("#dialog-container").append(result.successes.searchDialog);
                page.dialogs.searchDialog = SearchDialog;
                page.dialogs.searchDialog.initialize();

                //検索ダイアログで選択が実行された時に呼び出される関数を設定しています。
                page.dialogs.searchDialog.dataSelected = page.header.setTorihiki;

                $("#dialog-container").append(result.successes.buhinDialog);
                page.dialogs.buhinDialog = BuhinDialog;
                page.dialogs.buhinDialog.initialize();

                $("#dialog-container").append(result.successes.confirmDialog);
                page.dialogs.confirmDialog = ConfirmDialog;
            });

        };

        /**
         * 画面で処理の対象とするデータのロード処理を実行します。
         */
        page.loadData = function () {

            if (!page.values.no_mitsumori && page.values.no_fixed) {

                //TODO: 定型データを取得し、画面にバインドする処理を記述します。
                return $.ajax(App.ajax.webapi.get(page.urls.Fixed, { no_fixed: page.values.no_fixed }))
                    .fail(function(result){
                        if (result.status === 404) {
                            page.values.no_fixed = undefined;

                            page.header.bind({}, true);
                            page.detail.bind([], true);
                            return App.async.success();
                        }
                    }).then(function (result) {

                        page.header.bind(result.Header, true);
                        // パーツ開閉の判断
                        if (page.detail.isClose) {
                            // 検索データの保持
                            page.detail.searchData = {"data" : result.Detail, "isNew": true };
                        } else {
                            // データバインド
                            page.detail.bind(result.Detail, true);
                        }

                        var url = page.header.urls.torihiki + "?$filter=cd_torihiki eq " + page.header.element.form().data().cd_torihiki;
                        return $.ajax(App.ajax.odata.get(url));

                    }).then(function (result) {
                        if (result && result.value) {
                            page.header.element.findP("nm_torihiki").text(result.value[0].nm_torihiki);
                        }
                    });
            }

            if (!page.values.no_mitsumori) {
                page.header.bind({}, true);
                page.detail.bind([], true);
                return App.async.success();
            }

            //TODO: 画面内の処理の対象となるデータを取得し、画面にバインドする処理を記述します。

            return $.ajax(App.ajax.webapi.get(page.urls.mitsumori, { no_mitsumori: page.values.no_mitsumori }))
            .fail(function(result){
                if (result.status === 404) {
                    page.header.bind({}, true);
                    page.detail.bind([], true);
                    return App.async.success();
                }
            }).then(function (result) {
                $("#remove").show();

                page.header.bind(result.Header);
                // パーツ開閉の判断
                if (page.detail.isClose) {
                    // 検索データの保持
                    page.detail.searchData = { "data": result.Detail, "isNew": false };
                } else {
                    // データバインド
                    page.detail.bind(result.Detail);
                }

                var url = page.header.urls.torihiki + "?$filter=cd_torihiki eq " + page.header.element.form().data().cd_torihiki;
                return $.ajax(App.ajax.odata.get(url));

            }).then(function (result) {
                if (result && result.value && result.value.length) {
                    page.header.element.findP("nm_torihiki").text(result.value[0].nm_torihiki);
                }
            });
        };

        /**
         * 画面で処理の対象とする添付ファイルデータのロード処理を実行します。
         */
        page.loadFileAttach = function () {
            if (page.values.no_mitsumori) {
                return $.ajax(App.ajax.webapi.get(page.fileAttach.urls.tenpuList, { no_mitsumori: page.values.no_mitsumori }))
                .then(function (result) {
                    page.fileAttach.bind(result);
                });
            } else {
                page.fileAttach.bind([], true);
                return App.async.success();
            }
        };

        /**
         * 画面ヘッダーのバリデーションを定義します。
         */
        page.header.options.validations = {
            //TODO: 画面ヘッダーのバリデーションの定義を記述します。
            cd_torihiki: {
                rules: {
                    required: true,
                    digits: true,
                    equallength: 6,
                    nm_torihiki_required: function (value, opts, state, done) {
                        if (!App.isUndefOrNull(state) && state.isChange) {
                            done(true);
                        } else {
                            done(page.header.element.findP("nm_torihiki").text() !== "");
                        }
                    }
                },
                options: {
                    name: "取引先コード",
                },
                messages: {
                    required: App.messages.base.required,
                    digits: App.messages.base.digits,
                    equallength: App.messages.base.equallength,
                    nm_torihiki_required: App.messages.base.MS0015
                }
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
                    maxlength: App.messages.base.maxlength
                }
            }
        };

        /**
         * 画面ヘッダーの初期化処理を行います。
         */
        page.header.initialize = function () {

            var element = $(".header");

            // TODO: テキストボックスに入力されたコード値を元にサービスによる検索を実行し、値に一致するデータを取得します。
            element.findP("cd_torihiki").complete({
                textLength: 6,
                ajax: function (val) {
                    return $.ajax(App.ajax.odata.get(page.dialogs.searchDialog.urls.torihiki + "(" + val + ")"), { async: false });
                },
                success: page.header.setTorihiki,
                error: page.header.failTorihiki,
                clear: page.header.clearTorihiki
            });

            page.header.validator = element.validation(page.createValidator(page.header.options.validations));
            element.on("change", ":input", page.header.change);
            page.header.element = element;

            //TODO: 画面ヘッダーの初期化処理をここに記述します。
            //TODO: 画面ヘッダーで利用するコントロールのイベントの紐づけ処理をここに記述します。
            element.on("click", ".torihiki-select", page.header.showSearchDialog);

        };

        /**
         * 画面ヘッダーへのデータバインド処理を行います。
         */
        page.header.bind = function (data, isNewData) {

            var element = page.header.element,
                dataSet = App.ui.page.dataSet();

            page.header.data = dataSet;

            (isNewData ? dataSet.add : dataSet.attach).bind(dataSet)(data);

            page.header.element.form().bind(data);

            if (isNewData && !page.values.no_fixed) {
                //TODO: 新規データの場合の処理を記述します。
                //ドロップダウンなど初期値がある場合は、
                //DataSetに値を反映させるために change 関数を呼び出します。
                element.findP("cd_shiharai").change();
            } else {
                element.findP("cd_torihiki").change();
            }
                        
            //バリデーションを実行します。
            page.header.validator.validate({
                state: {
                    suppressMessage: true
                }
            });
        };

        /**
         * 画面ヘッダーにある入力項目の変更イベントの処理を行います。
         */
        page.header.change = function (e) {
            var element = page.header.element,
                target = $(e.target),
                id = element.attr("data-key"),
                property = target.attr("data-prop"),
                entity = page.header.data.entry(id),
                data = element.form().data();

            page.values.isChangeRunning[property] = true;

            element.validation().validate({
                state: { isChange: true },
                targets: target
            }).then(function () {
                entity[property] = data[property];
                page.header.data.update(entity);
            }).always(function () {
                delete page.values.isChangeRunning[property];
            });
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
        page.header.setTorihiki = function (data, $element) {
            // TODO: エンティティの更新を明示的に実行します。
            var id = page.header.element.attr("data-key"),
                entity = page.header.data.entry(id),
                target = page.header.element.findP("cd_torihiki");

            page.header.element.findP("cd_torihiki").val(data.cd_torihiki);
            page.header.element.findP("nm_torihiki").text(data.nm_torihiki);

            entity.cd_torihiki = data.cd_torihiki;
            page.header.data.update(entity);

            page.header.validator.validate({
                targets: target
            });
        };

        /**
         * 画面ヘッダーにある取引先コードの値をクリアします。
         */
        page.header.failTorihiki = function (error, $element) {
            page.header.clearTorihiki($element);
        };

        /**
         * 画面ヘッダーにある取引先コードの値をクリアします。
         */
        page.header.clearTorihiki = function ($element) {
            page.header.element.findP("nm_torihiki").text("");

            page.header.validator.validate({
                targets: $element
            });
        };

        /**
         * 画面明細のバリデーションを定義します。
         */
        page.detail.options.validations = {
            //TODO: 画面明細のバリデーションの定義を記述します。}
            cd_buhin: {
                rules: {
                    required: true,
                    integer: true,
                    range: [1, 9999],
                    nm_komoku_required: function (value, opts, state, done) {
                        if (!App.isUndefOrNull(state) && state.isChange && page.values.isChangeRunning["cd_buhin"]) {
                        } else {
                            if (!!value) {
                                var $tbody = state.tbody.element ? state.tbody.element : state.tbody;
                                done($tbody.findP("nm_komoku").text() !== "");
                                return;
                            }
                        }
                        done(true);
                    }
                },
                options: {
                    name: "部品コード"
                },
                messages: {
                    required: App.messages.base.required,
                    integer: App.messages.base.integer,
                    nm_komoku_required: App.messages.base.MS0015,
                    range: App.messages.base.range
                }
            },
            su_suryo: {
                rules: {
                    required: true,
                    integer: true,
                    range: [1, 9999]
                },
                options: {
                    name: "数量"
                },
                messages: {
                    required: App.messages.base.required,
                    integer: App.messages.base.integer,
                    range: App.messages.base.range
                }
            },
            kin_shiire_tanka: {
                rules: {
                    required: true,
                    number: true,
                    pointlength: [11, 2, true]
                },
                options: {
                    name: "仕入単価"
                },
                messages: {
                    required: App.messages.base.required,
                    number: App.messages.base.number,
                    pointlength:App.messages.base.pointlength
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
                    height: 280,
                    //列固定横スクロールにする場合は、下記3行をコメント解除
                    //fixedColumn: true,                //列固定の指定
                    //fixedColumns: 2,                  //固定位置を指定（左端を0としてカウント）
                    //innerWidth: 1200,                 //可動列の合計幅を指定
                    //TODO: データテーブルでソート機能を利用しない場合はfalseを指定します。
                    sortable: true,
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

            // 明細パートオープン時の処理を指定します。
            element.find(".part").on("expanded.aw.part", function () {
                page.detail.isClose = false;
                if (page.detail.searchData) {
                    App.ui.loading.show();
                    setTimeout(function () {
                        page.detail.bind(page.detail.searchData.data, page.detail.searchData.isNew);
                        page.detail.searchData = undefined;
                        App.ui.loading.close();
                    }, 5);
                };
            });

            // 明細パートクローズ時の処理を指定します。
            element.find(".part").on("collapsed.aw.part", function () {
                page.detail.isClose = true;
            });

            //TODO: 画面明細の初期化処理をここに記述します。

            //TODO: 画面明細で利用するコントロールのイベントの紐づけ処理をここに記述します。
            table.on("click", ".buhin-select", page.detail.showBuhinDialog);
        };

        /**
         * 画面明細へのデータバインド処理を行います。
         */
        page.detail.bind = function (data, isNewData) {
            var element = page.detail.element,
                dataSet = App.ui.page.dataSet();

            page.detail.data = dataSet;

            page.detail.dataTable.dataTable("clear");

            page.detail.dataTable.dataTable("addRows", data, function (row, item) {
                (isNewData ? dataSet.add : dataSet.attach).bind(dataSet)(item);
                row.form().bind(item);
                row.findP("cd_buhin").complete({
                    textLength: 5,
                    ajax: function (val) {
                        return $.ajax(App.ajax.odata.get(page.dialogs.buhinDialog.urls.buhin + "(" + val + ")"), { async: false });
                    },
                    success: page.detail.setBuhin,
                    error: page.detail.setBuhinFail,
                    clear: page.detail.clearBuhin
                });

                return row;
            }, true);

            //TODO: 画面明細へのデータバインド処理をここに記述します。

            //バリデーションを実行します。
            page.detail.validateList(true);

            //TODO:合計計算用の処理です。不要な場合は削除してください。
            page.detail.calculate();

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
         * 画面明細の一覧の入力項目の変更イベントの処理を行います。
         */
        page.detail.change = function (e, row) {
            var target = $(e.target),
                id = row.element.attr("data-key"),
                property = target.attr("data-prop"),
                entity = page.detail.data.entry(id),
                options = {
                    state: { isChange: true },
                    filter: page.detail.validationFilter
                };

            page.values.isChangeRunning[property] = true;

            page.detail.executeValidation(target, row, { state: { isChange: true } })
            .then(function () {
                entity[property] = row.element.form().data()[property];
                page.detail.data.update(entity);

                if (target.hasClass("comma-number")) {
                    target.val(App.data.getCommaNumberString(row.element.form().data()[property]));
                }
                else if (target.hasClass("currency-jp")) {
                    target.val(App.data.getCurrencyJpString(row.element.form().data()[property]));
                }

                //入力行の他の項目のバリデーション（必須チェック以外）を実施します
                page.detail.executeValidation(row.element.find(":input"), row, options);
            }).always(function () {
                delete page.values.isChangeRunning[property];
                //TODO:合計計算用の処理です。不要な場合は削除してください。
                page.detail.calculate();
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
                tbody.form().bind(newData);
                // TODO: テキストボックスに入力されたコード値を元にサービスによる検索を実行し、値に一致するデータを取得します。
                tbody.findP("cd_buhin").complete({
                    textLength: 5,
                    ajax: function (val) {
                        return $.ajax(App.ajax.odata.get(page.dialogs.buhinDialog.urls.buhin + "(" + val + ")"), { async: false });
                    },
                    success: page.detail.setBuhin,
                    error: page.detail.setBuhinFail,
                    clear: page.detail.clearBuhin
                });
                return tbody;
            }, true);
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

            //TODO:合計計算用の処理です。不要な場合は削除してください。
            page.detail.calculate();
        };

        /**
         * 画面明細の一覧に対して、選択行の前に新規データを挿入します。
         */
        page.detail.insertNewItemBefore = function () {
            //TODO:新規データおよび初期値を設定する処理を記述します。
            var newData = {
                no_mitsumori: page.values.no_mitsumori
            };

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

            // 新規データを挿入（後）
            page.detail.insertRow(newData, true, true);
        };

        /**
        * 画面明細の一覧に、選択行の後に新しい行を挿入します。
        */
        page.detail.insertRow = function (newData, isFocus, isInsertAfter) {
            var element = page.detail.element,
                selected = element.find(".datatable .select-tab.selected").closest("tbody");

            if (!selected.length) {
                // 選択行が無ければこれまでどおり追加
                page.detail.addNewItem();
                return;
            }

            page.detail.data.add(newData);
            page.detail.dataTable.dataTable("insertRow", selected, isInsertAfter, function (tbody) {
                tbody.form().bind(newData);

                // TODO: テキストボックスに入力されたコード値を元にサービスによる検索を実行し、値に一致するデータを取得します。
                tbody.findP("cd_buhin").complete({
                    textLength: 5,
                    ajax: function (val) {
                        return $.ajax(App.ajax.odata.get(page.dialogs.buhinDialog.urls.buhin + "(" + val + ")"), { async: false });
                    },
                    success: page.detail.setBuhin,
                    error: page.detail.setBuhinFail,
                    clear: page.detail.clearBuhin
                });
                return tbody;
            }, isFocus);

        };

        /**
         * 画面明細にある部品コードに値を設定します。
         */
        page.detail.setBuhin = function (data, $element) {
            var tbody = $element.closest("tbody"),
                row;
            page.detail.dataTable.dataTable("getRow", tbody, function (rowObject) {
                row = rowObject.element;
            });

            var target = row.findP("nm_komoku"),
                id = row.attr("data-key"),
                entity = page.detail.data.entry(id);

            target.text(data.nm_buhin);
            entity["cd_buhin"] = data.cd_buhin;
            entity["nm_komoku"] = data.nm_buhin;
            page.detail.data.update(entity);

            var options = { filter: page.detail.validationFilter };
            page.detail.executeValidation(row.find(":input"), row, options);
        };

        /**
         * 画面明細にある部品コードの値をクリアします。
         */
        page.detail.setBuhinFail = function (error, $element) {
            page.detail.clearBuhin($element);
        };

        /**
         * 画面明細にある部品コードの値をクリアします。
         */
        page.detail.clearBuhin = function ($element) {
            var tbody = $element.closest("tbody"),
                row;

            page.detail.dataTable.dataTable("getRow", tbody, function (rowObject) {
                row = rowObject.element;
            });

            var target = row.findP("nm_komoku"),
                id = row.attr("data-key"),
                entity = page.detail.data.entry(id);

            target.text("");
            entity["nm_komoku"] = "";
            page.detail.data.update(entity);

            var options = { filter: page.detail.validationFilter };
            page.detail.executeValidation(row.find(":input"), row, options);
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
            };
            options = $.extend(true, {}, defaultOptions, options);

            return page.detail.validator.validate(options);
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
                        suppressMessage: suppressMessage
                    }
                };

            page.detail.dataTable.dataTable("each", function (row) {
                validations.push(page.detail.executeValidation(row.element.find(":input"), row.element, options));
            });

            return App.async.all(validations);
        };

        //TODO: 以下の page.detail の各宣言は画面仕様ごとにことなるため、
        //不要の場合は削除してください。

        /**
         * 画面明細の一覧から部品選択ダイアログを表示します。
         */
        page.detail.showBuhinDialog = function (e) {
            var element = page.detail.element,
                target = $(e.target),
                tbody = target.closest("tbody"),
                row;

            page.detail.dataTable.dataTable("getRow", tbody, function(rowObject) {
                row = rowObject.element;
            });

            page.dialogs.buhinDialog.element.modal("show");

            //部品検索ダイアログで部品選択が実行された時に呼び出される関数を設定しています。
            page.dialogs.buhinDialog.dataSelected = function (data) {
                var suryo = row.findP("su_suryo"),
                    id = row.attr("data-key"),
                    entity = page.detail.data.entry(id);

                page.detail.values.suppressCalculate = true;
                row.findP("cd_buhin").val(data.cd_buhin);
                entity["cd_buhin"] = data.cd_buhin;
                page.detail.data.update(entity);

                row.findP("nm_komoku").text(data.nm_buhin);
                entity["nm_komoku"] = data.nm_buhin;
                row.findP("kin_shiire_tanka").val(data.kin_shiire).change();
                if (!suryo.val()) {
                    suryo.val(1).change();
                }

                delete page.dialogs.buhinDialog.dataSelected;
                page.detail.values.suppressCalculate = false;
                page.detail.calculate();
            }
        };

        /**
         * 画面明細の支払単価と数量をもとにした合計金額を計算し、表示します。
         */
        page.detail.calculate = function () {
            var items, suryo, tanka,
                total;

            if (page.detail.values.suppressCalculate) {
                return;
            }

            items = page.detail.data.findAll(function (item, entity) {
                return entity.state !== App.ui.page.dataSet.status.Deleted;
            });

            total = items.reduce(function (init, value) {
                suryo = App.isNum(value.su_suryo) ? value.su_suryo : 0;
                tanka = App.isNum(value.kin_shiire_tanka) ? value.kin_shiire_tanka : 0;
                return new BigNumber(init).plus(new BigNumber(suryo).times(tanka).round(0, BigNumber.ROUND_DOWN));
            }, 0);
    
            page.detail.element.find(".kei_shiire_kingaku").text(App.data.getCurrencyJpString(total.toString()));

        };

        /**
         * ファイルアップロード/ダウンロード部の初期化処理を実行します。
         */
        page.fileAttach.initialize = function () {
            var element = $("#file-attach");
            page.fileAttach.element = element;

            element.find(".file-attach-table").on("click", ".close", page.fileAttach.deleteItem);
            element.on("click", ".download", page.fileAttach.download);
            $(element.find(".drop-zone")).filedad({
                enableClickFileSelect: false,
                multiple: true
            }).on("selected", page.fileAttach.addItem);
        };

        /**
         * アップロードされたファイルの一覧を取得して表示します。
         */
        page.fileAttach.bind = function (data) {
            var element = page.fileAttach.element,
                table = element.find(".file-attach-table"),
                item, row;

            page.fileAttach.options.uploadfiles = [];
            page.fileAttach.data = App.ui.page.dataSet();

            page.fileAttach.data.attach(data);
            element.findP("file-attach-existence").text(App.settings.app.fileAttachNotExist);

            table.find("tbody > tr:visible").parent().remove();
            for (i = 0, l = data.length; i < l; i++) {
                item = data[i];
                row = table.find(".item-tmpl").not(".item-disp").clone();
                row.form().bind(item);
                row.appendTo(table).removeClass("item-tmpl").show();
            }

            if (data.length > 0) {
                element.findP("file-attach-existence").text(App.settings.app.fileAttachExist);
            }
        };

        /**
         * ファイル一覧部にファイルをドロップ時の処理を実行します。
         */
        page.fileAttach.addItem = function (e, args) {
            var existMessageKey = "fileexist",
                element = page.fileAttach.element,
                table, row, file, exist;

            if (!args.selectedFiles.length) {
                App.ui.page.notifyAlert.message(App.messages.base.selectfile).show();
                return;
            }

            App.ui.page.notifyAlert.remove(existMessageKey);
            for (var i = 0; i < args.selectedFiles.length; i++) {
                file = args.selectedFiles[i];
                if (page.fileAttach.validationFileNameLength(file.name)) {
                    var message = App.str.format(App.messages.base.MS0018, { byte: 200, length: 100 });
                    App.ui.page.notifyAlert.message(message, existMessageKey).show();
                    continue;
                }

                table = page.fileAttach.element.find(".file-attach-table");
                row = table.find(".item-tmpl.item-disp").clone();
                //同名のファイル名チェック
                exist = false;
                table.findP("nm_file").each(function (index, item) {
                    if ($(item).text() === file.name) {
                        exist = true;
                    }
                });

                if (exist) {
                    App.ui.page.notifyAlert.message(App.messages.base.fileexist, existMessageKey).show();
                } else {
                    page.fileAttach.options.uploadfiles.push(file);
                    row.findP("nm_file").text(file.name);
                    row.removeClass("item-tmpl").appendTo(table).show();
                }
            }
        };

        /**
         * ファイル名の長さチェック(200byte)
         */
        page.fileAttach.validationFileNameLength = function (fileName) {
            var iret = 0;

            for (var i = 0; i < fileName.length; ++i) {
                var c = fileName.charCodeAt(i);
                if ((c >= 0x0 && c < 0x81) || (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
                    iret = iret + 1;
                } else {
                    iret = iret + 2;
                }
            }

            return (iret > 200);
        };

        /**
         * ファイルアップロード/ダウンロード部の削除アイコン押下時の処理を実行します。
         */
        page.fileAttach.deleteItem = function (e) {
            var target = $(e.target),
                row = target.closest("tbody"),
                fileName, id, entity, file;

            id = row.attr("data-key");
            if (!App.validation.isEmpty(id)) {
                entity = page.fileAttach.data.entry(id);
                page.fileAttach.data.remove(entity);
            }

            fileName = row.findP("nm_file").text();
            for (var i = 0; i < page.fileAttach.options.uploadfiles.length; i++) {
                file = page.fileAttach.options.uploadfiles[i];
                if (file.name === fileName) {
                    page.fileAttach.options.uploadfiles.splice(i, 1);
                    return;
                }
            }

            row.remove();
        };

        /**
        * 添付ファイル名クリック時の処理を行います
        */
        page.fileAttach.download = function (e) {
            var id = $(e.target).closest("tbody").attr("data-key"),
                entity = page.fileAttach.data.entry(id);

            // ローディング表示
            App.ui.loading.show();

            // File出力（Ajax通信でファイルstreamを返却）
            return $.ajax(App.ajax.file.download(page.fileAttach.urls.tenpu + "?no_tenpu=" + entity.no_tenpu)
            ).then(function (response, status, xhr) {
                if (status !== "success") {
                    App.ui.page.notifyAlert.message(App.messages.base.MS0005).show();
                } else {
                    App.file.save(response, App.ajax.file.extractFileNameDownload(xhr) || "tempfile.dat");
                }
            }).fail(function (error) {
                App.ui.page.notifyAlert.message(App.ajax.handleError(error).message).show();

            }).always(function () {
                App.ui.loading.close();
            });
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

        <!--TODO: ヘッダーを定義するHTMLをここに記述します。-->
        <div class="header">
            <div title="基本情報" class="part">
                <div class="row">
                    <div class="control-label col-xs-1">
                        <label>見積番号</label>
                    </div>
                    <div class="control col-xs-1">
                        <label class="" data-prop="no_mitsumori"></label>
                    </div>
                    <div class="control-required-label col-xs-1">
                        <label>取引先</label>
                    </div>
                    <div class="control-required col-xs-1 with-next-col">
                        <input type="tel" data-prop="cd_torihiki" class="number-right number" />
                    </div>
                    <div class="control-required col-xs-3 with-next-col">
                        <label data-prop="nm_torihiki" style="white-space: nowrap;"></label>
                    </div>
                    <div class="control-required  col-xs-1">
                        <button type="button" class="btn btn-info btn-xs torihiki-select">選択</button>
                    </div>
                    <div class="control-label col-xs-1">
                        <label>代金支払条件</label>
                    </div>
                    <div class="control col-xs-3">
                        <select data-prop="cd_shiharai" class="number">
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="control-required-label col-xs-2">
                        <label>品名</label>
                    </div>
                    <div class="control-required col-xs-10">
                        <input type="text" class="ime-active" data-prop="nm_hinmei" />
                    </div>
                </div>
                <div class="row">
                    <div class="control-label col-xs-2">
                        <label>備考</label>
                    </div>
                    <div class="control col-xs-10">
                        <input type="text" class="ime-active" data-prop="biko" />
                    </div>
                </div>
            </div>
        </div>

        <!--TODO: 明細を定義するHTMLをここに記述します。-->
        <div class="detail">
            <div title="見積情報" class="part">
                <div class="control-label toolbar">
                    <i class="icon-th"></i>
                    <div class="btn-group">
                        <%--<button type="button" class="btn btn-default btn-xs" id="add-item">追加</button>--%>
                        <button type="button" class="btn btn-default btn-xs" id="insert-item-before">上に行追加</button>
                        <button type="button" class="btn btn-default btn-xs" id="insert-item-after">下に行追加</button>
                        <button type="button" class="btn btn-default btn-xs" id="del-item">削除</button>
                    </div>
                </div>
                <table class="datatable">
                    <thead>
                        <tr>
                            <th style="width: 10px;"></th>
                            <th class="number" data-prop="no_komoku" style="width: 50px;">No</th>
                            <th style="width: 40px;"></th>
                            <th style="width: 100px;">部品コード</th>
                            <th data-prop="nm_komoku">品名・型式・仕様</th>
                            <th style="width: 100px;">数量</th>
                            <th style="width: 160px;">仕入単価</th>
                        </tr>
                    </thead>
                    <tfoot>
                        <tr>
                            <td colspan="6"><span>合計金額</span></td>
                            <td style="width: 160px">
                                <label class="number-right kei_shiire_kingaku">0</label>
                            </td>
                        </tr>
                    </tfoot>
                    <tbody class="item-tmpl" style="cursor: default; display: none;">
                        <tr>
                            <td>
                                <span class="select-tab unselected"></span>
                            </td>
                            <td>
                                <span data-prop="no_komoku" class="number-right number" ></span>
                            </td>
                            <td class="center">
                                <button type="button" class="btn btn-info btn-xs buhin-select">部品</button>
                            </td>
                            <td>
                                <input type="tel" data-prop="cd_buhin" class="number-right number" />
                            </td>
                            <td>
                                <span data-prop="nm_komoku"></span>
                            </td>
                            <td>
                                <input type="tel" data-prop="su_suryo" class="number-right comma-number" />
                            </td>
                            <td>
                                <input type="tel" data-prop="kin_shiire_tanka" class="number-right comma-number" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- TODO: ファイル添付を定義するHTMLをここに記述します -->
        <div id="file-attach">
            <div title="見積書添付" class="part">
                <div class="drop-zone" style="max-height: 200px; min-height: 100px; overflow-y: auto;">
                    <table class="table table-hover table-condensed file-attach-table">
                        <thead>
                            <tr>
                                <th>添付ファイル一覧　※添付したいファイルをドラッグ＆ドロップしてください※</th>
                            </tr>
                        </thead>
                        <tfoot>
                            <tr>
                                <td></td>
                            </tr>
                        </tfoot>
                        <tbody class="item-tmpl" style="display: none">
                            <tr>
                                <td>
                                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                                    <a href="#" class="download" data-prop="nm_file"></a>
                                </td>
                            </tr>
                        </tbody>
                        <tbody class="item-tmpl item-disp" style="display: none">
                            <tr>
                                <td>
                                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                                    <span data-prop="nm_file"></span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="part-command">
                    <div style="vertical-align: top;">
                        <label style="padding-top: 6px; font-weight: bold" data-prop="file-attach-existence"></label>
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
        <button type="button" id="save" class="btn btn-sm btn-primary">保存</button>
        <button type="button" id="remove" style="display:none" class="btn btn-sm btn-default">削除</button>
    </div>
</asp:Content>
<asp:Content ID="DialogsContent" ContentPlaceHolderID="DialogsContent" runat="server">
    <div id="dialog-container"></div>
</asp:Content>
