using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using _Entities.Interfaces;

namespace _Entities.AP
{
    [Table("APRoles")]
    public class APRole : IEntity, IStatusableEntity
    {
        public string APRoleName { get; set; }

        public string APRoleCode { get; set; }

        public string APRoleDesc { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("APRoleID")]
        public int Id { get; set; }

        [StringLength(10)] public string AAStatus { get; set; }
    }
}