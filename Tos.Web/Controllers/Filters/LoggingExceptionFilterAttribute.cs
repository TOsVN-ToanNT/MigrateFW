/** 最終更新日 : 2016-10-17 **/
using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Filters;
using Tos.Web.Logging;
using Tos.Web.Properties;
using System.Data.Entity.Infrastructure;
using System.Net.Http.Formatting;
using System.Data.SqlClient;
using System.Web;

namespace Tos.Web.Controllers.Filters
{
    /// <summary>
    /// Web API コントローラーで例外が発生した場合に、エラーログを記録し、クライアントに HTTP エラーを送信する Web API フィルターです。
    /// </summary>
    public class LoggingExceptionFilterAttribute : GenericExceptionFilterAttribute
    {

        /// <summary>
        /// Web API コントローラーで例外が発生した場合に、エラーログを記録し、クライアントに HTTP エラーを送信します。
        /// </summary>
        /// <param name="actionExecutedContext">エラー発生時の HttpActionExecutedContext のインスタンス</param>
        protected override void HandleException(HttpActionExecutedContext actionExecutedContext)
        {

            Exception exception = actionExecutedContext.Exception;
            HttpRequestMessage request = actionExecutedContext.Request;
            JsonMediaTypeFormatter formatter = GlobalConfiguration.Configuration.Formatters.JsonFormatter;

            HttpStatusCode statusCode = HttpStatusCode.InternalServerError;
            Exception contentException = exception;

            if (exception == null)
            {
                contentException = new HttpUnhandledException(Properties.Resources.UnknownError);
            }

            // 例外をエラーログに出力します。
            Logger.App.Error(Resources.ServiceError, actionExecutedContext.Exception);

            if (exception is HttpException)
            {
                statusCode = (HttpStatusCode)((HttpException)exception).GetHttpCode();
            }

            // TODO: データベースの更新処理で同時事項の競合が発生した場合の例外をハンドルします。
            if (exception is DbUpdateConcurrencyException || 
                exception.InnerException is DbUpdateConcurrencyException) 
            {
                statusCode = HttpStatusCode.Conflict;
                contentException = new Exception(Properties.Resources.DbUpdateConcurrencyError, exception);
            }

            //TODO: データベースで発生した例外のハンドルを追加します。
            DbUpdateException updateException = exception as DbUpdateException;
            if (updateException != null)
            {
                SqlException sqlException = updateException.InnerException as SqlException;
                if (sqlException != null)
                {
                    if (sqlException.Number == Data.SqlErrorNumbers.PrimaryKeyViolation)
                    {
                        contentException = new Exception(Properties.Resources.PrimaryKeyViolation, exception);
                    }
                    else if (sqlException.Number == Data.SqlErrorNumbers.NotNullAllow)
                    {
                        contentException = new Exception(Properties.Resources.NotNullAllow, exception);
                    }
                    else
                    {
                        contentException = new Exception(Properties.Resources.DbSaveErrorMessage, exception);
                    }
                }
            }

            actionExecutedContext.Response = request.CreateResponse(statusCode, contentException);        
        }
    }
}
