/** 最終更新日 : 2018-06-18 **/
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Security;
using Tos.Web.Properties;
using System.Text.RegularExpressions;

namespace Tos.Web
{
    public partial class SiteMaster : System.Web.UI.MasterPage
    {
        //ブラウザの言語取得
        public readonly string lang = System.Threading.Thread.CurrentThread.CurrentUICulture.TwoLetterISOLanguageName;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (Page.IsPostBack)
            {
                if (isLogout.Value.ToLower() == true.ToString().ToLower())
                {
                    SignOut();
                }
            } 
        }

        protected void Page_PreRender(object sender, EventArgs e)
        {
            this.Page.ClientScript.GetPostBackEventReference(this, string.Empty);
        }
                
        private void SignOut()
        {
            FormsAuthentication.SignOut();
            FormsAuthentication.RedirectToLoginPage();
        }

        /// <summary>
        /// 指定された画面名（999_画面名）よりウインドウタイトルを組み立てる
        /// </summary>
        /// <param name="title"></param>
        /// <returns></returns>
        protected string GetPageTitle(string title)
        {
            // タイトルからシステム番号を取得する正規表現
            Regex dispNumRegex = new Regex(@"^\d{3}_"),
                  dispChar = new Regex(@"\D");

            string sysNum = dispNumRegex.IsMatch(title) ?
                "_" + dispChar.Replace(dispNumRegex.Match(title).Value, String.Empty) : String.Empty;
            string dispName = dispNumRegex.Replace(title, String.Empty);
            return String.Format("{0}({1}{2})", dispName, Properties.Settings.Default.TitleSystemNo, sysNum);
        }

        /// <summary>
        /// クライアントから要求されるURLにファイル更新日を付加する
        /// </summary>
        /// <param name="fileName"></param>
        /// <returns></returns>
        public string GetUrlWithLastUpdateTime(string fileName)
        {
#if DEBUG
            string update = System.IO.File.GetLastWriteTime(Request.PhysicalApplicationPath + fileName.Remove(0, 2)).ToString("yyyyMMddHHmmss");
#else
            string update = Settings.Default.buildDate;
#endif
            return ResolveUrl(fileName) + "?_=" + update;

        }

        /// <summary>
        /// 開発中アプリケーションの場合、ヘッダーに環境名を表示する
        /// </summary>
        /// <returns></returns>
        protected string GetDeployEnviromentName()
        {
#if UNDER_DEVELOPMENT
            string enviromentName = Properties.Settings.Default.DeployEnviromentName;
#else
            string enviromentName = "";
#endif
            return enviromentName;
        }

        /// <summary>
        /// 開発中アプリケーションの場合、ヘッダーにテスト用クラスを追加する
        /// </summary>
        /// <returns></returns>
        protected string GetDeployEnviromentClass()
        {
#if UNDER_DEVELOPMENT
            string enviromentClass = Properties.Settings.Default.DeployEnviromentClass;
#else
            string enviromentClass = "";
#endif
            return enviromentClass;
        }

    }
}
