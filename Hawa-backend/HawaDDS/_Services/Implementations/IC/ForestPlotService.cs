using System.Linq;
using System.Threading.Tasks;

using _Abstractions.Services.IC;
using _Common.Extensions;
using _Common.Timing;
using _Dtos.IC;
using _Dtos.IC.InputDtos;
using _Dtos.Migration;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;
using _Entities;
using _Entities.IC;
using _EntityFrameworkCore.Helpers.Linq;
using _EntityFrameworkCore.UnitOfWork;
using _Services.ConvertHelpers;
using _Services.Internal.Helpers.PagedResult;

using EFCore.BulkExtensions;

using Microsoft.EntityFrameworkCore;

namespace _Services.Implementations.IC
{
    public class ForestPlotService : IForestPlotService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ForestPlotService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
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
    }
}