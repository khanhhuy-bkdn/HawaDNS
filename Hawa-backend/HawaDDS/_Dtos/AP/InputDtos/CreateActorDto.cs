namespace _Dtos.AP.InputDtos
{
    public class CreateActorDto
    {
        public string ActorType { get; set; }

        public int[] ActorRoles { get; set; }

        public string Name { get; set; }

        public string TaxNumber { get; set; }

        public string AcronymName { get; set; }

        public string Representative { get; set; }

        public string Phone { get; set; }

        public string Fax { get; set; }

        public string Website { get; set; }

        public int? StateProvinceID { get; set; }

        public int? DistrictID { get; set; }

        public int? CommuneID { get; set; }

        public string HouseNumber { get; set; }

        public string Address { get; set; }

        public string IdentityCard { get; set; }
    }
}