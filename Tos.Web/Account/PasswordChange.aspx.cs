using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using Tos.Web.Properties;

namespace Tos.Web.Account
{
    public partial class PasswordChange : System.Web.UI.Page
    {
        /// <summary>
        /// 現在の HTTP 要求の言語を設定します。
        /// </summary>
        protected readonly string lang = System.Threading.Thread.CurrentThread.CurrentUICulture.TwoLetterISOLanguageName;

        /// <summary>
        /// パスワード変更が成功した場合の遷移先を取得します。
        /// </summary>
        /// <returns>パスワード変更が成功した場合の遷移先URL</returns>
        /// <remarks>このメソッドは aspx 側から呼び出すために定義されています。</remarks>
        public string successRedirectUrl { get; set; }


        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {
                //統合認証が有効の場合（フォーム認証以外の場合）にはエラーページへ遷移します。
                if (this.Context.User.Identity.AuthenticationType != "Forms")
                {
                    //TODO: エラー時の遷移先を指定しリダイレクトします。
                    this.Context.Response.Redirect("~/Error.aspx");
                }

                //TODO: パスワード変更が成功した場合の遷移先を設定します。
                successRedirectUrl = (FormsAuthentication.DefaultUrl == null) ? this.Context.Request.ApplicationPath
                                                                              : FormsAuthentication.DefaultUrl;
            }
        }
    }
}