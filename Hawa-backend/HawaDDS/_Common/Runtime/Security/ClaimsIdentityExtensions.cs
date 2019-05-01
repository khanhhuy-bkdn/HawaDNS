using System.Linq;
using System.Security.Authentication;
using System.Security.Claims;
using System.Security.Principal;

namespace _Common.Runtime.Security
{
    public static class ClaimsIdentityExtensions
    {
        public static int GetUserId(this IIdentity identity)
        {
            Guard.NotNull(identity, nameof(identity));

            var userIdClaim = (identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == BysClaimTypes.UserId);
            if (string.IsNullOrEmpty(userIdClaim?.Value))
            {
                throw new AuthenticationException();
            }

            int userId;
            if (!int.TryParse(userIdClaim.Value, out userId))
            {
                throw new AuthenticationException();
            }

            return userId;
        }

        public static int GetEmployeeId(this IIdentity identity)
        {
            var employeeIdClaim = (identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == BysClaimTypes.EmployeeId);
            if (string.IsNullOrEmpty(employeeIdClaim?.Value))
            {
                throw new AuthenticationException();
            }

            int employeeId;
            if (!int.TryParse(employeeIdClaim.Value, out employeeId))
            {
                throw new AuthenticationException();
            }

            return employeeId;
        }

        public static string GetUserName(this IIdentity identity)
        {
            Guard.NotNull(identity, nameof(identity));

            return (identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == BysClaimTypes.UserName)?.Value;
        }

        public static string GetRole(this IIdentity identity)
        {
            Guard.NotNull(identity, nameof(identity));

            return (identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == BysClaimTypes.Role)?.Value;
        }
    }
}