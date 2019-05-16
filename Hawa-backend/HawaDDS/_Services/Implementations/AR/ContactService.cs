using System.Linq;
using System.Threading.Tasks;

using _Abstractions.Services.AR;
using _Common.Exceptions;
using _Common.Extensions;
using _Common.Runtime.Session;
using _Constants.EntityStatuses;
using _Constants.EntityTypes;
using _Dtos.AR;
using _Dtos.AR.InputDtos;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;
using _Entities.AD;
using _Entities.AR;
using _Entities.GE;
using _Entities.IC;
using _EntityFrameworkCore.Helpers.Linq;
using _EntityFrameworkCore.UnitOfWork;
using _Services.ConvertHelpers;
using _Services.Implementations.AR.Helpers;
using _Services.Internal;
using _Services.Internal.Helpers.PagedResult;

using Microsoft.EntityFrameworkCore;

namespace _Services.Implementations.AR
{
    public class ContactService : IContactService
    {
        private readonly IBysSession _bysSession;
        private readonly IUnitOfWork _unitOfWork;
        private readonly INotificationService _notificationService;

        public ContactService(IUnitOfWork unitOfWork, IBysSession bysSession, INotificationService notificationService)
        {
            _unitOfWork = unitOfWork;
            _bysSession = bysSession;
            _notificationService = notificationService;
        }

        public async Task<ContactDto> CreateContactAsync(CreateContactDto dto)
        {
            if (!await ValidateLocationInCharges(dto.LocationInCharges))
                throw new BusinessException("Giá trị không hợp lệ.");

            var contactToCreate = dto.ToARContactEntity(_bysSession.GetUserId());
            var contact = await _unitOfWork.GetRepository<ARContact>().InsertAsync(contactToCreate);

            foreach (var locationInCharge in dto.LocationInCharges)
                await _unitOfWork.GetRepository<ARContactForestCommuneGroup>()
                    .InsertAsync(
                        new ARContactForestCommuneGroup
                        {
                            FK_ARContactID = contact.Id,
                            FK_GECommuneID = locationInCharge.ForestCommuneID,
                            FK_GEStateProvinceID = locationInCharge.ForestStateProvinceID,
                            FK_GEDistrictID = locationInCharge.ForestDistrictID
                        });

            await _unitOfWork.CompleteAsync();

            await _notificationService.CreateNotificationAsync(
                new CreateNotificationDto
                {
                    UserId = _bysSession.UserId,
                    NotificationType = NotificationType.AddedContact,
                    NotificationObjectType = "ARContacts",
                    NotificationObjectId = contact.Id,
                    NotificationContent = _unitOfWork.GetRepository<ADUser>().Get(_bysSession.UserId)?.ADUserOrganizationName + " đã đóng góp 1 liên hệ " + dto.ContactName
                });

            return await GetContactAsync(contact.Id);
        }

        public async Task<ContactDto> GetContactAsync(int contactId)
        {
            var contactFromDb = await _unitOfWork.GetRepository<ARContact>()
                .GetAllIncluding(
                    x => x.GEDistrict,
                    x => x.GECommune,
                    x => x.GEStateProvince,
                    x => x.ARContactType,
                    x => x.ARContactReviews,
                    x => x.ADCreatedUser)
                .Include(x => x.ARContactForestCommuneGroups)
                .ThenInclude(x => x.GECommune)
                .ThenInclude(x => x.GEDistrict)
                .ThenInclude(x => x.GEStateProvince)
                .FirstOrDefaultAsync(x => x.Id == contactId);

            return contactFromDb.ToContactDto();
        }

        public async Task<CommuneContactInfoDto> GetCommuneContactInfoAsync(PagingRequestDto pagingAndSortingRequestDto, int communeId)
        {
            var commune = await _unitOfWork.GetRepository<GECommune>()
                .GetAll()
                .Include(x => x.GEDistrict)
                .FirstOrDefaultAsync(x => x.Id == communeId);

            if(commune == null)
            {
                throw new BusinessException("Xã không tồn tại");
            }

            //Tìm những liên hệ phụ trách xã/huyện/tỉnh
            var contacts = await _unitOfWork.GetRepository<ARContact>()
                .GetAllIncluding(x => x.ARContactReviews, x => x.ARContactForestCommuneGroups, x => x.ADCreatedUser)
                .Where(x => x.ARContactForestCommuneGroups.Any(y => y.FK_GECommuneID == communeId || (y.FK_GECommuneID ==null && y.FK_GEDistrictID == commune.FK_GEDistrictID)|| (y.FK_GECommuneID == null && y.FK_GEDistrictID == null && y.FK_GEStateProvinceID == commune.GEDistrict.FK_GEStateProvinceID)) && x.ARContactStatus != ContactStatus.HuyBo)
                .MakeQueryToDatabaseAsync();

            var forestPlotFromDb = await _unitOfWork.GetRepository<ICForestPlot>()
                .GetAllIncluding(x => x.GEPeoplesCommittee)
                .Include(x => x.GEForestProtectionDepartment)
                .ThenInclude(x => x.GEStateProvince)
                .Include(x => x.GEForestProtectionDepartment)
                .ThenInclude(x => x.GEDistrict)
                .FirstOrDefaultAsync(x => x.FK_GECommuneID == communeId);

            return new CommuneContactInfoDto
            {
                Contacts = contacts.Select(x => x.ToShortContactDto())
                    .OrderByDescending(x => x.AverageRating)
                    .ToPagedResult(pagingAndSortingRequestDto.Page, pagingAndSortingRequestDto.PageSize, x => x),
                UBND = forestPlotFromDb?.GEPeoplesCommittee.ToDictionaryItemDto(),
                ForestProtectionDepartment = forestPlotFromDb?.GEForestProtectionDepartment.ToForestProtectionDepartmentDto()
            };
        }

