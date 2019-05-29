using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using _Entities.AP;
using _Entities.AD;
using _Entities.GE;
using _Entities.Interfaces;

namespace _Entities.IC
{
    [Table("ICForestPlotHistorys")]
    public class ICForestPlotHistory : IFullEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("ICForestPlotHistoryID")]
        public int Id { get; set; }

        [StringLength(10)] public string AAStatus { get; set; }

        public DateTime? AACreatedDate { get; set; }

        public string AACreatedUser { get; set; }

        public DateTime? AAUpdatedDate { get; set; }

        public string AAUpdatedUser { get; set; }

        public string GEProvinceCode { get; set; }

        public string GEDistrictCode { get; set; }

        public string GECommuneCode { get; set; }

        public string GECompartmentCode { get; set; }

        public string GESubCompartmentCode { get; set; }

        public string GEPlotCode { get; set; }

        public string GEParcelCode { get; set; }

        public string ICForestPlotHistoryVillage { get; set; }

        public decimal ICForestPlotHistoryArea { get; set; }

        public string ICForestTypeCode { get; set; }

        public string ICForestOrgCode { get; set; }

        public string ICTreeSpecCode { get; set; }

        public decimal? ICForestPlotHistoryLocationLongitude { get; set; }

        public decimal? ICForestPlotHistoryLocationLatitude { get; set; }

        public int? ICForestPlotHistoryPlantingYear { get; set; }

        public int? ICForestPlotHistoryAvgYearCanopy { get; set; }

        public decimal ICForestPlotHistoryVolumnPerHa { get; set; }

        public decimal ICForestPlotHistoryVolumnPerPlot { get; set; }

        public string APActorCode { get; set; }

        public int? FK_APActorID { get; set; }

        public string ICLandUseCertCode { get; set; }

        public string ICConflictSitCode { get; set; }

        public int? ICForestPlotHistoryLandUseTerune { get; set; }

        public int? FK_GECommuneID { get; set; }

        public int? FK_GECompartmentID { get; set; }

        public int? FK_GEDistrictID { get; set; }

        public int? FK_GEStateProvinceID { get; set; }

        public int? FK_GESubCompartmentID { get; set; }

        public int? FK_ICForestOrgID { get; set; }

        public int? FK_ICTreeSpecID { get; set; }

        public int? FK_ICLandUseCertID { get; set; }

        public int? FK_ICForestCertID { get; set; }

        public string ICForestPlotHistoryReliability { get; set; }

        public int? FK_GEForestProtectionDepartmentID { get; set; }

        public int? FK_GEPeoplesCommitteeID { get; set; }

        public DateTime? ICForestPlotHistoryLatestReviewDate { get; set; }

        public int? FK_ICForestPlotID { get; set; }

        public string ICForestPlotHistoryFormisUUID { get; set; }

        public DateTime? ICForestPlotHistoryPlantingDate { get; set; }

        public DateTime? ICForestPlotHistoryCreatedDate { get; set; }

        public int? FK_ADuserID { get; set; }

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

        [ForeignKey("FK_ICForestPlotID")]
        public virtual ICForestPlot ICForestPlot { get; set; }

        [ForeignKey("FK_ADuserID")]
        public virtual ADUser ADUser { get; set; }
    }
}