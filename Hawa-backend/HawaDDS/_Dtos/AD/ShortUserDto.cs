using _Dtos.Shared;

namespace _Dtos.AD
{
    public class ShortUserDto
    {
        public int Id { get; set; }

        public string Email { get; set; }

        public DictionaryItemDto Type { get; set; }

        public string OrganizationName { get; set; }

        public string AcronymName { get; set; }

        public string Phone { get; set; }

        public ImageUrlDto Avatar { get; set; }

        public DictionaryItemDto StateProvince { get; set; }

        public DictionaryItemDto District { get; set; }

        public DictionaryItemDto Commune { get; set; }

        public DictionaryItemDto Status { get; set; }
    }
}