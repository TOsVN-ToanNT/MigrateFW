/**
 * Web アプリケーション固有の設定・定数です。
 */
(function () {

    App.define("App.settings.app", {
        systemNo: "99_9999",
        fileAttachExist: "あり",
        fileAttachNotExist: "なし",
        toMainMenuLink: "../Pages/TreeMenu.aspx",

        // uploaddownload table name 
        nm_master: [                
            { value: "buhin", title: "部品マスタ" },
            { value: "mitsumori", title: "見積トラン" }
        ]
    });

})();
