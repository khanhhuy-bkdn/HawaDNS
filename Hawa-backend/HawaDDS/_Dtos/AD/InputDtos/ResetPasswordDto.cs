using System.ComponentModel.DataAnnotations;

namespace _Dtos.AD.InputDtos
{
    public class ResetPasswordDto
    {
        [Required] [EmailAddress] public string Email { get; set; }

        [Required] public string Token { get; set; }

        [Required] public string Password { get; set; }
    }
}