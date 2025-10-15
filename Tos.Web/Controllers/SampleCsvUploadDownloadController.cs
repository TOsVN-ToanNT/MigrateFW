/** 最終更新日 : 2016-10-17 **/
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.Entity.Infrastructure;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Http.OData.Query;
using Tos.Web.Controllers.Helpers;
using Tos.Web.Data;
using Tos.Web.Logging;

namespace Tos.Web.Controllers
{
    public class SampleCsvUploadDownloadController : ApiController
    {

        private static readonly TextFieldSetting[] BuhinFileSettings = new TextFieldSetting[]
        {
            new TextFieldSetting() { PropertyName = "update", DisplayName = "更新区分：更新=1、削除=2",
                ValidateRules = new Dictionary<string, object>()
                {
                    {"integer", false},
                    {"range", new TextFieldSetting.Range(){Min = 0, Max = 2}}
                }
            },
            new TextFieldSetting() { PropertyName = "cd_buhin", DisplayName = "部品コード",
                ValidateRules = new Dictionary<string, object>()
                {
                    {"required", true},
                    {"integer", false}
                }
            },
            new TextFieldSetting() { PropertyName = "nm_buhin", DisplayName = "部品名",
                ValidateRules = new Dictionary<string, object>()
                {
                    {"maxlength", 50}
                }
            },
            new TextFieldSetting() { PropertyName = "kin_shiire", DisplayName = "仕入金額",
                ValidateRules = new Dictionary<string, object>() 
                {
                    {"pointlength", new TextFieldSetting.PointLength(){ BeforePoint = 8, AfterPoint = 2, AllowNegativeNumber = false }}
                }
            },
            new TextFieldSetting() { PropertyName = "nm_tani", DisplayName = "単位",
                ValidateRules = new Dictionary<string, object>()
                {
                    {"maxlength", 4}
                }
            }
        };

        /// <summary>
        /// 検索条件に一致するデータを抽出しCSVを作成します。（Downloadフォルダに実体ファイル作成後、パスを返却）
        /// </summary>
        /// <param name="options">検索条件</param>
        /// <returns>作成されたCSVファイルのパス</returns>
        public HttpResponseMessage Get(ODataQueryOptions<Buhin> options)
        {
            // 保存CSVファイル名（ユーザID_Buhin_現在日時.csv）
            string userName = UserInfo.GetUserNameFromIdentity(this.User.Identity);
            string filename = userName + Properties.Resources.BuhinDownload;
            string csvname = filename + DateTime.Now.ToString("yyyyMMddHHmmss") + Properties.Resources.CsvExtension;

            using (SampleEntities context = new SampleEntities())
            {
                IEnumerable results = (from m in options.ApplyTo(context.Buhin.AsQueryable()) as IEnumerable<Buhin>
                                       select new Buhin_CsvUploadDownload()
                                        {
                                            update = 0,
                                            cd_buhin = m.cd_buhin,
                                            nm_buhin = m.nm_buhin,
                                            kin_shiire = m.kin_shiire,
                                            nm_tani = m.nm_tani
                                        }).ToList();

                MemoryStream stream = new MemoryStream();
                TextFieldFile<Buhin_CsvUploadDownload> tFile = new TextFieldFile<Buhin_CsvUploadDownload>(stream, Encoding.GetEncoding(Properties.Resources.Encoding), BuhinFileSettings);
                tFile.Delimiters = new string[] { "," };
                // TODO: ヘッダーを有効にするには IsFirstRowHeader を true に設定にします。
                tFile.IsFirstRowHeader = true;
                tFile.WriteFields(results as IEnumerable<Buhin_CsvUploadDownload>);

                return FileUploadDownloadUtility.CreateFileResponse(stream, csvname);
            }
        }

        /// <summary>
        /// アップロードCSVから対象テーブルを更新します
        /// </summary>
        /// <returns></returns>
        public HttpResponseMessage Post()
        {
            string mapPath = HttpContext.Current.Server.MapPath(Properties.Settings.Default.UploadTempFolder);
            MultipartFormDataStreamProvider streamProvider = FileUploadDownloadUtility.ReadAsMultiPart(Request, mapPath);
            MultipartFileData file = streamProvider.FileData.FirstOrDefault();

            if (file == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, Properties.Resources.NoUploadDataError);
            }

            using (TextFieldFile<Buhin_CsvUploadDownload> tFile = new TextFieldFile<Buhin_CsvUploadDownload>(file.LocalFileName,
                    Encoding.GetEncoding(Properties.Resources.Encoding), BuhinFileSettings))
            {
                SaveUploadCsv(tFile);

                if (tFile.RecordCount == 0)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, Properties.Resources.NoUploadDataError);
                }

                if (tFile.HasError)
                {
                    return CreateErrorCsv(tFile);
                }

