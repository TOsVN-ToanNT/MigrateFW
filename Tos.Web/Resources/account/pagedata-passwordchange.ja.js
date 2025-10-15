/** 最終更新日 : 2016-10-17 **/
(function () {

    var lang = App.ui.pagedata.lang("ja", {
        _pageTitle: { text: "パスワード変更" },
        userId: { text: "ユーザーID" },
        password: { text: "パスワード" },
        newpassword: { text: "新しいパスワード" },
        confirmpassword: { text: "確認パスワード" },
        changepassword: { text: "パスワードの変更" },
    });

    App.ui.pagedata.validation("ja", {
        password: {
            rules: {
                required: true
            },
            messages: {
                required: "パスワードは必須です。"
            }
        },
        newpassword: {
            rules: {
                required: true
            },
            messages: {
                required: "新しいパスワードは必須です。"
            }
        },
        confirmpassword: {
            rules: {
                required: true
            },
            messages: {
                required: "確認パスワードは必須です。"
            }
        }
    });
})();
