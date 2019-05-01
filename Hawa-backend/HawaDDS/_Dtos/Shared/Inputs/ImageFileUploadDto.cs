using Microsoft.AspNetCore.Http;

namespace _Dtos.Shared.Inputs
{
    public class FileUploadDto
    {
        public IFormFile File { get; set; }
    }
}