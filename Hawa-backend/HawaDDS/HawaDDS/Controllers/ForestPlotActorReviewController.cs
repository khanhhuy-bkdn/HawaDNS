using System.Threading.Tasks;

using _Abstractions.Services.AP;
using _Dtos;
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
    public class ForestPlotActorReviewController : ApiControllerBase
    {
        private readonly IForestPlotActorReviewService _forestPlotActorReviewService;

        public ForestPlotActorReviewController(IForestPlotActorReviewService forestPlotActorReviewService)
        {
            _forestPlotActorReviewService = forestPlotActorReviewService;
        }

        /// <summary>
        ///     Đánh giá chủ rừng theo lô
        /// </summary>
        [HttpPost("actor/review/create")]
        [SwaggerResponse(200, "", typeof(ReviewItemDto))]
        public async Task<IActionResult> Review([FromBody] ReviewForestPlotActorDto dto)
        {
            var result = await _forestPlotActorReviewService.ReviewAsync(dto);

            return Success(result);
        }

        /// <summary>
        ///     Chi tiết đánh giá chủ rừng đối với lô
        /// </summary>
        [HttpGet("actor/review/{actorReviewId}")]
        [SwaggerResponse(200, "", typeof(ReviewItemDto))]
        public async Task<IActionResult> Get([FromRoute] int actorReviewId)
        {
            var result = await _forestPlotActorReviewService.GetReviewAsync(actorReviewId);

            return Success(result);
        }

        /// <summary>
        ///     Xóa đánh giá
        /// </summary>
        [HttpPost("actor/review/{actorReviewId}/delete")]
        [SwaggerResponse(200)]
        public async Task<IActionResult> Delete([FromRoute] int actorReviewId)
        {
            await _forestPlotActorReviewService.DeleteReviewAsync(actorReviewId);

            return Success();
        }

        /// <summary>
        ///     Danh sách đánh giá chủ rừng của 1 lô rừng
        /// </summary>
        [HttpGet("forestplot/{forestPlotId}/review/{page:int}/{pageSize:int}")]
        [SwaggerResponse(200, "", typeof(IPagedResultDto<ReviewItemDto>))]
        public async Task<IActionResult> ReviewsOfForestPlot(
            [FromRoute] int forestPlotId,
            [FromRoute] int page,
            [FromRoute] int pageSize)
        {
            var result = await _forestPlotActorReviewService.GetReviewsOfForestPlotAsync(
                new PagingRequestDto
                {
                    Page = page,
                    PageSize = pageSize
                },
                forestPlotId);

            return Success(result);
        }

        /// <summary>
        ///     Danh sách đánh giá chủ rừng của 1 lô rừng (Admin)
        /// </summary>
        [HttpGet("admin/forestplot/{forestPlotId}/{actorId}/reviews/{page:int}/{pageSize:int}")]
        [SwaggerResponse(200, "", typeof(IPagedResultDto<ReviewItemDto>))]
        public async Task<IActionResult> AdminReviewsOfForestPlot(
            [FromRoute] int forestPlotId,
            [FromRoute] int page,
            [FromRoute] int pageSize,
            [FromRoute] int actorId)
        {
            var result = await _forestPlotActorReviewService.GetAdminReviewsOfForestPlotAsync(
                new PagingRequestDto
                {
                    Page = page,
                    PageSize = pageSize
                },
                forestPlotId,
                actorId);

            return Success(result);
        }

        /// <summary>
        ///     Ẩn một đánh giá chủ rừng đối với lô
        /// </summary>
        [HttpPost("actor/review/{actorReviewId}/hide")]
        [SwaggerResponse(200)]
        public async Task<IActionResult> Hide([FromRoute] int actorReviewId)
        {
            await _forestPlotActorReviewService.HideReviewAsync(actorReviewId);

            return Success();
        }

        /// <summary>
        ///     Hiện một đánh giá chủ rừng đối với lô
        /// </summary>
        [HttpPost("actor/review/{actorReviewId}/show")]
        [SwaggerResponse(200)]
        public async Task<IActionResult> Show([FromRoute] int actorReviewId)
        {
            await _forestPlotActorReviewService.ShowReviewAsync(actorReviewId);

            return Success();
        }
    }
}