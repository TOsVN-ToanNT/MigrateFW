<%@ Page Language="C#" Title="システムエラー" AutoEventWireup="true" CodeBehind="Error.aspx.cs" Inherits="Tos.Web.Error" 
 ClientIDMode="Static" EnableViewState="false" %>
<%--/** 最終更新日 : 2018-01-25 **/--%>
<!DOCTYPE html>
<html>
<head id="Head1" runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=8" />
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
    <script src="<%=ResolveUrl("~/Resources/pagedata-dialog." + lang + ".js") %>" type="text/javascript"></script>

    <style type="text/css">
        .container {
            margin: 40px;
        }
        
        pre {
            overflow: auto;
        }
    </style>
    <script type="text/javascript">
        $(function () {
            App.ui.page.lang = "<%= System.Threading.Thread.CurrentThread.CurrentUICulture.TwoLetterISOLanguageName%>";
            App.ui.pagedata.lang.applySetting(App.ui.page.lang);
        });
    </script>

</head>
<body>
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

        
        <div class="container">
            <div class="row">
                <div class="alert alert-warning">
                    <h2 id="messageTitle" runat="server"></h2>
                    <p id="message" runat="server">
                    </p>
                    <pre id="stacktrace" runat="server"></pre>
                </div>
            </div>
        </div>
    </div>

</body>
</html>
