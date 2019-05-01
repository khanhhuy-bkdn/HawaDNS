using System.Security.Claims;
using System.Threading.Tasks;

using _Common;
using _Dtos.AD;

namespace _Abstractions.Services.AD
{
    public interface ITokenService
    {
        Task<JwtTokenResultDto> RequestTokenAsync(ClaimsIdentity identity, ApplicationType application);
    }
}