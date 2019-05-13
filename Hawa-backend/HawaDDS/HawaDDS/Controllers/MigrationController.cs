using System.Threading.Tasks;

using _Abstractions.Services.IC;
using _Infrastructure.ApiControllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Swashbuckle.AspNetCore.Annotations;

namespace HawaDDS.Controllers
{
    [AllowAnonymous]
    public class MigrationController : ApiControllerBase
    {
        private readonly IForestPlotService _forestPlotService;

        public MigrationController(IForestPlotService forestPlotService)
        {
            _forestPlotService = forestPlotService;
        }

        /// <summary>
        /// Tách các lô có loài cây từ 2 trở lên (Ex: 524+12) thành nhiều lô với 1 loài cây
        /// </summary>
        [HttpGet("migration/forestplot/updatetreespeccode")]
        [SwaggerResponse(200, "", typeof(int[]))]
        public async Task<IActionResult> UpdateTreeSpecCode()
        {
            var result = await _forestPlotService.UpdateTreeSpecForestPlotsAsync();

            return Success(result);
        }
    }
}