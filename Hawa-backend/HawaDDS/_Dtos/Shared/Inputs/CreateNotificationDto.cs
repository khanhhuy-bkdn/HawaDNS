namespace _Dtos.Shared.Inputs
{
    public class CreateNotificationDto
    {
        public string NotificationContent { get; set; }

        public int? UserId { get; set; }

        public string NotificationType { get; set; }

        public int NotificationObjectId { get; set; }

        public string NotificationObjectType { get; set; }
    }
}