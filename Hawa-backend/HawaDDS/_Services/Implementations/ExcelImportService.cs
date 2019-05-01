using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using _Abstractions.Services;
using _Common;
using _Common.Exceptions;
using _Common.Extensions;
using _Common.Timing;
using _Dtos.IC.InputDtos;
using _Dtos.Import;
using _Dtos.Shared;
using _Entities.AP;
using _Entities.GE;
using _Entities.IC;
using _EntityFrameworkCore.UnitOfWork;

using EFCore.BulkExtensions;

using Microsoft.EntityFrameworkCore;

using OfficeOpenXml;

namespace _Services.Implementations
{
    public class ExcelImportService : IExcelImportService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ExcelImportService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public ImportResultDto ImportForestActor(FileDescription excelFile)
        {
            using (var memoryStream = new MemoryStream(excelFile.Data))
            {
                using (var package = new ExcelPackage(memoryStream))
                {
                    var worksheet = package.Workbook.Worksheets[1]; // Tip: To access the first worksheet, try index 1, not 0
                    int totalRows = worksheet.Dimension.Rows;

                    List<APActor> actors = new List<APActor>();

                    for (int i = 2; i < totalRows; i++)
                    {
                        actors.Add(
                            new APActor
                            {
                                AAStatus = "Alive",
                                AASource = worksheet.Cells[i, 1].Value?.ToString(),
                                APActorName = worksheet.Cells[i, 2].Value?.ToString(),
                                APActorAddress = worksheet.Cells[i, 3].Value?.ToString(),
                                APActorTypeCode = worksheet.Cells[i, 4].Value?.ToString(),
                                GEStateProvinceCode = GetCode(worksheet.Cells[i, 5].Value?.ToString()),
                                GEDistrictCode = GetCode(worksheet.Cells[i, 6].Value?.ToString()),
                                GECommuneCode = GetCode(worksheet.Cells[i, 7].Value?.ToString()),
                                APActorEmail = worksheet.Cells[i, 8].Value?.ToString(),
                                APActorPhone = worksheet.Cells[i, 9].Value?.ToString(),
                                APActorWebsite = worksheet.Cells[i, 10].Value?.ToString(),
                                APActorCode = worksheet.Cells[i, 23].Value?.ToString(),
                            });
                    }

                    _unitOfWork.Context.BulkInsert(actors);

                    _unitOfWork.Complete();

                    return new ImportResultDto
                    {
                        ImportRows = actors.Count
                    };
                }
            }
        }

        public async Task<DataResultDto> ImportForestPlotLocations(string path)
        {
            var dataResults = EmptyArray<DataAmountResultDto>.Instance;

            List<string> badFiles = new List<string>();

            List<string> badForestPlotCodes = new List<string>();

            if (path.IsNullOrEmpty())
            {
                throw new BusinessException("Path is empty.");
            }

            string[] filePaths = Directory.GetFiles(path, "*.geojson");

            foreach (var filePath in filePaths)
            {
                FileStream fs = new FileStream(filePath, FileMode.Open);

                StreamReader rd = new StreamReader(fs, Encoding.UTF8);

                var value = rd.ReadToEnd();

                rd.Close();

                try
                {
                    var locationJson = value.FromJsonString<DataLocationJsonDto>();

                    if (locationJson.Features.IsNullOrEmpty())
                    {
                        throw new BusinessException("Data is wrong.");
                    }

                    var communeCode = locationJson.Features.Select(x => x.Properties.Commune_co).ToArray();

                    var forestPlotsFromDb = await _unitOfWork.GetRepository<ICForestPlot>()
                        .GetAll()
                        .Where(
                            x => communeCode.Contains(x.GECommuneCode))
                        .ToArrayAsync();

                    int i = 0;
                    foreach (var location in locationJson.Features)
                    {
                        ++i;
                        if (location.Geometry?.Coordinates.Length != 2 && location.Geometry != null)
                        {
                            throw new BusinessException("Data Coordinates is wrong : " + filePath + " : row " + i);
                        }

                        var forestPlot = forestPlotsFromDb.FirstOrDefault(x => x.ICForestPlotFormisUUID == location.Properties.Plot_uuid);

                        if (forestPlot == null)
                        {
                            badForestPlotCodes.Add(location.Properties.Plot_uuid);
                        }

                        if (forestPlot != null && location.Geometry != null)
                        {
                            forestPlot.ICForestPlotLocationLongitude = location.Geometry.Coordinates[0];
                            forestPlot.ICForestPlotLocationLatitude = location.Geometry.Coordinates[1];
                        }
                    }

                    dataResults = dataResults.Concat(
                            new DataAmountResultDto[1]
                            {
                                new DataAmountResultDto
                                {
                                    DataDBAmount = forestPlotsFromDb.Length,
                                    DataInputAmount = locationJson.Features.Length
                                }
                            })
                        .ToArray();

                    using (var transaction = _unitOfWork.Context.Database.BeginTransaction())
                    {
                        _unitOfWork.Context.BulkUpdate(forestPlotsFromDb);

                        transaction.Commit();
                    }
                }
                catch (Exception ex)
                {
                    badFiles.Add(filePath + " " + ex.Message);
                }
            }

            return new DataResultDto
            {
                BadForestPlotCode = badForestPlotCodes,
                BadFile = badFiles,
                Result = dataResults
            };
        }

