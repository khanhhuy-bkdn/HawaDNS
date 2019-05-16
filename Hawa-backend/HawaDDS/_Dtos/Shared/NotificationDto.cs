using System;
using System.Collections.Generic;
using System.Text;

using _Dtos.AD;

namespace _Dtos.Shared
{
    public class NotificationDto
    {
        public int Id { get; set; }

        public string NotificationContent { get; set; }

        public string NotificationType { get; set; }

        public long? CreatedDate { get; set; }

        public int? NotificationObjectID { get; set; }

        public bool? ARNotificationRead { get; set; }

        public string NotificationObjectType { get; set; }

        public int? NotificationPriority { get; set; }

        public DictionaryItemDto NotificationSystemType { get; set; }
    }
}
