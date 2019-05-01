using _Dtos.IC;

namespace _Dtos.AP
{
    public class ShortActorDto
    {
        public string Name { get; set; }

        public ForestPlotDto ForestPlot { get; set; }

        public decimal ReviewCount { get; set; }

        public decimal AverageRating { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public string Website { get; set; }

        public ActorTypeDto Type { get; set; }
    }
}