<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="Tos.Web.Account.Login" ClientIDMode="Static" EnableViewState="false" %>
<%--/** 最終更新日 : 2018-08-07 **/--%>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <title><%= Page.Title %></title>
    <!-- CSS -->
    <% #if DEBUG %>
    <link media="all" rel="stylesheet" href="<%=ResolveUrl("~/Content/bootstrap.css") %>" type="text/css" />
    <% #else %>
    <link media="all" rel="stylesheet" href="<%=ResolveUrl("~/Content/bootstrap.min.css") %>" type="text/css" />
    <% #endif %>
    <link media="all" rel="stylesheet" href="<%=ResolveUrl("~/Content/site.css") %>" type="text/css" />
    <link media="all" rel="stylesheet" href="<%=ResolveUrl("~/Content/themes/base/jquery-ui.css") %>" type="text/css" />
    <link media="all" rel="stylesheet" href="<%=ResolveUrl("~/Content/menu.css") %>" type="text/css" />
    <link media="all" rel="stylesheet" href="<%=ResolveUrl("~/Content/icons.css") %>" type="text/css" />

    <!-- 
        下記の KB 提供されているパッチが適用されていない Internet Explorer 8 において
        ネイティブ JSON ライブラリに Stackoverflow が発生してしまう可能性があるため JSON2 ライブラリを利用するように対応します。
        http://support.microsoft.com/kb/976662
        Site.Masterで下記の実装を行うことにより必ず全てのページに対応されます。
    -->
    <!--[if IE 8]>
    <script type="text/javascript">
        if (navigator.appVersion.indexOf("MSIE 8.") != -1 || navigator.appVersion.indexOf("MSIE 7.") != -1) {
            JSON = undefined;
        }
    </script>        
    <![endif]-->

    <!-- JavaScript -->
    <% #if DEBUG %>
    <script src="<%=ResolveUrl("~/Scripts/json2.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/jquery-3.3.1.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/bootstrap.js") %>" type="text/javascript"></script>
    <% #else %>
    <script src="<%=ResolveUrl("~/Scripts/json2.min.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/jquery-3.3.1.min.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/bootstrap.min.js") %>" type="text/javascript"></script>
    <% #endif %>

    <!--[if lt IE 9]>
      <script src="<%=ResolveUrl("~/Scripts/html5shiv.js") %>"></script>
      <script src="<%=ResolveUrl("~/Scripts/respond.min.js") %>"></script>
    <![endif]-->
    
    <% #if DEBUG %>
    <script src="<%=ResolveUrl("~/Scripts/jquery-ui-1.12.1.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/app.base.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/app.validation.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/app.validation.method.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/app.obj.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/app.ajax.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/app.ui.js") %>" type="text/javascript"></script>
    <% #else %>
    <script src="<%=ResolveUrl("~/Scripts/jquery-ui-1.12.1.min.js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Scripts/app.min.js") %>" type="text/javascript"></script>
    <% #endif %>
    
    <!-- TODO: 言語ごとのリソースファイルの読み込み -->
    <script src="<%=ResolveUrl("~/Resources/message." + lang + ".js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Resources/menu." + lang + ".js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Resources/pagedata-all." + lang + ".js") %>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/Resources/account/pagedata-login." + lang + ".js") %>" type="text/javascript"></script>

    <style type="text/css">
        .container {
            margin-top: 50px;
            max-width: 480px;
        }

        label, input[type="text"], input[type="password"] {
            font-size: 12pt;
        }

        .control-label, .control {
            height: 35px;   
        }

        label
        {
            margin-top: 4px;
        }

        input[type="text"], input[type="password"]
        {
            padding: 6px;
            margin: 2px;
        }

    </style>


    <script type="text/javascript">
        $(function () {
            App.ui.page.lang = "<%= System.Threading.Thread.CurrentThread.CurrentUICulture.TwoLetterISOLanguageName%>";
            App.ui.pagedata.lang.applySetting(App.ui.page.lang);

            var validation = App.validation(
                App.ui.pagedata.validation(App.ui.page.lang),
                {
                    success: function (results) {
                        var i = 0, l = results.length;
                        for (; i < l; i++) {
                            App.ui.page.notifyAlert.remove();
                        }
                    },
                    fail: function (results) {
                        var i = 0, l = results.length;
                        for (; i < l; i++) {
                            App.ui.page.notifyAlert.message(results[i].message).show();
                        }
                    }
                }
            );

            $(".container").validation(validation);

            // 通知の設定
            App.ui.page.setNotify(App.ui.notify.info(document.body, {
                container: ".slideup-area .info-message",
                show: function () {
                    $(".info-message").show();
                },
                clear: function () {
                    $(".info-message").hide();
                }
            }), App.ui.notify.alert(document.body, {
                container: ".slideup-area .alert-message",
                show: function () {
                    $(".alert-message").show();
                },
                clear: function () {
                    $(".alert-message").hide();
                }
            }));

            var userIdElem = $("#userid"),
                userIdHintElem = $("#useridhint");

            $("#passwordhint, #useridhint").on("focus", function (e) {
                $("#" + e.currentTarget.id.replace("hint", "")).show().focus();
                $("#" + e.currentTarget.id).hide();
            });

            //ログインエラー
            var loginError = '<%= LoginErrorMessage %>',
                loginErrorId = App.uuid();

            //エラーメッセージを表示
            if (loginError) {
                App.ui.page.notifyAlert.message(loginError, loginErrorId).show();
            }

            $("#login").on("click", function () {
                App.ui.page.notifyAlert.clear();
                $(".container").validation().validate().done(function (result) {
                if (loginError) {
                    App.ui.page.notifyAlert.remove(loginErrorId);
                }
                    if (result.fails.length) {
                    return;
                }
                $("#form1").submit();
            });
            });

            if (loginError) {
                App.ui.page.notifyAlert.message(loginError, loginErrorId).show();
            }

            //$(".container").on("keydown", function (evt) {
            //    if (evt.keyCode === 13) {
            //        $("#login").click();
            //    }
            //});

        });
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div class="wrap">
        <!-- ヘッダーのレイアウト -->
        <div class="navbar navbar-default navbar-fixed-top">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".nav-collapse">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <div class="logo"></div>
                <div class="navbar-brand app-title" data-app-text="systemName">&nbsp;</div>
                <!-- ナビゲーションメニュー -->
                <div class="navbar-brand page-title"></div>

       </div>
            <div class="collapse navbar-collapse">

                <!-- ユーザー情報のコンテナ -->
                <p class="navbar-text pull-right">
                    <!-- TODO: ユーザー情報の表示は コードビハインドの SetUserInfo メソッドを変更してください -->
                    <button type="button" class="btn btn-link btn-xs" id="logout" runat="server">
                        <i class="icon-user"></i>
                    </button>
                    <span id="userName" class="user-name" runat="server"></span>
                </p>
            </div>
        </div>

        <!-- メニュー表示のコンテナー -->
        <div class="navbar navbar-static-top menu-container" style="display:none">
        </div>
    
        <div class="container">

            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title" data-app-text="_pageTitle"></h3>
                </div>
                <div class="panel-body">
                    <div class="form-group">
                        <div class="col-sm-4">
                            <label data-app-text="userId"></label>
                        </div>
                        <div class="col-sm-8">
                            <input type="text" runat="server" id="userid" class="form-control" data-prop="userId" />
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-4">
                            <label data-app-text="password"></label>
                        </div>
                        <div class="col-sm-8">
                            <input type="password" runat="server" id="password" class="form-control" data-prop="passowrd" />
                        </div>
                    </div>
<%--                    <div class="form-group">
                        <div class="col-sm-offset-4 col-sm-8">
                            <input type="checkbox" runat="server" id="persistlogin" />
                            <label for="persistlogin" data-app-text="persistantLogin"></label>
                        </div>
                    </div>--%>
                </div>
                <div class="panel-footer">
                    <button type="button" id="login" class="btn btn-primary btn-block" data-app-text="login"></button>
                </div>
            </div>

        </div>
    </div>

    <!-- フッターのレイアウト -->
    <div class="footer">
        <div class="footer-container">
            <!-- 通知／エラーメッセージの表示エリア -->
            <div class="message-area slideup-area">
                <div class="alert-message" data-app-text="title:alertTitle" style="display: none">
                    <ul></ul>
                </div>
                <div class="info-message" data-app-text="title:infoTitle" style="display: none">
                    <ul></ul>
                </div>
                </div>

            <div class="footer-content">
                </div>
            </div>
        </div>
    </form>
</body>
</html>
