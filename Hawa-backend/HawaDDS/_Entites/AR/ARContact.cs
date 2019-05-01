using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using _Entities.AD;
using _Entities.GE;
using _Entities.Interfaces;

namespace _Entities.AR
{
    [Table("ARContacts")]
    public class ARContact : IFullEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("ARContactID")]
        public int Id { get; set; }

        [StringLength(10)] public string AAStatus { get; set; }

        public DateTime? AACreatedDate { get; set; }

        public string AACreatedUser { get; set; }

        public DateTime? AAUpdatedDate { get; set; }

        public string AAUpdatedUser { get; set; }

        public string ARContactContributor { get; set; }

        public string ARContactTitleContribute { get; set; }

        public int? FK_ARContactTypeID { get; set; }

        public string ARContactUserType { get; set; }

        public string ARContactName { get; set; }

        public string ARContactAcronymName { get; set; }

        public string ARContactDetail { get; set; }

        public string ARContactUserContact { get; set; }

        public string ARContactPhone1 { get; set; }

        public string ARContactPhone2 { get; set; }

        public string ARContactEmail { get; set; }

        public string ARContactWebsite { get; set; }

        public string ARContactNote { get; set; }

        public string ARContactImage { get; set; }

        public int? FK_GEStateProvinceID { get; set; }

        public int? FK_GEDistrictID { get; set; }

        public int? FK_GECommuneID { get; set; }

        public string ARUserHouseNumber { get; set; }

        public string ARUserAddress { get; set; }

        public decimal? ARContactEvalution { get; set; }

        public string ARContactStatus { get; set; }

        [ForeignKey("FK_GEStateProvinceID")] public virtual GEStateProvince GEStateProvince { get; set; }

        [ForeignKey("FK_GEDistrictID")] public virtual GEDistrict GEDistrict { get; set; }

        [ForeignKey("FK_GECommuneID")] public virtual GECommune GECommune { get; set; }

        [ForeignKey("FK_ARContactTypeID")] public virtual ARContactType ARContactType { get; set; }

        [InverseProperty("ARContact")] public virtual ICollection<ARContactReview> ARContactReviews { get; set; }

        [InverseProperty("ARContact")] public virtual ICollection<ARContactForestCommuneGroup> ARContactForestCommuneGroups { get; set; }

        public int? FK_CreatedUserID { get; set; }

        [ForeignKey("FK_CreatedUserID")] public virtual ADUser ADCreatedUser { get; set; }
    }
}