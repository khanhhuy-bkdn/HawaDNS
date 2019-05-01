using System.Threading.Tasks;

using _Dtos.GE;
using _Dtos.GE.InputDto;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;

namespace _Abstractions.Services.GE
{
    public interface IStateProvinceService
    {
        Task CheckHideStateProvinceAsync(int stateProvinceId, bool isHidden);

        Task<IPagedResultDto<StateProvinceDto>> FilterStateProvincesAsynnc(PagingRequestDto pagingRequestDto, FilterStateProvinceDto filterStateProvinceDto);
    }
}