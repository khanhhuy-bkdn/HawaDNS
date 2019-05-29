namespace _Dtos.IC.InputDtos
{
    public class FilterForestPlotHistoryDetailDto
    {
        public int CommuneID { get; set; }

        public int ForestPlotID { get; set; }

        public int? TreeSpecID { get; set; }

        public int? ForestCertID { get; set; }

        public string SearchTerm { get; set; }
    }
}