        public async Task<IPagedResultDto<SummaryCommuneContactDto>> GetSummaryCommuneContactAsync(PagingRequestDto pagingAndSortingRequestDto, LocationFilterDto locationFilter)
        {
            return await _unitOfWork.GetRepository<GECommune>()
                .GetAllIncluding(x => x.GEDistrict, x => x.ARContactForestCommuneGroups)
                .Include(x => x.GEDistrict)
                .ThenInclude(x => x.ARContactForestCommuneGroups)
                .Include(x => x.GEDistrict)
                .ThenInclude(x => x.GEStateProvince)
                .ThenInclude(x => x.ARContactForestCommuneGroups)
                .Include(x => x.ARContactForestCommuneGroups)
                .ThenInclude(x => x.ARContact)
                .WhereIf(locationFilter.StateProvinceId > 0, x => x.GEDistrict.FK_GEStateProvinceID == locationFilter.StateProvinceId)
                .WhereIf(locationFilter.DistrictId > 0, x => x.FK_GEDistrictID == locationFilter.DistrictId)
                .WhereIf(locationFilter.CommuneId > 0, x => x.Id == locationFilter.CommuneId )
                .GetPagedResultAsync(
                    pagingAndSortingRequestDto.Page,
                    pagingAndSortingRequestDto.PageSize,
                    x => x.ToSummaryCommuneContactDto());
        }

        public async Task<IPagedResultDto<ShortContactDto>> GetContactsOfCommuneAsync(PagingRequestDto pagingAndSortingRequestDto, FilterContactsOfCommuneDto filter)
        {
            var commune = await _unitOfWork.GetRepository<GECommune>()
                .GetAll()
                .Include(x => x.GEDistrict)
                .FirstOrDefaultAsync(x => x.Id == filter.CommuneId);

            if (commune == null)
            {
                throw new BusinessException("Xã không tồn tại");
            }
            var statusCount = await _unitOfWork.GetRepository<ARContactForestCommuneGroup>()
                .GetAllIncluding(x => x.ARContact, x => x.GEDistrict, x => x.GECommune, x => x.GEStateProvince)
                .Where(x => x.FK_GECommuneID == filter.CommuneId || (x.FK_GECommuneID == null && x.FK_GEDistrictID == commune.FK_GEDistrictID) || (x.FK_GECommuneID == null && x.FK_GEDistrictID == null && x.FK_GEStateProvinceID == commune.GEDistrict.FK_GEStateProvinceID))
                .ToArrayAsync();

            ContactStatusCountDto extraData;
            if (statusCount.IsNullOrEmpty())
            {
                var communeFromDb = _unitOfWork.GetRepository<GECommune>()
                    .GetAll()
                    .Include(x => x.GEDistrict)
                    .ThenInclude(x => x.GEStateProvince)
                    .FirstOrDefault(x => x.Id == filter.CommuneId);

                extraData = new ContactStatusCountDto
                {
                    Total = 0,
                    ChuaDuyet = 0,
                    DaDuyet = 0,
                    HuyBo = 0,
                    DangXacMinh = 0,
                    StateProvince = communeFromDb.GEDistrict.GEStateProvince.ToDictionaryItemDto(),
                    District = communeFromDb.GEDistrict.ToDictionaryItemDto(),
                    Commune = communeFromDb.ToDictionaryItemDto()
                };
            }
            else
            {
                extraData = statusCount.ToContactStatusCountDto();
            }

            var contacts = await _unitOfWork.GetRepository<ARContact>()
                .GetAllIncluding(x => x.ARContactReviews, x => x.ARContactForestCommuneGroups, x => x.ADCreatedUser)
                .Where(x => x.ARContactForestCommuneGroups.Any(y => y.FK_GECommuneID == filter.CommuneId || (y.FK_GECommuneID == null && y.FK_GEDistrictID == commune.FK_GEDistrictID) || (y.FK_GECommuneID == null && y.FK_GEDistrictID == null && y.FK_GEStateProvinceID == commune.GEDistrict.FK_GEStateProvinceID)))
                .SearchByFields(filter.SearchTerm, x => x.ARContactContributor, x => x.ARContactEmail, x => x.ARContactName)
                .WhereIf(!filter.ContactStatus.IsNullOrEmpty(), x => x.ARContactStatus == filter.ContactStatus)
                .MakeQueryToDatabaseAsync();

            return contacts
                .Select(x => x.ToShortContactDto())
                .OrderByDescending(x => x.AverageRating)
                .ToPagedResult(pagingAndSortingRequestDto.Page, pagingAndSortingRequestDto.PageSize, extraData);
        }

