/** 最終更新日 : 2016-10-17 **/
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Tos.Web.Data
{
    public class StoredProcedureResult<T>
    {
        public IEnumerable<T> Items { get; set; }
        public int Count { get; set; }
    }
}
