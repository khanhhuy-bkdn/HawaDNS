using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using _Entities.GE;
using _Entities.Interfaces;

namespace _Entities.AD
{
    [Table("ADUsers")]
    public class ADUser : IFullEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("ADUserID")]
        public int Id { get; set; }

        [StringLength(10)] public string AAStatus { get; set; }

        public DateTime? AACreatedDate { get; set; }

        public string AACreatedUser { get; set; }

        public DateTime? AAUpdatedDate { get; set; }

        public string AAUpdatedUser { get; set; }

        public string ADUserOrganizationName { get; set; }

        public string ADUserPersonalName { get; set; }

        public string ADUserAcronymName { get; set; }

        public string ADUserTaxNumber { get; set; }

        public string ADUserPhone { get; set; }

        public string ADUserFax { get; set; }

        public string ADUserWebsite { get; set; }

        public string ADUserRepresentative { get; set; }

        public string ADUserHouseNumber { get; set; }

        public string ADUserAddress { get; set; }

        public string ADUserIdentityCard { get; set; }

        public string ADUserRole { get; set; }

        public string ADUserType { get; set; }

        public string ADUserAvatarFileName { get; set; }

        public int? FK_GEStateProvinceID { get; set; }

        public int? FK_GEDistrictID { get; set; }

        public int? FK_GECommuneID { get; set; }

        public string ADUserEmail { get; set; }

        public string ADUserStatus { get; set; }

        public decimal? ADUserEvaluate { get; set; }

        [ForeignKey("FK_GEStateProvinceID")] public virtual GEStateProvince GEStateProvince { get; set; }

        [ForeignKey("FK_GEDistrictID")] public virtual GEDistrict GEDistrict { get; set; }

        [ForeignKey("FK_GECommuneID")] public virtual GECommune GECommune { get; set; }

        public string ADUserPassword { get; set; }
    }
}