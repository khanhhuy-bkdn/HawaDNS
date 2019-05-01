using System.Threading.Tasks;

using _Dtos;
using _Dtos.AR.InputDtos;
using _Dtos.AR.Inputs;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;

namespace _Abstractions.Services.AR
{
    public interface IContactReviewService
    {
        Task<ReviewItemDto> ReviewAsync(ReviewContactDto dto);

        Task<ReviewItemDto> GetContactReviewAsync(int contactReviewId);

        Task<IPagedResultDto<ReviewItemDto>> GetReviewsOfContactAsync(PagingRequestDto pagingRequestDto, int contactId);

        Task<IPagedResultDto<ReviewItemDto>> GetContactReviewsAsync(PagingRequestDto pagingRequestDto, FilterContactReviewsDto filter);

        Task DeleteContactReviewAsync(int contactReviewId);

        Task HideContactReviewAsync(int contactReviewId);

        Task ShowContactReviewAsync(int contactReviewId);

        Task<IPagedResultDto<ReviewItemDto>> GetAdminReviewsOfContactAsync(PagingRequestDto pagingRequestDto, int contactId);
    }
}