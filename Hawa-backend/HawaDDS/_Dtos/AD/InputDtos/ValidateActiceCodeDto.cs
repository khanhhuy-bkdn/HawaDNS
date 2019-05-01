using System.ComponentModel.DataAnnotations;

namespace _Dtos.AD.InputDtos
{
    public class ValidateActiceCodeDto
    {
        [Required] [EmailAddress] public string Email { get; set; }

        [Required] public string Token { get; set; }
    }
}