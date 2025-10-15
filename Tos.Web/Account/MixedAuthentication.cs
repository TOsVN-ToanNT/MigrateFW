/** 最終更新日 : 2016-10-17 **/
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Tos.Web.Properties;
using System.Web.Security;
using Tos.Web.Controllers;
using System.Net;
using System.Net.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Tos.Web.Account
{
    class ContentTypes
    {
        public const string Json = "application/json";
    }

    public static class MixedAuthentication
    {
        private static readonly string ReturnUrl = Resources.ReturnUrl;

        /// <summary>
        /// 統合 Windows 認証とフォーム認証の混合認証において、
        /// 最初に統合 Windows 認証を行います。
        /// 統合 Windows 認証に失敗した場合には、Redirect401.html ページにリダイレクトされ、
        /// Redirect401.html からさらにフォーム認証用の Login.aspx にリダイレクトされます。
        /// </summary>
        /// <param name="context">現在の HTTP 要求に対する <see cref="System.Web.HttpContext"/></param>
        public static void WindowsAuthenticate(HttpContext context)
        {
            // 統合 Windows 認証で認証されていない場合には、サーバー変数「LogonUser」取得時に 401 エラーが発生し、
            // Redirect401.html にリダイレクトされます。
            // 統合 Windows 認証で認証済みの場合はリクエスト元のページにリダイレクトします。
            string userName = context.Request.ServerVariables[Resources.LogonUser];

            if (context.Request.ContentType.ToLower() == ContentTypes.Json)
            {
                if (string.IsNullOrEmpty(userName))
                {
                    ResponseAuthenticationError(context);
                }
                else
                {
                    ResponseAuthCookie(context, userName);
                }
            }
            else
            {
                FormsAuthentication.RedirectFromLoginPage(userName, false);
            }
        }

        private static void ResponseAuthCookie(HttpContext context, string userName)
        {
            FormsAuthentication.SetAuthCookie(userName, true);
            context.Response.StatusCode = (int)HttpStatusCode.OK;
            context.Response.End();
        }

        private static void ResponseAuthenticationError(HttpContext context)
        {
            context.Response.Clear();
            context.Response.ContentType = ContentTypes.Json;
            context.Response.TrySkipIisCustomErrors = true;
            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;

            JObject messages = new JObject();
            messages.Add("Message", Properties.Resources.AuthenticationErrorMessage);

            context.Response.Write(messages.ToString());
            context.Response.Flush();
            context.Response.End();
        }

        /// <summary>
        /// 統合 Windows 認証とフォーム認証の混合認証において、
        /// 統合 Windows 認証で認証されていない場合にフォーム認証を行います。
        /// </summary>
        /// <param name="context">現在の HTTP 要求に対する <see cref="System.Web.HttpContext"/></param>
        /// <param name="userName">ユーザー名</param>
        /// <param name="password">パスワード</param>
        /// <param name="createPersistentCookie">永続化クッキーを作成するかどうか</param>
        public static void FormAuthenticate(HttpContext context, string userName, string password, bool createPersistentCookie)
        {
            // フォーム認証に成功した場合は、
            // 1. 認証チケットを作成しクッキーに追加します。
            // 2. リクエスト元ページの URL をクッキーから取得します。
            //    リクエスト元ページの URL がクッキーから取得できない場合はアプリケーションのルートを戻り先に設定します。
            // 3. リクエスト元のページにリダイレクトします。
            if (Membership.ValidateUser(userName, password))
            {
                FormsAuthentication.SetAuthCookie(userName, createPersistentCookie);
                string returnUrl = (context.Request.Cookies[ReturnUrl] == null) ? context.Request.ApplicationPath
                                                                                : context.Request.Cookies[ReturnUrl].Value;
                context.Response.Redirect(returnUrl);
            }
        }

        /// <summary>
        /// 統合 Windows 認証とフォーム認証の混合認証において、
        /// 統合 Windows 認証で認証されていない場合にフォーム認証を行います。
        /// 初回ログイン時・パスワード有効期限（６か月）経過時、パスワード変更画面に遷移させます
        /// </summary>
        /// <param name="context">現在の HTTP 要求に対する <see cref="System.Web.HttpContext"/></param>
        /// <param name="userName">ユーザー名</param>
        /// <param name="password">パスワード</param>
        /// <param name="createPersistentCookie">永続化クッキーを作成するかどうか</param>
        public static void FormAuthenticateWithPassChange(HttpContext context, string userName, string password, bool createPersistentCookie)
        {
            // フォーム認証に成功した場合は、
            // 1. 認証チケットを作成しクッキーに追加します。
            // 2. リクエスト元ページの URL をクッキーから取得します。
            //    リクエスト元ページの URL がクッキーから取得できない場合はアプリケーションのルートを戻り先に設定します。
            // 3. リクエスト元のページにリダイレクトします。
            if (Membership.ValidateUser(userName, password))
            {
                FormsAuthentication.SetAuthCookie(userName, createPersistentCookie);

                bool isChangePassword = false;
                DateTime sixMonthBefore = DateTime.Now.AddMonths(-6);
                string returnUrl;

                MembershipUser User = Membership.GetUser(userName);
                if (User.CreationDate == User.LastPasswordChangedDate)
                {
                    isChangePassword = true;
                }
                else if (User.LastPasswordChangedDate < sixMonthBefore)
                {
                    isChangePassword = true;
                }

                if (isChangePassword)
                {
                    returnUrl = "PasswordChange.aspx";
                }
                else
                {
                    returnUrl = (context.Request.Cookies[ReturnUrl] == null) ? context.Request.ApplicationPath
                                                                                    : context.Request.Cookies[ReturnUrl].Value;
                }

                context.Response.Redirect(returnUrl);
            }
        }

        /// <summary>
        /// 強制的にフォーム認証にてログインをします。
        /// ユーザ登録日とログイン日が違う場合は、ユーザが存在してもログインできません
        /// </summary>
        /// <param name="context">現在の HTTP 要求に対する <see cref="System.Web.HttpContext"/></param>
        /// <param name="userName">ユーザー名</param>
        /// <param name="password">パスワード</param>
        /// <param name="createPersistentCookie">永続化クッキーを作成するかどうか</param>
        public static void FormAuthenticateFromNotAD(HttpContext context, string userName, string password, bool createPersistentCookie)
        {
            // フォーム認証に成功した場合は、
            // 1. 認証チケットを作成しクッキーに追加します。
            // 2. リクエスト元ページの URL をクッキーから取得します。
            //    リクエスト元ページの URL がクッキーから取得できない場合はアプリケーションのルートを戻り先に設定します。
            // 3. リクエスト元のページにリダイレクトします。
            if (Membership.ValidateUser(userName, password))
            {
                FormsAuthentication.SetAuthCookie(userName, createPersistentCookie);

                string returnUrl;
                DateTime nowDate = DateTime.Now.Date;

                MembershipUser User = Membership.GetUser(userName);
                var createDate = User.CreationDate.Date;
                if (User.CreationDate.Date == nowDate)
                {
                    returnUrl = (context.Request.Cookies[ReturnUrl] == null) ? context.Request.ApplicationPath
                                                                                    : context.Request.Cookies[ReturnUrl].Value;
                    context.Response.Redirect(returnUrl);
                }
            }
        }

        /// <summary>
        /// バッチテンプレートのWebサービス起動バッチで、FORM認証時の認証情報を返却します。
        /// </summary>
        /// <param name="context">現在の HTTP 要求に対する <see cref="System.Web.HttpContext"/></param>
        /// <param name="userName">ユーザー名</param>
        /// <param name="password">パスワード</param>
        /// <param name="createPersistentCookie">永続化クッキーを作成するかどうか</param>
        public static bool FormAuthenticateNoRedirect(string userName, string password, bool createPersistentCookie)
        {
            bool result = false;

            if (Membership.ValidateUser(userName, password))
            {
                FormsAuthentication.SetAuthCookie(userName, createPersistentCookie);
                result = true;
            }

            return result;
        }

        /// <summary>
        /// 統合 Windows 認証とフォーム認証の混合認証において、
        /// 統合 Windows 認証で認証されなかった場合には、フォーム認証のログインページにリダイレクトされます。
        /// フォーム認証用のログインページで認証が成功した際に、リクエスト元のページにリダイレクトするために
        /// リクエスト元のページの URL をクッキーにセットします。
        /// </summary>
        /// <param name="context">現在の HTTP 要求に対する <see cref="System.Web.HttpContext"/></param>
        public static void SetReturnUrl(HttpContext context)
        {
            if (!context.Request.IsAuthenticated)
            {
                int start = context.Request.Path.LastIndexOf("/");
                string path = context.Request.Path.Substring(start + 1);

                if (path.ToUpper() != Resources.LoginPage.ToUpper() && context.Request.Cookies[ReturnUrl] == null)
                {
                    context.Response.Cookies[ReturnUrl].Value = context.Request.Path;
                }
            }
        }
        /// <summary>
        /// フォーム認証において、パスワードの変更を行います。
        /// </summary>
        /// <param name="userName">ユーザー名</param>
        /// <param name="oldpassword">現在のパスワード</param>
        /// <param name="newpassword">新しいパスワード</param>
        public static void PasswordChangeFormAuthenticate(string userName, string oldpassword, string newpassword)
        {
            // フォーム認証に成功した場合は、
            //   1. パスワード変更を行います。
            //   2. パスワード変更に成功した場合は、認証チケットを作成しクッキーに追加します。
            //      また、フォーム認証用のデフォルトページへ遷移します。
            //   3. パスワード変更に失敗した場合は、戻り値にエラーメッセージを設定します。
            // フォーム認証に失敗した場合は、戻り値にエラーメッセージを設定します。

            if (Membership.ValidateUser(userName, oldpassword))
            {
                MembershipUser User = Membership.GetUser(userName);

                //TODO: パスワード変更を実装します。ここではMembershipのChangePasswordを使用してパスワードを変更しています。
                if (User.ChangePassword(oldpassword, newpassword))
                {
                    FormsAuthentication.SetAuthCookie(userName, true);
                }
                else
                {
                    throw new Exception(Properties.Resources.NotChangePassword, null);
                }
            }
            else
            {
                throw new Exception(Properties.Resources.InvalidUserIdOrPassword, null);
            }

        }
    }
}
