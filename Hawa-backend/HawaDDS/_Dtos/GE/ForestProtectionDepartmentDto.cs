using _Dtos.Shared;

namespace _Dtos.GE
{
    public class ForestProtectionDepartmentDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Phone { get; set; }

        public DictionaryItemDto District { get; set; }

        public DictionaryItemDto StateProvince { get; set; }
    }
}