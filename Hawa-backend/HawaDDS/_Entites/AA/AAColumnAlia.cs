using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using _Entities.Interfaces;

namespace _Entities.AA
{
    [Table("AAColumnAlias")]
    public class AAColumnAlia : IEntity, IStatusableEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("AAColumnAliasID")]
        public int Id { get; set; }

        public int? AANumberInt { get; set; }

        [StringLength(50)] public string AANumberString { get; set; }

        [StringLength(50)] public string AAStatus { get; set; }

        [Required] [StringLength(255)] public string AAColumnAliasName { get; set; }

        [Required] [StringLength(255)] public string AAColumnAliasCaption { get; set; }

        [Required] [StringLength(50)] public string AATableName { get; set; }
    }
}