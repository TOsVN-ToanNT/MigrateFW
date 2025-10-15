/** 最終更新日 : 2016-10-17 **/
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Newtonsoft.Json;
using Tos.Web.Controllers;
using System.Net.Http;
using System.Web.Http.Routing;
using Tos.Web.Controllers.Filters;
using Tos.Web.Properties;

namespace Tos.Web
{
    public class WebApiConfig
    {
        public static void Register(HttpConfiguration configuration)
        {
            // コントローラー名、パラメーター名(省略可能) によるマッピング
            configuration.Routes.MapHttpRoute(
                name: "DefaultApiWithId",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional },
                constraints: new { id = @"\d+" });

            // コントローラー名、アクション名によるマッピング
            configuration.Routes.MapHttpRoute(
                name: "DefaultApiWithAction",
                routeTemplate: "api/{controller}/{action}");

            // コントローラー名 (Get) によるマッピング
            configuration.Routes.MapHttpRoute(
                name: "DefaultApiGet", 
                routeTemplate: "api/{controller}", 
                defaults: new { action = "Get" }, 
                constraints: new { httpMethod = new HttpMethodConstraint(HttpMethod.Get) });

            // コントローラー名 (Post) によるマッピング
            configuration.Routes.MapHttpRoute(
                name: "DefaultApiPost",
                routeTemplate: "api/{controller}", 
                defaults: new { action = "Post" },
                constraints: new { httpMethod = new HttpMethodConstraint(HttpMethod.Post) });

            // コントローラー名 (Put) によるマッピング
            configuration.Routes.MapHttpRoute(
                name: "DefaultApiPut",
                routeTemplate: "api/{controller}",
                defaults: new { action = "Put" },
                constraints: new { httpMethod = new HttpMethodConstraint(HttpMethod.Put) });

            // コントローラー名 (Delete) によるマッピング
            configuration.Routes.MapHttpRoute(
                name: "DefaultApiDelete",
                routeTemplate: "api/{controller}",
                defaults: new { action = "Delete" },
                constraints: new { httpMethod = new HttpMethodConstraint(HttpMethod.Delete) });

            if (Settings.Default.EnableAuthSerivce)
            {
                configuration.Routes.MapHttpRoute(
                    name: "AuthApi",
                    routeTemplate: "auth",
                    defaults: new { action = "Post", controller = "Auth" },
                    constraints: new { httpMethod = new HttpMethodConstraint(HttpMethod.Post) });
            }

            // OData Query の有効化
            configuration.EnableQuerySupport();

            // 認証フィルターの追加
            configuration.Filters.Add(new AuthenticationFilterAttribute());

            // 例外フィルターの追加
            configuration.Filters.Add(new LoggingExceptionFilterAttribute());

            JsonSerializerSettings jsonSettings = configuration.Formatters.JsonFormatter.SerializerSettings;
            // タイムゾーンにUTCを指定
            jsonSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
            jsonSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
        }
    }
}
