namespace _Dtos.Shared.Inputs
{
    public class FilterNotificationDto
    {
        public string NotificationSystemType { get; set; }

        public bool? NotificationRead { get; set; }

        public long? StartDate { get; set; }

        public long? EndDate { get; set; }
    }
}