        public async Task ChangeStatusAsync(ChangeContactStatusDto dto)
        {
            var contactFromDb = await _unitOfWork.GetRepository<ARContact>().GetAsync(dto.Id);

            ARContactHelpers.CheckContactStatusTransition(contactFromDb, dto.Status);

            contactFromDb.ARContactStatus = dto.Status;

            await _unitOfWork.GetRepository<ARContact>().UpdateAsync(contactFromDb);

            await _unitOfWork.CompleteAsync();

            await _notificationService.CreateNotificationAsync(
                new CreateNotificationDto
                {
                    UserId = _bysSession.UserId,
                    NotificationType = dto.Status == "DaDuyet"
                        ? NotificationType.ApprovedContact
                        : dto.Status == "HuyBo"
                            ? NotificationType.RejectedContact
                            : NotificationType.ChangeContactStatus,
                    NotificationObjectType = "ARContacts",
                    NotificationObjectId = dto.Id,
                    NotificationContent = dto.Status == "DaDuyet"
                        ? _unitOfWork.GetRepository<ADUser>().Get(_bysSession.UserId)?.ADUserOrganizationName + " Admin đã duyệt đóng góp liên hệ gián tiếp " + contactFromDb.ARContactName
                        : dto.Status == "HuyBo"
                            ? _unitOfWork.GetRepository<ADUser>().Get(_bysSession.UserId)?.ADUserOrganizationName + " Admin đã từ chối đóng góp liên hệ gián tiếp " + contactFromDb.ARContactName
                            : _unitOfWork.GetRepository<ADUser>().Get(_bysSession.UserId)?.ADUserOrganizationName + " Admin đã chuyển trạng thái liên hệ " + contactFromDb.ARContactName + " sang trạng thái " + dto.Status
                });
        }

        public async Task<ContactDto> UpdateContactAsync(EditContactDto dto)
        {
            if (!await ValidateLocationInCharges(dto.LocationInCharges))
                throw new BusinessException("Giá trị không hợp lệ.");

            var contactToUpdate = await _unitOfWork.GetRepository<ARContact>()
                .GetAllIncluding(x => x.ARContactForestCommuneGroups)
                .FirstOrDefaultAsync(x => x.Id == dto.Id);

            if (contactToUpdate == null)
                throw new BusinessException("Không tìm thấy liên hệ.");

            UpdateContactDto(contactToUpdate, dto);

            await _unitOfWork.GetRepository<ARContact>().UpdateAsync(contactToUpdate);

            foreach (var contactForestCommuneGroup in contactToUpdate.ARContactForestCommuneGroups)
                if (dto.LocationInCharges.All(x => x.ForestCommuneID != contactForestCommuneGroup.FK_GECommuneID))
                    await _unitOfWork.GetRepository<ARContactForestCommuneGroup>().DeleteAsync(contactForestCommuneGroup);

            foreach (var locationInCharge in dto.LocationInCharges)
                if (contactToUpdate.ARContactForestCommuneGroups.All(x => x.FK_GECommuneID != locationInCharge.ForestCommuneID))
                    await _unitOfWork.GetRepository<ARContactForestCommuneGroup>()
                        .InsertAsync(
                            new ARContactForestCommuneGroup
                            {
                                FK_ARContactID = dto.Id,
                                FK_GECommuneID = locationInCharge.ForestCommuneID,
                                FK_GEDistrictID = locationInCharge.ForestDistrictID,
                                FK_GEStateProvinceID = locationInCharge.ForestStateProvinceID
                            });

            await _unitOfWork.CompleteAsync();

            return await GetContactAsync(contactToUpdate.Id);
        }

        public async Task DeleteAsync(int contactId)
        {
            var contactToDelete = await _unitOfWork.GetRepository<ARContact>().GetAsync(contactId);

            await _unitOfWork.GetRepository<ARContact>().DeleteAsync(contactToDelete);
            await _unitOfWork.CompleteAsync();
        }

