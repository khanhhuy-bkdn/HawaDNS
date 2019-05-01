using System.Linq;
using System.Security.Authentication;
using System.Security.Claims;

using _Common.Runtime.Security;

using Microsoft.AspNetCore.Http;

namespace _Common.Runtime.Session
{
    public class BysSession : IBysSession
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ClaimsPrincipal Principal => _httpContextAccessor.HttpContext?.User;

        public BysSession(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public int UserId
        {
            get
            {
                var userIdClaim = Principal?.Claims.FirstOrDefault(c => c.Type == BysClaimTypes.UserId);
                if (string.IsNullOrEmpty(userIdClaim?.Value))
                {
                    throw new AuthenticationException("User not login to system");
                }

                int userId;
                if (!int.TryParse(userIdClaim.Value, out userId))
                {
                    throw new AuthenticationException("User not login to system");
                }

                return userId;
            }
        }

        public int? GetUserId()
        {
            var userIdClaim = Principal?.Claims.FirstOrDefault(c => c.Type == BysClaimTypes.UserId);
            if (string.IsNullOrEmpty(userIdClaim?.Value))
            {
                return null;
            }

            int userId;
            if (!int.TryParse(userIdClaim.Value, out userId))
            {
                return null;
            }

            return userId;
        }

        public int? CurrentEmployeeId()
        {
            var employeeIdClaim = Principal?.Claims.FirstOrDefault(c => c.Type == BysClaimTypes.EmployeeId);
            if (string.IsNullOrEmpty(employeeIdClaim?.Value))
            {
                return null;
            }

            int employeeId;
            if (!int.TryParse(employeeIdClaim.Value, out employeeId))
            {
                return null;
            }

            return employeeId;
        }

        public int? CurrentBranchId()
        {
            var branchIdClaim = Principal?.Claims.FirstOrDefault(c => c.Type == BysClaimTypes.BranchId);
            if (string.IsNullOrEmpty(branchIdClaim?.Value))
            {
                return null;
            }

            int branchId;
            if (!int.TryParse(branchIdClaim.Value, out branchId))
            {
                return null;
            }

            return branchId;
        }

        public string UserName
        {
            get { return Principal?.Claims.FirstOrDefault(c => c.Type == BysClaimTypes.UserName)?.Value; }
        }

        public string CurrentUserRole
        {
            get { return Principal?.Claims.FirstOrDefault(c => c.Type == BysClaimTypes.Role)?.Value; }
        }

        public string[] CurrentUserPermissions
        {
            get { return Principal?.Claims.Where(c => c.Type == BysClaimTypes.Permission).Select(x => x.Value).ToArray(); }
        }

        public bool CurrentUserIsInRole(string roleName)
        {
            return CurrentUserRole == roleName;
        }
    }
}