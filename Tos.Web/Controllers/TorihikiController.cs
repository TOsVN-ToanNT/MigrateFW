using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.OData;
using System.Web.Http.OData.Query;
using Tos.Web.Data;

namespace Tos.Web.Controllers
{
    //created from 【SearchInputController(Ver1.7)】 Template
    public class TorihikiController : ApiController
    {
        #region "Controllerで公開するAPI"

        /// <summary>
        /// パラメータで受け渡された OData クエリに該当するすべてのtarget情報を取得します。
        /// </summary>
        /// <param name="options"> OData クエリ</param>
        /// <returns>target情報</returns>
        public PageResult<Torihiki> Get(ODataQueryOptions<Torihiki> options)
        {
            // TODO:target情報を管理しているDbContextとtargetの型を指定します。
             SampleEntities context = new SampleEntities();
             context.Configuration.ProxyCreationEnabled = false;
             IQueryable results = options.ApplyTo(context.Torihiki.AsQueryable());
             return new PageResult<Torihiki>(results as IEnumerable<Torihiki>, Request.GetNextPageLink(), Request.GetInlineCount());
        }

        /// <summary>
        /// パラメータで受け渡された target 情報をもとにエントリーを一括更新（追加・更新・削除）します。
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public HttpResponseMessage Post([FromBody]ChangeSet<Torihiki> value)
        {
            if (value == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, Properties.Resources.NotNullAllow);
            }

            // TODO: キー項目の重複チェックを行います。
            InvalidationSet<Torihiki> headerInvalidations = IsAlreadyExists(value);
            if (headerInvalidations.Count > 0)
            {
                return Request.CreateResponse<InvalidationSet<Torihiki>>(HttpStatusCode.BadRequest, headerInvalidations);
            }

            // TODO: 保存処理を実行します。
            var result = SaveData(value);
            return Request.CreateResponse<SearchInputChangeResponse>(HttpStatusCode.OK, result);

        }

        /// <summary>
        /// パラメーターで受け渡されたtarget情報を更新します
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public HttpResponseMessage Put([FromBody]ChangeSet<Torihiki> value)
        {

            var result = SaveData(value);
            return Request.CreateResponse<SearchInputChangeResponse>(HttpStatusCode.OK, result);

        }

        /// <summary>
        /// パラメーターで受け渡されたtarget情報を削除します
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public HttpResponseMessage Delete([FromBody]ChangeSet<Torihiki> value)
        {

            var result = SaveData(value);
            return Request.CreateResponse<SearchInputChangeResponse>(HttpStatusCode.OK, result);

        }

        #endregion

        #region "Controller内で利用する関数群"

        /// <summary>
        /// target 情報の主キーによる重複チェックを行います。
        /// </summary>
        /// <param name="value">target 情報の変更セット</param>
        /// <returns></returns>
        private InvalidationSet<Torihiki> IsAlreadyExists(ChangeSet<Torihiki> value)
        {
            InvalidationSet<Torihiki> result = new InvalidationSet<Torihiki>();

            using (SampleEntities context = new SampleEntities())
            {
                foreach (var item in value.Created)
                {
                    // TODO: 変更セット内で重複したキーが入力されたかどうかのチェック、およびデータベース上に重複した主キーがあるかどうかのチェックを行います。
                    bool isDepulicate = false;

                    var createdCount = value.Created.Count(target => target.cd_torihiki == item.cd_torihiki);
                    var isDeleted = value.Deleted.Exists(target => target.cd_torihiki == item.cd_torihiki);
                    var isDatabaseExists = (context.Torihiki.Find(item.cd_torihiki) != null);

                    isDepulicate |= (createdCount > 1);
                    isDepulicate |= (!isDeleted && createdCount == 1 && isDatabaseExists);

                    if (isDepulicate)
                    {
                        result.Add(new Invalidation<Torihiki>(Properties.Resources.ValidationKey, item, "cd_torihiki"));
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
        private SearchInputChangeResponse SaveData(ChangeSet<Torihiki> value)
        {
            using (SampleEntities context = new SampleEntities())
            {

                value.SetDataSaveInfo(this.User.Identity);                
                value.AttachTo(context);
                context.SaveChanges();
            }

            // TODO: 返却用のオブジェクトを生成します。
            var result = new SearchInputChangeResponse();
            result.Detail.AddRange(value.Flatten());
            return result;
        }

        #endregion
    }

    #region "ControllerのAPIで利用するリクエスト・レスポンスクラスです"

    public class SearchInputChangeResponse
    {
        public SearchInputChangeResponse()
        {
            this.Detail = new List<Torihiki>();
        }

        public List<Torihiki> Detail { get; set; }
    }

    #endregion
}
