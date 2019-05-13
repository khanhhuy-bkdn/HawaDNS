using System.Threading.Tasks;

using _Abstractions.Services.AD;
using _Dtos.AD;
using _Dtos.AD.InputDtos;
using _Dtos.AD.Inputs;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;
using _Infrastructure.ApiControllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Swashbuckle.AspNetCore.Annotations;

namespace HawaDDS.Controllers
{
    public class FeedbackController : ApiControllerBase
    {
        private readonly IFeedbackService _feedbackService;

        public FeedbackController(IFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        /// <summary>
        /// Gửi đánh giá hệ thống
        /// </summary>
        [HttpPost("feedback/create")]
        [AllowAnonymous]
        [SwaggerResponse(200)]
        public async Task<IActionResult> Create([FromBody] CreateFeedbackDto dto)
        {
            await _feedbackService.CreateFeedbackAsync(dto);

            return Success();
        }

        /// <summary>
        /// Danh sách đánh giá hệ thống
        /// </summary>
        [HttpGet("feedback/{page:int}/{pageSize:int}")]
        [SwaggerResponse(200, "", typeof(IPagedResultDto<FeedbackDto>))]
        public async Task<IActionResult> Filter(
            [FromRoute] int page,
            [FromRoute] int pageSize,
            [FromQuery] string searchTerm,
            [FromQuery] bool? isLike
        )
        {
            var result = await _feedbackService.FilterFeedbacksAsync(
                new PagingAndSortingRequestDto
                {
                    Page = page,
                    PageSize = pageSize
                },
                new FilterFeedbacksDto
                {
                    SearchTerm = searchTerm,
                    IsLike = isLike,
                });

            return Success(result);
        }

        /// <summary>
        /// Xóa đánh giá
        /// </summary>
        [HttpPost("feedback/{feedbackId}/delete")]
        [SwaggerResponse(200)]
        public async Task<IActionResult> Delete([FromRoute] int feedbackId)
        {
            await _feedbackService.DeleteAsync(feedbackId);

            return Success();
        }
    }
}