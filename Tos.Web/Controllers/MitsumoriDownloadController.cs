/** 最終更新日 : 2016-10-17 **/
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web.Http;
using System.Web.Http.OData.Query;
using Tos.Web.Controllers.Helpers;
using Tos.Web.Logging;
using Tos.Web.Data;
using System.Web;

namespace Tos.Web.Controllers
{
    public class MitsumoriDownloadController : ApiController
    {
        //作成するCSVのレイアウトを定義します
        private static readonly TextFieldSetting[] MitsumoriFileSettings = new TextFieldSetting[]
        {
            new TextFieldSetting() { PropertyName = "no_mitsumori", DisplayName = "見積番号", Format="00000"},
            new TextFieldSetting() { PropertyName = "cd_torihiki", DisplayName = "取引先コード"},
            new TextFieldSetting() { PropertyName = "nm_hinmei", WrapChar = "\"", DisplayName = "品名"},
            new TextFieldSetting() { PropertyName = "cd_shiharai", DisplayName = "支払コード" },
            new TextFieldSetting() { PropertyName = "biko", DisplayName = "備考" },
        };

        /// <summary>
        /// 検索条件に一致するデータを抽出しCSVを作成します。（Downloadフォルダに実体ファイル作成後、パスを返却）
        /// </summary>
        /// <param name="options">検索条件</param>
        /// <returns>作成されたCSVファイルのパス</returns>
        public string Get(ODataQueryOptions<Mitsumori> options)
        {
            try
            {
                // ユーザID取得
                string name = UserInfo.GetUserNameFromIdentity(this.User.Identity);

                // 一時保存フォルダパスの取得
                string dirDownload = HttpContext.Current.Server.MapPath(Properties.Settings.Default.DownloadTempFolder);
                // 保存CSVファイル名（ユーザID_mitsumori_現在日時.csv）
                string filename = name + Properties.Resources.MitsumoriDownload;
                string csvname = filename + DateTime.Now.ToString("yyyyMMddHHmmss") + Properties.Resources.CsvExtension;
                // 同一ユーザの前回ファイルの削除
                FileUploadDownloadUtility.deleteTempFile(dirDownload, filename);

                using (var context = new SampleEntities())
                {
                    IQueryable results = options.ApplyTo(context.Mitsumori.AsQueryable());

                    MemoryStream stream = new MemoryStream();
                    TextFieldFile<Mitsumori> tFile = new TextFieldFile<Mitsumori>(stream, Encoding.GetEncoding(Properties.Resources.Encoding), MitsumoriFileSettings);
                    tFile.Delimiters = new string[] { "," };
                    // TODO: ヘッダーを有効にするには IsFirstRowHeader を true に設定にします。
                    tFile.IsFirstRowHeader = true;
                    tFile.WriteFields(results as IEnumerable<Mitsumori>);

                    ///ファイル作成（ファイルが存在しているときは、上書きする）
                    using (FileStream fs = new FileStream(dirDownload + "\\" + csvname, FileMode.Create, FileAccess.Write))
                    {
                        //バイト型配列の内容をすべて書き込む
                        fs.Write(stream.ToArray(), 0, stream.ToArray().Length);
                    }

                    //ファイルパス返却
                    return VirtualPathUtility.ToAbsolute(Properties.Settings.Default.DownloadTempFolder + "\\" + csvname);
                }
            }
            catch (Exception ex)
            {
                // 例外をエラーログに出力します。
                Logger.App.Error(ex.Message, ex);
                // 空文字返却
                return "";

            }
        }

    }
}
