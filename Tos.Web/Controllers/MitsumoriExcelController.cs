/** 最終更新日 : 2016-10-17 **/
using System;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using Tos.Web.Controllers.Helpers;
using Tos.Web.Logging;
using Tos.Web.Data;
using System.Web.Http.OData.Query;
using System.Collections.Generic;

namespace Tos.Web.Controllers
{
    public class MitsumoriExcelController : ApiController
    {
        /// <summary>
        /// 検索条件に一致するデータを抽出しExcelを作成します。（Downloadフォルダに実体ファイル作成後、パスを返却）
        /// </summary>
        /// <param name="options">検索条件</param>
        /// <returns>作成されたExcelファイルのパス</returns>
        public string Get(ODataQueryOptions<Mitsumori> options)
        {
            try
            {
                // ユーザID取得
                string name = UserInfo.GetUserNameFromIdentity(this.User.Identity);

                // 読込テンプレートファイルパス
                string templatepath = HttpContext.Current.Server.MapPath(Properties.Settings.Default.ExcelTemplateFolder);
                string dirTemlates = templatepath + "\\" + Properties.Resources.MitsumoriExcelTemplateFile ;
                // 一時保存フォルダパスの取得
                string dirDownload = HttpContext.Current.Server.MapPath(Properties.Settings.Default.DownloadTempFolder);
                // 保存Excelファイル名（ユーザID_download_現在日時.xlsx）
                string filename = name + Properties.Resources.MitsumoriDownload;
                string excelname = filename+ DateTime.Now.ToString("yyyyMMddHHmmss") + Properties.Resources.ExcelExtension;
                // 既存ファイル削除（前回までの一時保存ファイルを削除）
                FileUploadDownloadUtility.deleteTempFile(dirDownload, filename);

                // テンプレートを読み込み、必要な情報をマッピングしてクライアントへ返却
                ExcelFile excelFile = new ExcelFile(dirTemlates);
                using (SampleEntities context = new SampleEntities())
                {
                    // データ取得
                    IEnumerable<Mitsumori> results = options.ApplyTo(context.Mitsumori.AsQueryable()) as IEnumerable<Mitsumori>;
                    // EXCEL編集
                    EditExcelFile(excelFile, results.ToArray());
                }

                ///ファイル作成（ファイルが存在しているときは、上書きする）
                using (FileStream fs = new FileStream(dirDownload + "\\" + excelname, FileMode.Create, FileAccess.Write))
                {
                    //バイト型配列の内容をすべて書き込む
                    fs.Write(
                        ((MemoryStream)excelFile.Stream).ToArray(),
                        0,
                        ((MemoryStream)excelFile.Stream).ToArray().Length
                    );
                }
                ((MemoryStream)excelFile.Stream).Close();
                
                //ファイルパス返却
                return VirtualPathUtility.ToAbsolute(Properties.Settings.Default.DownloadTempFolder + "\\" + excelname);
            }
            catch (Exception ex)
            {
                // 例外をエラーログに出力します。
                Logger.App.Error(ex.Message, ex);

                // 空文字返却
                return "";
            }
        }

        //EXCELファイルへの値のマッピング
        private void EditExcelFile(ExcelFile excelFile, Mitsumori[] data)
        {
            // シートデータへ値をマッピング
            // ヘッダはテンプレートに設定している為、2行目から明細設定
            int index = 2;
            UInt32 styleIndexA = 0;
            UInt32 styleIndexB = 0;
            UInt32 styleIndexC = 0;
            UInt32 styleIndexD = 0;
            UInt32 styleIndexE = 0;
            UInt32 styleIndexF = 0;
            UInt32 styleIndexG = 0;

            foreach (var item in data)
            {
                if (index == 2)
                {
                    styleIndexA = excelFile.GetStyleIndex("Sheet1", "A" + index);
                    styleIndexB = excelFile.GetStyleIndex("Sheet1", "B" + index);
                    //背景色設定
                    styleIndexC = excelFile.SetBackgroundColor("Sheet1", "C" + index, "FF0000", false);
                    //文字スタイル設定
                    styleIndexC = excelFile.SetFontStyle("Sheet1", "C" + index, "FFFF00", true, false);
                    //文字配置設定
                    styleIndexD = excelFile.SetAlignmentStyle("Sheet1", "D" + index, "Center", "Center", false, false);
                    styleIndexE = excelFile.GetStyleIndex("Sheet1", "E" + index);
                    styleIndexF = excelFile.GetStyleIndex("Sheet1", "F" + index);
                    styleIndexG = excelFile.GetStyleIndex("Sheet1", "G" + index);
                }

                // 見積番号
                excelFile.UpdateValue("Sheet1", "A" + index, item.no_mitsumori.ToString(), styleIndexA, false, false);
                // 取引先コード
                excelFile.UpdateValue("Sheet1", "B" + index, item.cd_torihiki.ToString(), styleIndexB, false, false);
                // 品名
                excelFile.UpdateValue("Sheet1", "C" + index, item.nm_hinmei, styleIndexC, true, false);
                // 支払い区分
                excelFile.UpdateValue("Sheet1", "D" + index, item.cd_shiharai.ToString(), styleIndexD, true, false);
                // 備考
                excelFile.UpdateValue("Sheet1", "E" + index, item.biko, styleIndexE, true, false);
                excelFile.UpdateValue("Sheet1", "F" + index, "", styleIndexF, false, false);
                // セルのマージ
                excelFile.MergeCells("Sheet1", "E" + index, "F" + index, false);
                // 計算式の設定
                string folumaText = "=A" + index + "*B" + index;
                excelFile.UpdateCellFormula("Sheet1", "G" + index, folumaText, styleIndexG, false);
                // 行の高さの設定
                excelFile.SetRowHeight("Sheet1", (UInt32)index, 50, false);

                index++;
            }

            // シートの保護（シート名）
            excelFile.ProtectedSheet("Sheet1", "", false);
            // セルの編集の許可（シート名、編集許可名、編集許可範囲）
            excelFile.ProtectCancelCells("Sheet1", "title", "A2", "E" + index, false);
            // シートの保存（シート名）
            excelFile.SaveSheet("Sheet1");

        }

    }
}
