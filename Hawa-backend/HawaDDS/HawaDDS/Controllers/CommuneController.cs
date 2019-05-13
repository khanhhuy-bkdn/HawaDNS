using System.Threading.Tasks;

using _Abstractions.Services.GE;
using _Dtos.GE.InputDto;
using _Infrastructure.ApiControllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Swashbuckle.AspNetCore.Annotations;

namespace HawaDDS.Controllers
{
    public class CommuneController : ApiControllerBase
    {
        private readonly ICommuneService _communeService;

        public CommuneController(ICommuneService communeService)
        {
            _communeService = communeService;
        }

        /// <summary>
        ///     Cập nhật thông tin vị trí của xã
        /// </summary>
        [HttpPost("commune/location/edit")]
        [SwaggerResponse(200)]
        [AllowAnonymous]
        public async Task<IActionResult> EditCommuneLocationAsync([FromBody] EditCommuneLocationDto dto)
        {
            await _communeService.EditCommuneLocationAsync(dto);

            return Success();
        }
    }
}