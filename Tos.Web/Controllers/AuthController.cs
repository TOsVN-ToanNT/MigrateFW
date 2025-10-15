/** 最終更新日 : 2016-10-17 **/
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Security;
using Tos.Web.Account;
using Tos.Web.Controllers.Filters;

namespace Tos.Web.Controllers
{
    [AuthenticationFilter(false)]
    public class AuthController: ApiController
    {
        public HttpResponseMessage Post([FromBody]AuthRequest request)
        {
            if (request == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, Properties.Resources.NotNullAllow);
            }

            if (MixedAuthentication.FormAuthenticateNoRedirect(request.UserId, request.Password, false))
            {
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.Unauthorized, Properties.Resources.AuthorizedErrorMessage);
            }
        }
    }

    public class AuthRequest
    {
        public string UserId { get; set; }
        public string Password { get; set; }
    }
}
