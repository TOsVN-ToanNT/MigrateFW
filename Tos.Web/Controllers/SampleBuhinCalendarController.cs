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

namespace Tos.Web.Controllers
{
    public class SampleBuhinCalendarController : ApiController
    {
        /// <summary>
        /// 開始日、終了日をもとにカレンダーに設定するデータを取得します。
        /// </summary>
        /// <param name="dt_from">開始日</param>
        /// <param name="dt_to">終了日</param>
        /// <returns></returns>
        public HttpResponseMessage Get(DateTime dt_from, DateTime dt_to)
        {
            SampleEntities context = new SampleEntities();

            var results = (from buhin in context.BuhinCalendar
                           where buhin.dt_sakusei <= dt_to && buhin.dt_sakusei >= dt_from
                           orderby buhin.cd_buhin
                           select buhin);

            // TODO: 検索処理の場合には下記のようにグルーピングを行うクエリを実装してください。
            //var data = (from buhin in context.BuhinCalendar
            //            where buhin.dt_sakusei <= dt_to && buhin.dt_sakusei >= dt_from
            //           group buhin by new
            //           {
            //               buhin.cd_buhin,
            //               buhin.nm_komoku,
                             // TODO: LINQ 構文を利用して日付でのグルーピングを行うには、
                             //       日付の年、月、日でグルーピングを行います。
            //               year_create = buhin.dt_sakusei.Year,
            //               month_create = buhin.dt_sakusei.Month,
            //               day_create = buhin.dt_sakusei.Day
            //           } into g
            //           select new
            //           {
            //               g.Key.cd_buhin,
            //               g.Key.nm_komoku,
            //               g.Key.year_create,
            //               g.Key.month_create,
            //               g.Key.day_create,
            //               suryo = g.Sum(k => k.su_suryo)
            //           }).ToArray();

            //var results = from k in data
            //              group k by new
            //              {
            //                  k.cd_buhin,
            //                  k.nm_komoku,
            //              };

            return Request.CreateResponse(HttpStatusCode.OK, results);
        }

        /// <summary>
        /// 開始日、終了日をもとにカレンダーに設定するデータを取得します。
        /// </summary>
        /// <param name="dt_from">開始日</param>
        /// <param name="dt_to">終了日</param>
        /// <returns></returns>
        public PageResult<BuhinCalendar> Get(ODataQueryOptions<BuhinCalendar> options)
        {
            SampleEntities context = new SampleEntities();

            context.Configuration.ProxyCreationEnabled = false;

            // TODO: 削除された見積情報を除外しています。
            var query = from m in context.BuhinCalendar
                        select m;

            IQueryable results = options.ApplyTo(query);

            return new PageResult<BuhinCalendar>(results as IEnumerable<BuhinCalendar>, Request.GetNextPageLink(), Request.GetInlineCount());

        }

        /// <summary>
        /// パラメーターで受け渡された見積情報を新規追加します
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public HttpResponseMessage Post([FromBody]ChangeSet<BuhinCalendar> value)
        {
            if (value == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, Properties.Resources.NotNullAllow);
            }

            // TODO: キー項目の重複チェックを行います。
            InvalidationSet<BuhinCalendar> headerInvalidations = IsAlreadyExists(value);
            if (headerInvalidations.Count > 0)
            {
                return Request.CreateResponse<InvalidationSet<BuhinCalendar>>(HttpStatusCode.BadRequest, headerInvalidations);
            }

            // TODO: 保存処理を実行します。
            var result = SaveBuhinCalendar(value);
            return Request.CreateResponse<BuhinCalendarChangeResponse>(HttpStatusCode.OK, result);
        }

        private InvalidationSet<BuhinCalendar> IsAlreadyExists(ChangeSet<BuhinCalendar> value)
        {
            InvalidationSet<BuhinCalendar> result = new InvalidationSet<BuhinCalendar>();

            using (SampleEntities context = new SampleEntities())
            {
                foreach (var item in value.Created)
                {
                    bool isDepulicate = false;
                    
                    var createdCount = value.Created.Count(m => m.cd_buhin == item.cd_buhin && m.dt_sakusei == item.dt_sakusei);
                    var isDeleted = value.Deleted.Exists(m => m.cd_buhin == item.cd_buhin && m.dt_sakusei == item.dt_sakusei);
                    var isDatabaseExists = (context.BuhinCalendar.FirstOrDefault(m => m.cd_buhin == item.cd_buhin && m.dt_sakusei == item.dt_sakusei) != null);

                    isDepulicate |= (createdCount > 1);
                    isDepulicate |= (!isDeleted && createdCount == 1 && isDatabaseExists);

                    if (isDepulicate)
                    {
                        result.Add(new Invalidation<BuhinCalendar>(Properties.Resources.ValidationKey, item, "no_buhin_calendar"));
                    }
                }
            }

            return result;
        }


        /// <summary>
        /// 変更されたデータを一括で保存します。
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        private BuhinCalendarChangeResponse SaveBuhinCalendar(ChangeSet<BuhinCalendar> value)
        {
            using (SampleEntities context = new SampleEntities())
            {

                value.SetDataSaveInfo(this.User.Identity);
                value.AttachTo(context);
                context.SaveChanges();
            }

            var result = new BuhinCalendarChangeResponse();
            result.Header.AddRange(value.Flatten());
            return result;
        }
    }

    /// <summary>
    /// 部品カレンダーの変更結果を格納するオブジェクトを定義します。
    /// </summary>
    public class BuhinCalendarChangeResponse
    {
        public BuhinCalendarChangeResponse()
        {
            this.Header = new List<BuhinCalendar>();
        }

        public List<BuhinCalendar> Header { get; set; }
    }
}
