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

        public string CommuneCode { get; set; }

        public string DistrictCode { get; set; }

        public string StateProvinceCode { get; set; }

        public string HouseNumber { get; set; }

        public string Address { get; set; }

        public string IdentityCard { get; set; }

        public string Email { get; set; }

        public string Avartar { get; set; }

        public string ActorTypeCode { get; set; }

        public int ActorTypeID { get; set; }

        public string ContactName { get; set; }

        public string ContactPhone { get; set; }

        public string Note { get; set; }
    }
}