        public ImportResultDto ImportForestPlots(FileDescription excelFile)
        {
            using (var memoryStream = new MemoryStream(excelFile.Data))
            {
                using (var package = new ExcelPackage(memoryStream))
                {
                    var worksheet = package.Workbook.Worksheets[1]; // Tip: To access the first worksheet, try index 1, not 0
                    int totalRows = worksheet.Dimension.Rows;

                    List<ICForestPlot> forestPlots = new List<ICForestPlot>();

                    for (int i = 2; i < totalRows; i++)
                    {
                        forestPlots.Add(
                            new ICForestPlot
                            {
                                AAStatus = "Alive",
                                AASource = worksheet.Cells[i, 1].Value?.ToString(),

                                //APActorTypeCode = worksheet.Cells[i, 4].Value?.ToString(),
                                GEProvinceCode = GetCode(worksheet.Cells[i, 5].Value?.ToString()),
                                GEDistrictCode = GetCode(worksheet.Cells[i, 6].Value?.ToString()),
                                GECommuneCode = GetCode(worksheet.Cells[i, 7].Value?.ToString()),
                                GECompartmentCode = worksheet.Cells[i, 13].Value?.ToString(),
                                GESubCompartmentCode = worksheet.Cells[i, 13].Value?.ToString(),
                                GEPlotCode = worksheet.Cells[i, 13].Value?.ToString(),
                                ICForestPlotVillage = worksheet.Cells[i, 14].Value?.ToString(),
                                ICForestPlotArea = Convert.ToDecimal(worksheet.Cells[i, 15].Value?.ToString()),
                                ICTreeSpecCode = GetCode(worksheet.Cells[i, 16].Value?.ToString()),
                                ICForestPlotPlantingYear = Convert.ToInt32(worksheet.Cells[i, 18].Value?.ToString()),
                                ICForestPlotVolumnPerHa = Convert.ToDecimal(worksheet.Cells[i, 19].Value?.ToString()),
                                ICForestPlotVolumnPerPlot = Convert.ToDecimal(worksheet.Cells[i, 20].Value?.ToString()),
                                ICLandUseCertCode = worksheet.Cells[i, 21].Value?.ToString(),
                                ICConflictSitCode = worksheet.Cells[i, 22].Value?.ToString(),
                                APActorCode = worksheet.Cells[i, 23].Value?.ToString()
                            });
                    }

                    _unitOfWork.Context.BulkInsert(forestPlots);

                    _unitOfWork.Complete();

                    return new ImportResultDto
                    {
                        ImportRows = forestPlots.Count
                    };
                }
            }
        }

        public ImportResultDto ImportSubCompartments(FileDescription excelFile)
        {
            using (var memoryStream = new MemoryStream(excelFile.Data))
            {
                using (var package = new ExcelPackage(memoryStream))
                {
                    var worksheet = package.Workbook.Worksheets[1]; // Tip: To access the first worksheet, try index 1, not 0
                    int totalRows = worksheet.Dimension.Rows;

                    List<GESubCompartment> subCompartments = new List<GESubCompartment>();

                    for (int i = 2; i <= totalRows; i++)
                    {
                        subCompartments.Add(
                            new GESubCompartment
                            {
                                AAStatus = "Alive",
                                AACreatedUser = "BYS",
                                AACreatedDate = Clock.Now,
                                GEProvinceCode = worksheet.Cells[i, 1].Value?.ToString(),
                                GESubCompartmentCode = worksheet.Cells[i, 8].Value?.ToString(),
                                GECompartmentCode = worksheet.Cells[i, 7].Value?.ToString(),
                                GECommuneCode = worksheet.Cells[i, 5].Value?.ToString(),
                                GEDistrictCode = worksheet.Cells[i, 3].Value?.ToString()
                            });
                    }

                    _unitOfWork.Context.BulkInsert(subCompartments);

                    _unitOfWork.Complete();

                    return new ImportResultDto
                    {
                        ImportRows = subCompartments.Count
                    };
                }
            }
        }

        public ImportResultDto ImportCompartments(FileDescription excelFile)
        {
            using (var memoryStream = new MemoryStream(excelFile.Data))
            {
                using (var package = new ExcelPackage(memoryStream))
                {
                    var worksheet = package.Workbook.Worksheets[1]; // Tip: To access the first worksheet, try index 1, not 0
                    int totalRows = worksheet.Dimension.Rows;

                    List<GECompartment> compartments = new List<GECompartment>();

                    for (int i = 2; i <= totalRows; i++)
                    {
                        compartments.Add(
                            new GECompartment
                            {
                                AAStatus = "Alive",
                                AACreatedUser = "BYS",
                                AACreatedDate = Clock.Now,
                                GEProvinceCode = worksheet.Cells[i, 1].Value?.ToString(),
                                GECompartmentCode = worksheet.Cells[i, 7].Value?.ToString(),
                                GECommuneCode = worksheet.Cells[i, 5].Value?.ToString(),
                                GEDistrictCode = worksheet.Cells[i, 3].Value?.ToString(),
                            });
                    }

                    _unitOfWork.Context.BulkInsert(compartments);

                    _unitOfWork.Complete();

                    return new ImportResultDto
                    {
                        ImportRows = compartments.Count
                    };
                }
            }
        }

