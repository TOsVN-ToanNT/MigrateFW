/** 最終更新日 : 2016-10-17 **/
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web;
using jp.co.fit.vfreport;

namespace Tos.Web.Reports
{
    class SvfClient : IDisposable
    {

        private SvfrClient svf = null;
        private MemoryStream stream = new MemoryStream();
        private const string SvfFormPathFormat = @"{0}\{1}_{2}.xml";

        #region errorMessages
        private readonly Dictionary<int, string> errorMessages = new Dictionary<int, string>()
            {
                { SVFErrorCode.Setting, Properties.Resource_SVF.SettingErrorMessage },
                { SVFErrorCode.Printer, Properties.Resource_SVF.PrinterErrorMessage },
                //{ SVFErrorCode.FieldName, Properties.Resource_SVF.FieldNameErrorMessage },
                //{ SVFErrorCode.FieldCount, Properties.Resource_SVF.FieldCountErrorMessage },
                { SVFErrorCode.Layout, Properties.Resource_SVF.LayoutErrorMessage },
                { SVFErrorCode.LayoutExists, Properties.Resource_SVF.LayoutExistsErrorMessage },
                { SVFErrorCode.ImageFile, Properties.Resource_SVF.ImageFileErrorMessage },
                { SVFErrorCode.PrinterSetting, Properties.Resource_SVF.PrinterSettingErrorMessage },
                { SVFErrorCode.Temporary, Properties.Resource_SVF.TemporaryErrorMessage },
                { SVFErrorCode.Adjustment, Properties.Resource_SVF.AdjustmentErrorMessage },
                { SVFErrorCode.Print, Properties.Resource_SVF.PrintErrorMessage },
                { SVFErrorCode.Graphic, Properties.Resource_SVF.GraphicErrorMessage },
                { SVFErrorCode.Invalid, Properties.Resource_SVF.InvalidErrorMessage },
                { SVFErrorCode.Stack, Properties.Resource_SVF.StackErrorMessage },
                { SVFErrorCode.Spooler, Properties.Resource_SVF.SpoolerErrorMessage },
                //{ SVFErrorCode.AttributeFieldExists, Properties.Resource_SVF.AttributeFieldExistsErrorMessage },
                { SVFErrorCode.AttributeInvalid, Properties.Resource_SVF.AttributeInvalidErrorMessage },
                { SVFErrorCode.AttributeChange, Properties.Resource_SVF.AttributeChangeErrorMessage },
                { SVFErrorCode.SubForm, Properties.Resource_SVF.SubFormErrorMessage },
                { SVFErrorCode.Record, Properties.Resource_SVF.RecordErrorMessage },
                //{ SVFErrorCode.RecordPaging, Properties.Resource_SVF.RecordPagingErrorMessage },
                { SVFErrorCode.ReportDirectorSpooler, Properties.Resource_SVF.ReportDirectorSpoolerErrorMessage },
                { SVFErrorCode.ReportDirectorConnection, Properties.Resource_SVF.ReportDirectorConnectionErrorMessage },
                { SVFErrorCode.ReportDirectorServer, Properties.Resource_SVF.ReportDirectorServerErrorMessage },
                //{ SVFErrorCode.FormModeCount, Properties.Resource_SVF.FormModeCountErrorMessage },
                //{ SVFErrorCode.FormModeField, Properties.Resource_SVF.FormModeFieldErrorMessage },
                { SVFErrorCode.RecordExists, Properties.Resource_SVF.RecordExistsErrorMessage },
                { SVFErrorCode.Sort, Properties.Resource_SVF.SortErrorMessage },
                { SVFErrorCode.Index, Properties.Resource_SVF.IndexErrorMessage },
                { SVFErrorCode.SortRecord, Properties.Resource_SVF.SortRecordErrorMessage },
                { SVFErrorCode.DBConnection, Properties.Resource_SVF.DBConnectionErrorMessage },
                { SVFErrorCode.LayoutQuery, Properties.Resource_SVF.LayoutQueryErrorMessage },
                { SVFErrorCode.QueryExists, Properties.Resource_SVF.QueryExistsErrorMessage },
                { SVFErrorCode.QueryNotResult, Properties.Resource_SVF.QueryNotResultErrorMessage },
                { SVFErrorCode.QueryNotField, Properties.Resource_SVF.QueryNotFieldErrorMessage },
                { SVFErrorCode.JavaVM, Properties.Resource_SVF.JavaVMErrorMessage },
                { SVFErrorCode.NotSupportedAPI, Properties.Resource_SVF.NotSupportedAPIErrorMessage },

            };
        #endregion

        /// <summary>
        /// 以下の処理をコンストラクタ内の初期化処理として実行します。
        /// ・ライブラリの初期化
        /// ・プリンタの指定
        /// ・様式ファイルの指定
        /// ・Streamの指定  
        /// </summary>
        /// <param name="formFileName">様式ファイル名</param>
        /// <param name="lang">言語</param>
        public SvfClient(string formFileName, string lang)
        {
            if (string.IsNullOrEmpty(formFileName))
            {
                throw new ArgumentNullException("formFileName");
            }
            if (string.IsNullOrEmpty(lang))
            {
                throw new ArgumentNullException("lang");
            }

            try
            {
                svf = new SvfrClient(Properties.Settings.Default.SvfServer);

                IsErrorThenThrowException(svf.VrInit());
                IsErrorThenThrowException(svf.VrSetPrinter(Properties.Settings.Default.SvfPDFPrinter, Properties.Settings.Default.SvfPDFPrinter));
                IsErrorThenThrowException(svf.VrSetSpoolFileStream(stream));
                string svfFormatFileName = string.Format(SvfFormPathFormat, Properties.Settings.Default.SvfFormPath, formFileName, lang);
                IsErrorThenThrowException(svf.VrSetForm(svfFormatFileName, 4));
            }
            catch (SvfrConnectException ex)
            {
                throw new SvfException(Properties.Resource_SVF.SvfClientErrorMessage, ex);
            }
            catch (SvfrException ex)
            {
                throw new SvfException(Properties.Resource_SVF.SvfClientErrorMessage, ex);
            }
            catch (Exception)
            {
                throw;
            }

        }

