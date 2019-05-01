using System.ComponentModel.DataAnnotations;

namespace _Dtos.AD.InputDtos
{
    public class CreateUserDto
    {
        public string Password { get; set; }

        [EmailAddress] public string Email { get; set; }

        public string Type { get; set; }

        [Required] public string OrganizationName { get; set; }

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

        public string Avatar { get; set; }

        public decimal? Evaluate { get; set; }
    }
}