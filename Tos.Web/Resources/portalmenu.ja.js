(function () {

    // visible が未設定の場合は表示
    // visible が関数の場合は、戻り値として true が返ってきた場合だけ表示
    App.ui.portalmenu.settings("ja", "メニュー", [
                {
                    display: "承認・申請状況確認",
                    items: [
                        {
                            display: "ｘｘｘ申請状況確認（検索（編集なし））", url: "#SearchList.aspx",
                            click: function (e) {
                                document.location = "SearchList.aspx?userid=" + App.ui.page.user.EmployeeCD;
                                return false;
                            },
                            load: function (target) {
                                page.menu.loadData(target, 1);
                            },
                        },
                        {
                            display: "ｘｘｘ申請状況確認（検索＋明細＋単票編集）", url: "/Pages/SearchInputDetail.aspx",
                            load: function (target) {
                                page.menu.loadData(target, 2);
                            }
                        },
                        {
                            display: "ｘｘｘ申請状況確認（検索＋明細直接編集）", url: "/Pages/SearchInputTable.aspx",
                            visible: function (role) {
                                if (role.length > 0) {
                                    return role[0].ContentCode > 0;
                                }
                                return false;
                            },
                            load: function (target) {
                                page.menu.loadData(target, 3);
                            }
                        }
                    ]
                },
            {
                display: "各種申請",
                items: [
                    { display: "ｘｘｘ新規申請", url: "/Pages/OptionSample.aspx" },
                    { display: "ｘｘｘ新規申請", url: "/Pages/OptionSample.aspx" },
                    { display: "ｘｘｘ新規申請", url: "/Pages/OptionSample.aspx" }
                ]
            },
            {
                display: "マスタデータメンテナンス",
                items: [
                    { display: "ｘｘｘマスタ追加・修正", url: "/Pages/SearchInputTable.aspx" },
                    { display: "ｘｘｘマスタ追加・修正", url: "/Pages/SearchInputTable.aspx" },
                    { display: "ｘｘｘマスタ追加・修正", url: "/Pages/SearchInputTable.aspx" }
                ]
            }
    ]);

})(App);
