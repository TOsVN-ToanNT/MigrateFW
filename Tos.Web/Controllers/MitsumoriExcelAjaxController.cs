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
using System.Web.Hosting;
using System.Net.Http;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Mime;
using ClosedXML.Excel;

namespace Tos.Web.Controllers
{
    public class MitsumoriExcelAjaxController : ApiController
    {
        /// <summary>
        /// 検索条件に一致するデータを抽出しExcelを作成します。（Downloadフォルダに実体ファイル作成後、パスを返却）
        /// </summary>
        /// <param name="options">検索条件</param>
        /// <returns>作成されたExcelファイルのパス</returns>
        public HttpResponseMessage Get(ODataQueryOptions<Mitsumori> options)
        {
            // 読込テンプレートファイルパス
            string templatepath = HttpContext.Current.Server.MapPath(Properties.Settings.Default.ExcelTemplateFolder);
            string dirTemlates = templatepath + "\\" + Properties.Resources.MitsumoriExcelTemplateFile;

            // 保存Excelファイル名（ユーザID_download_現在日時.xlsx）
            string name = UserInfo.GetUserNameFromIdentity(this.User.Identity);
            string filename = name + Properties.Resources.MitsumoriDownload;
            string excelname = filename + DateTime.Now.ToString("yyyyMMddHHmmss") + Properties.Resources.ExcelExtension;

            using (SampleEntities context = new SampleEntities())
            {
                context.Configuration.ProxyCreationEnabled = false;
                IEnumerable<Mitsumori> results = options.ApplyTo(context.Mitsumori.AsQueryable()) as IEnumerable<Mitsumori>;

                // Excelテンプレートを読み込み、必要な情報をマッピングしてクライアントへ返却
                MemoryStream stream = EditExcelFileByClosedXML(dirTemlates, results);
                return FileUploadDownloadUtility.CreateFileResponse(stream, excelname);
            };
        }

        /// <summary>
        /// Excelファイルの作成（ClosedXML使用）
        /// </summary>
        /// <param name="dirTemlates">検索条件</param>
        /// <param name="data">バインドデータ</param>
        /// <returns>作成されたExcelファイルのMemoryStream</returns>
        private MemoryStream EditExcelFileByClosedXML(string dirTemlates, IEnumerable<Mitsumori> data)
        {
            // テンプレートFileを読み込み、必要な情報をマッピングしてクライアントへ返却
            using (XLWorkbook wb = new XLWorkbook())
            {
                using (FileStream templateStream = new FileStream(dirTemlates, FileMode.Open, FileAccess.Read, FileShare.Read))
                {
                    using (var wbSource = new XLWorkbook(templateStream))
                    {
                        for (int i = 1; i <= wbSource.Worksheets.Count; i++)
                        {
                            wbSource.Worksheet(i).CopyTo(wb, wbSource.Worksheet(i).Name);
                        }
                    }
                }

                var worksheet = wb.Worksheet("Sheet1");
                //明細行データの編集
                var rows = (from i in data
                            select new
                            {
                                i.no_mitsumori,
                                i.cd_torihiki,
                                i.nm_hinmei,
                                i.cd_shiharai,
                                i.biko
                            }).ToList();
                var detailRange = worksheet.Cell(2, 1).InsertData(rows);

                //明細行のフォーマット編集
                var detailRowNumber = detailRange.RangeAddress.LastAddress.RowNumber;
                worksheet.Range("A2:G" + detailRowNumber.ToString()).Style.Border.SetTopBorder(XLBorderStyleValues.Thin)
                                                                          .Border.SetBottomBorder(XLBorderStyleValues.Thin)
                                                                          .Border.SetLeftBorder(XLBorderStyleValues.Thin)
                                                                          .Border.SetRightBorder(XLBorderStyleValues.Thin);
                worksheet.Range("C2:C" + detailRowNumber.ToString()).Style.Fill.SetBackgroundColor(XLColor.Red)
                                                                          .Font.SetBold(true)
                                                                          .Font.SetFontColor(XLColor.Yellow);
                worksheet.Range("D2:D" + detailRowNumber.ToString()).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center)
                                                                          .Alignment.SetVertical(XLAlignmentVerticalValues.Center);
                // 計算式の設定
                worksheet.Range("A2:G" + detailRowNumber.ToString()).LastColumn().FormulaR1C1 = "=RC[-6]*RC[-5]";
                // 行の高さの設定
                worksheet.Rows().Height = 50;
                // フォント名の設定
                worksheet.Style.Font.FontName = "ＭＳ Ｐゴシック";
                // セルのマージ
                using (var rangeRows = worksheet.Range("E2:F" + detailRowNumber.ToString()).Rows())
                {
                    foreach (var row in rangeRows)
                    {
                        row.Merge();
                    }
                }
                // セルの編集の許可
                worksheet.Range("A2:E" + detailRowNumber.ToString()).Style.Protection.SetLocked(false);
                // シートの保護（シート名）
                worksheet.Protect();

                worksheet.Columns().AdjustToContents();
                
                wb.ReferenceStyle = XLReferenceStyle.R1C1;  // You can also change the reference notation:
                wb.CalculateMode = XLCalculateMode.Auto;  // And the workbook calculation mode:

                MemoryStream stream = new MemoryStream();
                wb.SaveAs(stream);
                return stream;
            }
        }
    }
}