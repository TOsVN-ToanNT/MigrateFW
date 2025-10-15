using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Tos.Web.Properties;

namespace Tos.Web
{
    public partial class AuthorizedError : System.Web.UI.Page
    {
        protected readonly string lang = System.Threading.Thread.CurrentThread.CurrentUICulture.TwoLetterISOLanguageName;

        protected void Page_Load(object sender, EventArgs e)
        {
            //タイトルの設定
            messageTitle.InnerText = Resources.AuthorizedErrorMessageTitle;
            message.InnerText = Resources.AuthorizedErrorMessage;
        }
    }
}