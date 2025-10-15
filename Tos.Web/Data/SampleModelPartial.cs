/** 最終更新日 : 2018-01-25 **/
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web;

namespace Tos.Web.Data
{
    public partial class SampleEntities : DbContext
    {
        public SampleEntities(int timeoutTime)
            : base("name=SampleEntities")
        {
            (this as IObjectContextAdapter).ObjectContext.CommandTimeout = timeoutTime;
        }

     }
}