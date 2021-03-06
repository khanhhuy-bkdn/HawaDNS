﻿using System;
using System.Linq;
using System.Threading.Tasks;

using _Abstractions.Services.IC;
using _Common.Exceptions;
using _Common.Extensions;
using _Common.Runtime.Session;
using _Common.Timing;
using _Constants.EntityTypes;
using _Dtos;
using _Dtos.IC;
using _Dtos.IC.InputDtos;
using _Dtos.Migration;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;
using _Entities;
using _Entities.AP;
using _Entities.AR;
using _Entities.IC;
using _EntityFrameworkCore.Helpers.Linq;
using _EntityFrameworkCore.UnitOfWork;
using _Services.ConvertHelpers;
using _Services.Internal;
using _Services.Internal.Helpers.PagedResult;

using EFCore.BulkExtensions;

using Microsoft.EntityFrameworkCore;

namespace _Services.Implementations.IC
{
    public class ForestPlotService : IForestPlotService
    {
        private readonly IUnitOfWork _unitOfWork;

        private readonly IBysSession _bysSession;

        private readonly INotificationService _notificationService;

        private IRepository<ICForestPlot> _forestPlotRepository => _unitOfWork.GetRepository<ICForestPlot>();

        public ForestPlotService(IUnitOfWork unitOfWork, IBysSession bysSession, INotificationService notificationService)
        {
            _unitOfWork = unitOfWork;
            _bysSession = bysSession;
            _notificationService = notificationService;
        }

        public async Task<IPagedResultDto<ForestPlotDetailDto>> FilterForestPlotDetailsAsync(PagingAndSortingRequestDto pagingAndSortingRequestDto, FilterForestPlotDetailDto filter)
        {
            var plot = await _unitOfWork.GetRepository<ICPlot>()
                .GetAll()
                .Include(x => x.ICTreeSpecGroup)
                .Include(x => x.ICTreeSpec)
                .Include(x => x.GECommune)
                .ThenInclude(x => x.GEDistrict)
                .ThenInclude(x => x.GEStateProvince)
                .FirstOrDefaultAsync(x => x.FK_GECommuneID == filter.CommuneID && x.FK_ICTreeSpecID == filter.TreeSpecID);

            var query = GetFilterForestPlotsQuery(filter);

            return await query.OrderBy(x => x.Id)
                .ApplySorting(pagingAndSortingRequestDto)
                .GetPagedResultAsync(pagingAndSortingRequestDto.Page, pagingAndSortingRequestDto.PageSize, x => x.ToForestPlotDetailDto(), plot.ToForestPlotDto());
        }

        public Task<IPagedResultDto<TreeSpecGroupDto>> FilterTreeSpecGroupsAsync(PagingAndSortingRequestDto pagingAndSortingRequestDto)
        {
            return _unitOfWork.GetRepository<ICTreeSpecGroup>()
                .GetAll()
                .GetPagedResultAsync(pagingAndSortingRequestDto.Page, pagingAndSortingRequestDto.PageSize, x => x.ToTreeSpecGroupDto());
        }

        public Task<IPagedResultDto<TreeSpecDto>> FilterTreeSpecsAsync(PagingAndSortingRequestDto pagingAndSortingRequestDto, int treeSpecGroupId)
        {
            return _unitOfWork.GetRepository<ICTreeSpec>()
                .GetAll()
                .Where(x => x.FK_ICTreeSpecGroupID == treeSpecGroupId)
                .GetPagedResultAsync(pagingAndSortingRequestDto.Page, pagingAndSortingRequestDto.PageSize, x => x.ToTreeSpecDto());
        }

