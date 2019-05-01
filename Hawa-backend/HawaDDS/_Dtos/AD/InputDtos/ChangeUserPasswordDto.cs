using System.ComponentModel.DataAnnotations;

namespace _Dtos.AD.InputDtos
{
    public class ChangeUserPasswordDto
    {
        [Required] public string CurrentPassword { get; set; }

        [Required] [MinLength(6)] public string NewPassword { get; set; }
    }
}