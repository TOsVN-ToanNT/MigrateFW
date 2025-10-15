/** 最終更新日 : 2016-10-17 **/
using System;
using System.Collections.Generic;
using System.Web;
using System.Net.Http;
using System.Net;
using System.Web.Script.Serialization;
using System.Text;
using System.IO;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Threading;
using System.Web.Http;

namespace Tos.Web.Controllers.Helpers
{
    /// <summary>
    /// クライアント側にHttpResposeMessageを返すためのユーティリティクラスです。
    /// </summary>
    public static class FileUploadDownloadUtility
    {
        private static readonly string RequestClientKeyName = Properties.Resources.RequestClientKeyName;
        private static readonly string ResponseHtmlFormat = Properties.Resources.ResponseHtmlFormat;

        /// <summary>
        /// 指定された文字列をテキストファイルとしてダウンロードするためのレスポンスを生成します。
        /// </summary>
        /// <param name="content">コンテンツ</param>
        /// <param name="fileName">ファイル名</param>
        /// <returns>レスポンス</returns>
        public static HttpResponseMessage CreateFileResponse(string content, string fileName)
        {
            return CreateFileResponse(new MemoryStream(Encoding.GetEncoding(Properties.Resources.Encoding).GetBytes(content)), fileName);
        }

        /// <summary>
        /// 指定されたバイト配列をファイルとしてダウンロードするためのレスポンスを生成します。
        /// </summary>
        /// <param name="content">コンテンツ</param>
        /// <param name="fileName">ファイル名</param>
        /// <returns>レスポンス</returns>
        public static HttpResponseMessage CreateFileResponse(byte[] content, string fileName)
        {
            return CreateFileResponse(new MemoryStream(content), fileName);
        }

        /// <summary>
        /// 指定されたストリームをファイルとしてダウンロードするためのレスポンスを生成します。
        /// </summary>
        /// <param name="responseStream">コンテンツストリーム</param>
        /// <param name="fileName">ファイル名</param>
        /// <returns>レスポンス</returns>
        public static HttpResponseMessage CreateFileResponse(Stream responseStream, string fileName)
        {
            return CreateFileResponse(HttpStatusCode.OK, responseStream, fileName);
        }

        /// <summary>
        /// 指定されたストリームをファイルとしてダウンロードするためのレスポンスを生成します。
        /// </summary>
        /// <param name="responseStream">コンテンツストリーム</param>
        /// <param name="fileName">ファイル名</param>
        /// <returns>レスポンス</returns>
        public static HttpResponseMessage CreateFileResponse(HttpStatusCode satusCode, Stream responseStream, string fileName)
        {
            HttpResponseMessage result = new HttpResponseMessage();
            result.StatusCode = satusCode;
            responseStream.Position = 0;
            result.Content = new StreamContent(responseStream);
            result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            result.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
            result.Content.Headers.ContentDisposition.FileName = HttpUtility.UrlEncode(fileName);

            result.Headers.CacheControl = new CacheControlHeaderValue { Private = true, MaxAge = TimeSpan.Zero };

            return result;
        }

        /// <summary>
        /// 成功のレスポンスを作成します。ステータスは自動的に OK に設定されます。
        /// </summary>
        /// <param name="message">クライアントに返すメッセージ</param>
        /// <param name="data">クライアントに返す付属データ</param>
        /// <returns>レスポンス</returns>
        public static HttpResponseMessage CreateSuccessResponse(string message, object data = null)
        {
            return CreateResponse(true, HttpStatusCode.OK, message, data);
        }

        /// <summary>
        /// 失敗のレスポンスを作成します。
        /// </summary>
        /// <param name="statusCode">HTTPステータス</param>
        /// <param name="message">クライアントに返すメッセージ</param>
        /// <param name="data">クライアントに返す付属データ</param>
        /// <returns>レスポンス</returns>
        public static HttpResponseMessage CreateFailResponse(HttpStatusCode statusCode, string message, object data = null)
        {
            return CreateResponse(false, statusCode, message, data);
        }

        /// <summary>
        /// レスポンスを生成します。
        /// </summary>
        /// <param name="result">成功の場合は true 、そうでない場合は false</param>
        /// <param name="status">HTTPステータス</param>
        /// <param name="message">クライアントに返すメッセージ</param>
        /// <param name="data">クライアントに返す付属データ</param>
        /// <returns>レスポンス</returns>
        private static HttpResponseMessage CreateResponse(bool result, HttpStatusCode status, string message, object data)
        {
            HttpResponseMessage res = new HttpResponseMessage(status);
            HttpRequest req = HttpContext.Current.Request;
            string key = req.Params[RequestClientKeyName];
            string targetOrigion = "*";

            if (req.UrlReferrer != null)
            {
                targetOrigion = string.Format("{0}{1}{2}",
                    req.UrlReferrer.Scheme,
                    Uri.SchemeDelimiter,
                    req.UrlReferrer.Host);
                if (!req.UrlReferrer.IsDefaultPort)
                {
                    targetOrigion += ":" + req.UrlReferrer.Port.ToString();
                }
            }

            Dictionary<string, object> resultData = new Dictionary<string, object>(){
				    {"key", key},
				    {"result", result},
				    {"message", message},
				    {"data", data}
			    };

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            string postMessageJson = serializer.Serialize(resultData);
            string dataJson = serializer.Serialize(data);

            res.Content = new StringContent(string.Format(ResponseHtmlFormat, postMessageJson, targetOrigion, key, result, ToNumericCharacterReference(message), dataJson), Encoding.UTF8, "text/html");
            return res;
        }

