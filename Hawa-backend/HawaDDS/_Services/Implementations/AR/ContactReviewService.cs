using System.Linq;
using System.Threading.Tasks;

using _Abstractions.Services.AR;
using _Common.Exceptions;
using _Common.Runtime.Session;
using _Common.Timing;
using _Dtos;
using _Dtos.AR;
using _Dtos.AR.InputDtos;
using _Dtos.AR.Inputs;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;
using _Entities.AR;
using _EntityFrameworkCore.Helpers.Linq;
using _EntityFrameworkCore.UnitOfWork;
using _Services.ConvertHelpers;
using _Services.Internal.Helpers.PagedResult;

using Microsoft.EntityFrameworkCore;

namespace _Services.Implementations.AR
{
    public class ContactReviewService : IContactReviewService
    {
        private readonly IBysSession _bysSession;
        private readonly IUnitOfWork _unitOfWork;

        public ContactReviewService(IUnitOfWork unitOfWork, IBysSession bysSession)
        {
            _unitOfWork = unitOfWork;
            _bysSession = bysSession;
        }

        public async Task<ReviewItemDto> ReviewAsync(ReviewContactDto dto)
        {
            var contactReviewFromDb = await _unitOfWork.GetRepository<ARContactReview>()
                .GetAll()
                .Where(
                    x =>
                        x.FK_ReviewUserID == _bysSession.UserId
                        && (x.ARContactReviewDate.GetValueOrDefault().Date == Clock.Now.Date || x.FK_ARContactID == dto.ContactId))
                .ToArrayAsync();

            if (contactReviewFromDb.Any(x => x.FK_ARContactID == dto.ContactId))
            {
                throw new BusinessException("Bạn đã đánh giá liên hệ này rồi.");
            }

            if (contactReviewFromDb.Count(x => x.ARContactReviewDate.GetValueOrDefault().Date == Clock.Now.Date) >= 5)
            {
                throw new BusinessException("Bạn đã đánh giá 5 lần trong ngày.");
            }

            if (Clock.Now < contactReviewFromDb.Max(x => x.ARContactReviewDate).GetValueOrDefault().AddMinutes(30))
            {
                throw new BusinessException("Mỗi đánh giá trong ngày phải cách nhau 30 phút.");
            }

            var contactFromDb = await _unitOfWork.GetRepository<ARContact>().GetAll().FirstOrDefaultAsync(x => x.Id == dto.ContactId && x.FK_CreatedUserID == _bysSession.GetUserId());

            if (contactFromDb != null)
            {
                throw new BusinessException("Bạn không thể đánh giá liên hệ do chính mình đóng góp thông tin.");
            }

            var contactReviewToCreate = dto.ToARContactReviewEntity(_bysSession);

            var contactReview = await _unitOfWork.GetRepository<ARContactReview>().InsertAsync(contactReviewToCreate);

            await _unitOfWork.CompleteAsync();

            await UpdateContactEvalution(dto.ContactId);

            return await GetContactReviewAsync(contactReview.Id);
        }

        public async Task<ReviewItemDto> GetContactReviewAsync(int contactReviewId)
        {
            var contactReviewFromDb = await _unitOfWork.GetRepository<ARContactReview>()
                .GetAllIncluding(x => x.ADUser, x => x.ARContact)
                .FirstOrDefaultAsync(x => x.Id == contactReviewId);

            return contactReviewFromDb.ToContactReviewDto();
        }

        public async Task<IPagedResultDto<ReviewItemDto>> GetReviewsOfContactAsync(PagingRequestDto pagingRequestDto, int contactId)
        {
            var extraData = new ExtraDataReviewsDto
            {
                ReviewCount = await _unitOfWork.GetRepository<ARContactReview>()
                    .GetAll()
                    .Where(x => x.FK_ARContactID == contactId)
                    .CountAsync(),
                IsUserReview = await _unitOfWork.GetRepository<ARContactReview>()
                    .GetAll()
                    .AnyAsync(x => x.FK_ReviewUserID == _bysSession.GetUserId() && x.FK_ARContactID == contactId)
            };

            return await _unitOfWork.GetRepository<ARContactReview>()
                .GetAllIncluding(x => x.ADUser, x => x.ARContact)
                .Where(x => x.FK_ARContactID == contactId)
                .Where(x => !x.ARContactReviewIsHide.GetValueOrDefault())
                .OrderByDescending(x => x.ARContactReviewDate)
                .GetPagedResultAsync(pagingRequestDto.Page, pagingRequestDto.PageSize, x => x.ToContactReviewDto(), extraData);
        }

