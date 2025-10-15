/** 最終更新日 : 2016-10-17 **/
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Tos.Web.Data;
using Tos.Web.Reports;
using Tos.Web.Logging;
using Tos.Web.Controllers.Helpers;

namespace Tos.Web.Controllers
{

    public class SamplePDFSVFReportController : ApiController
    {
        protected readonly string lang = System.Threading.Thread.CurrentThread.CurrentUICulture.TwoLetterISOLanguageName;

        // GET api/SamplePDFSVFReport/GetMitsumori/1
        /// <summary>
        /// 見積書の作成(単票)
        /// </summary>
        /// <param name="no_mitsumoris"></param>
        /// <returns></returns>
        public HttpResponseMessage GetMitsumori(string no_mitsumoris)
        {
            if (string.IsNullOrEmpty(no_mitsumoris))
            {
                // 例外をエラーログに出力します。
                throw new ArgumentNullException("no_mitsumoris");
            }

            List<int> mitsumoris = no_mitsumoris.Split(new char[] { ',' }).ToList().ConvertAll<int>(m => int.Parse(m));
            if (mitsumoris.Count() == 0)
            {
                // 例外をエラーログに出力します。
                throw new ArgumentNullException("no_mitsumoris");
            }

            string today = DateTime.Now.ToString("yyyyMMdd_HHmmss");
            string reportName = "MitsumoriReprot_" + today + ".pdf";

            using (var context = new SampleEntities())
            {
                context.Configuration.ProxyCreationEnabled = false;

                List<Mitsumori> records = (from m in context.Mitsumori
                                            where mitsumoris.Contains(m.no_mitsumori)
                                                    && !m.flg_del
                                            select m).ToList();
                if (records.Count < 1)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, Properties.Resources.NoDataExsists);
                }

                using (SvfClient client = new SvfClient("Mitsumori", lang))
                {
                    client.SetRecords(records);
                    Stream stream = client.Execute();
                    return FileUploadDownloadUtility.CreateFileResponse(stream, reportName);
                }
            }
        }

        /// <summary>
        /// 検討書の作成(一覧表)
        /// </summary>
        /// <param name="no_mitsumori"></param>
        /// <returns></returns>
        public HttpResponseMessage GetKento(string no_mitsumoris)
        {
            if (string.IsNullOrEmpty(no_mitsumoris))
            {
                // 例外をエラーログに出力します。
                throw new ArgumentNullException("no_mitsumoris");
            }

            List<int> mitsumoris = no_mitsumoris.Split(new char[] { ',' }).ToList().ConvertAll<int>(m => int.Parse(m));
            if (mitsumoris.Count() == 0)
            {
                // 例外をエラーログに出力します。
                throw new ArgumentNullException("no_mitsumoris");
            }

            string today = DateTime.Now.ToString("yyyyMMdd_HHmmss");
            string reportName = "KentoReprot_" + today + ".pdf";
            using (var context = new SampleEntities())
            {
                context.Configuration.ProxyCreationEnabled = false;

                List<Kentosho> records = (from k in context.Kentosho
                                                    join m in context.Mitsumori on k.no_mitsumori equals m.no_mitsumori
                                                    where mitsumoris.Contains(k.no_mitsumori)
                                                    && !m.flg_del
                                                    select k).ToList();
                if (records.Count < 1) 
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, Properties.Resources.NoDataExsists);
                }

                using (SvfClient client = new SvfClient("Kento", lang))
                {
                    client.SetRecords(records);
                    Stream stream = client.Execute();
                    return FileUploadDownloadUtility.CreateFileResponse(stream, reportName);
                }
            }
        }
    }
}