        public async Task MultiDeleteAsync(IdentitiesDto contactIds)
        {
            if (contactIds == null)
                return;

            foreach (int contactId in contactIds.Ids)
                await DeleteAsync(contactId);
        }

        public async Task<IPagedResultDto<ShortContactDto>> FilterForestContactsAsync(PagingAndSortingRequestDto pagingAndSortingRequestDto, FilterContactsDto filter)
        {
            GECommune commune = null;
            if(filter.ContactCommuneId > 0)
            {
                commune = await _unitOfWork.GetRepository<GECommune>()
                            .GetAll()
                            .Include(x => x.GEDistrict)
                            .FirstOrDefaultAsync(x => x.Id == filter.ContactCommuneId);
            }

            GEDistrict district = null;
            if (filter.ContactDistrictId > 0)
            {
                district = await _unitOfWork.GetRepository<GEDistrict>()
                            .GetAll()
                            .Include(x => x.GEStateProvince)
                            .FirstOrDefaultAsync(x => x.Id == filter.ContactDistrictId);
            }

            return await _unitOfWork.GetRepository<ARContact>()
                .GetAllIncluding(x => x.ARContactReviews)
                .SearchByFields(filter.SearchTerm, x => x.ARContactName, x => x.ARContactAcronymName, x => x.ARContactContributor, x => x.ARContactUserContact)
                .WhereIf(filter.ContactStateProvinceId > 0, x => x.ARContactForestCommuneGroups.Any(y => y.FK_GEStateProvinceID == filter.ContactStateProvinceId))
                .WhereIf(district != null, x => x.ARContactForestCommuneGroups.Any(y => y.FK_GEDistrictID == filter.ContactDistrictId || (y.FK_GEDistrictID == null && y.FK_GEStateProvinceID == district.FK_GEStateProvinceID)))
                .WhereIf(commune !=null , x => x.ARContactForestCommuneGroups.Any(y => y.FK_GECommuneID == filter.ContactCommuneId || (y.FK_GECommuneID == null && y.FK_GEDistrictID == commune.FK_GEDistrictID) || (y.FK_GECommuneID == null && y.FK_GEDistrictID == null && y.FK_GEStateProvinceID == commune.GEDistrict.FK_GEStateProvinceID)))
                .OrderByDescending(x => x.ARContactReviews.Max(y => y.ARContactReviewDate))

                //.WhereIf(locationFilter.Rating.HasValue, x => x.ARContactReviewRating == locationFilter.Rating)
                .ApplySorting(pagingAndSortingRequestDto)
                .GetPagedResultAsync(
                    pagingAndSortingRequestDto.Page,
                    pagingAndSortingRequestDto.PageSize,
                    x => x.ToShortContactDto());
        }

        private static void UpdateContactDto(ARContact entity, EditContactDto dto)
        {
            entity.ARContactContributor = dto.Contributor;
            entity.ARContactTitleContribute = dto.TitleContribute;
            entity.FK_ARContactTypeID = dto.ContactTypeID;
            entity.ARContactName = dto.ContactName;
            entity.ARContactAcronymName = dto.AcronymName;
            entity.ARContactUserContact = dto.UserContact;
            entity.ARContactPhone1 = dto.Phone1;
            entity.ARContactPhone2 = dto.Phone2;
            entity.ARContactEmail = dto.Email;
            entity.ARContactWebsite = dto.Website;
            entity.ARContactNote = dto.Note;
            entity.ARContactImage = dto.Images.JoinNotEmpty(";");
            entity.FK_GEStateProvinceID = dto.StateProvinceID;
            entity.FK_GEDistrictID = dto.DistrictID;
            entity.FK_GECommuneID = dto.CommuneID;
            entity.ARUserHouseNumber = dto.HouseNumber;
            entity.ARUserAddress = dto.Address;
        }

        private async Task<bool> ValidateLocationInCharges(LocationInChargeDto[] locations)
        {
            foreach (var location in locations)
            {
                if (location.ForestCommuneID > 0)
                {
                    var commune = await _unitOfWork.GetRepository<GECommune>()
                        .GetAll()
                        .FirstOrDefaultAsync(
                            x => x.Id == location.ForestCommuneID
                                 && x.FK_GEDistrictID == location.ForestDistrictID
                                 && x.GEDistrict.FK_GEStateProvinceID == location.ForestStateProvinceID);

                    if (commune == null)
                    {
                        return false;
                    }
                }
                else
                {
                    var commune = await _unitOfWork.GetRepository<GEDistrict>()
                        .GetAll()
                        .Where(
                            x => x.Id == location.ForestCommuneID
                                 && x.GECommunes.Count > 0
                                 && x.FK_GEStateProvinceID == location.ForestStateProvinceID)
                        .FirstOrDefaultAsync();

                    if (commune != null)
                    {
                        return false;
                    }
                }
            }

            return true;
        }
    }
}