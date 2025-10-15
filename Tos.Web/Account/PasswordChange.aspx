<%@ Page Language="C#" Title="999_パスワード変更" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="PasswordChange.aspx.cs" Inherits="Tos.Web.Account.PasswordChange" %>
<%--/** 最終更新日 : 2018-01-25 **/--%>
<asp:Content ID="IncludeContent" ContentPlaceHolderID="IncludeContent" runat="server">
    <link media="all" rel="stylesheet" href="<%=ResolveUrl("~/Content/headerdetail.css") %>" type="text/css" />

</asp:Content>
<asp:Content ID="HeadContent" ContentPlaceHolderID="HeadContent" runat="server">

    <style type="text/css">
        .container {
            margin-top: 50px;
            max-width: 600px;
        }

        label, input[type="text"], input[type="password"], .container span {
            font-size: 12pt;
        }

        .control-label, .control {
            height: 35px;   
        }
    </style>
    <script type="text/javascript">

        /**
         * ページのレイアウト構造に対応するオブジェクトを定義します。
         */
        var page = App.define("PasswordChange", {
            //TODO: ページのレイアウト構造に対応するオブジェクト定義を記述します。
            options: {},
            values: {},
            urls: {
                passwordchange: "../api/PasswordChange"
            },
            password: {
                options: {},
                values: {},
                urls: {}
            },
            dialogs: {},
            commands: {}
        });

        /**
         * 単項目要素をエラーのスタイルに設定します。
         * @param target 設定する要素
         */
        page.setColInvalidStyle = function (target) {
            var $target,
                nextColStyleChange = function (target) {
                    var next;
                    if (target.hasClass("with-next-col")) {
                        next = target.next();
                        if (next.length) {
                            next.addClass("control-required");
                            next.removeClass("control-success");
                            nextColStyleChange(next);
                        }
                    }
                };

            $target = $(target).closest("div");
            $target.addClass("control-required");
            $target.removeClass("control-success");

            // control-labelまで対象の前の項目にクラスをセットする
            var element = $target;
            while (element.prev().length > 0) {
                element = element.prev();
                if (element.hasClass("control-label")) {
                    element.addClass("control-required-label");
                    element.removeClass("control-success-label");
                    break;
                }
                else if (element.hasClass("control-required-label")) {
                    element.removeClass("control-success-label");
                    break;
                }
                else if (element.hasClass("control")) {
                    element.addClass("control-required");
                    element.removeClass("control-success");
                }
            }
            nextColStyleChange($target);
        };

        /**
         * 単項目要素をエラー無しのスタイルに設定します。
         * @param target 設定する要素
         */
        page.setColValidStyle = function (target) {
            var $target,
                nextColStyleChange = function (target) {
                    var next;
                    if (target.hasClass("with-next-col")) {
                        next = target.next();
                        if (next.length) {
                            next.removeClass("control-required");
                            next.addClass("control-success");
                            nextColStyleChange(next);
                        }
                    }
                };
            $target = $(target).closest("div");
            $target.removeClass("control-required");
            $target.addClass("control-success");

            // control-labelまで対象の前の項目にクラスをセットする
            var element = $target;
            while (element.prev().length > 0) {
                element = element.prev();
                if (element.hasClass("control-label")) {
                    element.removeClass("control-required-label");
                    element.addClass("control-success-label");
                    break;
                }
                else if (element.hasClass("control-required-label")) {
                    element.removeClass("control-required-label");
                    element.addClass("control-success-label");
                    element.addClass("control-label");
                    break;
                }
                else if (element.hasClass("control")) {
                    element.removeClass("control-required");
                    element.addClass("control-success");
                }
            }
            nextColStyleChange($target);
        };

        /**
         * バリデーション成功時の処理を実行します。
         */
        page.validationSuccess = function (results, state) {
            var i = 0, l = results.length,
                item, $target;

            for (; i < l; i++) {
                item = results[i];
                if (state && state.isGridValidation) {
                    page.detail.dataTable.dataTable("getRow", $(item.element), function (row) {
                        if (row && row.element) {
                            row.element.find("tr").removeClass("has-error");
                        }
                    });
                } else {
                    page.setColValidStyle(item.element);
                }

                App.ui.page.notifyAlert.remove(item.element);
            }
        };

        /**
         * バリデーション失敗時の処理を実行します。
         */
        page.validationFail = function (results, state) {

            var i = 0, l = results.length,
                item, $target;

            for (; i < l; i++) {
                item = results[i];
                if (state && state.isGridValidation) {
                    page.detail.dataTable.dataTable("getRow", $(item.element), function (row) {
                        if (row && row.element) {
                            row.element.find("tr").addClass("has-error");
                        }
                    });
                } else {
                    page.setColInvalidStyle(item.element);
                }

                if (state && state.suppressMessage) {
                    continue;
                }
                App.ui.page.notifyAlert.message(item.message, item.element).show();
            }
        };

        /**
         * バリデーション後の処理を実行します。
         */
        page.validationAlways = function (results) {
            //TODO: バリデーションの成功、失敗に関わらない処理が必要な場合はここに記述します。
        };

        /**
          * 指定された定義をもとにバリデータを作成します。
          * @param target バリデーション定義
          * @param options オプションに設定する値。指定されていない場合は、
          *                画面の success/fail/always のハンドル処理が指定されたオプションが設定されます。
          */
        page.createValidator = function (target, options) {
            return App.validation(target, options || {
                success: page.validationSuccess,
                fail: page.validationFail,
                always: page.validationAlways
            });
        };

        /**
         * すべてのバリデーションを実行します。
         */
        page.validateAll = function () {

            var validations = [];

            validations.push(page.password.validator.validate());

            //TODO: 画面内で定義されているバリデーションを実行する処理を記述します。
            return App.async.all(validations);
        };


        /**
        * 画面の初期化処理を行います。
        */
        page.initialize = function () {

            App.ui.loading.show();
            //TODO: URLパラメーターで渡された値を取得し、保持する処理を記述します。
            if (!App.isUndefOrNull(App.uri.queryStrings.disp_menu)) {
                page.values.disp_menu = App.uri.queryStrings.disp_menu;
            } else {
                page.values.disp_menu = false;
            }

            page.initializeControl();
            page.initializeControlEvent();

            page.password.initialize();

            App.ui.loading.close();
        };

        /**
         * 画面コントロールの初期化処理を行います。
         */
        page.initializeControl = function () {

            //TODO: 画面全体で利用するコントロールの初期化処理をここに記述します。
            if (!page.values.disp_menu) {
                $("#menu-toggle").hide();
                $(".navbar-brand").removeClass("cursor").off("click");
            }

        };

        /**
         * コントロールへのイベントの紐づけを行います。
         */
        page.initializeControlEvent = function () {

            //TODO: 画面全体で利用するコントロールのイベントの紐づけ処理をここに記述します。
        };


        /**
         * コンテンツ部の初期化処理を行います。
         */
        page.password.initialize = function () {

            var element = $(".container");
            page.password.validator = element.validation(page.createValidator(page.password.options.validations));
            page.password.element = element;

            //TODO: コンテンツ部の初期化処理をここに記述します。
            page.password.element.findP("userId").text(App.ui.page.user.EmployeeCD + "：" + App.ui.page.user.Name);

            //TODO: コンテンツ部で利用するコントロールのイベントの紐づけ処理をここに記述します。
            element.on("click", "#changepassword", page.password.changePassword);

        };

        /**
         * パスワードのバリデーションルールを定義します。
         */
        page.password.options.validations = {
            password: {
                rules: {
                    required: true
                },
                options: {
                    name: "現在のパスワード"
                },
                messages: {
                    required: App.messages.base.required
                }
            },
            newpassword: {
                rules: {
                    required: true,
                    minlength: 6,
                    hankaku: true,
                    samenowpassword: function (value, opts, state, done) {
                        var nowpassword = page.password.element.findP("password").val();

                        if (!App.validation.isEmpty(value) || !App.validation.isEmpty(nowpassword)) {
                            if (value == nowpassword) {
                                done(false);
                                return;
                            }
                        }
                        done(true);
                    },
                    checkconfirmpassword: function (value, opts, state, done) {
                        var confirmpassword = page.password.element.findP("confirmpassword").val();

                        if (!App.validation.isEmpty(value) || !App.validation.isEmpty(confirmpassword)) {
                            if (value != confirmpassword) {
                                done(false);
                                return;
                            }
                        }
                        done(true);
                    },
                    checkComplexity: function (value, opts, state, done) {
                        // 大文字・小文字・数字・記号(! @ # $ % ^ & * ( ) _ { } | ')のうち3つを含むか。
                        var reg = [/(?=.*[A-Z]+).+$/, /(?=.*[a-z]+).+$/, /(?=.*[0-9]+).+$/, /(?=.*[!@#$%^&*()_{}|']+).+$/];
                        var cnt = 0;
                        if (!App.validation.isEmpty(value)) {
                            for (i = 0; i < 4 ; i += 1) {
                                if (value.match(reg[i])) {
                                    cnt += 1;
                                }
                            }
                            if (cnt < 3) {
                                done(false);
                                return;
                            }
                        }
                        done(true);
                    }
                },
                options: {
                    name: "新しいパスワード"
                },
                messages: {
                    required: App.messages.base.required,
                    minlength: App.messages.base.minlength,
                    hankaku: App.messages.base.hankaku,
                    samenowpassword: App.messages.base.MS0001,
                    checkconfirmpassword: App.messages.base.MS0007,
                    checkComplexity: App.messages.base.MS0021
                }
            },
            confirmpassword: {
                rules: {
                    required: true,
                    minlength: 6,
                    hankaku: true,
                    checknewpassword: function (value, opts, state, done) {
                        var newpassword = page.password.element.findP("newpassword").val();

                        if (!App.validation.isEmpty(value) || !App.validation.isEmpty(newpassword)) {
                            if (value != newpassword) {
                                done(false);
                                return;
                            }
                        }
                        done(true);
                    }
                },
                options: {
                    name: "新しいパスワード（確認）"
                },
                messages: {
                    required: App.messages.base.required,
                    minlength: App.messages.base.minlength,
                    hankaku: App.messages.base.hankaku,
                    checknewpassword: App.messages.base.MS0007
                }
            }
        };

        /**
         * パスワード変更処理を定義します。
         */
        page.password.changePassword = function () {
            var criteria = page.password.element.form().data();

            App.ui.page.notifyAlert.clear();

            page.password.validator.validate().then(function () {

                var inputdata = {
                    userid: App.ui.page.user.EmployeeCD,
                    password: criteria.password,
                    newpassword: criteria.newpassword
                }
                //TODO: データの保存処理をここに記述します。
                return $.ajax(App.ajax.webapi.post(page.urls.passwordchange, inputdata))
                    .done(function (result) {
                        //TODO: パスワード変更成功時の処理をここに記述します。
                        window.location = '<%= successRedirectUrl %>';
                    }).fail(function (error) {
                        //TODO: パスワード変更失敗時の処理をここに記述します。
                        App.ui.page.notifyAlert.message(App.ajax.handleError(error).message).show();

                    });
            });

        };

        /**
        * jQuery イベントで、ページの読み込み処理を定義します。
        */
        $(function () {
            // ページの初期化処理を呼び出します。
            page.initialize();
        });

    </script>
</asp:Content>

<asp:Content ID="MainContent" ContentPlaceHolderID="MainContent" runat="server">
    <div class="container">
        <div class="row">
            <div class="control-label col-xs-5">
                <label >ユーザID</label>
            </div>
            <div class="control col-xs-7">
                <span id="userid" data-prop="userId" ></span>
            </div>
        </div>
        <div class="row">
            <div class="control-label col-xs-5">
                <label >現在のパスワード</label>
            </div>
            <div class="control col-xs-7">
                <input type="password" class="text-selectAll" data-prop="password" />
            </div>
        </div>
        <div class="row">
            <div class="control-label col-xs-5">
                <label >新しいパスワード</label>
            </div>
            <div class="control col-xs-7">
                <input type="password" class="text-selectAll" data-prop="newpassword" />
            </div>
        </div>
        <div class="row">
            <div class="control-label col-xs-5">
                <label >新しいパスワード（確認）</label>
            </div>
            <div class="control col-xs-7">
                <input type="password" class="text-selectAll" data-prop="confirmpassword" />
            </div>
        </div>
        <div class="row">
            <p class="pull-right">
                <button type="button" id="changepassword" class="btn btn-primary" >パスワードの変更</button>
            </p>
        </div>
    </div>
</asp:Content>

<asp:Content ID="FooterContent" ContentPlaceHolderID="FooterContent" runat="server">
    <div class="command"></div>
</asp:Content>

<asp:Content ID="DialogsContent" ContentPlaceHolderID="DialogsContent" runat="server">
</asp:Content>
