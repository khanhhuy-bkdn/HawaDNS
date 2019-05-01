using System.ComponentModel.DataAnnotations;

namespace _Dtos.AD.InputDtos
{
    public class CreateUserGroupDto
    {
        [Required] [StringLength(50)] public string Name { get; set; }

        public string Description { get; set; }

        public int[] PrivilegeIds { get; set; }

        public bool IsActive { get; set; }
    }
}