                return Request.CreateResponse(HttpStatusCode.OK, Properties.Resources.FileSaveSuccessMessage);
            }
        }

        /// <summary>
        /// アップロードCSVを読み込みます
        /// </summary>
        /// <returns></returns>
        private TextFieldFile<Buhin_CsvUploadDownload> SaveUploadCsv(TextFieldFile<Buhin_CsvUploadDownload> tFile)
        {
            tFile.Delimiters = new string[] { "," };
            // TODO: 1行目をヘッダーとして読み飛ばすには IsFirstRowHeader を true に設定にします。
            tFile.IsFirstRowHeader = true;
            // TODO: 1カラム目を更新区分として利用するには IsUseUpdateColumn を true に設定にします。
            tFile.IsUseUpdateColumn = true;

            string userName = UserInfo.GetUserNameFromIdentity(this.User.Identity);
            DateTimeOffset nowDate = DateTimeOffset.Now;

            using (SampleEntities context = new SampleEntities())
            {
                IObjectContextAdapter adapter = context as IObjectContextAdapter;
                DbConnection connection = adapter.ObjectContext.Connection;
                connection.Open();
                using (DbTransaction transaction = connection.BeginTransaction())
                {
                    while (!tFile.EndOfData)
                    {
                        Buhin_CsvUploadDownload target = tFile.ReadFields();
                        if (target == null)
                        {
                            continue;
                        }

                        // TODO: 複合チェックやマスタチェックを行う場合にはここに実装し、エラー時に AddError メソッドを実行して下さい。
                        //if (target.biko == null && target.nm_hinmei == null) {
                        //    tFile.AddError("備考", target.biko, "備考、品名どちらかの値を設定してください。");
                        //}

                        SaveData(context, tFile, target, userName, nowDate);
                    }

                    if (tFile.RecordCount == 0 || tFile.HasError)
                    {
                        return tFile;
                    }

                    context.SaveChanges();
                    transaction.Commit();
                }
            }

            return tFile;
        }

        /// <summary>
        /// 読み込んだデータをDBに保存します
        /// </summary>
        /// <returns></returns>
        private void SaveData(SampleEntities context, TextFieldFile<Buhin_CsvUploadDownload> tFile,
                                    Buhin_CsvUploadDownload target, string userName, DateTimeOffset nowDate)
        {
            target.cd_update = userName;
            target.dt_update = nowDate;

            Buhin dbTarget = context.Buhin.Find(target.cd_buhin);
            
            if (target.update.ToString() == CsvUpdateColumn.Delete)
            {
                if (dbTarget != null) 
                {
                    context.Buhin.Remove(dbTarget);
                }
            }
            else if (target.update.ToString() == CsvUpdateColumn.CreateUpdate)
            {
                if (dbTarget == null)
                {
                    target.cd_create = userName;
                    target.dt_create = nowDate;
                    Buhin buhin = new Buhin();
                    DataCopier.ReFill(target, buhin);

                    context.Buhin.Add(buhin);
                }
                else
                {
                    target.cd_create = dbTarget.cd_create;
                    target.dt_create = dbTarget.dt_create;
                    DataCopier.ReFill(target, dbTarget);
                }
            }

            ///*TODO:データ保存時のSQLエラーもエラーCSVに書き出す場合は、以下のロジックもコメント解除する　※取込処理のレスポンスが落ちるため注意！ */
            try
            {
                context.SaveChanges();
            }
            catch (Exception ex)
            {
                // SQL発行時に発生したエラーをクライアントに返却する用のメッセージを設定します
                List<TextFieldError> errorList = TextFiedlFileUtility.GetExceptionMessage(ex);
                foreach (TextFieldError error in errorList)
                {
                    tFile.AddError(error.ColumnName, error.ErrorValue, error.ErrorMessage);
                }
                try
                {
                    // エラーが発生した対象行の状態を変更なしに設定します
                    if (dbTarget == null)
                    {
                        context.Entry<Buhin>(target).State = System.Data.EntityState.Detached;
                    }
                    else
                    {
                        context.Entry<Buhin>(dbTarget).State = System.Data.EntityState.Detached;
                    }
                }
                catch (Exception) { }
            }
        }

        /// <summary>
        /// エラー情報CSVを作成します
        /// </summary>
        /// <returns></returns>
        private HttpResponseMessage CreateErrorCsv(TextFieldFile<Buhin_CsvUploadDownload> tFile)
        {
            string name = UserInfo.GetUserNameFromIdentity(this.User.Identity);

            // 保存Excelファイル名（ユーザID_download_現在日時.xlsx）
            string filename = name + Properties.Resources.BuhinUploadError;
            string csvName = filename + DateTime.Now.ToString("yyyyMMddHHmmss") + Properties.Resources.CsvExtension;
            MemoryStream stream = tFile.GetErrorStream();
            stream.Position = 0;
            return FileUploadDownloadUtility.CreateFileResponse(HttpStatusCode.BadRequest, stream, csvName);
        }
    }

    #region "ControllerのAPIで利用するリクエスト・レスポンスクラスです"

    public class Buhin_CsvUploadDownload : Buhin
    {
        public int update { get; set; }
    }

    #endregion

}