        /// <summary>
        /// 文字列を数値実体参照文字列に変換します。
        /// </summary>
        /// <param name="value">変換する文字列</param>
        /// <returns>変換された数値実体参照文字列</returns>
        private static string ToNumericCharacterReference(string value)
        {
            StringBuilder result = new StringBuilder();
            foreach (int v in value)
            {
                result.Append("&#x" + v.ToString("x") + ";");
            }
            return result.ToString();
        }

        /// <summary>
        /// アップロードされるファイルのサイズを検証します。
        /// </summary>
        /// <param name="contentLength">アップロードされるファイルのサイズ</param>
        /// <returns>エラーがある場合はエラーメッセージを返す。それ以外は空白文字を返す。</returns>
        private static void ValidateFileSize(long contentLength)
        {
            double fileSize = Math.Round(contentLength / Math.Pow(2, 10), 10);

            if (fileSize > Properties.Settings.Default.MaxUploadFileSize)
            {
                throw new ArgumentException(string.Format(Properties.Resources.FileSizeErrorMessage, Properties.Settings.Default.MaxUploadFileSize));
//                throw new ArgumentException(string.Format(Properties.Resources.FileSizeErrorMessage, fileSize));
            }

            if (fileSize <= 0)
            {
                throw new ArgumentException(Properties.Resources.NoFileDataMessage);
            }
        }

        /// <summary>
        /// アップロードされるファイルからバイト配列のデータを読み込みます。
        /// </summary>
        /// <param name="file">アップロードされるファイル</param>
        /// <returns>読み込まれたバイト配列のデータ</returns>
        public static byte[] GetBytesFromFile(MultipartFileData file)
        {

            byte[] data = null;

            using (Stream stream = new FileStream(file.LocalFileName, FileMode.Open, FileAccess.Read, FileShare.Read))
            {
                ValidateFileSize(stream.Length);
                using (BinaryReader reader = new BinaryReader(stream))
                {
                    data = reader.ReadBytes((int)stream.Length);
                }
            }

            return data;
        }

        /// <summary>
        /// マルチパートでアップロードされたファイルをローカルの一時フォルダに格納します。
        /// </summary>
        /// <param name="request">アップロードでクライアントから送信された HttpRequestMessage </param>
        /// <param name="path">一時フォルダのパス</param>
        /// <returns>MultipartFormDataStreamProvider のインスタンス</returns>
        public static MultipartFormDataStreamProvider ReadAsMultiPart(HttpRequestMessage request, string path)
        {

            if (!request.Content.IsMimeMultipartContent("form-data"))
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            MultipartFormDataStreamProvider streamProvider = new MultipartFormDataStreamProvider(path);

            Task.Factory.StartNew(() => streamProvider = request.Content.ReadAsMultipartAsync(streamProvider).Result,
                                  CancellationToken.None,
                                  TaskCreationOptions.LongRunning,
                                  TaskScheduler.Default)
                                  .Wait();

            return streamProvider;
        }

        /// <summary>
        /// 一時フォルダから一致する名称を含むファイルを削除する
        /// </summary>
        /// <param name="dirDownload">一時フォルダのパス</param>
        /// <param name="name">検索する文字列（ファイル名）</param>
        /// <returns>MultipartFormDataStreamProvider のインスタンス</returns>
        public static void deleteTempFile(string dirDownload, string name)
        {
            // 既存ファイル削除（前回までの一時保存フォルダを削除）
            string[] files = Directory.GetFiles(dirDownload);
            foreach (string s in files)
            {
                // ファイル名取得
                String[] strAry = s.Split('\\');
                String fileName = strAry[strAry.Length - 1];

                // 検索する文字列が含まれるものを削除
                if (fileName.IndexOf(name) >= 0)
                {
                    FileInfo cFileInfo = new FileInfo(s);

                    // 読み取り専用属性がある場合は、読み取り専用属性を解除
                    if ((cFileInfo.Attributes & FileAttributes.ReadOnly) == FileAttributes.ReadOnly)
                    {
                        cFileInfo.Attributes = FileAttributes.Normal;
                    }

                    // ファイルを削除する
                    cFileInfo.Delete();
                }
            }
        }
    }
}
