/** 最終更新日 : 2016-10-17 **/
(function () {

    var lang = App.ui.pagedata.lang("ja", {
        _pageTitle: { text: "テスト" },
        inputTitle: { text: "データ登録" },
        count: { text: "取得件数" },
        id: { text: "ID" },
        cd_system: { text: "システムコード" },
        cd_shain: { text: "社員コード" },
        cd_ope: { text: "オペコード" },
        cd_kaisha: { text: "会社コード" },
        cd_kaiso: { text: "階層コード" },
        cd_bunrui: { text: "分類コード" },
        cd_kengen: { text: "権限コード" },
        no_table: { text: "テーブルNo." },
        cd_naiyo: { text: "内容コード" },
        ymd_create: { text: "作成日時" },
        cd_create_shain: { text: "作成者" },
        ymd_update: { text: "更新日時" },
        cd_update_shain: { text: "更新者" },
        ts: { text: "タイムスタンプ" },
        insertCommand: { text: "挿入" },
        updateCommand: { text: "更新" },
        deleteCommand: { text: "削除" },
        commandTitle: { text: "テスト項目" },
        test1: { text: "複数" },
        test2: { text: "単一" },
        test3: { text: "複数(V)" },
        test4: { text: "単一(V)" },
        test5: { text: "挿入" },
        test6: { text: "更新" },
        test7: { text: "削除" },
        test8: { text: "WA複数" },
        test9: { text: "WA単一" },
        test10: { text: "WA複数(V)" },
        test11: { text: "WA単一(V)" },
        test12: { text: "WA複数(S)" },
        test13: { text: "WA単一(S)" },
        test14: { text: "WA挿入" },
        test15: { text: "WA更新" },
        test16: { text: "WA削除" },
        test17: { text: "WA一括" },
        test18: { text: "WA一括(S)" },
        test19: { text: "WA一括RB" },
        test20: { text: "WA一括(S)RB" },
        test21: { text: "複数CSV" },
        test22: { text: "単一CSV" },
        test23: { text: "CSVアップ" },
        test24: { text: "Validation(SV)" }
    });

    App.ui.pagedata.validation("ja", {
//        groups: {
//            header: ["cd_system", "cd_shain"],
//            detail: []
//        },

        cd_system: {
            rules: { required: true },
            messages: {
                required: "システムコードは必須です。"
            }
        },
        cd_shain: {
            rules: {
                rangelength: [4, 10],
                alphabet: true
            },
            messages: {
                rangelength: "社員コードは{param[0]}文字から{param[1]}文字の間で入力してください。",
                alphabet: "社員コードは半角英字で入力してください。"
            }
        },
        cd_ope: {
            rules: { number: true },
            messages: {
                number: "オペコードは数値を入力してください。"
            }
        },
        cd_kaisha: {
            rules: { range: [0, 9] },
            messages: {
                range: "会社コードは{param[0]}から{param[1]}の間で入力してください。"
            }
        },
        cd_kaiso: {
            rules: {},
            messages: {
                custom: "会社コードを先に入力してください。"
            }
        },
        ymd_create: {
            messages: {
                date: "作成日は日付を入力してください。"
            }
        },
        cd_update_shain: {
            rules: {},
            messages: {
                custom: "更新者にはログインユーザー名を入力してください。"
            }
        }
    });

    App.ui.pagedata.operation("ja", {
        // できる・できないをグループ分けする
        groups: {
            pdf: {
                roles: ["sales_manager", "", ""],
                status: []
            }
        },
        roles: {
            manager: {
                rules: {
                    // 既定の制御
                    "default": {
                        ymd_create: "disable" //, ...
                    }

                }
            }
        }

    });
})();
