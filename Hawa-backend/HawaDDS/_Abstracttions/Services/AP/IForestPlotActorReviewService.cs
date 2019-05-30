using System.Threading.Tasks;

using _Dtos;
using _Dtos.AP.InputDtos;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;

namespace _Abstractions.Services.AP
{
    public interface IForestPlotActorReviewService
    {
        Task<ReviewItemDto> ReviewAsync(ReviewForestPlotActorDto dto);

        Task<ReviewItemDto> GetReviewAsync(int actorReviewId);

        Task<IPagedResultDto<ReviewItemDto>> GetReviewsOfForestPlotAsync(PagingRequestDto pagingRequestDto, int forestPlotId);

        Task<IPagedResultDto<ReviewItemDto>> GetAdminReviewsOfForestPlotAsync(PagingRequestDto pagingRequestDto, int forestPlotId, int actorId);

        Task DeleteReviewAsync(int actorReviewId);

        Task HideReviewAsync(int actorReviewId);

        Task ShowReviewAsync(int actorReviewId);
    }
}