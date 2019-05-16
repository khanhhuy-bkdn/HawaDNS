using System.Threading.Tasks;

using _Dtos.Shared;
using _Dtos.Shared.Inputs;
using _Infrastructure.ApiControllers;
using _Services.Internal;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Swashbuckle.AspNetCore.Annotations;

namespace _Hawa.WebApi.Controllers
{
    [Authorize]
    public class NotificationController : ApiControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        /// <summary>
        ///     Danh sách thông báo (lọc theo đọc/chưa đọc, SystemType)
        /// </summary>
        [HttpGet("notification/filter/{page:int}/{pageSize:int}")]
        [SwaggerResponse(200, "", typeof(IPagedResultDto<NotificationDto>))]
        public async Task<IActionResult> Filter(
            [FromRoute] int page,
            [FromRoute] int pageSize,
            [FromQuery] bool? isRead,
            [FromQuery] string systemType,
            [FromQuery] long? startDate,
            [FromQuery] long? endDate)
        {
            var result = await _notificationService.FilterNotificationsAsync(
                new FilterNotificationDto
                {
                    NotificationRead = isRead,
                    NotificationSystemType = systemType,
                    StartDate = startDate,
                    EndDate = endDate
                },
                new PagingAndSortingRequestDto
                {
                    Page = page,
                    PageSize = pageSize
                });

            return Success(result);
        }

        /// <summary>
        ///     Xóa một thông báo
        /// </summary>
        [HttpPost("notification/{notificationId}/delete")]
        public async Task<IActionResult> Delete([FromRoute] int notificationId)
        {
            await _notificationService.DeleteNotificationAsync(notificationId);

            return Success();
        }

        /// <summary>
        ///     Đã đọc thông báo
        /// </summary>
        [HttpGet("notification/{notificationId}/read")]
        public async Task<IActionResult> ReadNotification([FromRoute] int notificationId)
        {
            await _notificationService.ReadNotificationAsync(notificationId);

            return Success();
        }

        /// <summary>
        ///     Xóa nhiều thông báo
        /// </summary>
        [HttpPost("notification/multidelete")]
        public async Task<IActionResult> MultiDelete([FromBody]IdentitiesDto notificationIds)
        {
            await _notificationService.DeleteNotificationsAsync(notificationIds);

            return Success();
        }
    }
}