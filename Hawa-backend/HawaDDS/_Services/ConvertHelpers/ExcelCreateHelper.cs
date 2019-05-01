using System.IO;
using System.Linq;
using System.Xml;

using _Common.Dependency;
using _Common.Extensions;
using _Dtos.Shared;
using _Services.Internal;

using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;

namespace _Services.ConvertHelpers
{
    public static class ExcelCreateHelper
    {
        private static IColumnAliasManager columnAliasManager = SingletonDependency<IColumnAliasManager>.Instance;

        private static FileDescription CreateExcel(string sheetName, Row[] rows)
        {
            return new FileDescription
            {
                ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                FileName = "Report.xlsx",

                //UserFileName = Messages.Global.Labels.FileNames.Report,
                Data = SaveDataToExcel(sheetName, rows)
            };
        }

        private static byte[] SaveDataToExcel(string sheetName, Row[] rows)
        {
            using (var stream = new MemoryStream())
            {
                using (var spreadsheetDocument = SpreadsheetDocument.Create(stream, SpreadsheetDocumentType.Workbook))
                {
                    spreadsheetDocument.AddWorkbookPart();
                    spreadsheetDocument.WorkbookPart.Workbook = new Workbook
                    {
                        Sheets = new Sheets(),
                    };

                    var sheetPart = spreadsheetDocument.WorkbookPart.AddNewPart<WorksheetPart>();
                    var sheet = new Sheet
                    {
                        Id = spreadsheetDocument.WorkbookPart.GetIdOfPart(sheetPart),
                        SheetId = 1,
                        Name = !string.IsNullOrEmpty(sheetName) ? sheetName : "Report",
                    };
                    spreadsheetDocument.WorkbookPart.Workbook.GetFirstChild<Sheets>().Append(sheet);

                    var sheetData = new SheetData();
                    sheetPart.Worksheet = new Worksheet(sheetData);
                    foreach (var row in rows)
                    {
                        sheetData.AppendChild(row);
                    }

                    spreadsheetDocument.Close();
                }

                return stream.ToArray();
            }
        }

        private static Row CreateEmptyRow()
        {
            return CreateRow(string.Empty);
        }

        private static Row CreateRow(params string[] cellValues)
        {
            var row = new Row();
            foreach (string cellValue in cellValues)
            {
                row.AppendChild(cellValue.ToCell());
            }

            return row;
        }

        private static Row CreateOutlineRow(ByteValue outlineLevel, params string[] cellValues)
        {
            return CreateRow(outlineLevel, cellValues.ConvertArray(x => x.ToCell()));
        }

        private static Row CreateRow(ByteValue outlineLevel, params Cell[] cells)
        {
            var row = new Row();
            if (outlineLevel != null)
            {
                row.OutlineLevel = outlineLevel;
                row.Hidden = true;
            }

            row.Collapsed = true;
            foreach (var cell in cells)
            {
                row.AppendChild(cell);
            }

            return row;
        }

        private static Cell ToCell(this string value)
        {
            string validValue = string.Empty;
            if (value != null)
            {
                validValue = new string(value.Where(XmlConvert.IsXmlChar).ToArray());
            }

            return new Cell
            {
                CellValue = new CellValue(validValue),
                DataType = CellValues.String
            };
        }

        private static Cell ToCell(this decimal value)
        {
            return new Cell
            {
                CellValue = new CellValue(value.ToMoneyString(false)),
                DataType = CellValues.Number
            };
        }

        private static Cell ToCell(this int value)
        {
            return new Cell
            {
                CellValue = new CellValue(value.ToStringInvariant()),
                DataType = CellValues.Number
            };
        }

        private static Cell EmptyCell()
        {
            return string.Empty.ToCell();
        }
    }
}