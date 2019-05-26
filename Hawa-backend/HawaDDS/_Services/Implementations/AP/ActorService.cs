using System.Linq;
using System.Threading.Tasks;

using _Abstractions.Services.AP;
using _Common.Exceptions;
using _Common.Extensions;
using _Dtos.AP;
using _Dtos.AP.InputDtos;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;
using _Entities.AP;
using _Entities.IC;
using _EntityFrameworkCore.Helpers;
using _EntityFrameworkCore.Helpers.Linq;
using _EntityFrameworkCore.UnitOfWork;
using _Services.ConvertHelpers;
using _Services.Internal.Helpers.PagedResult;

using Microsoft.EntityFrameworkCore;

namespace _Services.Implementations.AP
{
    public class ActorService : IActorService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ActorService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ActorDto> GetActorAsync(int actorId)
        {
            var actorFromDb = await _unitOfWork.GetRepository<APActor>()
                .GetAllIncluding(x => x.GECommune, x => x.GEStateProvince, x => x.GEDistrict, x => x.APActorType)
                .Include(x => x.APActorRoles)
                .ThenInclude(x => x.APRole)
                .FirstOrDefaultAsync(x => x.Id == actorId);

            var actorReviews = await _unitOfWork.GetRepository<APActorReview>()
                .GetAll()
                .Where(x => x.FK_APActorID == actorId)
                .ToArrayAsync();

            return actorFromDb.ToActorDto(actorReviews);
        }

        public async Task<ActorDto> CreateActorAsync(CreateActorDto dto)
        {
            var actorToCreate = dto.ToAPActorEntity();

            var actor = await _unitOfWork.GetRepository<APActor>().InsertAsync(actorToCreate);
            if (!dto.ActorRoles.IsNullOrEmpty())
            {
                var actorRoles = dto.ActorRoles.ConvertArray(
                    x => new APActorRole
                    {
                        FK_APActorID = actor.Id,
                        FK_APRoleID = x
                    });

                await _unitOfWork.GetRepository<APActorRole>().BulkInsertAsync(actorRoles);
            }

            await _unitOfWork.CompleteAsync();

            return await GetActorAsync(actor.Id);
        }

        public async Task<ActorDto> UpdateActorAsync(EditActorDto dto)
        {
            ValidateActorDto(dto);
            var actorToUpdate = await _unitOfWork.GetRepository<APActor>().GetAsync(dto.Id);
            UpdateActorDto(actorToUpdate, dto);

            var actorRolesFromDb = await _unitOfWork.GetRepository<APActorRole>()
                .GetAll()
                .Where(x => x.FK_APActorID == dto.Id)
                .ToArrayAsync();

            foreach (var actorRole in actorRolesFromDb)
                if (dto.ActorRoles.All(x => x != actorRole.FK_APRoleID))
                    await _unitOfWork.GetRepository<APActorRole>().DeleteAsync(actorRole);

            foreach (int item in dto.ActorRoles)
                if (actorRolesFromDb.All(x => x.FK_APRoleID != item))
                    await _unitOfWork.GetRepository<APActorRole>()
                        .InsertAsync(
                            new APActorRole
                            {
                                FK_APRoleID = item,
                                FK_APActorID = dto.Id
                            });

            await _unitOfWork.CompleteAsync();
            return await GetActorAsync(actorToUpdate.Id);
        }

        public async Task<IPagedResultDto<ActorDto>> FilterActorsAsync(PagingAndSortingRequestDto pagingAndSortingRequestDto, FilterActorDto filter)
        {
            var query = GetFilterActorsQuery(filter);

            return await query
                .ApplySorting(pagingAndSortingRequestDto)
                .GetPagedResultAsync(pagingAndSortingRequestDto.Page, pagingAndSortingRequestDto.PageSize, x => x.ToActorDto());
        }

        public async Task DeleteActorAsync(int actorId)
        {
            var actorToDelete = await _unitOfWork.GetRepository<APActor>().GetAsync(actorId);
            var actorRolesFromDb = await _unitOfWork.GetRepository<APActorRole>()
                .GetAll()
                .Where(x => x.FK_APActorID == actorId)
                .ToArrayAsync();

            foreach (var actorRole in actorRolesFromDb)
                await _unitOfWork.GetRepository<APActorRole>().DeleteAsync(actorRole);

            await _unitOfWork.GetRepository<APActor>().DeleteAsync(actorToDelete);
            await _unitOfWork.CompleteAsync();
        }

        public async Task DeleteActorsAsync(IdentitiesDto dto)
        {
            if (dto == null)
                return;

            foreach (int i in dto.Ids)
                await DeleteActorAsync(i);
        }

        public async Task<ActorDto> GetForestPlotActorAsync(int forestPlotId)
        {
            var forestPlot = await _unitOfWork.GetRepository<ICForestPlot>()
                .GetAllIncluding(
                    x =>
                        x.APActorReviews,
                    x => x.GECommunes,
                    x => x.GEDistrict,
                    x => x.GEStateProvince,
                    x => x.GESubCompartment,
                    x => x.GECompartment)
                .IncludesForToActor(x => x.APActor)
                .Include(x => x.APActor.APActorRoles)
                .ThenInclude(x => x.APRole)
                .Where(x => x.APActor != null)
                .FirstOrDefaultAsync(x => x.Id == forestPlotId);

            return forestPlot.ToActorDto();
        }

