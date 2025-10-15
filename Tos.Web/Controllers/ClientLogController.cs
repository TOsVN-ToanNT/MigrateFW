/** 最終更新日 : 2017-10-01 **/
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Tos.Web.Controllers.Filters;
using Tos.Web.Logging;

namespace Tos.Web.Controllers
{
    [AuthenticationFilter(false)]
    public class ClientLogController : ApiController
    {
        public void Post([FromBody]JArray logItems)
        {
            foreach (JObject item in logItems)
            {
                var level = GetPropertyValue(item, "level");
                if (level == "info") Logger.App.Info(GetLogMessageString(item));
                else if (level == "debug") Logger.App.Debug(GetLogMessageString(item));
                else if (level == "trace") Logger.App.Trace(GetLogMessageString(item));
                else if (level == "warn") Logger.App.Warn(GetLogMessageString(item));
                else if (level == "error") Logger.App.Error(GetLogMessageString(item));
                else if (level == "fatal") Logger.App.Fatal(GetLogMessageString(item));
                else Logger.App.Info(GetLogMessageString(item));
            }
        }

        private string GetPropertyValue(JObject target, string propertyName)
        {
            var prop = target.Property(propertyName);
            if (prop == null || prop.Value == null)
            {
                return null;
            }
            return prop.Value.Value<string>();
        }

        private string GetLogMessageString(JObject target)
        {
            var message = GetPropertyValue(target, "message");
            return string.Format("{0} {1}", message, target.ToString(Formatting.None));
        }
    }
}