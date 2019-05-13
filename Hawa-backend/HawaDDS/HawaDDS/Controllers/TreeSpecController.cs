using System.Threading.Tasks;

using _Abstractions.Services.IC;
using _Dtos.IC;
using _Dtos.Shared.Inputs;
using _Infrastructure.ApiControllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Swashbuckle.AspNetCore.Annotations;

namespace HawaDDS.Controllers
{
    public class TreeSpecController : ApiControllerBase
    {
        private readonly ITreeSpecService _treeSpecService;

        public TreeSpecController(ITreeSpecService treeSpecService)
        {
            _treeSpecService = treeSpecService;
        }

        /// <summary>
        /// Danh sách tất cả loài cây không phân trang
        /// </summary>
        [HttpGet("treespecs")]
        [AllowAnonymous]
        [SwaggerResponse(200, "", typeof(TreeSpecDto[]))]
        public async Task<IActionResult> GetAll([FromQuery] string searchTerm)
        {
            var result = _treeSpecService.GetAll(searchTerm);

            return Success(result);
        }

        /// <summary>
        /// Danh sách loài cây (tìm kiếm theo tên)
        /// </summary>
        [HttpGet("treespecs/{page:int}/{pageSize:int}")]
        [AllowAnonymous]
        [SwaggerResponse(200, "", typeof(TreeSpecDto[]))]
        public async Task<IActionResult> Filter(
            [FromRoute] int page,
            [FromRoute] int pageSize,
            [FromQuery] string searchTerm
        )
        {
            var result = _treeSpecService.FilterTreeSpecsAsync(
                new PagingAndSortingRequestDto
                {
                    Page = page,
                    PageSize = pageSize
                },
                searchTerm);

            return Success(result);
        }
    }
}