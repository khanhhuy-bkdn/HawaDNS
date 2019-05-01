using _Dtos.Shared;

namespace _Dtos.IC
{
    public class ForestPlotDto
    {
        public int Id { get; set; }

        public DictionaryItemDto StateProvince { get; set; }

        public DictionaryItemDto District { get; set; }

        public DictionaryItemDto Commune { get; set; }

        public TreeSpecDto TreeSpec { get; set; }

        public decimal VolumnPerPlot { get; set; }

        public decimal Area { get; set; }

        public DictionaryItemDto Compartment { get; set; }

        public DictionaryItemDto SubCompartment { get; set; }

        public string PlotCode { get; set; }

        public decimal? LocationLatitudeCommune { get; set; }

        public decimal? LocationLongitudeCommune { get; set; }
    }
}