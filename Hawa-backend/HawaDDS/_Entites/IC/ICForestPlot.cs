using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using _Entities.AP;
using _Entities.GE;
using _Entities.Interfaces;

namespace _Entities.IC
{
    [Table("ICForestPlots")]
    public class ICForestPlot : IFullEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("ICForestPlotID")]
        public int Id { get; set; }

        [StringLength(10)] public string AAStatus { get; set; }

        public DateTime? AACreatedDate { get; set; }

        public string AACreatedUser { get; set; }

        public DateTime? AAUpdatedDate { get; set; }

        public string AAUpdatedUser { get; set; }

        public string AASource { get; set; }

        public string GEProvinceCode { get; set; }

        public string GEDistrictCode { get; set; }

        public string GECommuneCode { get; set; }

        public string GECompartmentCode { get; set; }

        public string GESubCompartmentCode { get; set; }

        public string GEPlotCode { get; set; }

        public string GEParcelCode { get; set; }

        public string ICForestPlotVillage { get; set; }

        public decimal ICForestPlotArea { get; set; }

        public string ICForestTypeCode { get; set; }

        public string ICForestOrgCode { get; set; }

        public string ICTreeSpecCode { get; set; }

        public decimal? ICForestPlotLocationLongitude { get; set; }

        public decimal? ICForestPlotLocationLatitude { get; set; }

        public int? ICForestPlotPlantingYear { get; set; }

        public int? ICForestPlotAvgYearCanopy { get; set; }

        public decimal ICForestPlotVolumnPerHa { get; set; }

        public decimal ICForestPlotVolumnPerPlot { get; set; }

        public string APActorCode { get; set; }

        public int? FK_APActorID { get; set; }

        public string ICLandUseCertCode { get; set; }

        public string ICConflictSitCode { get; set; }

        public int? ICForestPlotLandUseTerune { get; set; }

        public int? FK_GECommuneID { get; set; }

        public int? FK_GECompartmentID { get; set; }

        public int? FK_GEDistrictID { get; set; }

        public int? FK_GEStateProvinceID { get; set; }

        public int? FK_GESubCompartmentID { get; set; }

        public int? FK_ICForestOrgID { get; set; }

        public int? FK_ICTreeSpecID { get; set; }

        public int? FK_ICLandUseCertID { get; set; }

        public int? FK_ICForestCertID { get; set; }

        public string ICForestPlotReliability { get; set; }

        public int? FK_GEForestProtectionDepartmentID { get; set; }

        public int? FK_GEPeoplesCommitteeID { get; set; }

        public DateTime? ICForestPlotLatestReviewDate { get; set; }

        [ForeignKey("FK_GECommuneID")] public virtual GECommune GECommunes { get; set; }

        [ForeignKey("FK_GEDistrictID")] public virtual GEDistrict GEDistrict { get; set; }

        [ForeignKey("FK_GEStateProvinceID")] public virtual GEStateProvince GEStateProvince { get; set; }

        [ForeignKey("FK_ICTreeSpecID")] public virtual ICTreeSpec ICTreeSpec { get; set; }

        [ForeignKey("FK_ICLandUseCertID")] public virtual ICLandUseCert GEDisICLandUseCerttrict { get; set; }

        [ForeignKey("FK_APActorID")] public virtual APActor APActor { get; set; }

        [ForeignKey("FK_GESubCompartmentID")] public virtual GESubCompartment GESubCompartment { get; set; }

        [ForeignKey("FK_GECompartmentID")] public virtual GECompartment GECompartment { get; set; }

        [ForeignKey("FK_ICForestCertID")] public virtual ICForestCert ICForestCert { get; set; }

        [ForeignKey("FK_GEForestProtectionDepartmentID")]
        public virtual GEForestProtectionDepartment GEForestProtectionDepartment { get; set; }

        [ForeignKey("FK_GEPeoplesCommitteeID")]
        public virtual GEPeoplesCommittee GEPeoplesCommittee { get; set; }

        [InverseProperty("ICForestPlot")] public virtual ICollection<APActorReview> APActorReviews { get; set; }

        public string ICForestPlotFormisUUID { get; set; }
    }
}