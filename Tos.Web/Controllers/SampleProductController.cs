/** 最終更新日 : 2016-10-17 **/
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.OData;
using System.Web.Http.OData.Query;
using Tos.Web.Data;

namespace Tos.Web.Controllers
{
    public class SampleProductController : ApiController
    {

        #region "Contorollerで公開するAPI"

        /// <summary>
        /// パラメータで受け渡された OData クエリに該当するすべてのエントリー見積情報を取得します。
        /// TODO: ストアドプロシージャを利用する場合には、UIテンプレートアーキテクチャガイド （メインパターン）7.4.13.	ストアドプロシージャの利用を確認してください
        /// </summary>
        /// <param name="options"> OData クエリ</param>
        /// <returns>見積情報</returns>
        public PageResult<Product> Get(ODataQueryOptions<Product> options)
        {
            SampleEntities context = new SampleEntities();
            context.Configuration.ProxyCreationEnabled = false;

            IQueryable results = options.ApplyTo(context.Product);

            return new PageResult<Product>(results as IEnumerable<Product>, Request.GetNextPageLink(), Request.GetInlineCount());
        }

        #endregion
    }
}
