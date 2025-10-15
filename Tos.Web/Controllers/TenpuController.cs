/** 最終更新日 : 2016-10-17 **/
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.Entity.Infrastructure;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Tos.Web.Controllers.Helpers;
using Tos.Web.Data;
using Tos.Web.Logging;

namespace Tos.Web.Controllers
{
    public class TenpuController : ApiController
    {

        // GET api/Tenpu?no_tenpu={no_tenpu}
        /// <summary>
        /// 添付ファイルをダウンロードします。
        /// </summary>
        /// <param name="no_tenpu">添付ファイル番号</param>
        /// <returns>添付ファイル</returns>
        public HttpResponseMessage Get(int no_tenpu)
        {
            Tenpu tenpu = null;
            using (SampleEntities context = new SampleEntities())
            {
                context.Configuration.ProxyCreationEnabled = false;
                tenpu = context.Tenpu.Find(no_tenpu);
            }

            if (tenpu == null) {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, Properties.Resources.NoFileExists);
            }

            return FileUploadDownloadUtility.CreateFileResponse(tenpu.file, tenpu.nm_file);
        }

        // GET api/Tenpu?no_mitsumori={no_mitsumori}
        /// <summary>
        /// 申請データに関連する添付ファイルのデータを取得します。
        /// </summary>
        /// <param name="no_mitsumori">見積番号</param>
        /// <returns>申請添付ファイルトランのリスト</returns>
        public IEnumerable<TenpuSummary> GetList(int no_mitsumori)
        {
            using (SampleEntities context = new SampleEntities())
            {
                context.Configuration.ProxyCreationEnabled = false;

                var query = (from tenpu in context.Tenpu
                             where tenpu.no_mitsumori == no_mitsumori
                             select new TenpuSummary()
                             {
                                 no_tenpu = tenpu.no_tenpu,
                                 no_mitsumori = tenpu.no_mitsumori,
                                 nm_file = tenpu.nm_file,
                                 ts = tenpu.ts
                             });

                return query.ToList();
            }
        }

        // POST api/Tenpu?no_mitsumori={no_mitsumori}
        /// <summary>
        /// 添付ファイルのデータベースへの保存を行います。
        /// </summary>
        /// <param name="no_mitsumori">見積番号</param>
        /// <returns>ファイルアップロードの結果メッセージ</returns>
        public HttpResponseMessage Post(int no_mitsumori)
        {
            string path = HttpContext.Current.Server.MapPath(Properties.Settings.Default.UploadTempFolder);
            MultipartFormDataStreamProvider streamProvider = FileUploadDownloadUtility.ReadAsMultiPart(Request, path);

            using (SampleEntities context = new SampleEntities())
            {
                foreach (var file in streamProvider.FileData)
                {
                    string nm_file = file.Headers.ContentDisposition.FileName.Replace("\"", string.Empty);
                    string nm_file_name = Path.GetFileName(nm_file);
                    byte[] data = FileUploadDownloadUtility.GetBytesFromFile(file);
                    string userName = UserInfo.GetUserNameFromIdentity(this.User.Identity);

                    Tenpu tenpu = new Tenpu()
                    {
                        no_mitsumori = no_mitsumori,
                        nm_file = nm_file_name,
                        file = data,
                        cd_create = userName,
                        dt_create = DateTime.Now,
                        cd_update = userName,
                        dt_update = DateTime.Now
                    };
                    context.Tenpu.Add(tenpu);
                }
                context.SaveChanges();
            }

            return Request.CreateResponse(HttpStatusCode.OK, Properties.Resources.FileSaveSuccessMessage);
        }

        public class TenpuSummary
        {
            public int no_tenpu { get; set; }
            public int no_mitsumori { get; set; }
            public string nm_file { get; set; }
            public byte[] ts { get; set; }
        }

    }
}
