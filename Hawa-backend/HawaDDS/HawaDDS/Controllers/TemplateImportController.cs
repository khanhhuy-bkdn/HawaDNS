using System.Threading.Tasks;

using _Abstractions.Services;
using _Dtos.Shared.Inputs;
using _Infrastructure.ApiControllers;
using _Services.Internal.Helpers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Swashbuckle.AspNetCore.Annotations;

namespace HawaDDS.Controllers
{
    [AllowAnonymous]
    public class TemplateImportController : ApiControllerBase
    {
        private readonly IExcelImportService _excelImportService;

        public TemplateImportController(IExcelImportService excelImportService)
        {
            _excelImportService = excelImportService;
        }

        /// <summary>
        /// Import data chủ rừng từ excel template
        /// </summary>
        [HttpPost("import/actor")]
        [SwaggerResponse(200, "", typeof(int[]))]
        public async Task<IActionResult> ImportForestActor([FromForm] FileUploadDto dto)
        {
            var result = _excelImportService.ImportForestActor(dto.File.ToFileDescription());

            return Success(result);
        }

        /// <summary>
        /// Import data Forestplot từ excel
        /// </summary>
        [HttpPost("import/forestplot")]
        [SwaggerResponse(200, "", typeof(int[]))]
        public async Task<IActionResult> ImportForestPlot([FromForm] FileUploadDto dto)
        {
            var result = _excelImportService.ImportForestPlots(dto.File.ToFileDescription());

            return Success(result);
        }
    }
}