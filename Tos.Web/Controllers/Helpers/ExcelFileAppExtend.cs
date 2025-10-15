/** 最終更新日 : 2016-10-17 **/
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Text.RegularExpressions;


namespace Tos.Web.Controllers.Helpers
{
    public partial class ExcelFile
    {
        //アプリケーションでExcel出力の拡張機能を実装する場合はこちらに実装してください。

        /// <summary>
        /// 行をコピーする
        /// </summary>
        /// <param name="sheetName"></param>
        /// <param name="rowNumberFrom"></param>
        /// <param name="rowNumberTo"></param>
        //public void CopyRow(string sheetName, UInt32 rowNumberFrom, UInt32 rowNumberTo, bool isSave)
        //{
        //    WorkbookPart book = document.WorkbookPart;
        //    Sheet sheet = book.Workbook.Descendants<Sheet>().Where((s) => s.Name == sheetName).FirstOrDefault();

        //    if (sheet != null)
        //    {
        //        Worksheet ws = ((WorksheetPart)(book.GetPartById(sheet.Id))).Worksheet;
        //        SheetData sheetData = ws.GetFirstChild<SheetData>();

        //        Row row = (Row)GetRow(sheetData, rowNumberFrom).CloneNode(true);
        //        row.RowIndex = rowNumberTo;

        //        IEnumerable<Cell> cells = row.Elements<Cell>().AsEnumerable<Cell>();
        //        foreach (Cell cell in cells)
        //        {
        //            string column = GetColumnName(cell.CellReference.Value);
        //            cell.CellReference = column + rowNumberTo;
        //        }

        //        sheetData.Append(row);

        //        if (isSave)
        //            ws.Save();
        //    }
        //}

    }
}
