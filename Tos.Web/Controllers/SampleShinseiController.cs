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
    public class SampleShinseiController : ApiController
    {
        public Shinsei Get(int no_system)
        {
            SampleEntities context = new SampleEntities();
            context.Configuration.ProxyCreationEnabled = false;

            return context.Shinsei.Find(no_system);

        }
    }
}
