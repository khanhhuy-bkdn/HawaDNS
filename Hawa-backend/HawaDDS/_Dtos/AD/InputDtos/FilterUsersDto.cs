namespace _Dtos.AD.InputDtos
{
    public class FilterUsersDto
    {
        public string Type { get; set; }

        public int? StateProvinceID { get; set; }

        public int? DistrictID { get; set; }

        public int? CommuneID { get; set; }

        public string Status { get; set; }

        public string SearchTerm { get; set; }
    }
}