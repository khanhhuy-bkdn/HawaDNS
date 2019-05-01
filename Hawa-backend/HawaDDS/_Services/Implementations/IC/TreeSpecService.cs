using System.Linq;
using System.Threading.Tasks;

using _Abstractions.Services.IC;
using _Common.Extensions;
using _Dtos.IC;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;
using _Entities.IC;
using _EntityFrameworkCore.Helpers.Linq;
using _EntityFrameworkCore.UnitOfWork;
using _Services.ConvertHelpers;
using _Services.Internal.Helpers.PagedResult;

namespace _Services.Implementations.IC
{
    public class TreeSpecService : ITreeSpecService
    {
        private readonly IUnitOfWork _unitOfWork;

        public TreeSpecService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public TreeSpecDto[] GetAll(string searchTerm)
        {
            return _unitOfWork.GetRepository<ICTreeSpec>()
                .GetAll()
                .SearchByFields(searchTerm, x => x.ICTreeSpecName)
                .OrderBy(x => x.Id)
                .ConvertArray(x => x.ToTreeSpecDto());
        }

        public async Task<IPagedResultDto<TreeSpecDto>> FilterTreeSpecsAsync(PagingAndSortingRequestDto pagingAndSortingRequest, string searchTerm)
        {
            return await _unitOfWork.GetRepository<ICTreeSpec>()
                .GetAll()
                .SearchByFields(searchTerm, x => x.ICTreeSpecName)
                .OrderBy(x => x.Id)
                .GetPagedResultAsync(pagingAndSortingRequest.Page, pagingAndSortingRequest.PageSize, x => x.ToTreeSpecDto());
        }
    }
}