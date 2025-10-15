/** 最終更新日 : 2016-10-17 **/
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Principal;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace Tos.Web.Controllers.Filters
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple= false)]
    public class AuthenticationFilterAttribute : ActionFilterAttribute
    {
        private bool active;

        public AuthenticationFilterAttribute(bool active)
        {
            this.active = active;
        }

        public AuthenticationFilterAttribute()
            : this(true)
        { }

        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            if (!this.active) {
                base.OnActionExecuting(actionContext);
                return;
            }

            ApiController controller = (actionContext.ControllerContext.Controller as ApiController);
            if (controller == null)
            {
                throw new HttpRequestException();
            }

            IPrincipal principal = controller.User;
            if (principal == null)
            {
                throw new HttpRequestException();
            }

            if(!principal.Identity.IsAuthenticated)
            {
                HttpResponseMessage response = actionContext.Request.CreateErrorResponse(HttpStatusCode.Unauthorized, Properties.Resources.AuthorizedErrorMessage);
                actionContext.Response = response;
            }
            base.OnActionExecuting(actionContext);
        }
    }
}