        public async Task<IPagedResultDto<ShortActorDto>> FilterForestPlotActorsAsync(PagingAndSortingRequestDto pagingAndSortingRequestDto, FilterActorDto filterDto)
        {
            var forestPlotIds = await _unitOfWork.GetRepository<ICForestPlot>()
                .GetAll()
                .SearchByFields(filterDto.SearchTerm, x => x.APActor.APActorName)
                .Where(x => x.APActor != null)
                .WhereIf(filterDto.StateProvinceID > 0, x => x.FK_GEStateProvinceID == filterDto.StateProvinceID)
                .WhereIf(filterDto.DistrictID > 0, x => x.FK_GEDistrictID == filterDto.DistrictID)
                .WhereIf(filterDto.CommuneID > 0, x => x.FK_GECommuneID == filterDto.CommuneID)
                .WhereIf(filterDto.SubCompartmentId > 0, x => x.FK_GESubCompartmentID == filterDto.SubCompartmentId)
                .WhereIf(filterDto.CompartmentId > 0, x => x.FK_GECompartmentID == filterDto.CompartmentId)
                .WhereIf(!filterDto.PlotCode.IsNullOrEmpty(), x => x.GEPlotCode == filterDto.PlotCode)
                .OrderByDescending(x => x.ICForestPlotLatestReviewDate)
                .Select(x => x.Id)
                .GetPagedResultAsync(pagingAndSortingRequestDto.Page, pagingAndSortingRequestDto.PageSize);

            var forestPlots = await _unitOfWork.GetRepository<ICForestPlot>()
                .GetAllIncluding(
                    x => x.APActorReviews,
                    x => x.GECommunes,
                    x => x.GEDistrict,
                    x => x.GEStateProvince,
                    x => x.GESubCompartment,
                    x => x.GECompartment,
                    x => x.APActor,
                    x => x.APActor.APActorType)
                .Where(x => forestPlotIds.Items.Contains(x.Id))
                .OrderByDescending(x => x.ICForestPlotLatestReviewDate)
                .Select(x => x.ToShortActorDto())
                .ToArrayAsync();

            return new PagedResultDto<ShortActorDto>
            {
                PageSize = forestPlotIds.PageSize,
                Items = forestPlots,
                PageIndex = forestPlotIds.PageIndex,
                TotalCount = forestPlotIds.TotalCount,
                TotalPages = forestPlotIds.TotalPages
            };
        }

        private static void UpdateActorDto(APActor entity, EditActorDto dto)
        {
            if (entity == null)
                throw new EntityNotFoundException();

            entity.APActorAcronymName = dto.AcronymName;
            entity.APActorAddress = dto.Address;
            entity.APActorFax = dto.Fax;
            entity.APActorHouseNumber = dto.HouseNumber;
            entity.APActorIdentityCard = dto.IdentityCard;
            entity.APActorName = dto.Name;
            entity.APActorPhone = dto.Phone;
            entity.APActorTaxNumber = dto.TaxNumber;
            entity.FK_GECommuneID = dto.CommuneID;
            entity.GECommuneCode = dto.CommuneCode;
            entity.GEDistrictCode = dto.DistrictCode;
            entity.GEStateProvinceCode = dto.StateProvinceCode;
            entity.FK_GEDistrictID = dto.DistrictID;
            entity.FK_GEStateProvinceID = dto.StateProvinceID;
            entity.APActorRepresentative = dto.Representative;
            entity.APActorWebsite = dto.Website;
            entity.APActorEmail = dto.Email;
            entity.APActorAvatar = dto.Avartar;
            entity.APActorCode = dto.ActorTypeCode;
            entity.FK_APActorTypeID = dto.ActorTypeID;
            entity.APActorContactName = dto.ContactName;
            entity.APActorContactPhone = dto.ContactPhone;
            entity.APActorNote = dto.Note;
        }

        private IQueryable<APActor> GetFilterActorsQuery(FilterActorDto filter)
        {
            return _unitOfWork.GetRepository<APActor>()
                .GetAllIncluding(x => x.GEStateProvince, x => x.GEDistrict, x => x.GECommune)
                .Include(x => x.APActorRoles)
                .ThenInclude(x => x.APRole)
                .SearchByFields(
                    filter.SearchTerm,
                    x => x.APActorIdentityCard,
                    x => x.APActorName,
                    x => x.APActorAcronymName,
                    x => x.APActorEmail,
                    x => x.APActorPhone)
                .WhereIf(filter.ActorRoleId.HasValue, x => x.APActorRoles.Any(y => y.FK_APRoleID == filter.ActorRoleId))
                .WhereIf(filter.Status.IsNullOrWhiteSpace(), x => x.APActorStatus == filter.Status)
                .WhereIf(filter.StateProvinceID.HasValue, x => x.FK_GEStateProvinceID == filter.StateProvinceID)
                .WhereIf(filter.DistrictID.HasValue, x => x.FK_GEDistrictID == filter.DistrictID)
                .WhereIf(filter.CommuneID.HasValue, x => x.FK_GECommuneID == filter.CommuneID);
        }

        private void ValidateActorDto(EditActorDto dto)
        {
            if (dto.Name.IsNullOrEmpty())
            {
                throw new BusinessException("Tên chủ rừng không được để trống.");
            }

            if (dto.Phone.IsNullOrEmpty())
            {
                throw new BusinessException("Số điện thoại chủ rừng không được để trống.");
            }

            if (!dto.Phone.IsNumber())
            {
                throw new BusinessException("Số điện thoại không đúng định dạng.");
            }
        }

        public ActorDto[] GetAll(string searchTerm)
        {
            return _unitOfWork.GetRepository<APActor>()
                .GetAll().Take(500)
                .Include(x => x.APActorRoles)
                .ThenInclude(x => x.APRole)
                .Include(x => x.APActorType)
                .SearchByFields(searchTerm, x => x.APActorName)
                .OrderBy(x => x.Id)
                .ConvertArray(x => x.ToActorDto());
        }
    }
}