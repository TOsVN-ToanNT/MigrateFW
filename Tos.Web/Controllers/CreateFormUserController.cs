/** 最終更新日 : 2016-10-17 **/
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
using System.Web.Security;
using System.Data.Objects.SqlClient;

namespace Tos.Web.Controllers
{
    public class CreateFormUserController : ApiController
    {
        #region "Controllerで公開するAPI"

        /// <summary>
        /// パラメータで受け渡された OData クエリに該当するすべてのtarget情報を取得します。
        /// </summary>
        /// <param name="options"> OData クエリ</param>
        /// <returns>target情報</returns>
        public PageResult<vw_shain_info_form> Get(ODataQueryOptions<vw_shain_info_form> options)
        {
            // TODO:target情報を管理しているDbContextとtargetの型を指定します。

            AuthorityMasterEntities context = new AuthorityMasterEntities();
            context.Configuration.ProxyCreationEnabled = false;

            var view = from v in context.vw_shain_info_form
                       where v.kbn_form == 1 || v.kbn_form == 2
                       select v;

            IQueryable results = options.ApplyTo(view);
            return new PageResult<vw_shain_info_form>(results as IEnumerable<vw_shain_info_form>, Request.GetNextPageLink(), Request.GetInlineCount());
            
        }

        /// <summary>
        /// パラメータで受け渡された target のキー項目をもとに target情報を取得します。
        /// </summary>
        /// <param name="id"> target のキー項目</param>
        /// <returns> target 情報</returns>
        public vw_shain_info_form Get(decimal cd_shain)
        {
            // TODO: target 情報を管理しているDbContextと target の型を指定します。

             using (AuthorityMasterEntities context = new AuthorityMasterEntities())
             {
                 context.Configuration.ProxyCreationEnabled = false;
                 var result = (from m in context.vw_shain_info_form
                               where m.cd_shain == cd_shain
                               select m).FirstOrDefault();

                 if (result == null) {
                     throw new HttpException((int)HttpStatusCode.NotFound, Properties.Resources.NoDataExsists);
                 }
                 return result;
             }
        }

        /// <summary>
        /// パラメータで受け渡された target 情報をもとにエントリーを一括更新（追加・更新・削除）します。
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public HttpResponseMessage Post([FromBody]ChangeSet<ma_shain_form> value)
        {
            if (value == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, Properties.Resources.NotNullAllow);
            }

            // TODO: キー項目の重複チェックを行います。
            InvalidationSet<ma_shain_form> headerInvalidations = IsAlreadyExists(value);
            if (headerInvalidations.Count > 0)
            {
                return Request.CreateResponse<InvalidationSet<ma_shain_form>>(HttpStatusCode.BadRequest, headerInvalidations);
            }

            // TODO: 保存処理を実行します。
            var result = SaveData(value);

            //Membership登録・削除を実行します
            foreach (var item in value.Created)
            {
                Membership.CreateUser(item.cd_shain.ToString(), Properties.Resources.DefaultPassword);
            }
            foreach (var item in value.Deleted)
            {
                Membership.DeleteUser(item.cd_shain.ToString());
            }

            return Request.CreateResponse<CreateFormChangeResponse>(HttpStatusCode.OK, result);

        }

        /// <summary>
        /// パラメータで受け渡された target 情報をもとにパスワードリセットをします。
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public HttpResponseMessage ResetPassword([FromBody]ma_shain_form value)
        {
            if (value == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, Properties.Resources.NotNullAllow);
            }

            Membership.DeleteUser(value.cd_shain.ToString());
            Membership.CreateUser(value.cd_shain.ToString(), Properties.Resources.DefaultPassword);

            return Request.CreateResponse<ma_shain_form>(HttpStatusCode.OK, value);
        }

        #endregion

        #region "Controller内で利用する関数群"

        /// <summary>
        /// target 情報の主キーによる重複チェックを行います。
        /// </summary>
        /// <param name="value">target 情報の変更セット</param>
        /// <returns></returns>
        private InvalidationSet<ma_shain_form> IsAlreadyExists(ChangeSet<ma_shain_form> value)
        {
            InvalidationSet<ma_shain_form> result = new InvalidationSet<ma_shain_form>();

            using (AuthorityMasterEntities context = new AuthorityMasterEntities())
            {
                foreach (var item in value.Created)
                {
                    // TODO: 変更セット内で重複したキーが入力されたかどうかのチェック、およびデータベース上に重複した主キーがあるかどうかのチェックを行います。
                    bool isDepulicate = false;
            
                    var createdCount = value.Created.Count(target => target.cd_shain == item.cd_shain);
                    var isDeleted = value.Deleted.Exists(target => target.cd_shain == item.cd_shain);
                    var isDatabaseExists = (context.ma_shain_form.Find(item.cd_shain) != null);

                    isDepulicate |= (createdCount > 1);
                    isDepulicate |= (!isDeleted && createdCount == 1 && isDatabaseExists);

                    if (isDepulicate)
                    {
                        result.Add(new Invalidation<ma_shain_form>(Properties.Resources.ValidationKey, item, "cd_shain"));
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
        private CreateFormChangeResponse SaveData(ChangeSet<ma_shain_form> value)
        {
            using (AuthorityMasterEntities context = new AuthorityMasterEntities())
            {

                value.SetDataSaveInfo(this.User.Identity);                
                value.AttachTo(context);
                context.SaveChanges();
            }

            // TODO: 返却用のオブジェクトを生成します。
            var result = new CreateFormChangeResponse();
            result.Detail.AddRange(value.Flatten());
            return result;

        }

        #endregion
    }

    #region "ControllerのAPIで利用するリクエスト・レスポンスクラスです"

    public class CreateFormChangeResponse
    {
        public CreateFormChangeResponse()
        {
            this.Detail = new List<ma_shain_form>();
        }

        public List<ma_shain_form> Detail { get; set; }
    }

    #endregion
}
