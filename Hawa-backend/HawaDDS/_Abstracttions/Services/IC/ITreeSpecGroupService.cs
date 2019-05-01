using System.Threading.Tasks;

using _Dtos.IC;
using _Dtos.IC.InputDtos;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;

namespace _Abstractions.Services.IC
{
    public interface ITreeSpecGroupService
    {
        Task<TreeSpecGroupDto> CreateTreeSpecGroupAsync(CreateTreeSpecGroupDto dto);

        Task<TreeSpecGroupDto> EditTreeSpecGroupAsync(EditTreeSpecGroupDto dto);

        Task DeleteTreeSpecGroupAsync(int treeSpecGroupId);

        Task<TreeSpecGroupDto> GetTreeSpecGroupAsync(int treeSpecGroupId);

        Task<TreeSpecGroupDto[]> GetAll(string searchTerm);

        Task<IPagedResultDto<TreeSpecGroupDto>> FilterTreeSpecGroupsAsync(PagingAndSortingRequestDto pagingAndSorting, string searchTerm);
    }
}