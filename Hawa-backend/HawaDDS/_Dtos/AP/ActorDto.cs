using _Dtos.IC;
using _Dtos.Shared;

namespace _Dtos.AP
{
    public class ActorDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public string Website { get; set; }

        public ImageUrlDto Avatar { get; set; }

        public decimal AverageRating { get; set; }

        public DictionaryItemDto[] Roles { get; set; }

        public ActorTypeDto Type { get; set; }

        public string IdentityCard { get; set; }

        public string AcronymName { get; set; }

        public string Representative { get; set; }

        public string Fax { get; set; }

        public string Address { get; set; }

        public string HouseNumber { get; set; }

        public DictionaryItemDto StateProvince { get; set; }

        public DictionaryItemDto District { get; set; }

        public DictionaryItemDto Commune { get; set; }

        public DictionaryItemDto Status { get; set; }

        public AggregateOfRatingDto[] AggregateOfRatings { get; set; }

        public ReviewItemDto[] Reviews { get; set; }

        public ForestPlotDto ForestPlot { get; set; }
    }
}