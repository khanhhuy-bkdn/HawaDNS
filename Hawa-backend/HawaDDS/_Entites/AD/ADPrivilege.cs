using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using _Entities.Interfaces;

namespace _Entities.AD
{
    [Table("ADPrivileges")]
    public class ADPrivilege : IEntity, IStatusableEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("ADPrivilegeID")]
        public int Id { get; set; }

        [StringLength(10)] public string AAStatus { get; set; }

        public string ADPrivilegeNo { get; set; }

        public string ADPrivilegeName { get; set; }

        public string ADPrivilegeDesc { get; set; }

        public int FK_STModuleID { get; set; }

        public string ADPrivilegeCaption { get; set; }

        public int? ADPrivilegeGroupID { get; set; }

        //public ADPrivilegeGroups ADPrivilegeGroup { get; set; }

        //[ForeignKey("FK_STModuleID")] public virtual STModule STModule { get; set; }

        //public ICollection<ADPrivilegeDetails> ADPrivilegeDetails { get; set; }
        //public ICollection<ADPrivilegeUserGroups> ADPrivilegeUserGroups { get; set; }
    }
}