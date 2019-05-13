using System.Threading.Tasks;

using _Abstractions.Services.GE;
using _Dtos.GE;
using _Dtos.GE.InputDto;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;
using _Infrastructure.ApiControllers;

using Microsoft.AspNetCore.Mvc;

using Swashbuckle.AspNetCore.Annotations;

namespace HawaDDS.Controllers
{
    public class StateProvinceController : ApiControllerBase
    {
        private readonly IStateProvinceService _stateProvinceService;

        public StateProvinceController(IStateProvinceService stateProvinceService)
        {
            _stateProvinceService = stateProvinceService;
        }

        /// <summary>
        ///     Danh sách tỉnh/thành Việt Nam
        /// </summary>
        [HttpGet("stateprovinces/filter/{page:int}/{pageSize:int}")]
        [SwaggerResponse(200, "", typeof(IPagedResultDto<StateProvinceDto>))]
        public async Task<IActionResult> FilterStateProvinces(
            [FromRoute] int page,
            [FromRoute] int pageSize,
            [FromQuery] bool? isHidden,
            [FromQuery] string searchTerm)
        {
            var result = await _stateProvinceService.FilterStateProvincesAsynnc(
                new PagingRequestDto
                {
                    PageSize = pageSize,
                    Page = page
                },
                new FilterStateProvinceDto
                {
                    IsHidden = isHidden,
                    SearchTerm = searchTerm
                });

            return Success(result);
        }

        /// <summary>
        ///     Ẩn một tỉnh thành
        /// </summary>
        [HttpPost("stateprovince/{stateProvinceId}/hide")]
        [SwaggerResponse(200)]
        public async Task<IActionResult> Hide([FromRoute] int stateProvinceId)
        {
            await _stateProvinceService.CheckHideStateProvinceAsync(stateProvinceId, true);

            return Success();
        }

        /// <summary>
        ///     Hiện một tỉnh thành
        /// </summary>
        [HttpPost("stateprovince/{stateProvinceId}/show")]
        [SwaggerResponse(200)]
        public async Task<IActionResult> Show([FromRoute] int stateProvinceId)
        {
            await _stateProvinceService.CheckHideStateProvinceAsync(stateProvinceId, false);

            return Success();
        }
    }
}