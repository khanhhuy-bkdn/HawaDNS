using System;
using System.Collections.Generic;
using System.Text;

namespace _Dtos.AD
{
    public class JwtTokenResultDto
    {
        public int UserId { get; set; }

        public string TokenType { get; set; }

        public string AccessToken { get; set; }

        public int ExpiresInSeconds { get; set; }

        public int EmployeeId { get; set; }

        public string Role { get; set; }
    }
}
