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

    public class SampleNewsController : ApiController
    {

        public IEnumerable<News> Get(ODataQueryOptions<News> options)
        {
            SampleEntities context = new SampleEntities();
            context.Configuration.ProxyCreationEnabled = false;

            var query = (from n in context.News
                         orderby n.dt_news descending
                         select n).Skip(0).Take(10);

            IQueryable results = options.ApplyTo(query);

            return new PageResult<News>(results as IEnumerable<News>, Request.GetNextPageLink(), Request.GetInlineCount());
        }

    }
}
