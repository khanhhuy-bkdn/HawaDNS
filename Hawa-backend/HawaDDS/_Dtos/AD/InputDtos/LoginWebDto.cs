﻿using System.ComponentModel.DataAnnotations;

namespace _Dtos.AD.InputDtos
{
    public class LoginWebDto
    {
        [Required] public string UserName { get; set; }

        [Required] public string Password { get; set; }
    }
}