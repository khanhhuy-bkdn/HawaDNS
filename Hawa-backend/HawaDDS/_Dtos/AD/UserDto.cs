using _Dtos.Shared;

namespace _Dtos.AD
{
    public class UserDto
    {
        public int Id { get; set; }

        public string UserName { get; set; }

        public string Email { get; set; }

        public DictionaryItemDto Type { get; set; }

        public string OrganizationName { get; set; }

        public string TaxNumber { get; set; }

        public string AcronymName { get; set; }

        public string Representative { get; set; }

        public string Phone { get; set; }

        public string Fax { get; set; }

        public string Website { get; set; }

        public string HouseNumber { get; set; }

        public string Address { get; set; }

        public string IdentityCard { get; set; }

        public DictionaryItemDto StateProvince { get; set; }

        public DictionaryItemDto District { get; set; }

        public DictionaryItemDto Commune { get; set; }

        public ImageUrlDto Avatar { get; set; }

        public decimal? Evaluate { get; set; }

        public DictionaryItemDto Status { get; set; }
    }
}