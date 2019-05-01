using System;
using System.ComponentModel.DataAnnotations.Schema;

using _Entities.Interfaces;

namespace _Entities.AD
{
    [Table("ADFeedbacks")]
    public class ADFeedback : IEntity, IStatusableEntity, ICreatedAuditableEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("ADFeedbackID")]
        public int Id { get; set; }

        public bool ADFeedbackIsLike { get; set; }

        public string ADFeedbackContent { get; set; }

        public string AAStatus { get; set; }

        public DateTime? AACreatedDate { get; set; }

        public string AACreatedUser { get; set; }

        public int? FK_ADFeedbackUserID { get; set; }

        [ForeignKey("FK_ADFeedbackUserID")] public virtual ADUser ADFeedbackUser { get; set; }
    }
}