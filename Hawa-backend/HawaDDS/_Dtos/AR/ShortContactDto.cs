using _Dtos.AD;
using _Dtos.Shared;

namespace _Dtos.AR
{
    public class ShortContactDto
    {
        public int Id { get; set; }

        public string ContactName { get; set; }

        public string UserContact { get; set; }

        public string Phone1 { get; set; }

        public ShortUserDto Contributor { get; set; }

        public long? ContributeDate { get; set; }

        public decimal? Evalution { get; set; }

        public string Email { get; set; }

        public DictionaryItemDto Status { get; set; }

        public decimal AverageRating { get; set; }

        public AggregateOfRatingDto[] AggregateOfRatings { get; set; }

        public string TitleContribute { get; set; }

        public int ReviewCount { get; set; }
    }
}