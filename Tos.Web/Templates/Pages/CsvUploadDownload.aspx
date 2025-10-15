<%@ Page Title="TODO: 画面番号_画面名を設定します。" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="CsvUploadDownload.aspx.cs" Inherits="Tos.Web.Templates.Pages.CsvUploadDownload" %>
<%@ MasterType VirtualPath="~/Site.Master" %>
<%--created from 【CsvUploadDownload(Ver2.0)】 Template--%>

<asp:Content ID="IncludeContent" ContentPlaceHolderID="IncludeContent" runat="server">
    <link media="all" rel="stylesheet" href="<%=ResolveUrl("~/Content/part.css") %>" type="text/css" />
    <link media="all" rel="stylesheet" href="<%=ResolveUrl("~/Content/headerdetail.css") %>" type="text/css" />

    <% #if DEBUG %>
    <script src="<%=ResolveUrl("~/Scripts/part.js") %>" type="text/javascript"></script>
    <% #else %>
    <script src="<%=ResolveUrl("~/Scripts/part.min.js") %>" type="text/javascript"></script>
    <% #endif %>

</asp:Content>
<asp:Content ID="HeadContent" ContentPlaceHolderID="HeadContent" runat="server">
    <title></title>
    <style type="text/css">
    .drop-zone {
        border: 2px dashed #c5c5c5;
        text-align: center;
        position: relative;
        height: 100px;
    }

    </style>

    <script type="text/javascript">

        /**
         * ページのレイアウト構造に対応するオブジェクトを定義します。
         */
        var page = App.define("CsvUploadDownload", {
            //TODO: ページのレイアウト構造に対応するオブジェクト定義を記述します。
            options: {},
            values: {},
            urls: {},
            header: {
                options: {},
                values: {},
                urls: {}
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
                        next = $target.next();
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
                        next = $target.next();
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

            //TODO: ヘッダー/明細以外の初期化の処理を記述します。

            page.loadMasterData().then(function (result) {
                //TODO: 画面の初期化処理成功時の処理を記述します。
                return page.loadDialogs();
            }).fail(function (error) {
                App.ui.page.notifyAlert.message(App.ajax.handleError(error).message).show();

            }).always(function (result) {

                page.header.element.find("#download-select").focus();
                App.ui.loading.close();
            });
        };

        /**
         * 画面コントロールの初期化処理を行います。 
         */
        page.initializeControl = function () {
            // 共通コントロールの初期化処理
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

            var kbn_updownload = page.header.element.findP("kbn_updownload");
            kbn_updownload.children().remove();
            App.ui.appendOptions(
                kbn_updownload,
                "value",
                "title",
                App.settings.app/* 対象テーブル情報を記述した定数 */
            );

            return App.async.success();
        };

        /**
         * 共有ダイアログのロード処理を実行します。
         */
        page.loadDialogs = function () {

            return App.async.success();
        };

        /**
         * 画面ヘッダーのバリデーションを定義します。
         */
        page.header.options.validations = {
        };

        /**
         * 画面ヘッダーの初期化処理を行います。
         */
        page.header.initialize = function () {

            var element = $(".header");
            page.header.validator = element.validation(page.createValidator(page.header.options.validations));
            element.on("change", ":input", page.header.change);
            page.header.element = element;

            element.find("#download-btn").on("click", page.header.download);
            element.find(".drop-zone").filedad({
                enableClickFileSelect: true,
                multiple: false
            }).on("selected", page.header.upload);

            element.find("#upload-select").on("click", function (e) {
                element.find(".header-command").hide();
                element.find(".file-select").show();
                App.ui.page.notifyAlert.clear();
            });

            element.find("#download-select").on("click", function (e) {
                element.find(".header-command").show();
                element.find(".file-select").hide();
                App.ui.page.notifyAlert.clear();
            });
        };

        /**
         * データのアップロード処理を実行します。
         */
        page.header.upload = function (e, args) {
            var element = page.header.element,
                nm_table = element.findP("kbn_updownload").val(),
                file, extension;

            App.ui.page.notifyAlert.clear();

            if (!args.selectedFiles.length) {
                App.ui.page.notifyAlert.message(App.messages.base.selectfile).show();
                return;
            }

            file = args.selectedFiles[0];
            extension = file.name.split(".").pop().toLowerCase();
            if (extension !== "csv") {
                App.ui.page.notifyAlert.message(App.messages.base.csvonly).show();
                return;
            }

            // ローディング表示        
            App.ui.loading.show();

            $.ajax(App.ajax.file.upload(page.header.urls[nm_table], file))
                .then(function (response, status, xhr) {

                    App.ui.page.notifyInfo.message(App.messages.base.uploadsuccess).show();
                }).fail(function (error) {
                    if (error.responseType === "blob") {
                        App.file.save(error.response, App.ajax.file.extractFileNameDownload(error) || "CSVErrorFile.csv");
                        App.ui.page.notifyAlert.message(App.messages.base.uploaderror).show();
                    } else {
                        if (error.status === App.settings.base.validationErrorStatus) {
                            App.ui.page.notifyAlert.message(App.ajax.handleError(error).message).show();
                        } else {
                            App.ui.page.notifyAlert.message(App.messages.base.uploadServerError).show();
                        }
                    }
                }).always(function () {
                    App.ui.loading.close();
                });
        };

        /**
         * データのダウンロード処理を実行します。
         */
        page.header.download = function () {
            var element = page.header.element,
                nm_table = element.findP("kbn_updownload").val();

            App.ui.loading.show();
            App.ui.page.notifyAlert.clear();
            App.ui.page.notifyInfo.clear();

            page.options.filter = page.header.createFilter();

            var query = {
                url: page.header.urls[nm_table],
                filter: page.options.filter
            };

            // CSV出力（ファイルStreamでダウンロード）
            return $.ajax(App.ajax.file.download(App.data.toODataFormat(query))
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
        };

        /**
         * 検索条件のフィルターを定義します。
         */
        page.header.createFilter = function () {
            var criteria = page.header.element.form().data(),
                filters = [];

            //TODO: 画面で設定された検索条件を取得し、データ取得サービスのフィルターオプションを組み立てます。
            //if (!App.isUndefOrNull(criteria.cd_shiharai)) {
            //    filters.push("cd_shiharai eq " + criteria.cd_shiharai);
            //}
            //if (!App.isUndefOrNull(criteria.cd_torihiki) && criteria.cd_torihiki.length > 0) {
            //    filters.push("cd_torihiki eq " + criteria.cd_torihiki);
            //}
            //if (!App.isUndefOrNull(criteria.nm_hinmei) && criteria.nm_hinmei.length > 0) {
            //    filters.push("substringof('" + encodeURIComponent(criteria.nm_hinmei) + "', nm_hinmei) eq true");
            //}

            return filters.join(" and ");
        };

        /**
         * 画面ヘッダーにある入力項目の変更イベントの処理を行います。
         */
        page.header.change = function (e) {
            var element = page.header.element,
                target = $(e.target);

            element.validation().validate({
                targets: target
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
        <div class="header">
            <div title="データメンテナンス" class="part">
                <div class="row">
                    <div class="control-label col-xs-2">
                        <input type="radio" id="download-select" name="uploaddownload" checked />
                        <label for="download-select">ダウンロード</label>
                    </div>
                    <div class="control col-xs-2">
                            <input type="radio" id="upload-select" name="uploaddownload" style="margin-left: 15px;" />
                        <label for="upload-select">アップロード</label>
                    </div>
                </div>
                <div class="row">
                    <div class="control-label col-xs-2">
                        <label class="item-name">ファイル選択</label>
                    </div>
                    <div class="control col-xs-3">
                        <select data-prop="kbn_updownload"></select>
                    </div>
                </div>
                <div class="row file-select" style="display: none">
                    <div class="col-xs-8 drop-zone">
                            <div class="drop-description">
                                <p>ここにアップロードするファイルをドラッグ＆ドロップしてください。</p>
                            </div>
                        </div>
                </div>
<%--                <div class="row">
                    <div class="control-label col-xs-2">
                        <label>会社</label>
                    </div>
                    <div class="control col-xs-2">
                        <select data-prop="cd_kaisha"></select>
                    </div>
                </div>--%>
                <div class="header-command">
                    <button type="button" id="download-btn" class="btn btn-sm btn-primary">ダウンロード</button>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="FooterContent" ContentPlaceHolderID="FooterContent" runat="server">
    <div class="command">
    </div>
</asp:Content>
<asp:Content ID="DialogsContent" ContentPlaceHolderID="DialogsContent" runat="server">
    <div id="dialog-container"></div>
</asp:Content>
