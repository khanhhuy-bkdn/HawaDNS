using System.Threading.Tasks;

using _Abstractions.Services.AR;
using _Dtos.AR;
using _Dtos.AR.InputDtos;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;
using _Infrastructure.ApiControllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Swashbuckle.AspNetCore.Annotations;

namespace HawaDDS.Controllers
{
    [Authorize]
    public class ContactController : ApiControllerBase
    {
        private readonly IContactService _contactService;

        public ContactController(IContactService contactService)
        {
            _contactService = contactService;
        }

        /// <summary>
        ///     Chi tiết liên hệ
        /// </summary>
        [HttpGet("contact/{contactId}")]
        [SwaggerResponse(200, "", typeof(IPagedResultDto<ContactDto>))]
        public async Task<IActionResult> Get([FromRoute] int contactId)
        {
            var result = await _contactService.GetContactAsync(contactId);

            return Success(result);
        }

        /// <summary>
        ///     Tạo mới liên hệ
        /// </summary>
        [HttpPost("contact/create")]
        [SwaggerResponse(200, "", typeof(IPagedResultDto<ContactDto>))]
        public async Task<IActionResult> Create([FromBody] CreateContactDto dto)
        {
            var result = await _contactService.CreateContactAsync(dto);

            return Success(result);
        }

        /// <summary>
        ///   Lấy thông tin liên hệ gián tiếp của xã
        /// </summary>
        [HttpGet("commune/{communeId}/contact/{page:int}/{pageSize:int}")]
        [SwaggerResponse(200, "", typeof(CommuneContactInfoDto))]
        public async Task<IActionResult> Filter(
            [FromRoute] int page,
            [FromRoute] int pageSize,
            [FromRoute] int communeId)
        {
            var result = await _contactService.GetCommuneContactInfoAsync(
                new PagingRequestDto
                {
                    Page = page,
                    PageSize = pageSize
                },
                communeId);

            return Success(result);
        }

        /// <summary>
        ///     Chỉnh sửa liên hệ
        /// </summary>
        [HttpPost("contact/update")]
        [SwaggerResponse(200, "", typeof(IPagedResultDto<ContactDto>))]
        public async Task<IActionResult> Create([FromBody] EditContactDto dto)
        {
            var result = await _contactService.UpdateContactAsync(dto);

            return Success(result);
        }

        /// <summary>
        ///     Xóa liên hệ
        /// </summary>
        [HttpGet("contact/{contactId}/delete")]
        public async Task<IActionResult> Delete(int contactId)
        {
            await _contactService.DeleteAsync(contactId);

            return Success();
        }

        /// <summary>
        ///     Xóa nhiều liên hệ
        /// </summary>
        [HttpPost("contact/multidelete")]
        public async Task<IActionResult> MultiDelete(IdentitiesDto contactIds)
        {
            await _contactService.MultiDeleteAsync(contactIds);

            return Success();
        }

        /// <summary>
        ///     Chỉnh sửa trạng thái liên hệ
        /// </summary>
        [HttpPost("contact/changestatus")]
        [SwaggerResponse(200)]
        public async Task<IActionResult> ChangeContactStatusAsync([FromBody] ChangeContactStatusDto dto)
        {
            await _contactService.ChangeStatusAsync(dto);
            return Success();
        }

        /// <summary>
        ///     Thông tin xã và liên hệ đóng góp gián tiếp của xã đó
        /// </summary>
        [HttpGet("communes/contactstatuscount/filter/{page:int}/{pageSize:int}")]
        [SwaggerResponse(200, "", typeof(IPagedResultDto<SummaryCommuneContactDto>))]
        public async Task<IActionResult> FilterContactStatusCountOfCommunes(
            [FromRoute] int page,
            [FromRoute] int pageSize,
            [FromQuery] int? stateProvinceId,
            [FromQuery] int? districtId,
            [FromQuery] int? communeId)
        {
            var result = await _contactService.GetSummaryCommuneContactAsync(
                new PagingRequestDto
                {
                    Page = page,
                    PageSize = pageSize
                },
                new LocationFilterDto
                {
                    CommuneId = communeId,
                    DistrictId = districtId,
                    StateProvinceId = stateProvinceId
                });

            return Success(result);
        }

        /// <summary>
        ///     Danh sách liên hệ gián tiếp đóng góp của 1 xã
        /// </summary>
        [HttpGet("commune/{communeId}/contacts/filter/{page:int}/{pageSize:int}")]
        [SwaggerResponse(200, "", typeof(IPagedResultDto<ShortContactDto>))]
        public async Task<IActionResult> GetContactsOfCommune(
            [FromRoute] int page,
            [FromRoute] int pageSize,
            [FromRoute] int communeId,
            [FromQuery] string contactStatus,
            [FromQuery] string searchTerm)
        {
            var result = await _contactService.GetContactsOfCommuneAsync(
                new PagingRequestDto
                {
                    Page = page,
                    PageSize = pageSize
                },
                new FilterContactsOfCommuneDto
                {
                    ContactStatus = contactStatus,
                    CommuneId = communeId,
                    SearchTerm = searchTerm
                });

            return Success(result);
        }

        /// <summary>
        ///     Danh sách liên hệ gián tiếp (màn hình quản lí đánh giá liên hệ gián tiếp)
        /// </summary>
        [HttpGet("contact/filter/{page:int}/{pageSize:int}")]
        [SwaggerResponse(200, "", typeof(IPagedResultDto<ShortContactDto>))]
        public async Task<IActionResult> FilterForestContacts(
            [FromRoute] int page,
            [FromRoute] int pageSize,
            [FromQuery] string searchTerm,
            [FromQuery] string sorting,
            [FromQuery] int? contactStateProvinceId,
            [FromQuery] int? contactDistrictId,
            [FromQuery] int? contactCommuneId,
            [FromQuery] int? rating
        )
        {
            var result = await _contactService.FilterForestContactsAsync(
                new PagingAndSortingRequestDto
                {
                    Page = page,
                    PageSize = pageSize,
                    Sorting = sorting
                },
                new FilterContactsDto
                {
                    SearchTerm = searchTerm,
                    ContactStateProvinceId = contactStateProvinceId,
                    ContactDistrictId = contactDistrictId,
                    ContactCommuneId = contactCommuneId,
                    Rating = rating,
                });

            return Success(result);
        }
    }
}