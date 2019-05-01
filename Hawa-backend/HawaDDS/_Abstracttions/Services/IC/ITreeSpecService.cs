using System.Threading.Tasks;

using _Dtos.IC;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;

namespace _Abstractions.Services.IC
{
    public interface ITreeSpecService
    {
        TreeSpecDto[] GetAll(string searchTerm);

        Task<IPagedResultDto<TreeSpecDto>> FilterTreeSpecsAsync(PagingAndSortingRequestDto pagingAndSortingRequest, string searchTerm);
    }
}