(function () {
    // visible が未設定の場合は表示
    // visible が関数の場合は、戻り値として true が返ってきた場合だけ表示
    App.ui.ddlmenu.settings("ja", "メニュー", [
        {
            display: "メインパターン",
            items: [
                {
                    display: "ヘッダー＋明細（伝票入力）",
                    items: [
                        { display: "単一行", url: "/Pages/OptionSample.aspx" },
                        { display: "多段行", url: "/Pages/HeaderDetailMultiRow.aspx" },
                        { display: "列固定横スクロール", url: "/Pages/HeaderDetailScrollable.aspx" }
                    ]
                },
                {
                    display: "検索＋明細直接編集",
                    items: [
                        { display: "テーブル", url: "/Pages/SearchInputTable.aspx" },
                        { display: "列カレンダー形式", url: "/Pages/SearchInputCalendarColumn.aspx" },
                        { display: "列可変形式", url: "/Pages/SearchInputFlexMultiColumn.aspx" }
                    ]
                },
                {
                    display: "検索＋明細＋単票編集（詳細）",
                    items: [
                        { display: "テーブル", url: "/Pages/SearchInputDetail.aspx" }
                    ]
                },
                {
                    display: "検索（編集なし）",
                    items: [
                        { display: "テーブル（単一行）", url: "/Pages/SearchList.aspx" },
                        { display: "テーブル（多段行）", url: "/Pages/SearchListMultiRow.aspx" },
                        { display: "帳票出力", url: "/Pages/PDFSVFReports.aspx" }
                    ]
                },
                {
                    display: "メニュー",
                    items: [
                        { display: "ポータル形式", url: "/Pages/PortalMenu.aspx" },
                        { display: "ツリー形式", url: "/Pages/TreeMenu.aspx" }
                    ]
                },
                {
                    display: "CSVアップロードダウンロード",
                    items: [
                        { display: "CSVアップロードダウンロード", url: "/Pages/CsvUploadDownload.aspx" }
                    ]
                }
            ]
        },
        {
            display: "オプションパターン",
            items: [

                {
                    display: "検索ダイアログ",
                    items: [
                        { display: "検索単一セレクト", url: "/Pages/SearchList.aspx" },
                        { display: "検索複数セレクト", url: "/Pages/SearchListMultiRow.aspx" },
                        { display: "保存機能あり", url: "/Pages/SearchInputTable.aspx" }
                    ]
                },
                {
                    display: "アップロード/ダウンロード",
                    items: [
                        { display: "ファイルアップロード", url: "/Pages/OptionSample.aspx" },
                        { display: "CSVアップロード（ダイアログ）", url: "/Pages/SearchList.aspx" },
                        { display: "検索＋CSVダウンロード", url: "/Pages/SearchList.aspx" },
                        { display: "検索＋Excelダウンロード", url: "/Pages/SearchList.aspx" }
                    ]
                },
                {
                    display: "その他",
                    items: [
                        {
                            display: "コマンドボタン/チェックボックスで選択による操作",
                            items: [
                                { display: "チェックボックス", url: "/Pages/PDFSVFReports.aspx" },
                                { display: "コマンドボタン", url: "/Pages/OptionSample.aspx" }
                            ]
                        },
                        {
                            display: "小計・合計",
                            items: [
                                { display: "小計", url: "/Pages/SearchListSubtotal.aspx" },
                                { display: "合計", url: "/Pages/OptionSample.aspx" }
                            ]
                        },
                        {
                            display: "一覧表機能",
                            items: [
                                { display: "列選択（列表示・非表示切替）", url: "/Pages/SearchList.aspx" },
                                { display: "列ソート", url: "/Pages/SearchList.aspx" }
                            ]
                        },
                        {
                            display: "画面遷移のパラメータ（検索条件）受渡", url: "/Pages/SearchList.aspx"
                        },
                        {
                            display: "チャート",
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
            display: "FORM認証機能用",
            items: [
                {
                    display: "ユーザ登録（FORM認証）",
                    url: "/Pages/CreateFormUser.aspx"
                },
                {
                    display: "パスワード変更",
                    url: "/Account/PasswordChange.aspx?disp_menu=true",
                    visible: function (role) {
                        if (role.length > 0) {
                            return role[0].ContentCode > 0;
                        }
                        return false;
                    }
                }
            ]
        },
        {
            display: "CSVアップロードダウンロード",
            url: "/Pages/CsvUploadDownload.aspx",
        }
        /*
        {
            display: "システムロール専用メニュー",
            visible: function (role) {
                return !!/^sys.*$/i.test(role);
            },
            url: "http://www.google.com"
        }
        */
    ]);

})(App);
