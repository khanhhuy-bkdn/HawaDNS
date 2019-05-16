using System;
using System.Linq;
using System.Threading.Tasks;

using _Common.Exceptions;
using _Common.Extensions;
using _Common.Helpers;
using _Common.Timing;
using _Constants.EntityTypes;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;
using _Entities.AR;
using _EntityFrameworkCore.Helpers.Linq;
using _EntityFrameworkCore.UnitOfWork;
using _Services.Internal.Helpers;
using _Services.Internal.Helpers.PagedResult;

using Microsoft.EntityFrameworkCore;

namespace _Services.Internal.Implementations
{
    public class NotificationService : INotificationService
    {
        private readonly IUnitOfWork _unitOfWork;

        public NotificationService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task CreateNotificationAsync(CreateNotificationDto dto)
        {
            var notification = new ARNotification()
            {
                AACreatedDate = Clock.Now,
                ARNotificationContent = dto.NotificationContent,
                ARNotificationObjectID = dto.NotificationObjectId,
                ARNotificationObjectType = dto.NotificationObjectType,
                ARNotificationRead = false,
                ARNotificationSystemTypeCombo = NotificationSystemType.Message.ToString(),
                ARNotificationType = dto.NotificationType,
                FK_ADUserID = dto.UserId
            };
            await _unitOfWork.GetRepository<ARNotification>().InsertAsync(notification);

            await _unitOfWork.CompleteAsync();
        }

        public async Task DeleteNotificationAsync(int notificationId)
        {
            await _unitOfWork.GetRepository<ARNotification>()
                .DeleteAsync(notificationId);

            await _unitOfWork.CompleteAsync();
        }

        public async Task DeleteNotificationsAsync(IdentitiesDto dto)
        {
            if (dto != null)
            {
                foreach (int i in dto.Ids)
                    await DeleteNotificationAsync(i);
            }
        }

        public async Task ReadNotificationAsync(int notificationId)
        {
            var notificationFromDb = await _unitOfWork.GetRepository<ARNotification>().GetAsync(notificationId);
            if (notificationFromDb == null)
            {
                throw new BusinessException("Không tồn tại thông báo này");
            }

            notificationFromDb.ARNotificationRead = true;

            await _unitOfWork.CompleteAsync();
        }

        public async Task<IPagedResultDto<NotificationDto>> FilterNotificationsAsync(FilterNotificationDto dto, PagingAndSortingRequestDto pagingAndSortingRequestDto)
        {
            return await _unitOfWork.GetRepository<ARNotification>()
                .GetAllIncluding(x => x.ADUser)
                .WhereIf(dto.NotificationRead.HasValue, x => x.ARNotificationRead == dto.NotificationRead)
                .WhereIf(!dto.NotificationSystemType.IsNullOrWhiteSpace(), x => x.ARNotificationSystemTypeCombo == dto.NotificationSystemType)
                .WhereIf(dto.StartDate.HasValue, x => x.AACreatedDate.Date >= dto.StartDate.FromUnixTimeStamp().GetValueOrDefault().Date)
                .WhereIf(dto.EndDate.HasValue, x => x.AACreatedDate.Date <= dto.EndDate.FromUnixTimeStamp().GetValueOrDefault().Date)
                .OrderByDescending(x => x.AACreatedDate)
                .GetPagedResultAsync(pagingAndSortingRequestDto.Page, pagingAndSortingRequestDto.PageSize, x => x.ToNotificationDto());
        }
    }
}