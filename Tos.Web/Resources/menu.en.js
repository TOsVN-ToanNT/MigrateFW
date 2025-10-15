(function () {
    // visible が未設定の場合は表示
    // visible が "*" の場合は権限確認しない
    // visible が "*" 以外の場合は、一致する role だけに表示
    // visible が配列の場合は、一致する role が含まれている場合だけ表示
    // visible が関数の場合は、戻り値として true が返ってきた場合だけ表示
    App.ui.ddlmenu.settings("en", "メニュー", [
        {
            display: "main pattern",
            items: [
                {
                    display: "header + detail",
                    items: [
                        { display: "single row", url: "/Pages/OptionSample.aspx" },
                        { display: "multi rows", url: "/Pages/HeaderDetailMultiRow.aspx" },
                        { display: "scrollable", url: "/Pages/HeaderDetailScrollable.aspx" }
                    ]
                },
                {
                    display: "header + detail direct edit",
                    items: [
                        { display: "table", url: "/Pages/SearchInputTable.aspx" },
                        { display: "row calendar", url: "/Pages/SearchInputCalendarColumn.aspx" },
                        { display: "flex column", url: "/Pages/SearchInputFlexMultiColumn.aspx" }
                    ]
                },
                {
                    display: "header + detail + detail edit",
                    items: [
                        { display: "table", url: "/Pages/SearchInputDetail.aspx" }
                    ]
                },
                {
                    display: "search no edit",
                    items: [
                        { display: "table (single row)", url: "/Pages/SearchList.aspx" },
                        { display: "table (multi rows)", url: "/Pages/SearchListMultiRow.aspx" },
                        { display: "table (pdf create)", url: "/Pages/PDFSVFReports.aspx" }
                    ]
                },
                {
                    display: "menu",
                    items: [
                        { display: "portal menu", url: "/Pages/PortalMenu.aspx" },
                        { display: "tree menu", url: "/Pages/TreeMenu.aspx" }
                    ]
                },
                {
                    display: "csv upload/download",
                    items: [
                        { display: "csv upload/download", url: "/Pages/CsvUploadDownload.aspx" }
                    ]
                }
            ]
        },
        {
            display: "option pattern",
            items: [

                {
                    display: "search dialog",
                    items: [
                        { display: "single select", url: "/Pages/SearchList.aspx" },
                        { display: "multi select", url: "/Pages/SearchListMultiRow.aspx" },
                        { display: "save function", url: "/Pages/SearchListMultiRow.aspx" }
                    ]
                },
                {
                    display: "upload/download",
                    items: [
                        { display: "file upload", url: "/Pages/OptionSample.aspx" },
                        { display: "CSV upload", url: "/Pages/SearchList.aspx" },
                        { display: "CSV download", url: "/Pages/SearchList.aspx" },
                        { display: "Excel download", url: "/Pages/SearchList.aspx" }
                    ]
                },
                {
                    display: "others",
                    items: [
                        {
                            display: "button/checkbox the operation by the selection",
                            items: [
                                { display: "checkbox", url: "/Pages/PDFSVFReports.aspx" },
                                { display: "button", url: "/Pages/OptionSample.aspx" }
                            ]
                        },
                        {
                            display: "total/subtotal",
                            items: [
                                { display: "subtotal", url: "/Pages/SearchListSubtotal.aspx" },
                                { display: "totak", url: "/Pages/SearchList.aspx" }
                            ]
                        },
                        {
                            display: "tables function",
                            items: [
                                { display: "column selection(display and non-display switching)", url: "/Pages/SearchList.aspx" },
                                { display: "column sort", url: "/Pages/SearchList.aspx" }
                            ]
                        },
                        {
                            display: "screen transition of parameters delivery", url: "/Pages/SearchList.aspx"
                        },
                        {
                            display: "chart",
                            url: "#Chart",
                            click: function (e) {
                                App.ui.transfer("../Pages/Chart.aspx");
                                return false;
                            }
                        }
                    ]
                }
            ]
        },
        {
            display: "form authentication function",
            items: [
                {
                    display: "create user for form authentication",
                    url: "/Pages/CreateFormUser.aspx"
                },
                {
                    display: "change password",
                    url: "/Account/PasswordChange.aspx?disp_menu=true",
                    visible: function (role) {
                        if (role.length > 0) {
                            return role[0].ContentCode > 0;
                        }
                        return false;
                    }
                }
            ]
        }
    ]);

})(App);
