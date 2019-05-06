using _Abstractions.Services.AD;
using _Auditing;
using _Dtos.Shared;
using _Infrastructure.ApiControllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Swashbuckle.AspNetCore.Annotations;

namespace HawaDDS.Controllers
{
    [AllowAnonymous]
    [DisableAuditing]
    public class DataController : ApiControllerBase
    {
        private readonly IDataService _dataService;
        private readonly IDictionaryDataService _dictionaryDataService;

        public DataController(IDataService dataService, IDictionaryDataService dictionaryDataService)
        {
            _dataService = dataService;
            _dictionaryDataService = dictionaryDataService;
        }

        /// <summary>
        ///     Danh sách master data
        /// </summary>
        [HttpGet("data/all")]
        [SwaggerResponse(200, "", typeof(DictionaryDataDto))]
        public IActionResult All()
        {
            var result = new DictionaryDataDto
            {
                ActorTypes = _dataService.ActorTypes(),
                ContactTypes = _dataService.ContactTypes(),
                LandUseCerts = _dataService.LandUseCerts(),
                UserTypes = _dataService.UserTypes(),
                UserStatues = _dataService.UserStatuses(),
                ForestCerts = _dataService.ForestCerts(),
                ForestplotReliability = _dataService.ForestPlotReliabilities(),

                //Compartments = _dataService.Compartments(),
                ActorRoles = _dataService.ActorRoles(),
                ContactStatuses = _dataService.ContactStatuses(),
            };

            return Success(result);
        }

        /// <summary>
        ///     Danh sách tỉnh/thành Việt Nam
        /// </summary>
        [HttpGet("data/stateprovinces")]
        [SwaggerResponse(200, "", typeof(DictionaryItemDto[]))]
        public IActionResult StateProvinces()
        {
            var result = _dataService.VNStateProvinces();

            return Success(result);
        }

        /// <summary>
        ///     Danh sách tỉnh/thành Việt Nam không bị ẩn
        /// </summary>
        [HttpGet("data/stateprovinces/show")]
        [SwaggerResponse(200, "", typeof(DictionaryItemDto[]))]
        public IActionResult StateProvincesShow()
        {
            var result = _dataService.VNStateProvincesShow();

            return Success(result);
        }

        /// <summary>
        ///     Danh sách quận huyện theo tỉnh/thành
        /// </summary>
        [HttpGet("data/districts")]
        [SwaggerResponse(200, "", typeof(DictionaryItemDto[]))]
        public IActionResult Districts([FromQuery] string stateProviceCode)
        {
            var result = _dataService.Districts(stateProviceCode);

            return Success(result);
        }

        /// <summary>
        ///     Danh sách xã/phường theo quận/huyện
        /// </summary>
        [HttpGet("data/communes")]
        [SwaggerResponse(200, "", typeof(DictionaryItemDto[]))]
        public IActionResult Communes([FromQuery] string districtCode)
        {
            var result = _dataService.Communes(districtCode);

            return Success(result);
        }

        /// <summary>
        ///     Danh sách tiểu khu theo xã/phường
        /// </summary>
        [HttpGet("data/commune/{communeId}/compartments")]
        [SwaggerResponse(200, "", typeof(DictionaryItemDto[]))]
        public IActionResult Compartments([FromRoute] int communeId)
        {
            var result = _dataService.Compartments(communeId);

            return Success(result);
        }

        /// <summary>
        ///     Danh sách khoảnh theo tiểu khu
        /// </summary>
        [HttpGet("data/compartment/{compartmentId}/subCompartments")]
        [SwaggerResponse(200, "", typeof(DictionaryItemDto[]))]
        public IActionResult SubCompartments([FromRoute] int compartmentId)
        {
            var result = _dataService.SubCompartments(compartmentId);

            return Success(result);
        }

        /// <summary>
        ///     Danh sách lô theo khoảnh
        /// </summary>
        [HttpGet("data/subcompartment/{subCompartmentId}/plots")]
        [SwaggerResponse(200, "", typeof(DictionaryItemDto[]))]
        public IActionResult Plots([FromRoute] int subCompartmentId)
        {
            var result = _dataService.Plots(subCompartmentId);

            return Success(result);
        }
    }
}