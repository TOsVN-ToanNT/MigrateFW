<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Transfer.aspx.cs" Inherits="Tos.Web.Pages.Transfer" %>
<%@ MasterType VirtualPath="~/Site.Master" %>

<asp:Content ID="Content1" ContentPlaceHolderID="IncludeContent" runat="server">

</asp:Content>
<asp:Content ID="HeaderContent" ContentPlaceHolderID="HeadContent" runat="server">

    <script type="text/javascript">

        /**
         * jQuery イベントで、ページの読み込み処理を定義します。
         */
        $(function () {

            var queryStrings = window.location.search.substr(1).split("re_open_url="),
                url;

            if (queryStrings.length > 1) {
                url = queryStrings[1];
            }

            try {
                var agent = navigator.userAgent;
                if (agent.indexOf('MSIE') >= 0) {
                    App.ui.transfer(url);
                    window.open('about:blank', '_self').close();
                }
                else if (agent.indexOf('Gecko') >= 0) {
                    window.location = url;
                }
            } catch (e) {
            }
            
        });

    </script>

</asp:Content>
<asp:Content ID="MainContent" ContentPlaceHolderID="MainContent" runat="server">

    <div class="container">
        <div class="row">
        </div>
    </div>
</asp:Content>
<asp:Content ID="FooterContent" ContentPlaceHolderID="FooterContent" runat="server">
</asp:Content>
<asp:Content ID="DialogContent" ContentPlaceHolderID="DialogsContent" runat="server">
</asp:Content>
