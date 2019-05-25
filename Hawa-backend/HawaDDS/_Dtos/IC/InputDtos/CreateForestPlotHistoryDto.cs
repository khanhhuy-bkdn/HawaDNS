using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace _Dtos.IC.InputDtos
{
    public class CreateForestPlotHistoryDto
    {
        public string GEProvinceCode { get; set; }

        public string GEDistrictCode { get; set; }

        public string GECommuneCode { get; set; }

        public string GECompartmentCode { get; set; }

        public string GESubCompartmentCode { get; set; }

        public string GEPlotCode { get; set; }

        public string GEParcelCode { get; set; }

        public string ICForestPlotHistoryVillage { get; set; }

        public string ICForestTypeCode { get; set; }

        public string ICForestOrgCode { get; set; }

        public string ICTreeSpecCode { get; set; }

        public string APActorCode { get; set; }

        public string ICLandUseCertCode { get; set; }

        public string ICConflictSitCode { get; set; }

        public string ICForestPlotHistoryReliability { get; set; }

        public string ICForestPlotHistoryFormisUUID { get; set; }

        public int? ICForestPlotHistoryPlantingYear { get; set; }

        public int? ICForestPlotHistoryAvgYearCanopy { get; set; }

        public int? FK_GECommuneID { get; set; }

        public int? FK_APActorID { get; set; }

        public int? ICForestPlotHistoryLandUseTerune { get; set; }

        public int? FK_GECompartmentID { get; set; }

        public int? FK_GEDistrictID { get; set; }

        public int? FK_GEStateProvinceID { get; set; }

        public int? FK_GESubCompartmentID { get; set; }

        //[Required] public string OrganizationName { get; set; }

        public int? FK_ICForestOrgID { get; set; }

        public int? FK_ICTreeSpecID { get; set; }

        public int? FK_ICLandUseCertID { get; set; }

        public int? FK_ICForestCertID { get; set; }

        public int? FK_GEForestProtectionDepartmentID { get; set; }

        public int? FK_GEPeoplesCommitteeID { get; set; }

        public int? FK_APFormisActorID { get; set; }

        public int? FK_ICForestPlotID { get; set; }

        public decimal? ICForestPlotHistoryArea { get; set; }

        public decimal? ICForestPlotHistoryVolumnPerHa { get; set; }

        public decimal? ICForestPlotHistoryVolumnPerPlot { get; set; }

        public decimal? ICForestPlotHistoryLocationLatitude { get; set; }

        public decimal? ICForestPlotHistoryLocationLongitude { get; set; }

        public DateTime? ICForestPlotHistoryLatestReviewDate { get; set; }

        public DateTime? ICForestPlotHistoryPlantingDate { get; set; }
    }
}
