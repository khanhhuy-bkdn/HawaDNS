using _Dtos.AD;

namespace _Dtos.Shared.Audited
{
    public class AuditedEntityDto
    {
        public UserDto ModifierUser { get; set; }

        public long ModificationTime { get; set; }

        public string Action { get; set; }

        public AuditedEntityFieldDto[] AuditedFields { get; set; }
    }
}