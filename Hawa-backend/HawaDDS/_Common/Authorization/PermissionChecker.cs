using System.Linq;
using System.Threading.Tasks;

using _Common.Runtime.Session;

namespace _Common.Authorization
{
    public class PermissionChecker : IPermissionChecker
    {
        private readonly IBysSession _sessionService;

        public PermissionChecker(IBysSession sessionService)
        {
            _sessionService = sessionService;
        }

        public bool IsGranted(string permissionName)
        {
            return _sessionService.CurrentUserPermissions.Any(x => x == permissionName);
        }

        public Task<bool> IsGrantedAsync(int userId, string permissionName)
        {
            return Task.FromResult(true);
        }
    }
}