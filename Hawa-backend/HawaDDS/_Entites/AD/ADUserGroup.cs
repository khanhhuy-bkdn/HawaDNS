using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using _Entities.Interfaces;

namespace _Entities.AD
{
    [Table("ADUserGroups")]
    public class ADUserGroup : IEntity, IStatusableEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("ADUserGroupID")]
        public int Id { get; set; }

        [Column("AANumberString")]
        [StringLength(50)]
        public string AANumberString { get; set; }

        [Column("AANumberInt")] public int? AANumberInt { get; set; }

        [Column("AAStatus")]
        [StringLength(10)]
        public string AAStatus { get; set; }

        [Column("ADUserGroupSkinCombo")]
        [StringLength(50)]
        public string ADUserGroupSkinCombo { get; set; }

        [Required]
        [Column("ADUserGroupName")]
        [StringLength(50)]
        public string ADUserGroupName { get; set; }

        [Column("ADUserGroupDesc")]
        [StringLength(255)]
        public string ADUserGroupDesc { get; set; }

        [Column("ADUserGroupActiveCheck")] public bool ADUserGroupActiveCheck { get; set; }

        public int ADLanguageIDCombo { get; set; }

        public DateTime? ADUserGroupCreatedDate { get; set; }

        public virtual ICollection<ADUserGroupMember> ADUserGroupMembers { get; set; }

        public virtual ICollection<ADPrivilegeUserGroup> ADPrivilegeUserGroups { get; set; }

        public bool? ADUserGroupCanBeModify { get; set; }

        public string ADUserGroupCode { get; set; }
    }
}