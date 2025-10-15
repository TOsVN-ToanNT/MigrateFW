/** 最終更新日 : 2018-01-25 **/
using System.Collections.Generic;
using System.Data.Common;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.OData;
using System.Web.Http.OData.Query;
using Tos.Web.Data;

namespace Tos.Web.Controllers 
{
    /// <summary>
    /// 見積情報を更新するContorllerクラスです。
    /// </summary>
    public class SampleMitsumoriController : ApiController
    {

        #region "Contorollerで公開するAPI"

        /// <summary>
        /// パラメータで受け渡された OData クエリに該当するすべてのエントリー見積情報を取得します。
        /// TODO: ストアドプロシージャを利用する場合には、UIテンプレートアーキテクチャガイド （メインパターン）7.4.13.	ストアドプロシージャの利用を確認してください
        /// </summary>
        /// <param name="options"> OData クエリ</param>
        /// <returns>見積情報</returns>
        public PageResult<Mitsumori> Get(ODataQueryOptions<Mitsumori> options)
        {
            SampleEntities context = new SampleEntities();
            context.Configuration.ProxyCreationEnabled = false;

            // TODO: 削除された見積情報を除外しています。
            var query = from m in context.Mitsumori
                        where !m.flg_del
                        select m;

            IQueryable results = options.ApplyTo(query);

            return new PageResult<Mitsumori>(results as IEnumerable<Mitsumori>, Request.GetNextPageLink(), Request.GetInlineCount());
        }

        /// <summary>
        /// パラメータで受け渡された見積番号をもとに見積情報（ヘッダ）、検討書情報（明細）を取得します。
        /// </summary>
        /// <param name="no_mitsumori">見積番号</param>
        /// <returns>見積情報</returns>
        public MitsumoriChangeResponse Get(int no_mitsumori)
        {
            using (SampleEntities context = new SampleEntities(Properties.Settings.Default.CommandTimeout))
            {
                context.Configuration.ProxyCreationEnabled = false;
                context.Configuration.LazyLoadingEnabled = false;

                // header検索
                var header = (from m in context.Mitsumori
                              where m.no_mitsumori == no_mitsumori
                                  && !m.flg_del
                              select m).SingleOrDefault();

                if (header == null)
                {
                    throw new HttpException((int)HttpStatusCode.NotFound, Properties.Resources.NoDataExsists);
                }

                MitsumoriChangeResponse result = new MitsumoriChangeResponse();
                result.Header = header;

                // detail検索 
                result.Detail = (from k in context.Kentosho
                                 where k.no_mitsumori == no_mitsumori
                                 orderby k.no_komoku
                                 select k).ToList();

                return result;
            }
        }
        
        /// <summary>
        /// クライアントから送信された変更セットを基に一括更新を行います。
        /// パラメータで受け渡された見積情報・検討書をもとにエントリー見積情報・検討書を一括更新（追加・更新・削除）します。
        /// </summary>
        /// <param name="value">POST された HTTP リクエストの BODY に設定された変更セット</param>
        /// <returns></returns>
        public HttpResponseMessage Post([FromBody]MitsumoriChangeRequest value)
        {

            if (value == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, Properties.Resources.NotNullAllow);
            }

            // TODO：整合性チェックエラーの結果を格納するInvalidationSetを定義します。
            InvalidationSet<Mitsumori> headerInvalidations = ValidateHeader(value.Header);
            if (headerInvalidations.Count > 0)
            {
                return Request.CreateResponse<InvalidationSet<Mitsumori>>(HttpStatusCode.BadRequest, headerInvalidations);
            }

            InvalidationSet<Kentosho> detailInvalidations = ValidateDetail(value.Detail);
            if (detailInvalidations.Count > 0)
            {
                return Request.CreateResponse<InvalidationSet<Kentosho>>(HttpStatusCode.BadRequest, detailInvalidations);
            }
            // TODO: ここまで

            using (SampleEntities context = new SampleEntities())
            {
                IObjectContextAdapter adapter = context as IObjectContextAdapter;
                DbConnection connection = adapter.ObjectContext.Connection;
                connection.Open();

                using (DbTransaction transaction = connection.BeginTransaction())
                {
                    // バリデーションエラーおよび競合エラー時にクライアントに返却するオブジェクトの遅延読み込み防止
                    context.Configuration.LazyLoadingEnabled = false;

                    // TODO: header部の保存処理を実行します。
                    var mitsumoriNo = SaveHeader(context, value.Header);

                    // TODO: detail部の保存処理を実行します。
                    SaveDetail(context, value.Detail, mitsumoriNo);

                    // TODO: tenpu部の保存処理を実行します。(添付ファイルパートがある場合のみ：OptionSample）
                    if (value.FileAttach != null)
                    {
                        SaveFileAttach(context, value.FileAttach);
                    }

                    transaction.Commit();
                }
            }

            // TODO: 返却用のオブジェクトを生成します。
            var result = new MitsumoriChangeResponse();
            result.Header = value.Header.Flatten().SingleOrDefault();
            result.Detail.AddRange(value.Detail.Flatten());

            return Request.CreateResponse<MitsumoriChangeResponse>(HttpStatusCode.OK, result);

        }