        public async Task<IPagedResultDto<ForestPlotDto>> FilterForestPlotsAsync(PagingAndSortingRequestDto pagingAndSortingRequestDto, FilterForestPlotDto filter)
        {
            var treespecIdsByGroup = await _unitOfWork.GetRepository<ICTreeSpecGroupItem>()
                .GetAll()
                .Where(x => x.FK_ICTreeSpecGroupID == filter.TreeSpecGroupID)
                .Select(x => x.FK_ICTreeSpecID)
                .MakeQueryToDatabaseAsync();

            return await _unitOfWork.GetRepository<ICPlot>()
                .GetAll()
                .Include(x => x.ICTreeSpecGroup)
                .Include(x => x.ICTreeSpec)
                .Include(x => x.GECommune)
                .ThenInclude(x => x.GEDistrict)
                .ThenInclude(x => x.GEStateProvince)
                .WhereIf(filter.StateProvinceID > 0, x => x.GECommune.GEDistrict.FK_GEStateProvinceID == filter.StateProvinceID)
                .WhereIf(filter.DistrictID > 0, x => x.GECommune.FK_GEDistrictID == filter.DistrictID)
                .WhereIf(filter.CommuneID > 0, x => x.FK_GECommuneID == filter.CommuneID)
                .WhereIf(filter.TreeSpecID > 0, x => x.FK_ICTreeSpecID == filter.TreeSpecID)
                .WhereIf(filter.TreeSpecGroupID > 0, x => treespecIdsByGroup.Contains(x.FK_ICTreeSpecID.GetValueOrDefault()))
                .ApplySorting(pagingAndSortingRequestDto)
                .GetPagedResultAsync(pagingAndSortingRequestDto.Page, pagingAndSortingRequestDto.PageSize, x => x.ToForestPlotDto());
        }

        public async Task<int[]> ForestPlotPlantingYears(FilterForestPlotDetailDto filter)
        {
            return await _unitOfWork.GetRepository<ICForestPlot>()
                .GetAll()
                .Where(x => x.FK_GECommuneID == filter.CommuneID && x.FK_ICTreeSpecID == filter.TreeSpecID)
                .Select(x => x.ICForestPlotPlantingYear.GetValueOrDefault() == 0 ? 0 : (Clock.Now.Year - x.ICForestPlotPlantingYear.GetValueOrDefault()))
                .Distinct()
                .OrderBy(x => x)
                .ToArrayAsync();
        }

        public async Task UpdatePlotsAsync()
        {
            var plots = await _unitOfWork.GetRepository<ICPlot>().GetAll().ToArrayAsync();

            var forestPlots = await _unitOfWork.GetRepository<ICForestPlot>()
                .GetAll()
                .Where(x => !plots.Any(y => y.FK_ICTreeSpecID == x.FK_ICTreeSpecID && y.FK_GECommuneID == x.FK_GECommuneID))
                .GroupBy(
                    x => new
                    {
                        x.FK_GECommuneID,
                        x.ICTreeSpec.FK_ICTreeSpecGroupID
                    })
                .Select(
                    x => new
                    {
                        CommuneId = x.Select(y => y.FK_GECommuneID).FirstOrDefault(),
                        TreeSpecId = x.Select(y => y.FK_ICTreeSpecID).FirstOrDefault(),
                        Area = x.Sum(y => y.ICForestPlotArea),
                        VolumnPerPlot = x.Sum(y => y.ICForestPlotVolumnPerPlot)
                    })
                .ToArrayAsync();

            foreach (var forestPlot in forestPlots)
            {
                await _unitOfWork.GetRepository<ICPlot>()
                    .InsertAsync(
                        new ICPlot
                        {
                            FK_GECommuneID = forestPlot.CommuneId,
                            FK_ICTreeSpecID = forestPlot.TreeSpecId,
                            ICPlotArea = forestPlot.Area,
                            ICPlotVolumnPerPlot = forestPlot.VolumnPerPlot
                        });
            }

            await _unitOfWork.CompleteAsync();
        }

