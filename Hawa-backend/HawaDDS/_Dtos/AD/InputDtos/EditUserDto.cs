using System.ComponentModel.DataAnnotations;

namespace _Dtos.AD.InputDtos
{
    public class EditUserDto
    {
        public int Id { get; set; }

        [EmailAddress] public string Email { get; set; }

        public string Type { get; set; }

        [Required] public string OrganizationName { get; set; }

        [Required] public string TaxNumber { get; set; }

        [Required] public string AcronymName { get; set; }

        [Required] public string Representative { get; set; }

        [Required] public string Phone { get; set; }

        public string Fax { get; set; }

        public string Website { get; set; }

        public int? StateProvinceID { get; set; }

        public int? DistrictID { get; set; }

        public int? CommuneID { get; set; }

        public string HouseNumber { get; set; }

        public string Address { get; set; }

        public string IdentityCard { get; set; }

        public string Status { get; set; }

        public decimal? Evaluate { get; set; }

        public string Avatar { get; set; }
    }
}