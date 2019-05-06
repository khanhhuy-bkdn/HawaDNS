using System.Threading.Tasks;

using _Abstractions.Services.IC;
using _Dtos.IC;
using _Dtos.IC.InputDtos;
using _Dtos.Shared.Inputs;
using _Infrastructure.ApiControllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Swashbuckle.AspNetCore.Annotations;

namespace HawaDDS.Controllers
{
    public class TreeSpecGroupController : ApiControllerBase
    {
        private readonly ITreeSpecGroupService _treeSpecGroupService;

        public TreeSpecGroupController(ITreeSpecGroupService treeSpecGroupService)
        {
            _treeSpecGroupService = treeSpecGroupService;
        }

        /// <summary>
        /// Tạo nhóm loài cây
        /// </summary>
        [HttpPost("treespecgroups/create")]
        [SwaggerResponse(200, "", typeof(TreeSpecGroupDto))]
        public async Task<IActionResult> CreateTreeSpecGroupAsync([FromBody] CreateTreeSpecGroupDto dto)
        {
            var result = await _treeSpecGroupService.CreateTreeSpecGroupAsync(dto);

            return Success(result);
        }

        /// <summary>
        /// Sửa nhóm loài cây
        /// </summary>
        [HttpPost("treespecgroups/edit")]
        [SwaggerResponse(200, "", typeof(TreeSpecGroupDto))]
        public async Task<IActionResult> EditTreeSpecGroupAsync([FromBody] EditTreeSpecGroupDto dto)
        {
            var result = await _treeSpecGroupService.EditTreeSpecGroupAsync(dto);

            return Success(result);
        }

        /// <summary>
        /// Xóa nhóm loài cây
        /// </summary>
        [HttpPost("treespecgroups/{treeSpecGroupId}/delete")]
        [SwaggerResponse(200)]
        public async Task<IActionResult> DeleteTreeSpecGroupAsync([FromRoute] int treeSpecGroupId)
        {
            await _treeSpecGroupService.DeleteTreeSpecGroupAsync(treeSpecGroupId);

            return Success();
        }

        /// <summary>
        /// Chi tiết nhóm loài cây
        /// </summary>
        [HttpGet("treespecgroups/{treeSpecGroupId}")]
        [SwaggerResponse(200, "", typeof(TreeSpecGroupDto))]
        public async Task<IActionResult> GetTreeSpecGroupAsync([FromRoute] int treeSpecGroupId)
        {
            var result = await _treeSpecGroupService.GetTreeSpecGroupAsync(treeSpecGroupId);

            return Success(result);
        }

        /// <summary>
        /// Danh sách nhóm loài cây
        /// </summary>
        [HttpGet("treespecgroups/filter")]
        [AllowAnonymous]
        [SwaggerResponse(200, "", typeof(TreeSpecGroupDto[]))]
        public async Task<IActionResult> GetAll([FromQuery] string searchTerm)
        {
            var result = await _treeSpecGroupService.GetAll(searchTerm);

            return Success(result);
        }

        /// <summary>
        /// Danh sách nhóm loài cây
        /// </summary>
        [HttpGet("treespecgroups/filter/{page:int}/{pageSize:int}")]
        [AllowAnonymous]
        [SwaggerResponse(200, "", typeof(TreeSpecGroupDto[]))]
        public async Task<IActionResult> Filter(
            [FromRoute] int page,
            [FromRoute] int pageSize,
            [FromQuery] string searchTerm
        )
        {
            var result = await _treeSpecGroupService.FilterTreeSpecGroupsAsync(new PagingAndSortingRequestDto(page, pageSize), searchTerm);

            return Success(result);
        }
    }
}