        public async Task<IPagedResultDto<ReviewItemDto>> GetAdminReviewsOfContactAsync(PagingRequestDto pagingRequestDto, int contactId)
        {
            return await _unitOfWork.GetRepository<ARContactReview>()
                .GetAllIncluding(x => x.ADUser, x => x.ARContact)
                .Where(x => x.FK_ARContactID == contactId)
                .OrderByDescending(x => x.ARContactReviewDate)
                .GetPagedResultAsync(pagingRequestDto.Page, pagingRequestDto.PageSize, x => x.ToContactReviewDto());
        }

        public async Task<IPagedResultDto<ReviewItemDto>> GetContactReviewsAsync(PagingRequestDto pagingRequestDto, FilterContactReviewsDto filter)
        {
            return await _unitOfWork.GetRepository<ARContactReview>()
                .GetAllIncluding(x => x.ADUser, x => x.ARContact)
                .SearchByFields(
                    filter.SearchTerm,
                    x => x.ARContact.ARContactName
                )
                .WhereIf(filter.ContactStateProvinceId > 0, x => x.ARContact.FK_GEStateProvinceID == filter.ContactStateProvinceId)
                .WhereIf(filter.ContactDistrictId > 0, x => x.ARContact.FK_GEDistrictID == filter.ContactDistrictId)
                .WhereIf(filter.ContactCommuneId > 0, x => x.ARContact.FK_GECommuneID == filter.ContactCommuneId)
                .WhereIf(filter.Rating.HasValue, x => x.ARContactReviewRating == filter.Rating)
                .OrderByDescending(x => x.ARContactReviewDate)
                .GetPagedResultAsync(pagingRequestDto.Page, pagingRequestDto.PageSize, x => x.ToContactReviewDto());
        }

        public async Task DeleteContactReviewAsync(int contactReviewId)
        {
            var contactReviewToDelete = await _unitOfWork.GetRepository<ARContactReview>().GetAsync(contactReviewId);

            await _unitOfWork.GetRepository<ARContactReview>().DeleteAsync(contactReviewToDelete);
            await _unitOfWork.CompleteAsync();

            await UpdateContactEvalution(contactReviewToDelete.FK_ARContactID.GetValueOrDefault());
        }

        public async Task HideContactReviewAsync(int contactReviewId)
        {
            var contactReviewToHide = await _unitOfWork.GetRepository<ARContactReview>().GetAsync(contactReviewId);
            contactReviewToHide.ARContactReviewIsHide = true;

            await _unitOfWork.GetRepository<ARContactReview>().UpdateAsync(contactReviewToHide);
            await _unitOfWork.CompleteAsync();
        }

        public async Task ShowContactReviewAsync(int contactReviewId)
        {
            var contactReviewToShow = await _unitOfWork.GetRepository<ARContactReview>().GetAsync(contactReviewId);
            contactReviewToShow.ARContactReviewIsHide = false;

            await _unitOfWork.GetRepository<ARContactReview>().UpdateAsync(contactReviewToShow);
            await _unitOfWork.CompleteAsync();
        }

        private async Task UpdateContactEvalution(int contactId)
        {
            var contactFromDb = await _unitOfWork.GetRepository<ARContact>().GetAsync(contactId);

            var contactReviews = await _unitOfWork.GetRepository<ARContactReview>().GetAll().Where(x => x.FK_ARContactID == contactId).ToArrayAsync();

            contactFromDb.ARContactEvalution = contactReviews.ToAverageRating();

            await _unitOfWork.CompleteAsync();
        }
    }
}