using Microsoft.AspNetCore.Http;

namespace _Dtos.AD.InputDtos
{
    public class EditUserAvatarDto
    {
        public IFormFile[] ImageFiles { get; set; }
    }
}