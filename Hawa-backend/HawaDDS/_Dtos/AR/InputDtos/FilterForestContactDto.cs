namespace _Dtos.AR.InputDtos
{
    public class FilterContactsDto
    {
        public string SearchTerm { get; set; }

        public int? ContactStateProvinceId { get; set; }

        public int? ContactDistrictId { get; set; }

        public int? ContactCommuneId { get; set; }

        public int? Rating { get; set; }
    }
}