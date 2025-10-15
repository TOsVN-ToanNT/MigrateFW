/** 最終更新日 : 2016-10-17 **/
(function () {

    var lang = App.ui.pagedata.lang("en", {
        _pageTitle: { text: "change password" },
        userId: { text: "user id" },
        password: { text: "password" },
        newpassword: { text: "new password" },
        confirmpassword: { text: "confirm password" },
        changepassword: { text: "change password" },
    });

    App.ui.pagedata.validation("en", {
        password: {
            rules: {
                required: true
            },
            messages: {
                required: "please enter your password."
            }
        },
        newpassword: {
            rules: {
                required: true
            },
            messages: {
                required: "please enter new password."
            }
        },
        confirmpassword: {
            rules: {
                required: true
            },
            messages: {
                required: "please enter confirm password."
            }
        }
    });
})();
