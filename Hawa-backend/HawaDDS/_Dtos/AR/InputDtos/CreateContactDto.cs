namespace _Dtos.AR.InputDtos
{
    public class CreateContactDto
    {
        public string Contributor { get; set; }

        public string TitleContribute { get; set; }

        public int? ContactTypeID { get; set; }

        public string ContactName { get; set; }

        public string AcronymName { get; set; }

        public string UserContact { get; set; }

        public string Phone1 { get; set; }

        public string Phone2 { get; set; }

        public string Email { get; set; }

        public string Website { get; set; }

        public string Note { get; set; }

        public string[] Images { get; set; }

        public int? StateProvinceID { get; set; }

        public int? DistrictID { get; set; }

        public int? CommuneID { get; set; }

        public string HouseNumber { get; set; }

        public string Address { get; set; }

        public LocationInChargeDto[] LocationInCharges { get; set; }
    }
}