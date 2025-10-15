/** 最終更新日 : 2016-10-17 **/
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.OData;
using System.Web.Http.OData.Query;
using Tos.Web.Data;
using Tos.Web.Logging;

namespace Tos.Web.Controllers
{
    public class SampleMitsumoriInputDetailController : ApiController
    {

        /// <summary>
        /// パラメータで受け渡された OData クエリに該当するすべてのエントリー見積情報を取得します。
        /// </summary>
        /// <param name="options"> OData クエリ</param>
        /// <returns>見積情報</returns>
        public PageResult<MitsumoriDirect> Get(ODataQueryOptions<MitsumoriDirect> options)
        {
            SampleEntities context = new SampleEntities();
            context.Configuration.ProxyCreationEnabled = false;
            IQueryable results = options.ApplyTo(context.MitsumoriDirect.AsQueryable());

            return new PageResult<MitsumoriDirect>(results as IEnumerable<MitsumoriDirect>, Request.GetNextPageLink(), Request.GetInlineCount());
        }

        public MitsumoriDirect Get(int no_mitsumori)
        {

            using (var context = new SampleEntities())
            {
                context.Configuration.ProxyCreationEnabled = false;

                return (from m in context.MitsumoriDirect
                        where m.no_mitsumori == no_mitsumori
                        select m).SingleOrDefault();
            }
        }

        /// <summary>
        /// パラメーターで受け渡された見積情報を新規追加します
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public HttpResponseMessage Post([FromBody]ChangeSet<MitsumoriDirect> value)
        {
            if (value == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, Properties.Resources.NotNullAllow);
            }

            // TODO: キー項目の重複チェックを行います。
            InvalidationSet<MitsumoriDirect> headerInvalidations = IsAlreadyExists(value);
            // TODO: 取引先コードの存在チェックを行います。
            headerInvalidations = IsTorihikiCdExists(value, headerInvalidations);
            if (headerInvalidations.Count > 0)
            {
                Logger.App.Error("キー重複です");
                return Request.CreateResponse<InvalidationSet<MitsumoriDirect>>(HttpStatusCode.BadRequest, headerInvalidations);
            }

            // TODO: 保存処理を実行します。
            var result = SaveData(value);
            return Request.CreateResponse<MitsumorDirectiChangeResponse>(HttpStatusCode.OK, result); 

        }

        /// <summary>
        /// パラメーターで受け渡された見積情報を更新します
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public HttpResponseMessage Put([FromBody]ChangeSet<MitsumoriDirect> value)
        {

            var result = SaveData(value);
            return Request.CreateResponse<MitsumorDirectiChangeResponse>(HttpStatusCode.OK, result); 

        }

        /// <summary>
        /// パラメーターで受け渡された見積情報を削除します
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public HttpResponseMessage Delete([FromBody]ChangeSet<MitsumoriDirect> value)
        {

            var result = SaveData(value);
            return Request.CreateResponse<MitsumorDirectiChangeResponse>(HttpStatusCode.OK, result);

        }

        private InvalidationSet<MitsumoriDirect> IsAlreadyExists(ChangeSet<MitsumoriDirect> value)
        {
            InvalidationSet<MitsumoriDirect> result = new InvalidationSet<MitsumoriDirect>();


            using (SampleEntities context = new SampleEntities())
            {
                foreach (var item in value.Created)
                {
                    bool isDepulicate = false;

                    var createdCount = value.Created.Count(m => m.no_mitsumori == item.no_mitsumori);
                    var isDeleted = value.Deleted.Exists(m => m.no_mitsumori == item.no_mitsumori);
                    var isDatabaseExists = (context.MitsumoriDirect.Find(item.no_mitsumori) != null);

                    isDepulicate |= (createdCount > 1);
                    isDepulicate |= (!isDeleted && createdCount == 1 && isDatabaseExists);

                    if (isDepulicate)
                    {
                        result.Add(new Invalidation<MitsumoriDirect>(Properties.Resources.ValidationKey + "見積番号：", item, "no_mitsumori"));
                    }

                }
            }

            return result;
        }

        /// <summary>
        /// 取引先コードの存在チェックを行います。
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        private InvalidationSet<MitsumoriDirect> IsTorihikiCdExists(ChangeSet<MitsumoriDirect> value, InvalidationSet<MitsumoriDirect> result)
        {

            using (SampleEntities context = new SampleEntities())
            {
                foreach (var item in value.Created)
                {
                    var torihikisaki = (from t in context.Torihiki
                              where t.cd_torihiki == item.cd_torihiki
                              select t).FirstOrDefault();
                    if (torihikisaki == null)
                    {
                        result.Add(new Invalidation<MitsumoriDirect>(Properties.Resources.NoKeyDataExsists, item, "cd_torihiki"));
                    }
                }
                foreach (var item in value.Updated)
                {
                    var torihikisaki = (from t in context.Torihiki
                                        where t.cd_torihiki == item.cd_torihiki
                                        select t).FirstOrDefault();
                    if (torihikisaki == null)
                    {
                        result.Add(new Invalidation<MitsumoriDirect>(Properties.Resources.NoKeyDataExsists, item, "cd_torihiki"));
                    }
                }
            }

            return result;
        }

        private MitsumorDirectiChangeResponse SaveData(ChangeSet<MitsumoriDirect> value)
        {
            using (SampleEntities context = new SampleEntities())
            {

                value.SetDataSaveInfo(this.User.Identity);                
                value.AttachTo(context);
                context.SaveChanges();
            }

            var result = new MitsumorDirectiChangeResponse();
            result.Header.AddRange(value.Flatten());
            return result;
        }
    }

    public class MitsumorDirectiChangeResponse
    {
        public MitsumorDirectiChangeResponse()
        {
            this.Header = new List<MitsumoriDirect>();
        }

        public List<MitsumoriDirect> Header { get; set; }
    }
}
