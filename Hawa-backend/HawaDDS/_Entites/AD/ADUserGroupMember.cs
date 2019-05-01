using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using _Entities.Interfaces;

namespace _Entities.AD
{
    [Table("ADUserGroupMembers")]
    public class ADUserGroupMember : IFullEntity
    {
        [Key] [Column("ADUserGroupMemberID")] public int Id { get; set; }

        [Column("AACreatedDate", TypeName = "datetime")]
        public DateTime? AACreatedDate { get; set; }

        [Column("AACreatedUser")]
        [StringLength(50)]
        public string AACreatedUser { get; set; }

        [Column("AAUpdatedDate", TypeName = "datetime")]
        public DateTime? AAUpdatedDate { get; set; }

        [Column("AAUpdatedUser")]
        [StringLength(50)]
        public string AAUpdatedUser { get; set; }

        [Column("AAStatus")]
        [StringLength(10)]
        public string AAStatus { get; set; }

        [Column("FK_ADUserGroupID")] public int FK_ADUserGroupID { get; set; }

        [Column("FK_HREmployeeID")] public int FK_HREmployeeID { get; set; }

        [Column("FK_ADUserID")] public int FK_ADUserID { get; set; }

        [ForeignKey("FK_ADUserGroupID")] public virtual ADUserGroup ADUserGroup { get; set; }

        [ForeignKey("FK_ADUserID")] public virtual ADUser ADUser { get; set; }
    }
}