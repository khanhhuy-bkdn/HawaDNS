using _Dtos.AP;
using _Dtos.Shared;
using System;

namespace _Dtos.IC
{
    public class ForestPlotDetailDto
    {
        public int Id { get; set; }

        public TreeSpecDto TreeSpec { get; set; }

        public DictionaryItemDto Compartment { get; set; }

        public DictionaryItemDto SubCompartment { get; set; }

        public DictionaryItemDto Plot { get; set; }

        public decimal VolumnPerPlot { get; set; }

        public decimal Area { get; set; }

        public int PlantingYear { get; set; }

        //public DictionaryItemDto Dispute { get; set; }

        public ActorDto Actor { get; set; }

        public ActorTypeDto ActorType { get; set; }

        public DictionaryItemDto ForestCert { get; set; }

        public DictionaryItemDto Reliability { get; set; }

        public string CompartmentCode { get; set; }

        public string SubCompartmentCode { get; set; }

        public string PlotCode { get; set; }

        public DictionaryItemDto LandUseCert { get; set; }

        public int ConflictSitCode { get; set; }

        public decimal? LocationLatitude { get; set; }

        public decimal? LocationLongitude { get; set; }

        public long? PlantingDate { get; set; }
    }
}