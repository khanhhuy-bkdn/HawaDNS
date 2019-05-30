using System.Threading.Tasks;

using _Dtos.AP;
using _Dtos.AP.InputDtos;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;

namespace _Abstractions.Services.AP
{
    public interface IActorService
    {
        Task<ActorDto> GetActorAsync(int actorId);

        Task<ActorDto> CreateActorAsync(CreateActorDto dto);

        Task<ActorDto> UpdateActorAsync(EditActorDto dto);

        Task<IPagedResultDto<ActorDto>> FilterActorsAsync(PagingAndSortingRequestDto pagingAndSortingRequestDto, FilterActorDto filter);

        Task DeleteActorAsync(int actorId);

        Task DeleteActorsAsync(IdentitiesDto dto);

        Task<ActorDto> GetForestPlotActorAsync(int forestPlotId, int actorId);

        Task<IPagedResultDto<ShortActorDto>> FilterForestPlotActorsAsync(PagingAndSortingRequestDto pagingAndSortingRequestDto, FilterActorDto filterActorDto);

        ActorDto[] GetAll(string searchTerm);
    }
}