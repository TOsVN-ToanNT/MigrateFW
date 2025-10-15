/** 最終更新日 : 2016-10-17 **/
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data;
using System.Text;
using Tos.Web.Logging;

namespace Tos.Web.Data
{
    public partial class AuthorityMasterEntities : DbContext
    {
        /// <summary>
        /// エンティティの変更セットを、監査ログに出力します
        /// </summary>
        public override int SaveChanges()
        {
            var changes = this.ChangeTracker.Entries().Where(
                   e => e.State == EntityState.Added
                       || e.State == EntityState.Modified
                       || e.State == EntityState.Deleted);

            foreach (DbEntityEntry item in changes)
            {
                StringBuilder builder = new StringBuilder();

                DbPropertyValues values = null; 

                if (item.State == EntityState.Deleted)
                {
                    values = item.OriginalValues;
                }
                else
                {
                    values = item.CurrentValues;
                }

                // 追加、修正があった場合、現在の値を出力する
                foreach (string propertyName in values.PropertyNames)
                {
                    builder.Append(propertyName);
                    builder.Append(": [");
                    builder.Append(values[propertyName]);
                    builder.Append("] ");
                }

                // 操作を行っているEntity名を出力
                builder.Append(item.Entity.GetType());
                builder.Append(" ");
                // 変更状態（追加か修正）を出力
                builder.Append(item.State);
                builder.Append(" ");
                // 操作を行っているユーザIDを出力
                builder.Append(HttpContext.Current.User.Identity.Name);
                builder.Append(" ");
                // 操作を行っている時間を出力
                builder.Append(DateTime.UtcNow);

                // ログに内容を出力する
                Logger.Audit.Info(builder.ToString(), null);
            }

            return base.SaveChanges();
        }
    }
}
