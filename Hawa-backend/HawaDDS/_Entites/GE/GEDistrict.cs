using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using _Entities.Interfaces;

namespace _Entities.GE
{
    [Table("GEDistricts")]
    public partial class GEDistrict : IEntity, IStatusableEntity
    {
        [Column("GEDistrictID")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }

        [StringLength(50)] public string AAStatus { get; set; }

        public int? FK_GEStateProvinceID { get; set; }

        [StringLength(256)] public string GEStateProvinceCode { get; set; }

        [StringLength(256)] public string GEDistrictCode { get; set; }

        [Required] [StringLength(512)] public string GEDistrictName { get; set; }

        [ForeignKey("FK_GEStateProvinceID")] public virtual GEStateProvince GEStateProvince { get; set; }

        [InverseProperty("GEDistrict")] public virtual ICollection<GECommune> GECommunes { get; set; }
    }
}