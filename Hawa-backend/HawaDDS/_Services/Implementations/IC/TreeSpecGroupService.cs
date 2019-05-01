using System.Linq;
using System.Threading.Tasks;

using _Abstractions.Services.IC;
using _Common.Exceptions;
using _Common.Extensions;
using _Dtos.IC;
using _Dtos.IC.InputDtos;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;
using _Entities.IC;
using _EntityFrameworkCore.Helpers.Linq;
using _EntityFrameworkCore.UnitOfWork;
using _Services.ConvertHelpers;
using _Services.Internal.Helpers.PagedResult;

using Microsoft.EntityFrameworkCore;

namespace _Services.Implementations.IC
{
    public class TreeSpecGroupService : ITreeSpecGroupService
    {
        private readonly IUnitOfWork _unitOfWork;

        public TreeSpecGroupService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<TreeSpecGroupDto> CreateTreeSpecGroupAsync(CreateTreeSpecGroupDto dto)
        {
            CheckDuplicateTreeGroupName(dto.Name);

            var treeSpecGroup = await _unitOfWork.GetRepository<ICTreeSpecGroup>()
                .InsertAsync(
                    new ICTreeSpecGroup
                    {
                        ICTreeSpecGroupDesc = dto.Desc,
                        ICTreeSpecGroupName = dto.Name
                    });

            foreach (var treeSpecId in dto.TreeSpecIds)
            {
                await _unitOfWork.GetRepository<ICTreeSpecGroupItem>()
                    .InsertAsync(
                        new ICTreeSpecGroupItem
                        {
                            FK_ICTreeSpecGroupID = treeSpecGroup.Id,
                            FK_ICTreeSpecID = treeSpecId
                        });
            }

            await _unitOfWork.CompleteAsync();

            return await GetTreeSpecGroupAsync(treeSpecGroup.Id);
        }

        public async Task DeleteTreeSpecGroupAsync(int treeSpecGroupId)
        {
            var treeSpecGroup = await _unitOfWork.GetRepository<ICTreeSpecGroup>().GetAsync(treeSpecGroupId);
            await _unitOfWork.GetRepository<ICTreeSpecGroup>().DeleteAsync(treeSpecGroup);
            await _unitOfWork.CompleteAsync();
        }

        public async Task<TreeSpecGroupDto> EditTreeSpecGroupAsync(EditTreeSpecGroupDto dto)
        {
            CheckDuplicateTreeGroupName(dto.Name, dto.Id);

            var treeSpecGroup = await _unitOfWork.GetRepository<ICTreeSpecGroup>()
                .GetAllIncluding(x => x.ICTreeSpecGroupItems)
                .FirstOrDefaultAsync(x => x.Id == dto.Id);

            if (treeSpecGroup == null)
            {
                throw new BusinessException("Không tìm thấy nhóm loài cây.");
            }

            treeSpecGroup.ICTreeSpecGroupName = dto.Name;
            treeSpecGroup.ICTreeSpecGroupDesc = dto.Desc;

            await _unitOfWork.GetRepository<ICTreeSpecGroup>().UpdateAsync(treeSpecGroup);

            foreach (var treeSpecGroupItem in treeSpecGroup.ICTreeSpecGroupItems)
            {
                if (!dto.TreeSpecIds.Contains(treeSpecGroupItem.FK_ICTreeSpecID))
                {
                    await _unitOfWork.GetRepository<ICTreeSpecGroupItem>().DeleteAsync(treeSpecGroupItem);
                }
            }

            foreach (var treeSpecId in dto.TreeSpecIds)
            {
                if (treeSpecGroup.ICTreeSpecGroupItems.All(x => x.FK_ICTreeSpecID != treeSpecId))
                {
                    await _unitOfWork.GetRepository<ICTreeSpecGroupItem>()
                        .InsertAsync(
                            new ICTreeSpecGroupItem
                            {
                                FK_ICTreeSpecID = treeSpecId,
                                FK_ICTreeSpecGroupID = dto.Id
                            });
                }
            }

            await _unitOfWork.CompleteAsync();

            return await GetTreeSpecGroupAsync(dto.Id);
        }

        public async Task<TreeSpecGroupDto> GetTreeSpecGroupAsync(int treeSpecGroupId)
        {
            var treeSpecGroup = await _unitOfWork.GetRepository<ICTreeSpecGroup>()
                .GetAllIncluding(x => x.ICTreeSpecGroupItems)
                .Include(x => x.ICTreeSpecGroupItems)
                .ThenInclude(x => x.ICTreeSpec)
                .FirstOrDefaultAsync(x => x.Id == treeSpecGroupId);

            return treeSpecGroup.ToTreeSpecGroupDto();
        }

        public async Task<TreeSpecGroupDto[]> GetAll(string searchTerm)
        {
            var treeSpecGroups = await _unitOfWork.GetRepository<ICTreeSpecGroup>()
                .GetAllIncluding(x => x.ICTreeSpecGroupItems)
                .Include(x => x.ICTreeSpecGroupItems)
                .ThenInclude(x => x.ICTreeSpec)
                .SearchByFields(searchTerm, x => x.ICTreeSpecGroupName, x => x.ICTreeSpecGroupDesc)
                .OrderBy(x => x.ICTreeSpecGroupName)
                .MakeQueryToDatabaseAsync();

            return treeSpecGroups.ConvertArray(x => x.ToTreeSpecGroupDto());
        }

        public async Task<IPagedResultDto<TreeSpecGroupDto>> FilterTreeSpecGroupsAsync(PagingAndSortingRequestDto pagingAndSorting, string searchTerm)
        {
            return await _unitOfWork.GetRepository<ICTreeSpecGroup>()
                .GetAllIncluding(x => x.ICTreeSpecGroupItems)
                .Include(x => x.ICTreeSpecGroupItems)
                .ThenInclude(x => x.ICTreeSpec)
                .SearchByFields(searchTerm, x => x.ICTreeSpecGroupName, x => x.ICTreeSpecGroupDesc)
                .OrderBy(x => x.ICTreeSpecGroupName)
                .GetPagedResultAsync(pagingAndSorting.Page, pagingAndSorting.PageSize, x => x.ToTreeSpecGroupDto());
        }

        private void CheckDuplicateTreeGroupName(string name, int excludeId = 0)
        {
            var existTreeGroup = _unitOfWork.GetRepository<ICTreeSpecGroup>().GetFirstOrDefault(x => x.ICTreeSpecGroupName == name);

            if (existTreeGroup != null && existTreeGroup.Id != excludeId)
            {
                throw new InvalidArgumentException("Tên nhóm loài cây đã tồn tại trong hệ thống");
            }
        }
    }
}