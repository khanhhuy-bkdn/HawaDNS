using System.Threading.Tasks;

using _Dtos.AD;
using _Dtos.AD.InputDtos;
using _Dtos.AD.Inputs;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;

namespace _Abstractions.Services.AD
{
    public interface IFeedbackService
    {
        Task CreateFeedbackAsync(CreateFeedbackDto dto);

        Task<IPagedResultDto<FeedbackDto>> FilterFeedbacksAsync(PagingAndSortingRequestDto pagingAndSortingRequestDto, FilterFeedbacksDto filter);

        Task DeleteAsync(int feedbackId);
    }
}