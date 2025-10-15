/** 最終更新日 : 2016-10-17 **/
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using System.Net.Http;
using Tos.Web.Data;
using System.Security.Principal;
using System.Threading;

namespace Tos.Web.Controllers.Filters
{

    /// <summary>
    /// 認可されたユーザーのみを許可する FilterAttribute を定義します。
    /// </summary>
    public class RolesAuthorizationFilterAttribute : AuthorizationFilterAttribute
    {
        private int[] roles = null;

        /// <summary>
        /// 引数で指定された権限コードをもとに FilterAttribute のインスタンスを初期化します。
        /// </summary>
        /// <param name="roles">認可する権限コードの配列</param>
        public RolesAuthorizationFilterAttribute(params int[] roles)
        {
            this.roles = roles;
        }

        /// <summary>
        /// 認可時の処理を実行します。
        /// 統合認可に登録されたユーザーの権限コードと認可する権限コードを比較して認可されているかどうかを決定します。
        /// </summary>
        /// <param name="actionContext"></param>
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            var identity = Thread.CurrentPrincipal.Identity;
            if (identity == null && HttpContext.Current != null) {
                identity = HttpContext.Current.User.Identity;
            }

            if (identity == null)
            {
                actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.Unauthorized, Properties.Resources.AuthorizedErrorMessage);
            }

            decimal cd_shain = 0;
            Decimal.TryParse(UserInfo.GetUserNameFromIdentity(identity), out cd_shain);

            if (roles == null || roles.Length == 0)
            {
                return;
            }

            using (AuthorityMasterEntities context = new AuthorityMasterEntities())
            {

                var count = (from r in context.vw_shain_info
                             where r.cd_shain == cd_shain
                                && this.roles.Contains(r.cd_kengen)
                             select r)
                             .Count();

                if (count == 0)
                {
                    actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.Unauthorized, Properties.Resources.AuthorizedErrorMessage);
                }
            }
        }

    }
}
