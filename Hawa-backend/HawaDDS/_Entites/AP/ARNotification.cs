using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using _Entities.AD;
using _Entities.Interfaces;

namespace _Entities.AR
{
    [Table("ARNotifications")]
    public class ARNotification : IEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("ARNotificationID")]
        public int Id { get; set; }

        public string ARNotificationContent { get; set; }

        public string ARNotificationType { get; set; }

        public DateTime AACreatedDate { get; set; }

        public string AACreatedUser { get; set; }

        public int? FK_ADUserID { get; set; }

        [ForeignKey("FK_ADUserID")]
        public virtual ADUser ADUser { get; set; }

        public int? ARNotificationObjectID { get; set; }

        public bool? ARNotificationRead { get; set; }

        public string ARNotificationObjectType { get; set; }

        public int? ARNotificationPriority { get; set; }

        public string ARNotificationSystemTypeCombo { get; set; }
    }
}