        private string GetCode(string codeWithText)
        {
            return codeWithText.IsNullOrEmpty()
                ? string.Empty
                : codeWithText.Split("-").FirstOrDefault()?.Trim();
        }

        public ImportResultDto ImportForestPlotFromFormis(FileDescription excelFile)
        {
            using (var memoryStream = new MemoryStream(excelFile.Data))
            {
                using (var package = new ExcelPackage(memoryStream))
                {
                    var worksheet = package.Workbook.Worksheets[1]; // Tip: To access the first worksheet, try index 1, not 0
                    int totalRows = worksheet.Dimension.Rows;

                    List<ICForestPlot> forestPlots = new List<ICForestPlot>();

                    for (int i = 2; i <= totalRows; i++)
                    {
                        forestPlots.Add(
                            new ICForestPlot
                            {
                                AAStatus = "Alive",
                                AASource = "Formis",
                                AACreatedDate = Clock.Now,
                                AACreatedUser = "BYS",
                                ICForestPlotFormisUUID = worksheet.Cells[i, 1].Value?.ToString(),

                                //APActorTypeCode = worksheet.Cells[i, 26].Value?.ToString(),
                                GECommuneCode = GetCode(worksheet.Cells[i, 2].Value?.ToString()),
                                GECompartmentCode = worksheet.Cells[i, 3].Value?.ToString(),
                                GESubCompartmentCode = worksheet.Cells[i, 4].Value?.ToString(),
                                GEPlotCode = worksheet.Cells[i, 5].Value?.ToString(),
                                ICForestPlotVillage = worksheet.Cells[i, 8].Value?.ToString(),
                                ICForestPlotArea = Convert.ToDecimal(worksheet.Cells[i, 9].Value?.ToString()),
                                ICTreeSpecCode = GetCode(worksheet.Cells[i, 18].Value?.ToString()),
                                ICForestPlotPlantingYear = Convert.ToInt32(worksheet.Cells[i, 19].Value?.ToString()),
                                ICForestPlotVolumnPerHa = Convert.ToDecimal(worksheet.Cells[i, 21].Value?.ToString()),
                                ICForestPlotVolumnPerPlot = Convert.ToDecimal(worksheet.Cells[i, 22].Value?.ToString()),
                                ICLandUseCertCode = worksheet.Cells[i, 27].Value?.ToString(),
                                ICConflictSitCode = worksheet.Cells[i, 29].Value?.ToString(),
                                APActorCode = worksheet.Cells[i, 25].Value?.ToString(),
                                ICForestTypeCode = worksheet.Cells[i, 13].Value?.ToString(),
                                ICForestOrgCode = worksheet.Cells[i, 14].Value?.ToString(),
                                GEParcelCode = worksheet.Cells[i, 6].Value?.ToString(),
                                ICForestPlotAvgYearCanopy = Convert.ToInt32(worksheet.Cells[i, 20].Value?.ToString()),
                                ICForestPlotLandUseTerune = Convert.ToInt32(worksheet.Cells[i, 28].Value?.ToString())
                            });
                    }

                    _unitOfWork.Context.BulkInsert(forestPlots);

                    _unitOfWork.Complete();

                    return new ImportResultDto
                    {
                        ImportRows = forestPlots.Count
                    };
                }
            }
        }

        public ImportResultDto ImportActors(FileDescription excelFile)
        {
            using (var memoryStream = new MemoryStream(excelFile.Data))
            {
                using (var package = new ExcelPackage(memoryStream))
                {
                    var worksheet = package.Workbook.Worksheets[1]; // Tip: To access the first worksheet, try index 1, not 0
                    int totalRows = worksheet.Dimension.Rows;

                    List<APActor> actors = new List<APActor>();

                    for (int i = 2; i <= totalRows; i++)
                    {
                        actors.Add(
                            new APActor
                            {
                                AAStatus = "Alive",
                                AASource = "Formis",
                                AACreatedUser = "BYS",
                                AACreatedDate = Clock.Now,
                                APActorAddress = worksheet.Cells[i, 5].Value?.ToString(),
                                APActorCode = worksheet.Cells[i, 2].Value?.ToString(),
                                APActorTypeCode = worksheet.Cells[i, 3].Value?.ToString(),
                                GECommuneCode = worksheet.Cells[i, 1].Value?.ToString(),
                                APActorName = worksheet.Cells[i, 4].Value?.ToString()
                            });
                    }

                    _unitOfWork.Context.BulkInsert(actors);

                    _unitOfWork.Complete();

                    return new ImportResultDto
                    {
                        ImportRows = actors.Count
                    };
                }
            }
        }
    }
}