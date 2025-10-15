/** 最終更新日 : 2018-08-24 **/
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Tos.Web.Controllers.Helpers
{
    public class Constants
    {
    }

    /// <summary>
    /// バリデーション種別を定義します
    /// </summary>
    public static class ValidationRuleTypes
    {
        public const string Required = "required";
        public const string MaxLength = "maxlength";
        public const string Range = "range";
        public const string Number = "number";
        public const string Integer = "integer";
        public const string PointLength = "pointlength";
        public const string Date = "date";
        public const string Boolean = "bit";
        public const string Zenkaku = "zenkaku";
        public const string Hankaku = "hankaku";
        public const string Alphabet = "alphabet";
        public const string Alphanum = "alphanum";
        public const string Haneisukigo = "haneisukigo";
        public const string Hankana = "hankana";
    }

    /// <summary>
    /// ブール型の数値変換を定義します
    /// </summary>
    public static class BoolStrings
    {
        public static readonly Dictionary<string, Boolean> BoolMembers = new Dictionary<string, Boolean>()
        {
            {"0", false},
            {"1", true}
        };
    }

    /// <summary>
    /// カラムタイプの種類を定義します
    /// </summary>
    public static class ColumnTypes
    {
        public static readonly string BoolTypes = "Boolean";
        public static readonly string DateTimeTypes = "DateTime";
        public static readonly string DateTimeOffsetTypes = "DateTimeOffset";
    }

    /// <summary>
    /// CSV更新区分の種類を定義します
    /// </summary>
    public static class CsvUpdateColumn
    {
        public static readonly string NotUpdate = "0";
        public static readonly string CreateUpdate = "1";
        public static readonly string Delete = "2";
    }
}
