using System.ComponentModel.DataAnnotations.Schema;

using _Entities.Interfaces;

namespace _Entities.AD
{
    [Table("ADPrivilegeUserGroups")]
    public class ADPrivilegeUserGroup : IEntity, IStatusableEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("ADPrivilegeUserGroupID")]
        public int Id { get; set; }

        public string AAStatus { get; set; }

        public int FK_ADPrivilegeID { get; set; }

        public int FK_ADUserGroupID { get; set; }

        public bool ADPrivilegeUserGroupCheck { get; set; }

        [ForeignKey("FK_ADUserGroupID")] public virtual ADUserGroup ADUserGroup { get; set; }

        [ForeignKey("FK_ADPrivilegeID")] public virtual ADPrivilege ADPrivilege { get; set; }

        //public AduserGroups FkAduserGroup { get; set; }
    }
}