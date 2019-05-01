using _Dtos.GE;
using _Dtos.Shared;

namespace _Dtos.AR
{
    public class CommuneContactInfoDto
    {
        public IPagedResultDto<ShortContactDto> Contacts { get; set; }

        public DictionaryItemDto UBND { get; set; }

        public ForestProtectionDepartmentDto ForestProtectionDepartment { get; set; }
    }
}