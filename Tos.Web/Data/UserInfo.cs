using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace Tos.Web.Data
{
    /// <summary>
    /// ユーザー情報を定義します。
    /// </summary>
    public class UserInfo
    {
        /// <summary>
        /// ユーザー情報を定義するクラスのインスタンスを初期化します。
        /// </summary>
        public UserInfo()
        {
            this.EmployeeCD = 0;
            this.Organization = string.Empty;
            this.Branch = string.Empty;
            this.Name = string.Empty;
            this.Roles = new List<RoleInfo>();
        }

        /// <summary>
        /// 現在ログインしているユーザーの社員番号
        /// </summary>
        public decimal EmployeeCD { get; set; }

        /// <summary>
        /// 現在ログインしているユーザーの組織
        /// </summary>
        public string Organization { get; set; }

        /// <summary>
        /// 現在ログインしているユーザーの所属
        /// </summary>
        public string Branch { get; set; }

        /// <summary>
        /// 現在ログインしているユーザー名
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 現在ログインしているユーザーが付与されているロール（権限）
        /// </summary>
        public List<RoleInfo> Roles { get; set; }

        /// <summary>
        /// ユーザー情報を定義するクラスのインスタンスを初期化します。
        /// </summary>
        public static UserInfo CreateFromAuthorityMaster(IIdentity identity)
        {
            UserInfo result = new UserInfo();

            // 統合ID権限テーブルから認可情報を取得します。
            using (AuthorityMasterEntities context = new AuthorityMasterEntities())
            {

                decimal employeeCD = 0;
                Decimal.TryParse(UserInfo.GetUserNameFromIdentity(identity), out employeeCD);
                result.EmployeeCD = employeeCD;

                var roleInfos = (from r in context.vw_shain_info_form
                                 where r.cd_shain == employeeCD
                                 select r).ToList();

                if (roleInfos.Count == 0)
                {
                    return null;
                }

                foreach (var roleInfo in roleInfos)
                {
                    result.EmployeeCD = roleInfo.cd_shain;
                    result.Name = roleInfo.nm_shain;
                    result.Branch = roleInfo.nm_shozoku;
                    result.Organization = roleInfo.nm_kaisha;

                    result.Roles.Add(new RoleInfo
                    {
                        AuthorityCode = roleInfo.cd_kengen,
                        ContentCode = roleInfo.kbn_form
                    });
                }
            }

            return result;
        }

        /// <summary>
        /// ユーザー名を取得します
        /// </summary>
        /// <param name="identity">実行ユーザー情報</param>
        /// <returns>ユーザー名</returns>
        public static string GetUserNameFromIdentity(IIdentity identity)
        {
            string name = identity.Name;
            int separator = name.IndexOf("\\");
            return (separator > -1) ? name.Substring(separator + 1, name.Length - separator - 1) : name;
        }
    }

    public class RoleInfo
    {
        public RoleInfo()
        {
            this.AuthorityCode = 0;
            this.ContentCode = 0;
        }

        /// <summary>
        /// 権限コード
        /// </summary>
        public int AuthorityCode { get; set; }

        /// <summary>
        /// 内容コード
        /// </summary>
        public int ContentCode { get; set; }

    }
}
