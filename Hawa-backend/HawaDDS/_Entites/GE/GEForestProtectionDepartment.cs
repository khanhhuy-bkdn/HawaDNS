using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using _Entities.Interfaces;

namespace _Entities.GE
{
    [Table("GEForestProtectionDepartments")]
    public class GEForestProtectionDepartment : IFullEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("GEForestProtectionDepartmentID")]
        public int Id { get; set; }

        [StringLength(10)] public string AAStatus { get; set; }

        public DateTime? AACreatedDate { get; set; }

        public string AACreatedUser { get; set; }

        public DateTime? AAUpdatedDate { get; set; }

        public string AAUpdatedUser { get; set; }

        public string AASource { get; set; }

        public string GEForestProtectionDepartmentCode { get; set; }

        public string GEForestProtectionDepartmentName { get; set; }

        public string GEForestProtectionDepartmentDesc { get; set; }

        public string GEForestProtectionDepartmentPhone { get; set; }

        public string GEForestProtectionDepartmentPhone2 { get; set; }

        public string GEForestProtectionDepartmentAddress { get; set; }

        public string GEDistrictCode { get; set; }

        public int? FK_GEDistrictID { get; set; }

        [ForeignKey("FK_GEDistrictID")] public virtual GEDistrict GEDistrict { get; set; }

        public string GEStateProvinceCode { get; set; }

        public int? FK_GEStateProvinceID { get; set; }

        [ForeignKey("FK_GEStateProvinceID")] public virtual GEStateProvince GEStateProvince { get; set; }
    }
}