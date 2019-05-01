using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using _Entities.Interfaces;

namespace _Entities.AD
{
    public class ADConfigValue : IEntity, IStatusableEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("ADConfigValueID")]
        public int Id { get; set; }

        [StringLength(10)] public string AAStatus { get; set; }

        [Required] [StringLength(100)] public string ADConfigKey { get; set; }

        [Required] [StringLength(100)] public string ADConfigKeyValue { get; set; }

        [StringLength(1000)] public string ADConfigText { get; set; }

        [StringLength(500)] public string ADConfigKeyDesc { get; set; }

        [Required] [StringLength(50)] public string ADConfigKeyGroup { get; set; }

        public int? ADConfigValueSortOrder { get; set; }
    }
}