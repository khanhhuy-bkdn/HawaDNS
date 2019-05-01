using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using _Entities.AD;
using _Entities.IC;
using _Entities.Interfaces;

namespace _Entities.AP
{
    [Table("APActorReviews")]
    public class APActorReview : IEntity, IStatusableEntity
    {
        public int? FK_ReviewUserID { get; set; }

        public int? FK_APActorID { get; set; }

        public int? FK_ICForestPlotID { get; set; }

        public string APActorReviewTitle { get; set; }

        public string APActorReviewContent { get; set; }

        public int APActorReviewRating { get; set; }

        public DateTime? APActorReviewDate { get; set; }

        [ForeignKey("FK_ReviewUserID")] public virtual ADUser ADUser { get; set; }

        [ForeignKey("FK_APActorID")] public virtual APActor APActor { get; set; }

        [ForeignKey("FK_ICForestPlotID")] public virtual ICForestPlot ICForestPlot { get; set; }

        public bool? APActorReviewIsHide { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("APActorReviewID")]
        public int Id { get; set; }

        [StringLength(10)] public string AAStatus { get; set; }
    }
}