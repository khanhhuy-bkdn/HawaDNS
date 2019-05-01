using System;
using System.ComponentModel.DataAnnotations.Schema;

using _Entities.GE;
using _Entities.Interfaces;

namespace _Entities.AR
{
    [Table("ARContactForestCommuneGroups")]
    public class ARContactForestCommuneGroup : IFullEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("ARContactForestCommuneGroupID")]
        public int Id { get; set; }

        public string AAStatus { get; set; }

        public DateTime? AACreatedDate { get; set; }

        public string AACreatedUser { get; set; }

        public DateTime? AAUpdatedDate { get; set; }

        public string AAUpdatedUser { get; set; }

        public int FK_ARContactID { get; set; }

        public int? FK_GECommuneID { get; set; }

        public int? FK_GEDistrictID { get; set; }

        public int? FK_GEStateProvinceID { get; set; }

        [ForeignKey("FK_GECommuneID")] public virtual GECommune GECommune { get; set; }

        [ForeignKey("FK_GEDistrictID")] public virtual GEDistrict GEDistrict { get; set; }

        [ForeignKey("FK_GEStateProvinceID")] public virtual GEStateProvince GEStateProvince { get; set; }

        [ForeignKey("FK_ARContactID")] public virtual ARContact ARContact { get; set; }
    }
}