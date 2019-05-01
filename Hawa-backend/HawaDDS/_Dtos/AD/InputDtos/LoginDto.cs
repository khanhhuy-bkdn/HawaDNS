using System.ComponentModel.DataAnnotations;

namespace _Dtos.AD.InputDtos
{
    public class LoginDto
    {
        [Required] public string UserNameOrEmailAddress { get; set; }

        [Required] public string Password { get; set; }
    }
}