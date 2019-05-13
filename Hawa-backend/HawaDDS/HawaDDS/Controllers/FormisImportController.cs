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
    public class FormisImportController : ApiControllerBase
    {
        private readonly IExcelImportService _excelImportService;

        public FormisImportController(IExcelImportService excelImportService)
        {
            _excelImportService = excelImportService;
        }

        /// <summary>
        /// [Formis] Import data SubCompartment từ excel
        /// </summary>
        [HttpPost("import/subcompartment")]
        [SwaggerResponse(200, "", typeof(int[]))]
        public async Task<IActionResult> ImportSubCompartments([FromForm] FileUploadDto dto)
        {
            var result = _excelImportService.ImportSubCompartments(dto.File.ToFileDescription());

            return Success(result);
        }

        /// <summary>
        ///  [Formis] Import data Compartment từ excel
        /// </summary>
        [HttpPost("import/compartment")]
        [SwaggerResponse(200, "", typeof(int[]))]
        public async Task<IActionResult> ImportCompartments([FromForm] FileUploadDto dto)
        {
            var result = _excelImportService.ImportCompartments(dto.File.ToFileDescription());

            return Success(result);
        }

        /// <summary>
        ///  [Formis] Import data Forestplot từ excel Formis
        /// </summary>
        [HttpPost("import/formis/forestplot")]
        [RequestSizeLimit(52428800)]
        [SwaggerResponse(200, "", typeof(int[]))]
        public async Task<IActionResult> ImportForestPlotFromFormis([FromForm] FileUploadDto dto)
        {
            var result = _excelImportService.ImportForestPlotFromFormis(dto.File.ToFileDescription());

            return Success(result);
        }

        /// <summary>
        ///  [Formis] Import data LocationForestplot từ 1 thư mục
        /// </summary>
        [HttpPost("import/forestplot/location")]
        [SwaggerResponse(200)]
        public async Task<IActionResult> ImportForestPlotLocation([FromQuery] string path)
        {
            var result = await _excelImportService.ImportForestPlotLocations(path);

            return Success(result);
        }

        /// <summary>
        ///  [Formis] Import data Actor từ excel formis
        /// </summary>
        [HttpPost("import/formis/actor")]
        [SwaggerResponse(200, "", typeof(int[]))]
        public async Task<IActionResult> ImportActors([FromForm] FileUploadDto dto)
        {
            var result = _excelImportService.ImportActors(dto.File.ToFileDescription());

            return Success(result);
        }
    }
}