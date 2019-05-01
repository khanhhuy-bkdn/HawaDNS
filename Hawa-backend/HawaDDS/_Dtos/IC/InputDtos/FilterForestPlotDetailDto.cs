namespace _Dtos.IC.InputDtos
{
    public class FilterForestPlotDetailDto
    {
        public int CommuneID { get; set; }

        public int? TreeSpecID { get; set; }

        public int? OldFrom { get; set; }

        public int? OldTo { get; set; }

        public int? ForestCertID { get; set; }

        public string Reliability { get; set; }

        public string SearchTerm { get; set; }
    }
}