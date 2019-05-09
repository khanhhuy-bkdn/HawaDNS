using System.Threading.Tasks;

using _Abstractions.Services.AR;
using _Dtos;
using _Dtos.AR.InputDtos;
using _Dtos.AR.Inputs;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;
using _Infrastructure.ApiControllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Swashbuckle.AspNetCore.Annotations;

namespace HawaDDS.Controllers
{
    [Authorize]
    public class ContactReviewController : ApiControllerBase
    {
        private readonly IContactReviewService _contactReviewService;

        public ContactReviewController(IContactReviewService contactReviewService)
        {
            _contactReviewService = contactReviewService;
        }

        /// <summary>
        ///     Đánh giá liên hệ gián tiếp
        /// </summary>
        [HttpPost("contact/review/create")]
        [SwaggerResponse(200, "", typeof(ReviewItemDto))]
        public async Task<IActionResult> Create([FromBody] ReviewContactDto dto)
        {
            var result = await _contactReviewService.ReviewAsync(dto);

            return Success(result);
        }

        /// <summary>
        ///     Chi tiết đánh giá liên hệ gián tiếp
        /// </summary>
        [HttpGet("contact/review/{contactReviewId}")]
        [SwaggerResponse(200, "", typeof(ReviewItemDto))]
        public async Task<IActionResult> Get([FromRoute] int contactReviewId)
        {
            var result = await _contactReviewService.GetContactReviewAsync(contactReviewId);

            return Success(result);
        }

        /// <summary>
        ///     xóa một đánh giá liên hệ gián tiếp
        /// </summary>
        [HttpPost("contact/review/{contactReviewId}/delete")]
        [SwaggerResponse(200)]
        public async Task<IActionResult> Delete([FromRoute] int contactReviewId)
        {
            await _contactReviewService.DeleteContactReviewAsync(contactReviewId);

            return Success();
        }

        /// <summary>
        ///     Danh sách đánh giá của 1 liên hệ gián tiếp
        /// </summary>
        [HttpGet("contact/{contactId}/reviews/{page:int}/{pageSize:int}")]
        [SwaggerResponse(200, "", typeof(IPagedResultDto<ReviewItemDto>))]
        public async Task<IActionResult> ReviewsOfContact(
            [FromRoute] int contactId,
            [FromRoute] int page,
            [FromRoute] int pageSize)
        {
            var result = await _contactReviewService.GetReviewsOfContactAsync(
                new PagingRequestDto
                {
                    Page = page,
                    PageSize = pageSize
                },
                contactId);

            return Success(result);
        }

        /// <summary>
        ///     Danh sách đánh giá của 1 liên hệ gián tiếp (Admin)
        /// </summary>
        [HttpGet("admin/contact/{contactId}/reviews/{page:int}/{pageSize:int}")]
        [SwaggerResponse(200, "", typeof(IPagedResultDto<ReviewItemDto>))]
        public async Task<IActionResult> AdminReviewsOfContact(
            [FromRoute] int contactId,
            [FromRoute] int page,
            [FromRoute] int pageSize)
        {
            var result = await _contactReviewService.GetAdminReviewsOfContactAsync(
                new PagingRequestDto
                {
                    Page = page,
                    PageSize = pageSize
                },
                contactId);

            return Success(result);
        }

        /// <summary>
        ///     Danh sách đánh giá liên hệ gián tiếp
        /// </summary>
        [HttpGet("contactreviews/{page:int}/{pageSize:int}")]
        [SwaggerResponse(200, "", typeof(IPagedResultDto<ReviewItemDto>))]
        public async Task<IActionResult> Reviews(
            [FromRoute] int page,
            [FromRoute] int pageSize,
            [FromQuery] string searchTerm,
            [FromQuery] int? contactStateProvinceId,
            [FromQuery] int? contactDistrictId,
            [FromQuery] int? contactCommuneId,
            [FromQuery] int? rating
        )
        {
            var result = await _contactReviewService.GetContactReviewsAsync(
                new PagingRequestDto
                {
                    Page = page,
                    PageSize = pageSize
                },
                new FilterContactReviewsDto
                {
                    SearchTerm = searchTerm,
                    ContactStateProvinceId = contactStateProvinceId,
                    ContactDistrictId = contactDistrictId,
                    ContactCommuneId = contactCommuneId,
                    Rating = rating,
                });

            return Success(result);
        }

        /// <summary>
        ///     Ẩn một đánh giá liên hệ gián tiếp
        /// </summary>
        [HttpPost("contact/review/{contactReviewId}/hide")]
        [SwaggerResponse(200)]
        public async Task<IActionResult> Hide([FromRoute] int contactReviewId)
        {
            await _contactReviewService.HideContactReviewAsync(contactReviewId);

            return Success();
        }

        /// <summary>
        ///     Hiện một đánh giá liên hệ gián tiếp
        /// </summary>
        [HttpPost("contact/review/{contactReviewId}/show")]
        [SwaggerResponse(200)]
        public async Task<IActionResult> Show([FromRoute] int contactReviewId)
        {
            await _contactReviewService.ShowContactReviewAsync(contactReviewId);

            return Success();
        }
    }
}