        public async Task<UpdateTreeSpecForestPlotReportDto> UpdateTreeSpecForestPlotsAsync()
        {
            var deleteforestPlots = await _unitOfWork.GetRepository<ICForestPlot>()
                .GetAll()
                .SearchByFields("+", x => x.ICTreeSpecCode)
                .MakeQueryToDatabaseAsync();

            var forestPlots = deleteforestPlots
                .GroupBy(
                    x => new
                    {
                        x.ICTreeSpecCode,
                        x.FK_GECommuneID,
                        x.FK_GESubCompartmentID,
                        x.GEPlotCode,
                        x.ICForestPlotArea,
                        x.ICForestPlotVolumnPerHa,
                        x.ICForestPlotVolumnPerPlot
                    })
                .Select(x => x.First())
                .ToArray();

            var newforestPlots = forestPlots.SelectMany(
                    x => x.ICTreeSpecCode.SplitBy("+")
                        .ConvertArray(
                            y =>
                            {
                                ICForestPlot forestPlot = new ICForestPlot();

                                x.CopyTo(forestPlot);
                                forestPlot.ICTreeSpecCode = y;

                                return forestPlot;
                            }))
                .ToArray();

            using (var transaction = _unitOfWork.Context.Database.BeginTransaction())
            {
                _unitOfWork.Context.BulkDelete(deleteforestPlots);

                _unitOfWork.Context.BulkInsert(newforestPlots);

                transaction.Commit();
            }

            //await _unitOfWork.GetRepository<ICForestPlot>().DeleteAsync(x => forestPlots.Any(y => y.Id == x.Id));

            //foreach (var forestPlot in forestPlots)
            //{
            //    await _unitOfWork.GetRepository<ICForestPlot>().DeleteAsync(forestPlot);
            //}

            //await _unitOfWork.GetRepository<ICForestPlot>().BulkInsertAsync(newforestPlots);

            //await _unitOfWork.CompleteAsync();

            return new UpdateTreeSpecForestPlotReportDto
            {
                ForestPlotCombineTreeSpecCodeCount = deleteforestPlots.Length,
                InsertedForestPlotCount = newforestPlots.Length,
            };
        }

        private IQueryable<ICForestPlot> GetFilterForestPlotsQuery(FilterForestPlotDetailDto filter)
        {
            return _unitOfWork.GetRepository<ICForestPlot>()
                .GetAll()
                .Include(x => x.GESubCompartment)
                .Include(x => x.GECompartment)
                .Include(x => x.GEStateProvince)
                .Include(x => x.GEDistrict)
                .Include(x => x.GECommunes)
                .Include(x => x.ICTreeSpec)
                .Include(x => x.GECompartment)
                .Include(x => x.GESubCompartment)
                .Include(x => x.ICForestCert)
                .Include(x => x.APActor)
                .ThenInclude(x => x.APActorType)
                .Include(x => x.GEDisICLandUseCerttrict)
                .SearchByFields(
                    filter.SearchTerm,
                    x => x.APActor.APActorName)
                .Where(x => x.FK_GECommuneID == filter.CommuneID && x.FK_ICTreeSpecID == filter.TreeSpecID)
                .WhereIf(filter.OldFrom.HasValue, x => (x.ICForestPlotPlantingYear.GetValueOrDefault() == 0 ? 0 : (Clock.Now.Year - x.ICForestPlotPlantingYear.GetValueOrDefault())) >= filter.OldFrom)
                .WhereIf(filter.OldTo.HasValue, x => (x.ICForestPlotPlantingYear.GetValueOrDefault() == 0 ? 0 : (Clock.Now.Year - x.ICForestPlotPlantingYear.GetValueOrDefault())) <= filter.OldTo)
                .WhereIf(!filter.Reliability.IsNullOrEmpty(), x => x.ICForestPlotReliability == filter.Reliability)
                .WhereIf(filter.ForestCertID.HasValue, x => x.FK_ICForestCertID == filter.ForestCertID);
        }

        public async Task<StatisticDto> StatisticAsync()
        {
            return new StatisticDto()
            {
                ActorCount = await _unitOfWork.GetRepository<APActor>().GetAll().CountAsync(),
                Area = await _unitOfWork.GetRepository<ICPlot>().GetAll().SumAsync(x => x.ICPlotArea.GetValueOrDefault()),
                Volume = await _unitOfWork.GetRepository<ICPlot>().GetAll().SumAsync(x => x.ICPlotVolumnPerPlot.GetValueOrDefault()),
                ReviewCount = await _unitOfWork.GetRepository<APActorReview>().GetAll().CountAsync() + await _unitOfWork.GetRepository<ARContactReview>().GetAll().CountAsync()
            };
        }

