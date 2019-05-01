using _Dtos.AD;
using _Dtos.IC;

using Newtonsoft.Json;

namespace _Dtos.AP
{
    public class ForestPlotActorReviewItemDto
    {
        public int Id { get; set; }

        [JsonIgnore] public ActorDto Actor { get; set; }

        public ShortUserDto ReviewUser { get; set; }

        public int Rating { get; set; }

        public string Title { get; set; }

        public string Content { get; set; }

        public long? ReviewDate { get; set; }

        public bool Hidden { get; set; }

        [JsonIgnore] public ForestPlotDetailDto ForestPlot { get; set; }
    }
}