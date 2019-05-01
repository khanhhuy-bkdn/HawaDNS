using System.Threading.Tasks;

using _Abstractions.Services.GE;
using _Dtos.GE.InputDto;
using _Entities.GE;
using _EntityFrameworkCore.UnitOfWork;

namespace _Services.Implementations.GE
{
    public class CommuneService : ICommuneService
    {
        private readonly IUnitOfWork _unitOfWork;

        public CommuneService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task EditCommuneLocationAsync(EditCommuneLocationDto dto)
        {
            var commune = await _unitOfWork.GetRepository<GECommune>().GetAsync(dto.Id);

            commune.GECommuneLocationLongitude = dto.Longitude;
            commune.GECommuneLocationLatitude = dto.Latitude;

            await _unitOfWork.GetRepository<GECommune>().UpdateAsync(commune);
            await _unitOfWork.CompleteAsync();
        }
    }
}