        public async Task<ForestPlotDetailDto> UpdateForestPlotsAsync(EditForestPlotDto dto)
        {
            //ValidateActorDto(dto);
            var forestPlotToUpdate = await _unitOfWork.GetRepository<ICForestPlot>().GetAsync(dto.Id);
            var actor = await _unitOfWork.GetRepository<APActor>().GetAsync(dto.FK_APActorID.Value);
            dto.APActorCode = actor.APActorCode;

            var treeSpecies = await _unitOfWork.GetRepository<ICTreeSpec>().GetAsync(dto.FK_ICTreeSpecID.Value);
            dto.ICTreeSpecCode = treeSpecies.ICTreeSpecCode;

            var landUseCert = await _unitOfWork.GetRepository<ICLandUseCert>().GetAsync(dto.FK_ICLandUseCertID.Value);
            dto.ICLandUseCertCode = landUseCert.ICLandUseCertCode;

            //var forestPlotHistory = await _unitOfWork.GetRepository<ICForestPlotHistory>()
            //    .GetAll()
            //    .WhereIf(forestPlotToUpdate.Id > 0, x => x.FK_ICForestPlotID == forestPlotToUpdate.Id)
            //    .WhereIf(forestPlotToUpdate.FK_APActorID > 0, x => x.FK_APActorID == forestPlotToUpdate.FK_APActorID)
            //    .WhereIf(forestPlotToUpdate.FK_ICForestCertID > 0, x => x.FK_ICForestCertID == forestPlotToUpdate.FK_ICForestCertID)
            //    .WhereIf(forestPlotToUpdate.FK_ICLandUseCertID > 0, x => x.FK_ICLandUseCertID == forestPlotToUpdate.FK_ICLandUseCertID)
            //    .WhereIf(forestPlotToUpdate.FK_ICTreeSpecID > 0, x => x.FK_ICTreeSpecID == forestPlotToUpdate.FK_ICTreeSpecID)
            //    .WhereIf(!forestPlotToUpdate.ICForestPlotReliability.IsNullOrEmpty(), x => x.ICForestPlotHistoryReliability == forestPlotToUpdate.ICForestPlotReliability)
            //    .WhereIf(forestPlotToUpdate.ICForestPlotPlantingDate.HasValue, x => x.ICForestPlotHistoryPlantingDate == forestPlotToUpdate.ICForestPlotPlantingDate)
            //    .WhereIf(!forestPlotToUpdate.ICConflictSitCode.IsNullOrEmpty(), x => x.ICConflictSitCode == forestPlotToUpdate.ICConflictSitCode).FirstOrDefaultAsync();

            if ((forestPlotToUpdate.APActorCode != dto.APActorCode)
                || (forestPlotToUpdate.FK_APActorID != dto.FK_APActorID)
                || (forestPlotToUpdate.FK_ICTreeSpecID != dto.FK_ICTreeSpecID) 
                || (forestPlotToUpdate.ICTreeSpecCode != dto.ICTreeSpecCode)
                || (forestPlotToUpdate.ICForestPlotPlantingDate.GetValueOrDefault().Date != Convert.ToDateTime(dto.ICForestPlotPlantingDate).Date) 
                || (forestPlotToUpdate.ICForestPlotReliability != dto.ICForestPlotReliability) 
                ||(forestPlotToUpdate.ICConflictSitCode != dto.ICConflictSitCode)
                ||(forestPlotToUpdate.FK_ICLandUseCertID != dto.FK_ICLandUseCertID) 
                ||(forestPlotToUpdate.FK_ICForestCertID != dto.FK_ICForestCertID)
                ||(forestPlotToUpdate.ICLandUseCertCode != dto.ICLandUseCertCode)
                ||(forestPlotToUpdate.ICForestPlotArea != dto.ICForestPlotArea)
                || (forestPlotToUpdate.ICForestPlotVolumnPerPlot != dto.ICForestPlotVolumnPerPlot)
            )
            {
                await CreateForestPlotHistoryAsync(forestPlotToUpdate);
            }

            UpdateForestPlotDto(forestPlotToUpdate, dto);

            await _forestPlotRepository.UpdateAsync(forestPlotToUpdate);

            await _unitOfWork.CompleteAsync();

            return await GetUserAsync(forestPlotToUpdate.Id);
        }

