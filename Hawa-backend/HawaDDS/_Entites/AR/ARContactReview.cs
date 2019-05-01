using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using _Entities.AD;
using _Entities.Interfaces;

namespace _Entities.AR
{
    [Table("ARContactReviews")]
    public class ARContactReview : IEntity, IStatusableEntity
    {
        public int? FK_ReviewUserID { get; set; }

        public int? FK_ARContactID { get; set; }

        public string ARContactReviewTitle { get; set; }

        public string ARContactReviewContent { get; set; }

        public int ARContactReviewRating { get; set; }

        public DateTime? ARContactReviewDate { get; set; }

        [ForeignKey("FK_ReviewUserID")] public virtual ADUser ADUser { get; set; }

        [ForeignKey("FK_ARContactID")] public virtual ARContact ARContact { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("ARContactReviewID")]
        public int Id { get; set; }

        [StringLength(10)] public string AAStatus { get; set; }

        public bool? ARContactReviewIsHide { get; set; }
    }
}