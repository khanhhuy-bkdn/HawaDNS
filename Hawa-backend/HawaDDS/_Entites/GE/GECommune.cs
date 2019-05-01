using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using _Entities.AR;

//using _Entities.AR;
using _Entities.Interfaces;

namespace _Entities.GE
{
    [Table("GECommunes")]
    public class GECommune : IEntity, IStatusableEntity
    {
        [Column("GECommuneID")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }

        [StringLength(50)] public string AAStatus { get; set; }

        public int? FK_GEDistrictID { get; set; }

        public decimal? GECommuneLocationLatitude { get; set; }

        public decimal? GECommuneLocationLongitude { get; set; }

        [StringLength(256)] public string GEDistrictCode { get; set; }

        [StringLength(256)] public string GECommuneCode { get; set; }

        [Required] [StringLength(512)] public string GECommuneName { get; set; }

        [ForeignKey("FK_GEDistrictID")] public virtual GEDistrict GEDistrict { get; set; }

        [InverseProperty("GECommune")] public ICollection<ARContactForestCommuneGroup> ARContactForestCommuneGroups { get; set; }
    }
}