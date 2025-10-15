using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Security;

namespace Tos.Web.Account
{
    public partial class WinLogin : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            // 統合 Windows 認証とフォーム認証の混合認証において、
            // 最初に統合 Windows 認証を行います。
            // 統合 Windows 認証に失敗した場合には、Redirect401.html ページにリダイレクトされ、
            // Redirect401.html からさらにフォーム認証用の Login.aspx にリダイレクトされます。
            MixedAuthentication.WindowsAuthenticate(this.Context);
        }
    }
}