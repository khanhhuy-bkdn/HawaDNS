using _Dtos.Shared;

namespace _Dtos.AR
{
    public class SummaryCommuneContactDto
    {
        public DictionaryItemDto StateProvince { get; set; }

        public DictionaryItemDto District { get; set; }

        public DictionaryItemDto Commune { get; set; }

        public int ReviewCount { get; set; }

        public int NotConfirmStatusCount { get; set; }

        public int PendingStatusCount { get; set; }
    }
}