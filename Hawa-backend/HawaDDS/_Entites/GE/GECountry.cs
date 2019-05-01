using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using _Entities.Interfaces;

namespace _Entities.GE
{
    [Table("GECountrys")]
    public partial class GECountry : IEntity, IStatusableEntity
    {
        [Column("GECountryID")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }

        [StringLength(50)] public string AAStatus { get; set; }

        [Required] [StringLength(50)] public string GECountryCode { get; set; }

        [Required] [StringLength(512)] public string GECountryName { get; set; }
    }
}