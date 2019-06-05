namespace _Dtos.AP.InputDtos
{
    public class FilterActorDto
    {
        public string ActorType { get; set; }

        public int? ActorRoleId { get; set; }

        public int? StateProvinceID { get; set; }

        public int? DistrictID { get; set; }

        public int? CommuneID { get; set; }

        public string SearchTerm { get; set; }

        public string Status { get; set; }

        public string PlotCode { get; set; }

        public int? CompartmentId { get; set; }

        public int? ActorId { get; set; }

        public int? SubCompartmentId { get; set; }
    }
}