namespace _Common.Runtime.Session
{
    public interface IBysSession
    {
        int UserId { get; }

        int? GetUserId();

        string UserName { get; }

        string CurrentUserRole { get; }

        bool CurrentUserIsInRole(string roleName);

        int? CurrentEmployeeId();

        int? CurrentBranchId();

        string[] CurrentUserPermissions { get; }
    }
}