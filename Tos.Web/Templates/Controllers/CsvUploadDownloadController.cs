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

namespace Tos.Web.Templates.Controllers
{
    //created from 【CsvUploadDownloadController(Ver2.0)】 Template
    public class CsvUploadDownloadController : ApiController
    {
        #region "CSVファイルの項目設定"

        private static readonly TextFieldSetting[] CsvFileSettings = new TextFieldSetting[]
        {
            //new TextFieldSetting() { PropertyName = "update", DisplayName = "更新区分：新規/更新=1、削除=2",
            //    ValidateRules = new Dictionary<string,object>()
            //    {
            //        {"range", new TextFieldSetting.Range(){Min = 0, Max = 2}}
            //    }
            //},
            //new TextFieldSetting() { PropertyName = "cd_buhin", DisplayName = "部品コード",
            //    ValidateRules = new Dictionary<string,object>()
            //    {
            //        {"required", true},
            //        {"number", true}
            //    }
            //},
            //new TextFieldSetting() { PropertyName = "nm_buhin", DisplayName = "部品名", WrapChar = "\"",
            //    ValidateRules = new Dictionary<string,object>()
            //    {
            //        {"maxlength", 50}
            //    }
            //},
        };

        #endregion
       
        #region "Controllerで公開するAPI"

        /// <summary>
        /// 検索条件に一致するデータを抽出しCSVを作成します。（Downloadフォルダに実体ファイル作成後、パスを返却）
        /// </summary>
        /// <param name="options">検索条件</param>
        /// <returns>作成されたCSVファイルのパス</returns>
        public HttpResponseMessage Get(ODataQueryOptions<object/*TODO:【1】CsvDownloadTableの型を指定します*/> options)
        {
            // 保存CSVファイル名（ユーザID_CsvDownload_現在日時.csv）
            string userName = UserInfo.GetUserNameFromIdentity(this.User.Identity);
            string filename = userName + "CsvDownload_"/*Properties.Resources.//TODO:DownloadFileNameの定数を指定します*/;
            string csvname = filename + DateTime.Now.ToString("yyyyMMddHHmmss") + Properties.Resources.CsvExtension;

            //using (/*TODO:CsvDownloadTable情報を管理しているDbContextを指定します*/ context = new /*TODO:CsvDownloadTable情報を管理しているDbContextを指定します*/())
            //{
            //     //テーブル（ビュー）の項目のみでダウンロードする場合は以下を使用します
            //    IQueryable results = options.ApplyTo(context./*TODO:【1】CsvDownloadTableの型を指定します*/.AsQueryable());

            //     //テーブル（ビュー）の項目＋更新区分を追加してダウンロードする場合は以下を使用します
            //    IEnumerable results = (from m in options.ApplyTo(context./*TODO:【1】CsvDownloadTableの型を指定します*/.AsQueryable()) as IEnumerable<Object/*TODO:【1】CsvDownloadTableの型を指定します*/>
            //                            select new Model_CsvUploadDownload()
            //                            {
            //                                update = 0,
            //                                cd_buhin = m.cd_buhin,
            //                                nm_buhin = m.nm_buhin,
            //                                kin_shiire = m.kin_shiire,
            //                                nm_tani = m.nm_tani
            //                            }).ToList();

                MemoryStream stream = new MemoryStream();
                //TextFieldFile<Object/*TODO:【2】CsvDownloadTableの型、もしくはModel_CsvUploadDownloadクラスを指定します*/> tFile 
                //                    = new TextFieldFile<Object/*TODO:【2】CsvDownloadTableの型、もしくはModel_CsvUploadDownloadクラスを指定します*/>(stream, 
                //                                                          Encoding.GetEncoding(Properties.Resources.Encoding), CsvFileSettings);
                //tFile.Delimiters = new string[] { "," };
                //// TODO: ヘッダーを有効にするには IsFirstRowHeader を true に設定にします。
                //tFile.IsFirstRowHeader = true;
                //tFile.WriteFields(results as IEnumerable<Object/*TODO:【2】CsvDownloadTableの型、もしくはModel_CsvUploadDownloadクラスを指定します*/>);

                return FileUploadDownloadUtility.CreateFileResponse(stream, csvname);
            //}
        }

