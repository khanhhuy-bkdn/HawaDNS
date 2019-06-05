using System.Threading.Tasks;

using _Abstractions.Services.AP;
using _Dtos.AP;
using _Dtos.AP.InputDtos;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;
using _Infrastructure.ApiControllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Swashbuckle.AspNetCore.Annotations;

namespace _Hawa.WebApi.Controllers
{
    [Authorize]
    public class ActorController : ApiControllerBase
    {
        private readonly IActorService _actorService;

        public ActorController(IActorService actorService)
        {
            _actorService = actorService;
        }

        /// <summary>
        ///     Chi tiết chủ rừng
        /// </summary>
        [HttpGet("actor/{actorId}")]
        [SwaggerResponse(200, "", typeof(ActorDto))]
        public async Task<IActionResult> Get([FromRoute] int actorId)
        {
            var result = await _actorService.GetActorAsync(actorId);

            return Success(result);
        }

        /// <summary>
        ///     Tạo mới chủ rừng
        /// </summary>
        [HttpPost("actor/create")]
        [SwaggerResponse(200, "", typeof(ActorDto))]
        public async Task<IActionResult> Create([FromBody] CreateActorDto dto)
        {
            var result = await _actorService.CreateActorAsync(dto);

            return Success(result);
        }

        /// <summary>
        ///     Chỉnh sửa thông tin chủ rừng
        /// </summary>
        [HttpPost("actor/edit")]
        [SwaggerResponse(200, "", typeof(ActorDto))]
        public async Task<IActionResult> Update([FromBody] EditActorDto dto)
        {
            var result = await _actorService.UpdateActorAsync(dto);

            return Success(result);
        }

        /// <summary>
        ///     Danh sách actor (tìm kiếm theo tên,email,sdt,cmnd, lọc và sorting)
        /// </summary>
        [HttpGet("actor/filter/{page:int}/{pageSize:int}")]
        [SwaggerResponse(200, "", typeof(IPagedResultDto<ActorDto>))]
        public async Task<IActionResult> Filter(
            [FromRoute] int page,
            [FromRoute] int pageSize,
            [FromQuery] string searchTerm,
            [FromQuery] string actorType,
            [FromQuery] int? stateProvinceId,
            [FromQuery] int? districtId,
            [FromQuery] int? communeId,
            [FromQuery] int? actorRoleId,
            [FromQuery] string status,
            [FromQuery] string sorting)
        {
            var result = await _actorService.FilterActorsAsync(
                new PagingAndSortingRequestDto
                {
                    Page = page,
                    PageSize = pageSize,
                    Sorting = sorting
                },
                new FilterActorDto
                {
                    ActorType = actorType,
                    StateProvinceID = stateProvinceId,
                    DistrictID = districtId,
                    CommuneID = communeId,
                    SearchTerm = searchTerm,
                    Status = status,
                    ActorRoleId = actorRoleId
                });

            return Success(result);
        }

        /// <summary>
        ///     Xóa chủ rừng
        /// </summary>
        [HttpPost("actor/{actorId}/delete")]
        public async Task<IActionResult> Delete(int actorId)
        {
            await _actorService.DeleteActorAsync(actorId);

            return Success();
        }

        /// <summary>
        ///     Xóa nhiều chủ rừng
        /// </summary>
        [HttpPost("actor/multidelete")]
        public async Task<IActionResult> MultiDelete(IdentitiesDto actorIds)
        {
            await _actorService.DeleteActorsAsync(actorIds);

            return Success();
        }

        /// <summary>
        ///     Chi tiết chủ rừng theo lô
        /// </summary>
        [HttpGet("actor/forestplot/{forestPlotId}/{actorId}")]
        [SwaggerResponse(200, "", typeof(ActorDto))]
        public async Task<IActionResult> GetForestPlotActorAsync([FromRoute] int forestPlotId, [FromRoute] int actorId)
        {
            var result = await _actorService.GetForestPlotActorAsync(forestPlotId, actorId);

            return Success(result);
        }

        /// <summary>
        ///     Danh sách chủ rừng theo lô (Admin quản lý)
        /// </summary>
        [HttpGet("forestplotactor/{actorId:int}/filter/{page:int}/{pageSize:int}")]
        [SwaggerResponse(200, "", typeof(IPagedResultDto<ShortActorDto>))]
        [AllowAnonymous]
        public async Task<IActionResult> FilterForestPlotActor(
            [FromRoute] int actorId,
            [FromRoute] int page,
            [FromRoute] int pageSize,
            [FromQuery] int? stateProvinceId,
            [FromQuery] int? districtId,
            [FromQuery] int? communeId,
            [FromQuery] string plotCode,
            [FromQuery] int? compartmentId,
            [FromQuery] int? subCompartmentId,
            [FromQuery] string sorting,
            [FromQuery] string searchTerm)
        {
            var result = await _actorService.FilterForestPlotActorsAsync(
                new PagingAndSortingRequestDto
                {
                    Page = page,
                    PageSize = pageSize,
                    Sorting = sorting
                },
                new FilterActorDto
                {
                    StateProvinceID = stateProvinceId,
                    DistrictID = districtId,
                    CommuneID = communeId,
                    SubCompartmentId = subCompartmentId,
                    CompartmentId = compartmentId,
                    PlotCode = plotCode,
                    SearchTerm = searchTerm,
                    ActorId = actorId,
                });

            return Success(result);
        }

        /// <summary>
        /// Danh sách tất cả chủ rừng không phân trang
        /// </summary>
        [HttpGet("actors")]
        [AllowAnonymous]
        [SwaggerResponse(200, "", typeof(IPagedResultDto<ActorDto>))]
        public async Task<IActionResult> GetAll([FromQuery] string searchTerm)
        {
            var result = _actorService.GetAll(searchTerm);

            return Success(result);
        }

        /// <summary>
        ///     Chi tiết chủ rừng theo lô Admin
        /// </summary>
        [HttpGet("actor/forestplot/{forestPlotId}")]
        [SwaggerResponse(200, "", typeof(ActorDto))]
        public async Task<IActionResult> GetForestPlotActorAdminAsync([FromRoute] int forestPlotId)
        {
            var result = await _actorService.GetForestPlotActorAdminAsync(forestPlotId);

            return Success(result);
        }
    }
}