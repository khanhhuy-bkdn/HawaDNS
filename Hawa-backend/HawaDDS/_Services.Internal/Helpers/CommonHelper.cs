using System.Linq;
using _Common.Dependency;
using _Common.Extensions;
using _Common.Helpers;
using _Constants.EntityTypes;
using _Dtos.Shared;
using _Entities.AR;
using Microsoft.AspNetCore.Http;

namespace _Services.Internal.Helpers
{
    public static class CommonHelper
    {
        public static string ToFullName(string firstName, string lastName)
        {
            return new[]
            {
                firstName,
                lastName
            }.JoinNotEmpty(" ");
        }

        public static FileDescription ToFileDescription(this IFormFile file)
        {
            return file == null
                ? null
                : new FileDescription
                {
                    FileName = file.FileName,
                    Data = file.OpenReadStream().GetAllBytes(),
                    ContentType = file.ContentType
                };
        }

        public static bool IsImageFile(this FileDescription image)
        {
            if (image == null)
            {
                return false;
            }

            var imageContenType = new[] { "image/jpg", "image/jpeg", "image/pjpeg", "image/gif", "image/x-png", "image/png" };

            return imageContenType.Contains(image.ContentType.ToLower());
        }

        public static DictionaryItemDto ToDictionaryItemDto<T>(this string value)
        {
            return value == null
                ? null
                : new DictionaryItemDto
                {
                    Key = value,
                    Code = value,
                    Text = SingletonDependency<IConfigValueManager>.Instance.GetOrNull<T>(value) ?? value
                };
        }

        public static NotificationDto ToNotificationDto(this ARNotification entity)
        {
            return entity == null
                ? null
                : new NotificationDto()
                {
                    NotificationSystemType = entity.ARNotificationSystemTypeCombo.ToDictionaryItemDto<NotificationSystemType>(),
                    NotificationType = entity.ARNotificationType,
                    NotificationContent = entity.ARNotificationContent,
                    NotificationObjectType = entity.ARNotificationObjectType,
                    ARNotificationRead = entity.ARNotificationRead,
                    CreatedDate = entity.AACreatedDate.ToSecondsTimestamp(),
                    Id = entity.Id,
                    NotificationObjectID = entity.ARNotificationObjectID,
                    NotificationPriority = entity.ARNotificationPriority
                };
        }
    }
}