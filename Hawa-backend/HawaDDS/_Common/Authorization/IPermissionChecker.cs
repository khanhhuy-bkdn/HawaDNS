using System.Threading.Tasks;

namespace _Common.Authorization
{
    public interface IPermissionChecker
    {
        /// <summary>
        /// Checks if current user is granted for a permission.
        /// </summary>
        /// <param name="permissionName">Name of the permission</param>
        bool IsGranted(string permissionName);

        /// <summary>
        /// Checks if a user is granted for a permission.
        /// </summary>
        /// <param name="userId">User to check</param>
        /// <param name="permissionName">Name of the permission</param>
        Task<bool> IsGrantedAsync(int userId, string permissionName);
    }
}