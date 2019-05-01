using _Dtos.Shared;

namespace _Dtos.AR
{
    public class ContactLocationInChargeDto
    {
        public DictionaryItemDto StateProvince { get; set; }

        public DictionaryItemDto District { get; set; }

        public DictionaryItemDto Commune { get; set; }
    }
}