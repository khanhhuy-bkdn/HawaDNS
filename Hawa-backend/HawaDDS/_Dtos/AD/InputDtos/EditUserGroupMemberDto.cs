namespace _Dtos.AD.InputDtos
{
    public class ChangeUserGroupMembersDto
    {
        public int UserGroupId { get; set; }

        public int[] UserIds { get; set; }
    }
}