using System.Linq;
using System.Threading.Tasks;

using _Abstractions.Services.AP;
using _Common.Exceptions;
using _Common.Runtime.Session;
using _Common.Timing;
using _Constants.EntityTypes;
using _Dtos;
using _Dtos.AP.InputDtos;
using _Dtos.AR;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;
using _Entities.AD;
using _Entities.AP;
using _Entities.IC;
using _EntityFrameworkCore.Helpers;
using _EntityFrameworkCore.UnitOfWork;
using _Services.ConvertHelpers;
using _Services.Internal;
using _Services.Internal.Helpers.PagedResult;

using Microsoft.EntityFrameworkCore;

namespace _Services.Implementations.AP
{
    public class ForestPlotActorReviewService : IForestPlotActorReviewService
    {
        private readonly IBysSession _bysSession;
        private readonly IUnitOfWork _unitOfWork;
        private readonly INotificationService _notificationService;

        public ForestPlotActorReviewService(IUnitOfWork unitOfWork, IBysSession bysSession, INotificationService notificationService)
        {
            _unitOfWork = unitOfWork;
            _bysSession = bysSession;
            _notificationService = notificationService;
        }

        public async Task<ReviewItemDto> ReviewAsync(ReviewForestPlotActorDto dto)
        {
            var forestPlotActorFromDb = await _unitOfWork.GetRepository<ICForestPlot>()
                .GetAllIncluding(x => x.APActor)
                .Where(x => x.Id == dto.ForestPlotId && x.APActor != null)
                .FirstOrDefaultAsync();

            if (forestPlotActorFromDb == null)
            {
                throw new BusinessException("Không tìm thấy chủ rừng của lô này.");
            }

            var contactReviewFromDb = await _unitOfWork.GetRepository<APActorReview>()
                .GetAll()
                .Where(
                    x =>
                        x.FK_ReviewUserID == _bysSession.UserId
                        && (x.APActorReviewDate.GetValueOrDefault().Date == Clock.Now.Date || x.FK_ICForestPlotID == dto.ForestPlotId))
                .ToArrayAsync();

            if (contactReviewFromDb.Any(x => x.FK_ICForestPlotID == dto.ForestPlotId))
            {
                throw new BusinessException("Bạn đã đánh giá lô rừng này rồi.");
            }

            if (contactReviewFromDb.Count(x => x.APActorReviewDate.GetValueOrDefault().Date == Clock.Now.Date) >= 5)
            {
                throw new BusinessException("Bạn đã đánh giá 5 lần trong ngày.");
            }

            if (Clock.Now < contactReviewFromDb.Max(x => x.APActorReviewDate).GetValueOrDefault().AddMinutes(30))
            {
                throw new BusinessException("Mỗi đánh giá trong ngày phải cách nhau 30 phút.");
            }

            var actorReviewToCreate = dto.ToAPActorReviewEntity(_bysSession);
            var actorReview = await _unitOfWork.GetRepository<APActorReview>().InsertAsync(actorReviewToCreate);

            forestPlotActorFromDb.ICForestPlotLatestReviewDate = actorReviewToCreate.APActorReviewDate;

            await _unitOfWork.CompleteAsync();

            await _notificationService.CreateNotificationAsync(
                new CreateNotificationDto
                {
                    UserId = _bysSession.UserId,
                    NotificationType = NotificationType.AddedActorEvaluation,
                    NotificationObjectType = "APActorReviews",
                    NotificationObjectId = actorReview.Id,
                    NotificationContent = _unitOfWork.GetRepository<ADUser>().Get(_bysSession.UserId)?.ADUserOrganizationName + " đã thêm đánh giá chủ rừng " + forestPlotActorFromDb.APActor?.APActorName
                });

            return await GetReviewAsync(actorReview.Id);
        }

        public async Task<ReviewItemDto> GetReviewAsync(int actorReviewId)
        {
            var actorReviewFromDb = await _unitOfWork.GetRepository<APActorReview>()
                .GetAllIncluding(x => x.APActor, x => x.ADUser)
                .FirstOrDefaultAsync(x => x.Id == actorReviewId);

            return actorReviewFromDb.ToReviewItemDto();
        }

        public async Task<IPagedResultDto<ReviewItemDto>> GetReviewsOfForestPlotAsync(PagingRequestDto pagingRequestDto, int forestPlotId)
        {
            var extraData = new ExtraDataReviewsDto
            {
                IsUserReview = await _unitOfWork.GetRepository<APActorReview>()
                    .GetAll()
                    .AnyAsync(x => x.FK_ReviewUserID == _bysSession.GetUserId() && x.FK_ICForestPlotID == forestPlotId)
            };

            return await _unitOfWork.GetRepository<APActorReview>()
                .GetAllIncluding(x => x.APActor, x => x.ADUser, x => x.ICForestPlot)
                .IncludesForToForestPlot(x => x.ICForestPlot)
                .Where(x => x.FK_ICForestPlotID == forestPlotId && x.APActorReviewIsHide == false)
                .OrderByDescending(x => x.APActorReviewDate)
                .GetPagedResultAsync(pagingRequestDto.Page, pagingRequestDto.PageSize, x => x.ToReviewItemDto(), extraData);
        }

        public async Task<IPagedResultDto<ReviewItemDto>> GetAdminReviewsOfForestPlotAsync(PagingRequestDto pagingRequestDto, int forestPlotId, int actorId)
        {
            return await _unitOfWork.GetRepository<APActorReview>()
                .GetAllIncluding(x => x.APActor, x => x.ADUser, x => x.ICForestPlot)
                .IncludesForToForestPlot(x => x.ICForestPlot)
                .Where(x => x.FK_ICForestPlotID == forestPlotId)
                .Where(x => x.FK_APActorID == actorId)
                .OrderByDescending(x => x.APActorReviewDate)
                .GetPagedResultAsync(pagingRequestDto.Page, pagingRequestDto.PageSize, x => x.ToReviewItemDto());
        }

        public async Task DeleteReviewAsync(int actorReviewId)
        {
            var actorReviewToDelete = await _unitOfWork.GetRepository<APActorReview>().GetAsync(actorReviewId);

            await _unitOfWork.GetRepository<APActorReview>().DeleteAsync(actorReviewToDelete);
            await _unitOfWork.CompleteAsync();
        }

        public async Task HideReviewAsync(int actorReviewId)
        {
            var actorReviewToHide = await _unitOfWork.GetRepository<APActorReview>().GetAsync(actorReviewId);
            actorReviewToHide.APActorReviewIsHide = true;

            await _unitOfWork.GetRepository<APActorReview>().UpdateAsync(actorReviewToHide);
            await _unitOfWork.CompleteAsync();
        }

        public async Task ShowReviewAsync(int actorReviewId)
        {
            var actorReviewToShow = await _unitOfWork.GetRepository<APActorReview>().GetAsync(actorReviewId);
            actorReviewToShow.APActorReviewIsHide = false;

            await _unitOfWork.GetRepository<APActorReview>().UpdateAsync(actorReviewToShow);
            await _unitOfWork.CompleteAsync();
        }
    }
}