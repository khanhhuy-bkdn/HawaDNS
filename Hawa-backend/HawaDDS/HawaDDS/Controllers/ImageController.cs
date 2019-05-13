using System;

using _Abstractions.Services;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;
using _Infrastructure.ApiControllers;
using _Infrastructure.Filters;
using _Services.Internal.Helpers;

using Microsoft.AspNetCore.Mvc;

using Swashbuckle.AspNetCore.Annotations;

namespace HawaDDS.Controllers
{
    public class ImageController : ApiControllerBase
    {
        private readonly IImageService _imageService;

        public ImageController(IImageService imageService)
        {
            _imageService = imageService;
        }

        /// <summary>
        /// Tải ảnh lên server
        /// </summary>
        [HttpPost("image/upload")]
        [ModelValidationFilter]
        [SwaggerResponse(200, "", typeof(ImageUrlDto))]
        public IActionResult Upload([FromForm] ImageFileUploadDto dto)
        {
            var result = _imageService.UploadImage(dto.File.ToFileDescription());

            return Success(result);
        }

        /// <summary>
        /// Xóa ảnh  
        /// </summary>
        [HttpPost("image/delete")]
        [SwaggerResponse(200)]
        public IActionResult DeleteImage([FromBody] GuidDto guid)
        {
            _imageService.DeleteImage(Guid.Parse(guid.Guid));

            return Success();
        }

        /// <summary>
        /// Get image url
        /// </summary>
        [HttpGet("image/{guid}")]
        [SwaggerResponse(200, "", typeof(ImageUrlDto))]
        public IActionResult GetUrlImage([FromRoute] string guid)
        {
            var result = _imageService.GetImageUrl(Guid.Parse(guid));

            return Success(result);
        }
    }
}