        /// <summary>
        /// アップロードCSVから対象テーブルを更新します
        /// </summary>
        /// <returns></returns>
        public HttpResponseMessage Post()
        {
            string mapPath = HttpContext.Current.Server.MapPath(Properties.Settings.Default.UploadTempFolder);

            MultipartFormDataStreamProvider streamProvider = FileUploadDownloadUtility.ReadAsMultiPart(Request, mapPath);
            var file = streamProvider.FileData.FirstOrDefault();
            if (file == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, Properties.Resources.NoUploadDataError);
            }

            using (TextFieldFile<Object/*TODO:【2】CsvUploadTableの型、もしくはModel_CsvUploadDownloadクラスを指定します*/> tFile
                = new TextFieldFile<Object/*TODO:【2】CsvUploadTableの型、もしくはModel_CsvUploadDownloadクラスを指定します*/>(file.LocalFileName,
                    Encoding.GetEncoding(Properties.Resources.Encoding), CsvFileSettings))
            {
                SaveUploadCsv(tFile);

                if (tFile.RecordCount == 0)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, Properties.Resources.NoUploadDataError);
                }

                if (tFile.HasError)
                {
                    return createErrorCsv(tFile);
                }

                return Request.CreateResponse(HttpStatusCode.OK, Properties.Resources.FileSaveSuccessMessage);
            }
        }

        #endregion

        #region "Controller内で利用する関数群"

        /// <summary>
        /// アップロードCSVを読み込みます
        /// </summary>
        /// <returns></returns>
        private TextFieldFile<Object/*TODO:【2】CsvUploadTableの型、もしくはModel_CsvUploadDownloadクラスを指定します*/> SaveUploadCsv(TextFieldFile<Object/*TODO:【2】CsvUploadTableの型、もしくはModel_CsvUploadDownloadクラスを指定します*/> tFile)
        {
            tFile.Delimiters = new string[] { "," };
            // TODO: 1行目をヘッダーとして読み飛ばすには IsFirstRowHeader を true に設定にします。
            tFile.IsFirstRowHeader = true;
            // TODO: 1カラム目を更新区分として利用するには IsUseUpdateColumn を true に設定にします。
            //tFile.IsUseUpdateColumn = true;

            string userName = UserInfo.GetUserNameFromIdentity(this.User.Identity);
            DateTimeOffset nowDate = DateTimeOffset.Now;

            //using (/*TODO:CsvUploadTable情報を管理しているDbContextを指定します*/ context = new /*TODO:CsvUploadTable情報を管理しているDbContextを指定します*/())
            //{
            //    IObjectContextAdapter adapter = context as IObjectContextAdapter;
            //    DbConnection connection = adapter.ObjectContext.Connection;
            //    connection.Open();
            //    using (DbTransaction transaction = connection.BeginTransaction())
            //    {
            //        while (!tFile.EndOfData)
            //        {
            //            Object/*TODO:【2】CsvUploadTableの型、もしくはModel_CsvUploadDownloadクラスを指定します*/ target = tFile.ReadFields();
            //            if (target == null)
            //            {
            //                continue;
            //            }

            //            // TODO: 複合チェックやマスタチェックを行う場合にはここに実装し、エラー時に AddError メソッドを実行して下さい。
            //            //if (target.biko == null && target.nm_hinmei == null) {
            //            //    tFile.AddError("備考", target.biko, "備考、品名どちらかの値を設定してください。");
            //            //}

            //            SaveData(context, tFile, target, userName, nowDate);
            //        }

            //        if (tFile.RecordCount == 0 || tFile.HasError)
            //        {
            //            return tFile;
            //        }

            //        context.SaveChanges();
            //        transaction.Commit();
            //    }
            //}

            return tFile;
        }

        /// <summary>
        /// 読み込んだデータをDBに保存します
        /// </summary>
        /// <returns></returns>
        private void SaveData(System.Data.Entity.DbContext/*TODO:CsvUploadTable情報を管理しているDbContextを指定します*/ context, TextFieldFile<Object/*TODO:【2】CsvUploadTableの型、もしくはModel_CsvUploadDownloadクラスを指定します*/> tFile,
                                    Object/*TODO:【2】CsvUploadTableの型、もしくはModel_CsvUploadDownloadクラスを指定します*/ target, string userName, DateTimeOffset nowDate)
        {
            //target.cd_update = userName;
            //target.dt_update = nowDate;

            ///*TODO:【1】CsvUploadTableの型を指定します*/ dbTarget = context./*TODO:【1】CsvUploadTableの型を指定します*/.Find(target./*TODO:Key項目を指定します*/);

            ///*TODO:1カラム目を更新区分として利用する場合は、以下のロジックもコメント解除する */
            ////if (target.update.ToString() == CsvUpdateColumn.Delete)
            ////{
            ////    if (dbTarget != null) 
            ////    {
            ////        context./*TODO:【1】CsvUploadTableの型を指定します*/.Remove(dbTarget);
            ////    }
            ////}
            ////else if (target.update.ToString() == CsvUpdateColumn.CreateUpdate)
            ////{
            //    if (dbTarget == null)
            //    {
            //        target.cd_create = userName;
            //        target.dt_create = nowDate;
            //        /*TODO:【1】CsvUploadTableの型を指定します*/ newTarget = DataCopier.ReFill</*TODO:【1】CsvUploadTableの型を指定します*/>(target);
            //        context./*TODO:【1】CsvUploadTableの型を指定します*/.Add(newTarget);
            //    }
            //    else
            //    {
            //        target.cd_create = dbTarget.cd_create;
            //        target.dt_create = dbTarget.dt_create;
            //        DataCopier.ReFill(target, dbTarget);
            //    }
            ///*TODO:1カラム目を更新区分として利用する場合は、以下のロジックもコメント解除する */
            ////}

            ///*TODO:データ保存時のSQLエラーもエラーCSVに書き出す場合は、以下のロジックもコメント解除する　※取込処理のレスポンスが落ちるため注意！ */
            //try
            //{
            //    context.SaveChanges();
            //}
            //catch (Exception ex)
            //{
            //    // SQL発行時に発生したエラーをクライアントに返却する用のメッセージを設定します
            //    List<TextFieldError> errorList = TextFiedlFileUtility.GetExceptionMessage(ex);
            //    foreach (TextFieldError error in errorList)
            //    {
            //        tFile.AddError(error.ColumnName, error.ErrorValue, error.ErrorMessage);
            //    }
            //    try
            //    {
            //        // エラーが発生した対象行の状態を変更なしに設定します
            //        if (dbTarget == null)
            //        {
            //            context.Entry<Object/*TODO:【1】CsvUploadTableの型を指定します*/>(target).State = System.Data.EntityState.Detached;
            //        }
            //        else
            //        {
            //            context.Entry<Object/*TODO:【1】CsvUploadTableの型を指定します*/>(dbTarget).State = System.Data.EntityState.Detached;
            //        }
            //    }
            //    catch (Exception) { }
            //}
        }

        /// <summary>
        /// エラー情報CSVを作成します
        /// </summary>
        /// <returns></returns>
        private HttpResponseMessage createErrorCsv(TextFieldFile<Object/*TODO:【2】CsvUploadTableの型、もしくはModel_CsvUploadDownloadクラスを指定します*/> tFile)
        {
            // 保存Csvファイル名（ユーザID_downloadError_現在日時.csv）
            string name = UserInfo.GetUserNameFromIdentity(this.User.Identity);
            string filename = name + "UploadError_"/*Properties.Resources.//TODO:UploadErrorFileNameの定数を指定します*/;
            string csvName = filename + DateTime.Now.ToString("yyyyMMddHHmmss") + Properties.Resources.CsvExtension;
            MemoryStream stream = tFile.GetErrorStream();
            stream.Position = 0;
            return FileUploadDownloadUtility.CreateFileResponse(HttpStatusCode.BadRequest, stream, csvName);
        }

        #endregion
    }

    #region "ControllerのAPIで利用するリクエスト・レスポンスクラスです"

    /// <summary>
    /// テーブル（ビュー）の項目＋更新区分を追加してアップロード・ダウンロードする場合に、追加する項目を定義します
    /// </summary>
    public class Model_CsvUploadDownload : object/*TODO:【1】CsvDownTableの型を指定します*/
    {
        public int update { get; set; }
    }

    #endregion

}