        /// <summary>
        /// ヘッダー情報の整合性チェックを行います。
        ///  TODO: エンティティに対する整合性チェック (マスタ存在チェックなど) を行います。
        /// </summary>
        /// <param name="changeSet">ヘッダーの変更セット</param>
        /// <returns></returns>
        private InvalidationSet<Mitsumori> ValidateHeader(ChangeSet<Mitsumori> changeSet)
        {
            InvalidationSet<Mitsumori> invalidations = new InvalidationSet<Mitsumori>();

            // TODO: ヘッダーのサーバー入力検証

            foreach (var item in changeSet.Created)
            {
            }


            foreach (var item in changeSet.Updated)
            {
            }

            return invalidations;
        }

        /// <summary>
        /// 明細一覧情報の整合性チェックを行います。
        ///  TODO: エンティティに対する整合性チェック (マスタ存在チェックなど) を行います。
        /// </summary>
        /// <param name="changeSet">明細一覧の変更セット</param>
        /// <returns></returns>
        private InvalidationSet<Kentosho> ValidateDetail(ChangeSet<Kentosho> changeSet)
        {

            InvalidationSet<Kentosho> invalidations = new InvalidationSet<Kentosho>();

            // TODO: 明細のサーバー入力検証
            foreach (var item in changeSet.Created)
            {
            }


            foreach (var item in changeSet.Updated)
            {
            }

            return invalidations;
        }

        /// <summary>
        /// パラメータで受け渡された見積情報をもとにエントリー見積情報を論理削除します。
        /// </summary>
        /// <param name="value">見積情報</param>
        /// <returns>見積情報</returns>
        [HttpPost]
        public MitsumoriHeaderChangeResponse Remove([FromBody]ChangeSet<Mitsumori> value)
        {
            using (SampleEntities context = new SampleEntities())
            {
                // TODO: header部の保存処理を実行します。
                SaveHeader(context, value);
            }

            var result = new MitsumoriHeaderChangeResponse();
            result.Header = value.Flatten().SingleOrDefault();

            return result;
        }

        #endregion

        #region "Contorller内で利用する関数群"

        /// <summary>
        /// 見積情報の一括更新（追加・更新・削除）を実行します
        /// </summary>
        /// <param name="context">DbContext</param>
        /// <param name="header">見積情報</param>
        /// <returns>新規キー項目</returns>
        private int SaveHeader(SampleEntities context, ChangeSet<Mitsumori> header)
        {
            int newId = -1;

            // TODO: キー項目を採番する場合はここで処理を実行します。
            //       identity列などを利用してデータ作成時に自動採番する場合は以下の処理をコメントアウトしてください。

            // TODO: キー項目を採番する処理を実行します。
            // newId = 新規採番キー項目;

            // TODO: キー項目の設定処理を実行します。
            //if (header.Created.Count > 0)
            //{
            //    foreach (var mitsumori in header.Created)
            //    {
            //        mitsumori.no_mitsumori = newId;
            //    }
            //}

            header.SetDataSaveInfo(this.User.Identity);
            header.AttachTo(context);
            context.SaveChanges();

            // TODO: キー項目を採番する場合はここで処理を実行します。
            if (header.Created.Count > 0) {
                newId = ((Mitsumori)header.Created.First()).no_mitsumori;
            }

            return newId;
        }

        /// <summary>
        /// 検討書の一括更新（追加・更新・削除）を実行します
        /// </summary>
        /// <param name="context">DbContext</param>
        /// <param name="detail">検討書</param>
        /// <param name="newId">キー項目</param>
        private void SaveDetail(SampleEntities context, ChangeSet<Kentosho> detail, int newId = -1)
        {
            if (newId > 0)
            {
                // TODO: 見積情報で採番されたキー項目を検討書に設定します。
                foreach (var kentoItem in detail.Created)
                {
                    kentoItem.no_mitsumori = newId;
                }
            }

            detail.SetDataSaveInfo(this.User.Identity);
            detail.AttachTo(context);
            context.SaveChanges();
        }

        /// <summary>
        /// 添付ファイルリストの一括更新（削除）を実行します
        /// </summary>
        /// <param name="context">DbContext</param>
        /// <param name="tenpu">添付ファイルリスト</param>
        private void SaveFileAttach(SampleEntities context, ChangeSet<Tenpu> fileAttach)
        {

            fileAttach.SetDataSaveInfo(this.User.Identity);
            fileAttach.AttachTo(context);
            context.SaveChanges();
        }

        #endregion
    }

    #region "ContorollerのAPIで利用するリクエスト・レスポンスクラスです"

    public class MitsumoriChangeRequest
    {
        public ChangeSet<Mitsumori> Header { get; set; }
        public ChangeSet<Kentosho> Detail { get; set; }
        public ChangeSet<Tenpu> FileAttach { get; set; }
    }

    public class MitsumoriChangeResponse
    {
        public MitsumoriChangeResponse()
        {
            this.Header = new Mitsumori();
            this.Detail = new List<Kentosho>();
        }

        public Mitsumori Header { get; set; }
        public List<Kentosho> Detail { get; set; }
    }

    public class MitsumoriHeaderChangeRequest
    {
        public ChangeSet<Mitsumori> Header { get; set; }
    }

    public class MitsumoriHeaderChangeResponse
    {
        public MitsumoriHeaderChangeResponse()
        {
            this.Header = new Mitsumori();
        }

        public Mitsumori Header { get; set; }
    }

    #endregion

}
