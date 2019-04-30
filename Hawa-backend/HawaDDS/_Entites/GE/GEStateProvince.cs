using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using Bys.Entities.Interfaces;

namespace Bys.Entities.GE
{
    [Table("GEStateProvinces")]
    public partial class GEStateProvince : IEntity, IStatusableEntity
    {
        [Column("GEStateProvinceID")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }

        [StringLength(50)] public string AAStatus { get; set; }

        public int? FK_GECountryID { get; set; }

        [StringLength(50)] public string GECountryCode { get; set; }

        [StringLength(50)] public string GEStateProvinceCode { get; set; }

        [Required] [StringLength(512)] public string GEStateProvinceName { get; set; }

        public bool? GEStateProvinceIsHidden { get; set; }

        [InverseProperty("GEStateProvince")] public virtual ICollection<GEDistrict> GEDistricts { get; set; }
    }
}