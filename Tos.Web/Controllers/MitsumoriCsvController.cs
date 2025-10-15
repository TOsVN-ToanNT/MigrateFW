/** 最終更新日 : 2016-10-17 **/
using System;
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
    public class MitsumoriCSVController : ApiController
    {

        private static readonly TextFieldSetting[] MitsumoriFileSettings = new TextFieldSetting[]
        {
            new TextFieldSetting() { PropertyName = "no_mitsumori", DisplayName = "見積番号", Format="00000",
                ValidateRules = new Dictionary<string, object>()
                {
                    { "required" , true},
                    { "integer" , false}
                }
            },
            new TextFieldSetting() { PropertyName = "cd_torihiki", DisplayName = "取引先コード", 
                RegexValidation = "\\d{6}", RegexErrorMessage = "数値6桁で入力してください",
                ValidateRules = new Dictionary<string, object>()
                {
                    { "required" , true}
                }
            },
            new TextFieldSetting() { PropertyName = "nm_hinmei", DisplayName = "品名",
                ValidateRules = new Dictionary<string, object>()
                {
                    { "maxlength" , 200}
                }
            },
            new TextFieldSetting() { PropertyName = "cd_shiharai", DisplayName = "支払コード",
                ValidateRules = new Dictionary<string, object>()
                {
                    { "integer" , false},
                    { "range" , new TextFieldSetting.Range(){ Min = 1, Max = 4 }}
                }
            },
            new TextFieldSetting() { PropertyName = "biko", DisplayName = "備考",
                ValidateRules = new Dictionary<string, object>()
                {
                    { "maxlength" , 200},
                }
            },
            new TextFieldSetting() { PropertyName = "flg_del", DisplayName = "削除フラグ", Format = "bit",
                ValidateRules = new Dictionary<string, object>()
                {
                    { "bit" , true}
                }            
            },
            new TextFieldSetting() { PropertyName = "dt_create", DisplayName = "作成日", Format = "yyyyMMdd",
                ValidateRules = new Dictionary<string, object>()
                {
                    { "date" , "yyyyMMdd"}
                }
            }
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
                string userName = UserInfo.GetUserNameFromIdentity(this.User.Identity);
                string dirDownload = HttpContext.Current.Server.MapPath(Properties.Settings.Default.DownloadTempFolder);

                using (SampleEntities context = new SampleEntities())
                {
                    // 保存CSVファイル名（ユーザID_mitsumori_現在日時.csv）
                    string filename = userName + Properties.Resources.MitsumoriDownload;
                    string csvname = filename + DateTime.Now.ToString("yyyyMMddHHmmss") + Properties.Resources.CsvExtension;
                    FileUploadDownloadUtility.deleteTempFile(dirDownload, filename);

                    IQueryable results = options.ApplyTo(context.Mitsumori.AsQueryable());
                    
                    MemoryStream stream = new MemoryStream();
                    TextFieldFile<Mitsumori> tFile = new TextFieldFile<Mitsumori>(stream, Encoding.GetEncoding(Properties.Resources.Encoding), MitsumoriFileSettings);
                    tFile.Delimiters = new string[] { "," };
                    // TODO: ヘッダーを有効にするには IsFirstRowHeader を true に設定にします。
                    tFile.IsFirstRowHeader = true;
                    tFile.WriteFields(results as IEnumerable<Mitsumori>);

                    using (FileStream fs = new FileStream(dirDownload + "\\" + csvname, FileMode.Create, FileAccess.Write))
                    {
                        fs.Write(stream.ToArray(), 0, stream.ToArray().Length);
                    }

                    //ファイルパス返却
                    return VirtualPathUtility.ToAbsolute(Properties.Settings.Default.DownloadTempFolder + "\\" + csvname);
                }
            }
            catch (Exception ex)
            {
                Logger.App.Error(ex.Message, ex);
                return "";

            }
        }

        /// <summary>
        /// アップロードCSVから対象テーブルを更新します
        /// </summary>
        /// <returns></returns>
        public HttpResponseMessage Post()
        {
            string mapPath = HttpContext.Current.Server.MapPath(Properties.Settings.Default.UploadTempFolder);

            try
            {
                MultipartFormDataStreamProvider streamProvider = FileUploadDownloadUtility.ReadAsMultiPart(Request, mapPath);
                var file = streamProvider.FileData.FirstOrDefault();
                if (file == null)
                {
                    return FileUploadDownloadUtility.CreateFailResponse(HttpStatusCode.InternalServerError, Properties.Resources.NoUploadDataError);
                }

                using (TextFieldFile<Mitsumori> tFile = new TextFieldFile<Mitsumori>(file.LocalFileName, Encoding.GetEncoding(Properties.Resources.Encoding), MitsumoriFileSettings))
                {
                    SaveUploadCsv(tFile);

                    if (tFile.RecordCount == 0)
                    {
                        return FileUploadDownloadUtility.CreateFailResponse(HttpStatusCode.BadRequest, Properties.Resources.NoUploadDataError);
                    }

                    if (tFile.HasError)
                    {
                        var errorCsvPath = createErrorCsv(tFile);
                        return FileUploadDownloadUtility.CreateFailResponse(
                                                            HttpStatusCode.InternalServerError,
                                                            Properties.Resources.RaiseFileUploadServerError,
                                                            new { url = errorCsvPath });
                    }

                    return FileUploadDownloadUtility.CreateSuccessResponse(
                                                            Properties.Resources.FileSaveSuccessMessage, 
                                                            new { count = tFile.RecordCount });
                }
            }
            catch (Exception ex)
            {
                Logger.App.Error(ex.Message, ex);
                return FileUploadDownloadUtility.CreateFailResponse(HttpStatusCode.InternalServerError,Properties.Resources.RaiseFileUploadServerError);
            }
        }

        /// <summary>
        /// アップロードCSVを読み込みます
        /// </summary>
        /// <returns></returns>
        private TextFieldFile<Mitsumori> SaveUploadCsv(TextFieldFile<Mitsumori> tFile)
        {
            tFile.Delimiters = new string[] { "," };
            // TODO: ヘッダーを読み飛ばすにはにするには IsFirstRowHeader を true に設定にします。
            tFile.IsFirstRowHeader = true;
            // TODO: 1カラム目を更新区分として利用するには IsUseUpdateColumn を true に設定にします。
//            tFile.IsUseUpdateColumn = true;

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
                        Mitsumori target = tFile.ReadFields();
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

                    if (tFile.RecordCount == 0)
                    {
                        return tFile;
                    }

                    if (tFile.HasError)
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
        private void SaveData(SampleEntities context, TextFieldFile<Mitsumori> tFile, Mitsumori target, string userName, DateTimeOffset nowDate)
        {
            target.cd_update = userName;
            target.dt_update = nowDate;

            Mitsumori dbTarget = context.Mitsumori.Find(target.no_mitsumori);
            if (dbTarget == null)
            {
                target.cd_create = userName;
                target.dt_create = nowDate;
                context.Mitsumori.Add(target);
            }
            else
            {
                target.cd_create = dbTarget.cd_create;
                target.dt_create = dbTarget.dt_create;
                DataCopier.ReFill(target, dbTarget);
            }

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
                        context.Entry<Mitsumori>(target).State = System.Data.EntityState.Detached;
                    }
                    else
                    {
                        context.Entry<Mitsumori>(dbTarget).State = System.Data.EntityState.Detached;
                    }
                }
                catch (Exception) { }
            }
        }

        /// <summary>
        /// エラー情報CSVを作成します
        /// </summary>
        /// <returns></returns>
        private string createErrorCsv(TextFieldFile<Mitsumori> tFile)
        {
            string name = UserInfo.GetUserNameFromIdentity(this.User.Identity);
            string dirDownload = HttpContext.Current.Server.MapPath(Properties.Settings.Default.DownloadTempFolder);

            // 保存Excelファイル名（ユーザID_download_現在日時.xlsx）
            string filename = name + Properties.Resources.MitsumoriUploadError;
            string csvName = filename + DateTime.Now.ToString("yyyyMMddHHmmss") + Properties.Resources.CsvExtension;
            FileUploadDownloadUtility.deleteTempFile(dirDownload, filename);

            using (FileStream fs = new FileStream(dirDownload + "\\" + csvName, FileMode.Create, FileAccess.Write))
            {
                fs.Write(tFile.GetErrorStream().ToArray(), 0, tFile.GetErrorStream().ToArray().Length);
            }

            return VirtualPathUtility.ToAbsolute(Properties.Settings.Default.DownloadTempFolder + "\\" + csvName);
        }

    }

}
