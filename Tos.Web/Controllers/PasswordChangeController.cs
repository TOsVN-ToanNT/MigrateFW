/** 最終更新日 : 2016-10-17 **/
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Tos.Web.Account;
using Tos.Web.Data;

namespace Tos.Web.Controllers
{
    [Authorize]
    public class PasswordChangeController : ApiController
    {
        public void Post([FromBody]PasswordChangeRequest value)
        {
            // パスワード変更に処理を呼び出します。
            MixedAuthentication.PasswordChangeFormAuthenticate(value.userid, value.password, value.newpassword);
        }
    }

    public class PasswordChangeRequest
    {
        public string userid { get; set; }
        public string password { get; set; }
        public string newpassword { get; set; }
    }

}
