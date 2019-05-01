namespace _Dtos.AD.InputDtos
{
    public class ChangeUserGroupPrivilegesDto
    {
        public int UserGroupId { get; set; }

        public int[] PrivilegeIds { get; set; }
    }
}