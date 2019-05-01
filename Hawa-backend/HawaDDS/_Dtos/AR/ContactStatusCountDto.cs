using _Dtos.Shared;

namespace _Dtos.AR
{
    public class ContactStatusCountDto
    {
        public int Total { get; set; }

        public int ChuaDuyet { get; set; }

        public int DangXacMinh { get; set; }

        public int DaDuyet { get; set; }

        public int HuyBo { get; set; }

        public DictionaryItemDto StateProvince { get; set; }

        public DictionaryItemDto District { get; set; }

        public DictionaryItemDto Commune { get; set; }
    }
}