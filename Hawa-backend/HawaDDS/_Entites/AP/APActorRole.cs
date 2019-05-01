using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using _Entities.Interfaces;

namespace _Entities.AP
{
    [Table("APActorRoles")]
    public class APActorRole : IFullEntity
    {
        public int FK_APRoleID { get; set; }

        public int FK_APActorID { get; set; }

        [ForeignKey("FK_APRoleID")] public virtual APRole APRole { get; set; }

        [ForeignKey("FK_APActorID")] public virtual APActor APActor { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("APActorRoleID")]
        public int Id { get; set; }

        [StringLength(10)] public string AAStatus { get; set; }

        public DateTime? AACreatedDate { get; set; }

        public string AACreatedUser { get; set; }

        public DateTime? AAUpdatedDate { get; set; }

        public string AAUpdatedUser { get; set; }
    }
}