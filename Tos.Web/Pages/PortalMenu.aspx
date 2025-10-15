<%@ Page Title="999_ポータルメニュー" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="PortalMenu.aspx.cs" Inherits="Tos.Web.Pages.PortalMenu" %>
<%@ MasterType VirtualPath="~/Site.Master" %>

<asp:Content ID="IncludeContent" ContentPlaceHolderID="IncludeContent" runat="server">

    <link media="all" rel="stylesheet" href="<%=ResolveUrl("~/Content/part.css") %>" type="text/css" />
    <link media="all" rel="stylesheet" href="<%=ResolveUrl("~/Content/headerdetail.css") %>" type="text/css" />

    <script src="<%=ResolveUrl("~/Resources/portalmenu.ja.js") %>" type="text/javascript"></script>

</asp:Content>

<asp:Content ID="HeadContent" ContentPlaceHolderID="HeadContent" runat="server">

    <title></title>
    <style type="text/css">
    </style>

    <script type="text/javascript">

        /**
         * ページのレイアウト構造に対応するオブジェクトを定義します。
         */
        var page = App.define("PortalMenu", {
            //TODO: ページのレイアウト構造に対応するオブジェクト定義を記述します。
            options: {

            },
            values: {},
            urls: {
                news: "../api/SampleNews",
                kensu: "../api/SampleShinsei"
            },
            menu: {
                options: {},
                values: {},
                urls: {
                }
            },
            news: {
                options: {},
                values: {},
                url: {}
            },
            dialogs: {
            },
            commands: {}
        });

        /**
        * 画面の初期化処理を行います。
        */
        page.initialize = function () {

            App.ui.loading.show();


            page.initializeControl();
            page.initializeControlEvent();

            page.news.initialize();
            page.menu.initialize();

            App.ui.loading.close();
        };

        /**
         * 画面コントロールの初期化処理を行います。
         */
        page.initializeControl = function () {

            //TODO: 画面全体で利用するコントロールの初期化処理をここに記述します。
        };

        /**
         * コントロールへのイベントの紐づけを行います。
         */
        page.initializeControlEvent = function () {

            //TODO: 画面全体で利用するコントロールのイベントの紐づけ処理をここに記述します。
        };

        /**
         * ニュースエリアの初期化を行います。
         */
        page.news.initialize = function () {
            var element = $(".news");
            page.news.element = element;
            page.news.loadData();
        };

        /**
         * ニュースのロード処理を実行します。
         */
        page.news.loadData = function () {

            App.ui.loading.show();
            App.ui.page.notifyAlert.clear();

            return $.ajax(App.ajax.webapi.get(page.urls.news))
                .done(function (result) {
                    page.news.bind(result);

                }).fail(function (error) {
                    App.ui.page.notifyAlert.message(App.ajax.handleError(error).message).show();

                }).always(function () {
                    App.ui.loading.close();

                });
        };

        page.news.options.bindOption = {
            //appliers: {
            //    dt_news: function (value, element) {
            //        value = App.data.parseJsonDate(value);
            //        element.text(App.date.format(value, "yyyy-MM-dd"));
            //        return true;
            //    }
            //}
        };

        /**
         * ニュースのデータバインド処理を行います。
         */
        page.news.bind = function (data) {

            var i, l, item, dataSet, clone;

            data = (data.Items) ? data.Items : data;

            for (i = 0, l = data.length; i < l; i++) {
                item = data[i];
                clone = $(".news-tmpl").clone();

                if (item.level === "warning") {
                    clone.addClass("panel-warning");
                } else if (item.level === "danger") {
                    clone.addClass("panel-danger");
                } else if (item.level === "info") {
                    clone.addClass("panel-info");
                } else {
                    clone.addClass("panel-default");
                }
                //ニュース内容の改行を反映させるため、documentに要素を追加してから値を設定します。
                clone.appendTo(page.news.element).removeClass("news-tmpl").show();
                clone.form(page.news.options.bindOption).bind(item);
            }
        };

        /**
         * 画面メニューを定義します。
         */
        page.menu.initialize = function () {

            var element = $(".menu"),
                baseUrl = '<%=ResolveUrl("~/") %>';

            page.menu.element = element;

            //TODO: 画面メニューの初期化処理をここに記述します。
            App.ui.portalmenu.setup(App.ui.page.lang, App.ui.page.user.Roles, ".menu", baseUrl, App.ui.portalmenu.settingsObj);

            //TODO: 画面メニューで利用するコントロールのイベントの紐づけ処理をここに記述します。

        };

        /**
         * メニューボタン内に表示するデータを取得します
         */
        page.menu.loadData = function (target, systemNo) {
            $.ajax(App.ajax.webapi.get(page.urls.kensu, { "no_system": systemNo }))
            .done(function (result) {
                page.menu.bind(result, target);
            });
        };

        /**
         * メニューボタン内に付加情報のバインド処理を行います。
         */
        page.menu.bind = function (item, target) {
            var self = $(target);
            // TODO:項目作成時の処理を記述します
            var clone = $(".menuinfo-tmpl").clone();
            clone.form().bind(item);
            clone.appendTo(self).removeClass("menuinfo-tmpl").show();
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
        <!--TODO: メニューに差し込む一覧を表示する場合は、HTMLをここに記述します。-->
        <div style="display:none" class="menuinfo-tmpl">
            <table class="table table-condensed table-bordered" style="margin-bottom: 5px;margin-top:5px;">
                <tbody>
                    <tr>
                        <td>承認待ち件数</td>
                        <td><span data-prop="su_machi"></span> 件</td>
                    </tr>
                    <tr>
                        <td>承認済み件数</td>
                        <td><span data-prop="su_zumi"></span> 件</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="row">
            <div class="col-sm-4">
                <!-- お知らせ表示のコンテナー -->
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title">お知らせ</h3>
                    </div>
                    <div class="panel-body">
                        <div class="panel news-tmpl" style="display:none;">
                            <div class="panel-heading">
                                <h3 class="panel-title">
                                    <span data-prop="dt_news" class="data-app-format" data-app-format="date"></span>
                                    <span data-prop="nm_title"></span>
                                </h3>
                            </div>
                            <div class="panel-body">
                                <span data-prop="nm_content"></span>
                            </div>
                        </div>
                        <div class="news"></div>
                    </div>
                </div>
            </div>
            <div class="col-sm-8">
                <!-- メニュー表示のコンテナー -->
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title">メニュー</h3>
                    </div>
                    <div class="panel-body">
                        <div class="menu"></div>
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
        <!--TODO: コマンドボタンを定義するHTMLをここに記述します。-->
    </div>

</asp:Content>

<asp:Content ID="DialogsContent" ContentPlaceHolderID="DialogsContent" runat="server">

    <!--TODO: ダイアログを定義するHTMLをここに記述します。-->

</asp:Content>
