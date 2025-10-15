<%@ Page Language="C#" Title="999_ツリーメニュー" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="TreeMenu.aspx.cs" Inherits="Tos.Web.Pages.TreeMenu" %>
<%@ MasterType VirtualPath="~/Site.Master" %>

<asp:Content ID="IncludeContent" ContentPlaceHolderID="IncludeContent" runat="server">
    <link media="all" rel="stylesheet" href="<%=ResolveUrl("~/Content/part.css") %>" type="text/css" />
    <link media="all" rel="stylesheet" href="<%=ResolveUrl("~/Content/headerdetail.css") %>" type="text/css" />
</asp:Content>

<asp:Content ID="HeadContent" ContentPlaceHolderID="HeadContent" runat="server">

    <style type="text/css">
    </style>

    <script type="text/javascript">

         /**
         * ページのレイアウト構造に対応するオブジェクトを定義します。
         */
        var page = App.define("TreeMenu", {
            //TODO: ページのレイアウト構造に対応するオブジェクト定義を記述します。
            options: {

            },
            values: {},
            urls: {
                news: "../api/SampleNews"
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

        page.news.initialize = function () {
            var element = $(".news");
            page.news.element = element;
            page.news.loadData();
        };

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
        * 画面メニューの初期化処理を定義します。
        */
        page.menu.initialize = function () {

            var element = $(".menu"),
                baseUrl = '<%=ResolveUrl("~/") %>';

            page.menu.element = element;

            //TODO: 画面メニューの初期化処理をここに記述します。
            App.ui.treemenu.setup(App.ui.page.lang, App.ui.page.user.Roles, ".menu", baseUrl, App.ui.ddlmenu.settingsObj);

            //TODO: 画面メニューで利用するコントロールのイベントの紐づけ処理をここに記述します。

            $("#closetree").on("click", page.menu.closeTree);
            $("#opentree").on("click", page.menu.openTree);
        };

        page.menu.closeTree = function (e) {
            page.menu.element.find("i.icon-minus").click();
        }

        page.menu.openTree = function (e) {
            page.menu.element.find("i.icon-plus").click();
        }

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
        <div class="row">
           <div class="col-sm-6">
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
            <div class="col-sm-6">
                <!-- メニュー表示のコンテナー -->
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title">メニュー
                            <span class="btn-group pull-right">
                                <button type="button" class="btn btn-xs btn-default" id="opentree">開く</button>
                                <button type="button" class="btn btn-xs btn-default" id="closetree">閉じる</button>
                            </span>
                        </h3>
                    </div>
                    <div class="panel-body">
                        <div class="menu">
                        </div>
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