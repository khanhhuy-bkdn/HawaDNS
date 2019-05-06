using System.Threading.Tasks;
using _Abstractions.Services.IC;
using _Dtos.IC;
using _Dtos.IC.InputDtos;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;
using _Infrastructure.ApiControllers;
using _Abstractions.Services.IC;
using _Dtos.IC;
using _Dtos.IC.InputDtos;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;
using _Infrastructure.ApiControllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Swashbuckle.AspNetCore.Annotations;

namespace HawaDDS.Controllers
{
    public class ForestPlotController : ApiControllerBase
    {
        private readonly IForestPlotService _forestPlotService;

        public ForestPlotController(IForestPlotService forestPlotService)
        {
            _forestPlotService = forestPlotService;
        }

        /// <summary>
        /// Danh sách thông tin tổng quan về rừng (lọc và sorting)
        /// </summary>
        [HttpGet("forestplot/filter/{page:int}/{pageSize:int}")]
        [AllowAnonymous]
        [SwaggerResponse(200, "", typeof(IPagedResultDto<ForestPlotDto>))]
        public async Task<IActionResult> Filter(
            [FromRoute] int page,
            [FromRoute] int pageSize,
            [FromQuery] int? stateProvinceID,
            [FromQuery] int? districtID,
            [FromQuery] int? communeID,
            [FromQuery] int? treeSpecID,
            [FromQuery] int? treeSpecGroupID,
            [FromQuery] string sorting)
        {
            var result = await _forestPlotService.FilterForestPlotsAsync(
                new PagingAndSortingRequestDto
                {
                    Page = page,
                    PageSize = pageSize,
                    Sorting = sorting
                },
                new FilterForestPlotDto
                {
                    DistrictID = districtID,
                    TreeSpecID = treeSpecID,
                    StateProvinceID = stateProvinceID,
                    CommuneID = communeID,
                    TreeSpecGroupID = treeSpecGroupID
                });

            return Success(result);
        }

        /// <summary>
        /// Danh sách thông tin về rừng theo loại cây của từng xã(lọc và sorting)
        /// </summary>
        [HttpGet("forestplot/detail/filter/{page:int}/{pageSize:int}")]
        [AllowAnonymous]
        [SwaggerResponse(200, "", typeof(IPagedResultDto<ForestPlotDetailDto>))]
        public async Task<IActionResult> FilterForestPlotDetails(
            [FromRoute] int page,
            [FromRoute] int pageSize,
            [FromQuery] int communeID,
            [FromQuery] int? treeSpecID,
            [FromQuery] int? forestCertID,
            [FromQuery] int? oldFrom,
            [FromQuery] int? oldTo,
            [FromQuery] int? treeSpecGroupID,
            [FromQuery] string reliability,
            [FromQuery] string searchTerm,
            [FromQuery] string sorting)
        {
            var result = await _forestPlotService.FilterForestPlotDetailsAsync(
                new PagingAndSortingRequestDto
                {
                    Page = page,
                    PageSize = pageSize,
                    Sorting = sorting
                },
                new FilterForestPlotDetailDto
                {
                    TreeSpecID = treeSpecID,
                    CommuneID = communeID,
                    ForestCertID = forestCertID,
                    OldFrom = oldFrom,
                    OldTo = oldTo,
                    Reliability = reliability,
                    SearchTerm = searchTerm
                });

            return Success(result);
        }

        /// <summary>
        /// Danh sách tuổi của loài cây (theo xã và nhóm loài cây)
        /// </summary>
        [HttpGet("forestplot/detail/yearolds")]
        [AllowAnonymous]
        [SwaggerResponse(200, "", typeof(int[]))]
        public async Task<IActionResult> ForestPlotPlantingYears(
            [FromQuery] int? treespecId,
            [FromQuery] int communeId)
        {
            var result = await _forestPlotService.ForestPlotPlantingYears(
                new FilterForestPlotDetailDto
                {
                    TreeSpecID = treespecId,
                    CommuneID = communeId
                });

            return Success(result);
        }
    }
}