        /// <summary>
        /// 単一のレコードを帳票に設定します
        /// </summary>
        /// <param name="record"></param>
        public void SetRecord(object record)
        {
            if (record == null)
            {
                throw new ArgumentNullException("record");
            }

            Type type = record.GetType();
            PropertyInfo[] properties = type.GetProperties();

            SetRecordValue(record, properties);
        }

        /// <summary>
        /// 複数のレコードを帳票に設定します
        /// </summary>
        /// <param name="records"></param>
        public void SetRecords<T>(IEnumerable<T> records)
        {
            if (records == null || records.Count() == 0)
            {
                throw new ArgumentNullException("records");
            }

            Type type = typeof(T);
            PropertyInfo[] properties = type.GetProperties();

            foreach (object record in records)
            {
                SetRecordValue(record, properties);
            }
        }

        private void SetRecordValue(object record, PropertyInfo[] properties)
        {
            if (record == null)
            {
                throw new ArgumentNullException("record");
            }
            if (properties == null || properties.Length == 0)
            {
                throw new ArgumentNullException("properties");
            }

            try
            {
                foreach (PropertyInfo property in properties)
                {
                    if (property.PropertyType == typeof(object))
                    {
                        continue;
                    }

                    var propertyValue = property.GetValue(record, null);
                    svf.VrsOut(property.Name, ConvertReportValue(propertyValue));
                }

                IsErrorThenThrowException(svf.VrEndRecord());
            }
            catch (SvfrConnectException ex)
            {
                throw new SvfException(Properties.Resource_SVF.SvfClientErrorMessage, ex);
            }
            catch (SvfrException ex)
            {
                throw new SvfException(Properties.Resource_SVF.SvfClientErrorMessage, ex);
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// 帳票作成処理を実行します。
        /// </summary>
        /// <returns></returns>
        public Stream Execute()
        {
            try
            {
                IsErrorThenThrowException(svf.VrPrint());
                IsErrorThenThrowException(svf.VrQuit());
            }
            catch (SvfrConnectException ex)
            {
                throw new SvfException(Properties.Resource_SVF.SvfClientErrorMessage, ex);
            }
            catch (SvfrException ex)
            {
                throw new SvfException(Properties.Resource_SVF.SvfClientErrorMessage, ex);
            }
            catch (Exception)
            {
                throw;
            }

            return new MemoryStream(stream.GetBuffer());
        }

        public void Close()
        {
            Dispose(true);
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        ~SvfClient()
        {
            Dispose(false);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (svf != null)
                {
                    svf.Close();
                }

                if (stream != null)
                {
                    stream.Close();
                }
            }
        }

        public bool IsErrorThenThrowException(int code)
        {
            if (errorMessages.ContainsKey(code))
            {
                throw new SvfException(errorMessages[code]);
            }
            return true;
        }

        private string ConvertReportValue(object value)
        {
            if (value == null)
            {
                return string.Empty;
            }
            return value.ToString();
        }
    }

    /// <summary>
    /// Svfの例外を定義します
    /// </summary>
    class SvfException : Exception
    {
        public SvfException(string message)
            : base(message)
        {
        }
        public SvfException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }

    /// <summary>
    /// Svfのエラーコードを定義します
    /// </summary>
    class SVFErrorCode
    {
        public const int Setting = -1;
        public const int Printer = -3;
        public const int FieldName = -21;
        public const int FieldCount = -22;
        public const int Layout = -23;
        public const int LayoutExists = -30;
        public const int ImageFile = -31;
        public const int PrinterSetting = -32;
        public const int Temporary = -33;
        public const int Adjustment = -34;
        public const int Print = -35;
        public const int Graphic = -37;
        public const int Invalid = -40;
        public const int Stack = -81;
        public const int Spooler = -102;
        public const int AttributeFieldExists = -120;
        public const int AttributeInvalid = -121;
        public const int AttributeChange = -122;
        public const int SubForm = -131;
        public const int Record = -132;
        public const int RecordPaging = -133;
        public const int ReportDirectorSpooler = -150;
        public const int ReportDirectorConnection = -153;
        public const int ReportDirectorServer = -155;
        public const int FormModeCount = -501;
        public const int FormModeField = -505;
        public const int RecordExists = -506;
        public const int Sort = -530;
        public const int Index = -531;
        public const int SortRecord = -532;
        public const int DBConnection = -550;
        public const int LayoutQuery = -551;
        public const int QueryExists = -552;
        public const int QueryNotResult = -554;
        public const int QueryNotField = -555;
        public const int JavaVM = -4971;
        public const int NotSupportedAPI = -7474;
    }
}

