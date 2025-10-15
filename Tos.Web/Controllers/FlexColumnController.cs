/** 最終更新日 : 2016-10-17 **/
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.OData.Query;
// TODO:DbContextの名前空間を指定します。
using Tos.Web.Data;

namespace Tos.Web.Controllers
{
    public class FlexColumnController : ApiController
    {
        #region "Controllerで公開するAPI"

        /// <summary>
        /// パラメータで受け渡されたheaderのキー項目をもとにheaderとdetailの見積情報を取得します。
        /// </summary>
        /// <param name="no_seq">headerのキー項目</param>
        /// <returns>ChangeResponse</returns>
        public FlexColumnChangeResponse Get(ODataQueryOptions<tr_torihiki_buhin> options)
        {
            // TODO:header情報を管理しているDbContextとheader,detailの型を指定します。

            using (SampleEntities context = new SampleEntities())
            {
                context.Configuration.ProxyCreationEnabled = false;

                // header検索
                var header = (from m in context.Torihiki
                              orderby m.cd_torihiki
                              select m).ToList();
                if (header == null)
                {
                    throw new HttpException((int)HttpStatusCode.NotFound, Properties.Resources.NoDataExsists);
                }
                FlexColumnChangeResponse result = new FlexColumnChangeResponse();
                result.Header = header;

                // detail検索
                var query = options.ApplyTo(context.tr_torihiki_buhin.AsQueryable()) as IEnumerable<tr_torihiki_buhin>;
                result.Detail = query.ToList();

                return result;
            }
        }

        /// <summary>
        /// パラメータで受け渡されたheader情報・detail情報をもとにエントリーheader情報・detail書を一括更新（追加・更新・削除）します。
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public HttpResponseMessage Post([FromBody]ChangeSet<tr_torihiki_buhin> value)
        {
            if (value == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, Properties.Resources.NotNullAllow);
            }

            // TODO: キー項目の重複チェックを行います。
            InvalidationSet<tr_torihiki_buhin> headerInvalidations = IsAlreadyExists(value);
            if (headerInvalidations.Count > 0)
            {
                return Request.CreateResponse<InvalidationSet<tr_torihiki_buhin>>(HttpStatusCode.BadRequest, headerInvalidations);
            }

            // TODO: 保存処理を実行します。
            var result = SaveData(value);
            return Request.CreateResponse<FlexColumnChangeResponse>(HttpStatusCode.OK, result);

        }

        #endregion

        #region "Controller内で利用する関数群"

        /// <summary>
        /// target 情報の主キーによる重複チェックを行います。
        /// </summary>
        /// <param name="value">target 情報の変更セット</param>
        /// <returns></returns>
        private InvalidationSet<tr_torihiki_buhin> IsAlreadyExists(ChangeSet<tr_torihiki_buhin> value)
        {
            InvalidationSet<tr_torihiki_buhin> result = new InvalidationSet<tr_torihiki_buhin>();

            using (SampleEntities context = new SampleEntities())
            {
                foreach (var item in value.Created)
                {
                    // TODO: 変更セット内で重複したキーが入力されたかどうかのチェック、およびデータベース上に重複した主キーがあるかどうかのチェックを行います。
                    bool isDepulicate = false;

                    var createdCount = value.Created.Count(target => target.dt_nohin == item.dt_nohin && target.cd_torihiki == item.cd_torihiki && target.cd_buhin == item.cd_buhin);
                    var isDeleted = value.Deleted.Exists(target => target.dt_nohin == item.dt_nohin && target.cd_torihiki == item.cd_torihiki && target.cd_buhin == item.cd_buhin);
                    var isDatabaseExists = (context.tr_torihiki_buhin.Find(item.dt_nohin, item.cd_torihiki, item.cd_buhin) != null);

                    isDepulicate |= (createdCount > 1);
                    isDepulicate |= (!isDeleted && createdCount == 1 && isDatabaseExists);

                    if (isDepulicate)
                    {
                        result.Add(new Invalidation<tr_torihiki_buhin>(Properties.Resources.ValidationKey, item, "cd_buhin"));
                    }
                }
            }

            return result;
        }

        /// <summary>
        /// target 情報の一括更新（追加・更新・削除）を実行します
        /// </summary>
        /// <param name="value">target 情報の変更セット</param>
        /// <returns>target 情報の更新結果オブジェクト</returns>
        private FlexColumnChangeResponse SaveData(ChangeSet<tr_torihiki_buhin> value)
        {
            using (SampleEntities context = new SampleEntities())
            {

                value.SetDataSaveInfo(this.User.Identity);
                value.AttachTo(context);
                context.SaveChanges();
            }

            // TODO: 返却用のオブジェクトを生成します。
            var result = new FlexColumnChangeResponse();
            result.Detail.AddRange(value.Flatten());
            return result;

        }

        #endregion
    }

    #region "ControllerのAPIで利用するリクエスト・レスポンスクラスです"

    public class FlexColumnChangeResponse
    {
        public FlexColumnChangeResponse()
        {
            this.Header = new List<Torihiki>();
            this.Detail = new List<tr_torihiki_buhin>();
        }

        public List<Torihiki> Header { get; set; }
        public List<tr_torihiki_buhin> Detail { get; set; }
    }

    #endregion
}
