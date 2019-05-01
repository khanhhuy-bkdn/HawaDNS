using _Dtos.AP;

namespace _Dtos.Shared
{
    public class DictionaryDataDto
    {
        public ActorTypeDto[] ActorTypes { get; set; }

        public DictionaryItemDto[] ContactTypes { get; set; }

        public DictionaryItemDto[] LandUseCerts { get; set; }

        public DictionaryItemDto[] UserTypes { get; set; }

        public DictionaryItemDto[] UserStatues { get; set; }

        public DictionaryItemDto[] ForestCerts { get; set; }

        public DictionaryItemDto[] ForestplotReliability { get; set; }

        public DictionaryItemDto[] Compartments { get; set; }

        public DictionaryItemDto[] ActorRoles { get; set; }

        public DictionaryItemDto[] ContactStatuses { get; set; }

        public DictionaryItemDto[] ShowVNStateProvinces { get; set; }
    }
}