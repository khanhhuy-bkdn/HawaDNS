using Microsoft.AspNetCore.Http;

namespace _Dtos.Shared.Inputs
{
    public class ImageFileUploadDto
    {
        public IFormFile File { get; set; }
    }
}