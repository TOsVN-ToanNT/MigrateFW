using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;
using System.Web.Http;
using Newtonsoft.Json;
using System.Net;
using Tos.Web.Controllers;
using Tos.Web.Properties;
using Tos.Web.Account;
using System.Web.Routing;

namespace Tos.Web
{
    public class Global : System.Web.HttpApplication
    {
        void Application_Start(object sender, EventArgs e)
        {
            // アプリケーションのスタートアップで実行するコードです
            WebApiConfig.Register(GlobalConfiguration.Configuration);
        }

        void Application_End(object sender, EventArgs e)
        {
            //  アプリケーションのシャットダウンで実行するコードです

        }

        void Application_Error(object sender, EventArgs e)
        {
            // ハンドルされていないエラーが発生したときに実行するコードです

            Exception exception = Server.GetLastError();
            HttpException httpException = exception as HttpException;

            // TODO: 404 (Not Fount) など 500 以外の HTTP エラーの場合にはロギングなどは実施しません。
            if (httpException != null)
            {
                if (httpException.GetHttpCode() != (int)HttpStatusCode.InternalServerError)
                {
                    return;
                }
            }

            if (exception.InnerException != null) {
                exception = exception.InnerException;
            }
            Logging.Logger.App.Error(exception.Message, exception);
        }

        //void Session_Start(object sender, EventArgs e)
        //{
        //    // 新規セッションを開始したときに実行するコードです

        //}

        //void Session_End(object sender, EventArgs e)
        //{
        //    // セッションが終了したときに実行するコードです 
        //    // メモ: Web.config ファイル内で sessionstate モードが InProc に設定されているときのみ、
        //    // Session_End イベントが発生します。 session モードが StateServer か、または 
        //    // SQLServer に設定されている場合、イベントは発生しません。

        //}

        void Application_AuthenticateRequest(object sender, EventArgs e)
        {
            //var caller = HttpContext.Current.Request.Headers.GetValues("X-HttpRequestor");
            //if (caller != null && caller.FirstOrDefault() == "Batch")
            //{
            //    FormsAuthentication.SetAuthCookie(HttpContext.Current.Request.LogonUserIdentity.Name, false);
            //}

            // 統合 Windows 認証とフォーム認証の混合認証において、
            // 統合 Windows 認証で認証されなかった場合には、フォーム認証のログインページにリダイレクトされます。
            // フォーム認証用のログインページで認証が成功した際に、リクエスト元のページにリダイレクトするために
            // リクエスト元のページの URL をクッキーにセットします。
            MixedAuthentication.SetReturnUrl(HttpContext.Current);
        }
    }
}
