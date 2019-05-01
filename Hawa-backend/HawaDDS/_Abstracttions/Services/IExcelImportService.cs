using System.Threading.Tasks;

using _Dtos.IC.InputDtos;
using _Dtos.Import;
using _Dtos.Shared;

namespace _Abstractions.Services
{
    public interface IExcelImportService
    {
        ImportResultDto ImportForestActor(FileDescription excelFile);

        ImportResultDto ImportForestPlots(FileDescription excelFile);

        ImportResultDto ImportSubCompartments(FileDescription excelFile);

        ImportResultDto ImportCompartments(FileDescription excelFile);

        ImportResultDto ImportActors(FileDescription excelFile);

        ImportResultDto ImportForestPlotFromFormis(FileDescription excelFile);

        Task<DataResultDto> ImportForestPlotLocations(string path);
    }
}