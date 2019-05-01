using _Dtos.AD;
using _Dtos.AR;

using Newtonsoft.Json;

namespace _Dtos
{
    public class ReviewItemDto
    {
        public int Id { get; set; }

        [JsonIgnore] public ContactDto Contact { get; set; }

        public ShortUserDto ReviewUser { get; set; }

        public int Rating { get; set; }

        public string Title { get; set; }

        public string Content { get; set; }

        public long? ReviewDate { get; set; }

        public bool Hidden { get; set; }
    }
}