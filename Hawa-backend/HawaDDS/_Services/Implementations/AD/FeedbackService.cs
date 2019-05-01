using System.Linq;
using System.Threading.Tasks;

using _Abstractions.Services.AD;
using _Common.Helpers;
using _Dtos.AD;
using _Dtos.AD.InputDtos;
using _Dtos.AD.Inputs;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;
using _Entities.AD;
using _EntityFrameworkCore.Helpers.Linq;
using _EntityFrameworkCore.UnitOfWork;
using _Services.ConvertHelpers;
using _Services.Internal.Helpers.PagedResult;

namespace _Services.Implementations.AD
{
    public class FeedbackService : IFeedbackService
    {
        private readonly IUnitOfWork _unitOfWork;

        public FeedbackService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task CreateFeedbackAsync(CreateFeedbackDto dto)
        {
            await _unitOfWork.GetRepository<ADFeedback>()
                .InsertAsync(
                    new ADFeedback
                    {
                        ADFeedbackContent = dto.Content,
                        ADFeedbackIsLike = dto.IsLike,
                        FK_ADFeedbackUserID = dto.UserId,
                    });
            await _unitOfWork.CompleteAsync();
        }

        public async Task<IPagedResultDto<FeedbackDto>> FilterFeedbacksAsync(PagingAndSortingRequestDto pagingAndSortingRequestDto, FilterFeedbacksDto filter)
        {
            return await _unitOfWork.GetRepository<ADFeedback>()
                .GetAllIncluding(x => x.ADFeedbackUser)
                .WhereIf(filter.IsLike.HasValue, x => x.ADFeedbackIsLike == filter.IsLike)
                .OrderByDescending(x => x.AACreatedDate)
                .GetPagedResultAsync(
                    pagingAndSortingRequestDto.Page,
                    pagingAndSortingRequestDto.PageSize,
                    x => new FeedbackDto
                    {
                        Id = x.Id,
                        IsLike = x.ADFeedbackIsLike,
                        Date = x.AACreatedDate.ToSecondsTimestamp(),
                        Content = x.ADFeedbackContent,
                        User = x.ADFeedbackUser.ToShortUserDto(),
                    });
        }

        public async Task DeleteAsync(int feedbackId)
        {
            await _unitOfWork.GetRepository<ADFeedback>().DeleteAsync(feedbackId);

            await _unitOfWork.CompleteAsync();
        }
    }
}