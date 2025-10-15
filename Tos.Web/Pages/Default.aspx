<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Tos.Web.Pages.Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="IncludeContent" runat="server">
    <!-- IncludeContent
    ページコンテンツ単位で必要なリソースを読み込みます

    例：
    <script src="<%=ResolveUrl("~/Resources/pages/pagedata" + System.Threading.Thread.CurrentThread.CurrentUICulture.TwoLetterISOLanguageName + ".js") %>"
        type="text/javascript"></script>

     -->
</asp:Content>
<asp:Content ID="HeaderContent" ContentPlaceHolderID="HeadContent" runat="server">
    <!-- HeadContent
            ページコンテンツ個別のスクリプトとCSSを記載します

        例：
        <style type="text/css">
            /* 画面デザイン -- Start */
                
            /* 画面デザイン -- End */
        </style>
        <script type="text/javascript">

            $(App.ui.page).on("ready", function () {
            });

        </script>
     -->
    <script type="text/javascript">


    </script>

</asp:Content>
<asp:Content ID="MainContent" ContentPlaceHolderID="MainContent" runat="server">

    <div class="container">
        <div class="row">

        </div>
    </div>
    <!-- MainContent
    ページのコンテンツを表示する画面デザインを記述します

    例：
    <div class="content-part search-criteria">
        <h3 class="part-header" data-app-text="searchCriteria"><a class="search-part-toggle" href="#"></a></h3>
        <div class="part-body">
            <ul class="item-list">

            </ul>
        </div>
    </div>
     -->
</asp:Content>
<asp:Content ID="FooterContent" ContentPlaceHolderID="FooterContent" runat="server">
    <!-- FooterContent
    ページコンテンツに対応するボタン（保存、印刷など）を記述します

    例：
    <div class="command" style="left: 1px;">
        <button type="button" class="print-button" name="print-button" data-app-operation="print">
            <span data-app-text="print"></span>
        </button>
    </div>
     -->
</asp:Content>
<asp:Content ID="DialogContent" ContentPlaceHolderID="DialogsContent" runat="server">
    <!-- DialogsContent
    ページコンテンツで利用するダイアログを記述します

    例：
    <div class="csv-upload-dialog">
    </div>
     -->
</asp:Content>
