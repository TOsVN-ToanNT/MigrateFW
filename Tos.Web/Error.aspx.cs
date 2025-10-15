using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Net;
using Tos.Web.Properties;

namespace Tos.Web
{
	public partial class Error : System.Web.UI.Page
	{
        protected readonly string lang = System.Threading.Thread.CurrentThread.CurrentUICulture.TwoLetterISOLanguageName;

		protected void Page_Load(object sender, EventArgs e)
		{
            Exception exception = GetDisplayException(Server.GetLastError());
			Server.ClearError();

			//タイトルの設定
			messageTitle.InnerText = Resources.ErrorMessageTitle;

            if (exception != null) {
                //例外詳細の設定
                message.InnerText = exception.Message;
                stacktrace.InnerText = exception.StackTrace;
            }
		}

        private Exception GetDisplayException(Exception ex) {
            if (ex == null) {
                return null;
            }
            if (ex.InnerException != null) {
                ex = ex.InnerException;
            }
            return ex;
        }
	}
}