using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Security;
using Tos.Web.Properties;

namespace Tos.Web.Account
{
	public partial class Login : System.Web.UI.Page
	{
        /// <summary>
        /// 現在の HTTP 要求の言語を設定します。
        /// </summary>
        protected readonly string lang = System.Threading.Thread.CurrentThread.CurrentUICulture.TwoLetterISOLanguageName;

        /// <summary>
        /// ログインエラーのメッセージを取得します。
        /// </summary>
        /// <returns>ログインエラーメッセージ</returns>
        /// <remarks>このメソッドは aspx 側から呼び出すために定義されています。</remarks>
        public string LoginErrorMessage { get; set; }
        
        protected void Page_Load(object sender, EventArgs e)
		{
            if (Page.IsPostBack)
            {
                // 統合 Windows 認証とフォーム認証の混合認証において、
                // 統合 Windows 認証で認証されていない場合のフォーム認証を行います。
                // ログインに失敗してリクエスト元にリダイレクトされなかった場合はエラーメッセージを設定します。
                // 初回ログイン時・パスワード有効期限（６か月）経過時にパスワード変更画面に遷移させます。
                //MixedAuthentication.FormAuthenticateWithPassChange(this.Context, userid.Value, password.Value, false);

                // 条件付きパスワード変更機能を使用しない場合は、上の1行をコメントし、下記メソッドを実行します。
                MixedAuthentication.FormAuthenticate(this.Context, userid.Value, password.Value, false);
//                MixedAuthentication.FormAuthenticate(this.Context, userid.Value, password.Value, persistlogin.Value);

                this.LoginErrorMessage = Resources.InvalidUserIdOrPassword;
            }
		}

	}
}