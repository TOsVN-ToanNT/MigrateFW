/** 最終更新日 : 2016-10-17 **/
(function () {

    var lang = App.ui.pagedata.lang("en", {
        _pageTitle: { text: "login" },
        userId: { text: "user id" },
        password: { text: "password" },
        persistantLogin: { text: "keep me logged in." },
        login: { text: "Login" }
    });

    App.ui.pagedata.validation("en", {
        userId: {
            rules: { required: true },
            messages: { required: "please enter your user id." }
        },
        password: {
            rules: {
                required: true
            },
            messages: {
                required: "please enter your password."
            }
        }
    });
})();