        private static void UpdateForestPlotDto(ICForestPlot entity, EditForestPlotDto dto)
        {
            if (entity == null)
                throw new EntityNotFoundException();

            entity.APActorCode = dto.APActorCode;
            entity.FK_APActorID = dto.FK_APActorID;
            entity.FK_ICTreeSpecID = dto.FK_ICTreeSpecID;
            entity.ICTreeSpecCode = dto.ICTreeSpecCode;
            entity.ICForestPlotPlantingDate = Convert.ToDateTime(dto.ICForestPlotPlantingDate);
            entity.ICForestPlotPlantingYear = entity.ICForestPlotPlantingDate.GetValueOrDefault().Year;
            entity.ICForestPlotReliability = dto.ICForestPlotReliability;
            entity.ICConflictSitCode = dto.ICConflictSitCode;
            entity.FK_ICLandUseCertID = dto.FK_ICLandUseCertID;
            entity.FK_ICForestCertID = dto.FK_ICForestCertID;
            entity.ICLandUseCertCode = dto.ICLandUseCertCode;
            entity.ICForestPlotArea = dto.ICForestPlotArea;
            entity.ICForestPlotVolumnPerPlot = dto.ICForestPlotVolumnPerPlot;
        }

        public async Task<ForestPlotDetailDto> GetUserAsync(int Id)
        {
            var forestPlotDetail = await _forestPlotRepository.GetAllIncluding(x => x.GEStateProvince, x => x.GEDistrict, x => x.GECommunes, x => x.ICTreeSpec, 
                x => x.GEDisICLandUseCerttrict, x => x.APActor, x => x.GESubCompartment, x => x.GECompartment, x => x.ICForestCert)
                .FirstOrDefaultAsync(x => x.Id == Id);

            return forestPlotDetail.ToForestPlotDetailDto();
        }

        public async Task CreateForestPlotHistoryAsync(ICForestPlot dto)
        {
            var forestPlotHistoryCreate = dto.ToForestPlotHistory(_bysSession);
            await _unitOfWork.GetRepository<ICForestPlotHistory>().InsertAsync(forestPlotHistoryCreate);

            await _unitOfWork.CompleteAsync();

            //return await GetForestPlotHistoryAsync(forestPlotHistory.Id);
        }

        public async Task<ForestPlotDetailHistoryDto> GetForestPlotHistoryAsync(int forestPlotHistoryId)
        {
            var forestPlotHistoryFromDb = await _unitOfWork.GetRepository<ICForestPlotHistory>()
                .GetAllIncluding(x => x.APActor, x => x.ADUser)
                .FirstOrDefaultAsync(x => x.Id == forestPlotHistoryId);

            return forestPlotHistoryFromDb.ToForestPlotHistoryDto();
        }

        public async Task<IPagedResultDto<ForestPlotDetailHistoryDto>> FilterForestPlotHistoryDetailsAsync(PagingAndSortingRequestDto pagingAndSortingRequestDto, FilterForestPlotHistoryDetailDto filter)
        {
            var query = GetFilterForestPlotHistorysQuery(filter);

            return await query.OrderBy(x => x.Id)
                .ApplySorting(pagingAndSortingRequestDto)
                .GetPagedResultAsync(pagingAndSortingRequestDto.Page, pagingAndSortingRequestDto.PageSize, x => x.ToForestPlotHistoryDto());
        }

        private IQueryable<ICForestPlotHistory> GetFilterForestPlotHistorysQuery(FilterForestPlotHistoryDetailDto filter)
        {
            return _unitOfWork.GetRepository<ICForestPlotHistory>()
                .GetAll()
                .Include(x => x.GESubCompartment)
                .Include(x => x.GECompartment)
                .Include(x => x.GEStateProvince)
                .Include(x => x.GEDistrict)
                .Include(x => x.GECommunes)
                .Include(x => x.ICTreeSpec)
                .Include(x => x.GECompartment)
                .Include(x => x.GESubCompartment)
                .Include(x => x.ICForestCert)
                .Include(x => x.APActor)
                .ThenInclude(x => x.APActorType)
                .Include(x => x.GEDisICLandUseCerttrict)
                .Include(x => x.ADUser)
                .Include(x => x.ICForestPlot)
                .Where(x => x.FK_ICForestPlotID == filter.ForestPlotID);
        }
    }
}