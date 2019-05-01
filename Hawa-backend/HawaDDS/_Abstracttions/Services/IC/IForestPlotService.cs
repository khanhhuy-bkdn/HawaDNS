using System.Threading.Tasks;

using _Dtos.IC;
using _Dtos.IC.InputDtos;
using _Dtos.Migration;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;

namespace _Abstractions.Services.IC
{
    public interface IForestPlotService
    {
        Task<IPagedResultDto<ForestPlotDto>> FilterForestPlotsAsync(PagingAndSortingRequestDto pagingAndSortingRequestDto, FilterForestPlotDto filter);

        Task<IPagedResultDto<ForestPlotDetailDto>> FilterForestPlotDetailsAsync(PagingAndSortingRequestDto pagingAndSortingRequestDto, FilterForestPlotDetailDto filter);

        Task<IPagedResultDto<TreeSpecGroupDto>> FilterTreeSpecGroupsAsync(PagingAndSortingRequestDto pagingAndSortingRequestDto);

        Task<IPagedResultDto<TreeSpecDto>> FilterTreeSpecsAsync(PagingAndSortingRequestDto pagingAndSortingRequestDto, int treeSpecGroupId);

        Task<int[]> ForestPlotPlantingYears(FilterForestPlotDetailDto dto);

        Task UpdatePlotsAsync();

        Task<UpdateTreeSpecForestPlotReportDto> UpdateTreeSpecForestPlotsAsync();
    }
}