/** 最終更新日 : 2018-01-25 **/
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Tos.Web.Data;
using System.Security.Principal;
using System.Web;

namespace Tos.Web.Controllers
{
    [Authorize]
    public class UserController : ApiController
    {
        /// <summary>
        /// 現在ログインしているユーザーの情報を取得します。
        /// GET api/<controller>
        /// </summary>
        public UserInfo Get()
        {
            UserInfo result = UserInfo.CreateFromAuthorityMaster(this.User.Identity);

            if (result == null)
            {
                throw new HttpException((int)HttpStatusCode.NotFound, Properties.Resources.NoUserExists + this.User.Identity.Name);
            }

            return result;
        }
    }
}
