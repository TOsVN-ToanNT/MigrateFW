/** 最終更新日 : 2016-10-17 **/
//------------------------------------------------------------------------------
// <copyright file="WebDataService.svc.cs" company="Microsoft">
//     Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//------------------------------------------------------------------------------
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Services;
using System.Data.Services.Common;
using System.Linq;
using System.Net;
using System.ServiceModel.Web;
using System.Web;
using Tos.Web.Logging;
using Tos.Web.Data;

namespace Tos.Web.Services
{
    public class SampleService : DataService<SampleEntities>
    {
        // This method is called only once to initialize service-wide policies.
        public static void InitializeService(DataServiceConfiguration config)
        {
            config.SetEntitySetAccessRule("Torihiki", EntitySetRights.AllRead);
            config.SetEntitySetAccessRule("ShiharaiJoken", EntitySetRights.AllRead);
            config.SetEntitySetAccessRule("Buhin", EntitySetRights.AllRead);
            config.DataServiceBehavior.MaxProtocolVersion = DataServiceProtocolVersion.V3;
        }

        /// <summary>
        /// Data Services で発生した例外をハンドルします。
        /// ここではサーバーのエラーログにエラー情報を記録し、例外の詳細な情報をクライアントに通知するよう設定しています。
        /// </summary>
        /// <param name="args">発生した例外の詳細と、関連する HTTP 応答の詳細を格納した引数。</param>
        protected override void HandleException(HandleExceptionArgs args) {
            Logger.App.Error(args.Exception.Message, args.Exception);

            args.UseVerboseErrors = true;

            //同時実行エラーをハンドルして呼び出し元に返します。
            if (args.Exception != null
                && args.Exception is OptimisticConcurrencyException
                || args.Exception.InnerException is OptimisticConcurrencyException) {
                throw new DataServiceException((int)HttpStatusCode.Conflict, args.Exception.Message);
            }

            //TODO: ここに個別でデータベースで発生した例外のハンドルを追加します。
            System.Data.UpdateException updateException = args.Exception as System.Data.UpdateException;
            if (updateException != null) {
                System.Data.SqlClient.SqlException ex = updateException.InnerException as System.Data.SqlClient.SqlException;
                if (ex != null) {
                    if (ex.Number == Tos.Web.Data.SqlErrorNumbers.PrimaryKeyViolation) {
                        throw new DataServiceException((int)HttpStatusCode.InternalServerError, Properties.Resources.PrimaryKeyViolation);
                    }

                    if (ex.Number == Tos.Web.Data.SqlErrorNumbers.NotNullAllow) {
                        throw new DataServiceException((int)HttpStatusCode.InternalServerError, Properties.Resources.NotNullAllow);
                    }
                }
            }
        }
    
    }
}
