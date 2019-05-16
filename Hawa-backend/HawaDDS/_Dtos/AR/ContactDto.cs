using _Dtos.AD;
using _Dtos.Shared;

namespace _Dtos.AR
{
    public class ContactDto
    {
        public int Id { get; set; }

        public ShortUserDto Contributor { get; set; }

        public string TitleContribute { get; set; }

        public DictionaryItemDto ContactType { get; set; }

        public DictionaryItemDto UserType { get; set; }

        public string ContactName { get; set; }

        public string AcronymName { get; set; }

        public string Detail { get; set; }

        public string UserContact { get; set; }

        public string Phone1 { get; set; }

        public string Phone2 { get; set; }

        public string Email { get; set; }

        public string Website { get; set; }

        public string Note { get; set; }

        public ImageUrlDto[] Images { get; set; }

        public DictionaryItemDto StateProvince { get; set; }

        public DictionaryItemDto District { get; set; }

        public DictionaryItemDto Commune { get; set; }

        public string HouseNumber { get; set; }

        public string Address { get; set; }

        public decimal AverageRating { get; set; }

        public AggregateOfRatingDto[] AggregateOfRatings { get; set; }

        public long? ContributeDate { get; set; }

        public ContactLocationInChargeDto[] LocationInCharge { get; set; }

        public DictionaryItemDto Status { get; set; }
    }
}