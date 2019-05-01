using System.Linq;
using System.Threading.Tasks;

using _Abstractions.Services.GE;
using _Dtos.GE;
using _Dtos.GE.InputDto;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;
using _Entities.GE;
using _EntityFrameworkCore.Helpers.Linq;
using _EntityFrameworkCore.UnitOfWork;
using _Services.Internal.Helpers.PagedResult;

namespace _Services.Implementations.GE
{
    public class StateProvinceService : IStateProvinceService
    {
        private readonly IUnitOfWork _unitOfWork;

        public StateProvinceService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task CheckHideStateProvinceAsync(int stateProvinceId, bool isHidden)
        {
            var stateProvince = await _unitOfWork.GetRepository<GEStateProvince>().GetAsync(stateProvinceId);

            stateProvince.GEStateProvinceIsHidden = isHidden;

            await _unitOfWork.GetRepository<GEStateProvince>().UpdateAsync(stateProvince);
            await _unitOfWork.CompleteAsync();
        }

        public async Task<IPagedResultDto<StateProvinceDto>> FilterStateProvincesAsynnc(PagingRequestDto pagingRequestDto, FilterStateProvinceDto filterDto)
        {
            return await _unitOfWork.GetRepository<GEStateProvince>()
                .GetAll()
                .SearchByFields(filterDto.SearchTerm, x => x.GEStateProvinceName)
                .WhereIf(filterDto.IsHidden.HasValue, x => x.GEStateProvinceIsHidden.GetValueOrDefault() == filterDto.IsHidden.GetValueOrDefault())
                .OrderBy(x => x.GEStateProvinceName)
                .GetPagedResultAsync(
                    pagingRequestDto.Page,
                    pagingRequestDto.PageSize,
                    x => new StateProvinceDto
                    {
                        IsHidden = x.GEStateProvinceIsHidden.GetValueOrDefault(),
                        Code = x.GECountryCode,
                        Id = x.Id,
                        Name = x.GEStateProvinceName
                    });
        }
    }
}