using System.Threading.Tasks;

using _Dtos.Shared;
using _Dtos.Shared.Inputs;

namespace _Services.Internal
{
    public interface INotificationService
    {
        Task CreateNotificationAsync(CreateNotificationDto dto);

        Task<IPagedResultDto<NotificationDto>> FilterNotificationsAsync(FilterNotificationDto dto, PagingAndSortingRequestDto pagingAndSortingRequestDto);

        Task DeleteNotificationAsync(int notificationId);

        Task DeleteNotificationsAsync(IdentitiesDto dto);

        Task ReadNotificationAsync(int notificationId);
    }
}