using System.ComponentModel.DataAnnotations;

namespace _Dtos.AD.InputDtos
{
    public class ForgotPasswordDto
    {
        [Required] [EmailAddress] public string Email { get; set; }
    }
}