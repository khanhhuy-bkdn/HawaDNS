using System;
using System.Collections.Generic;
using System.Text;

namespace _Dtos.IC.InputDtos
{
    public class EditForestPlotDto
    {
        public int Id { get; set; }

        //public string GEProvinceCode { get; set; }

        //public string GEDistrictCode { get; set; }

        //public string GECommuneCode { get; set; }

        //public string GECompartmentCode { get; set; }

        //public string GESubCompartmentCode { get; set; }

        //public string GEPlotCode { get; set; }

        //public string GEParcelCode { get; set; }

        //public string ICForestPlotVillage { get; set; }

        //public string ICForestTypeCode { get; set; }

        //public string ICForestOrgCode { get; set; }

        public string ICTreeSpecCode { get; set; }

        public string APActorCode { get; set; }

        public string ICLandUseCertCode { get; set; }

        public string ICConflictSitCode { get; set; }

        public string ICForestPlotReliability { get; set; }

        //public string ICForestPlotFormisUUID { get; set; }

        public int? ICForestPlotPlantingYear { get; set; }

        //public int? ICForestPlotAvgYearCanopy { get; set; }

        //public int? FK_GECommuneID { get; set; }

        public int? FK_APActorID { get; set; }

        //public int? ICForestPlotLandUseTerune { get; set; }

        //public int? FK_GECompartmentID { get; set; }

        //public int? FK_GEDistrictID { get; set; }

        //public int? FK_GEStateProvinceID { get; set; }

        //public int? FK_GESubCompartmentID { get; set; }

        //[Required] public string OrganizationName { get; set; }

        //public int? FK_ICForestOrgID { get; set; }

        public int? FK_ICTreeSpecID { get; set; }

        public int? FK_ICLandUseCertID { get; set; }

        public int? FK_ICForestCertID { get; set; }

        //public int? FK_GEForestProtectionDepartmentID { get; set; }

        //public int? FK_GEPeoplesCommitteeID { get; set; }

        //public int? FK_APFormisActorID { get; set; }

        public decimal ICForestPlotArea { get; set; }

        //public decimal? ICForestPlotVolumnPerHa { get; set; }

        public decimal ICForestPlotVolumnPerPlot { get; set; }

        //public decimal? ICForestPlotLocationLatitude { get; set; }

        //public decimal? ICForestPlotLocationLongitude { get; set; }

        //public DateTime? ICForestPlotLatestReviewDate { get; set; }

        public String ICForestPlotPlantingDate { get; set; }
    }
}
