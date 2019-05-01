namespace _Dtos.Shared.Audited
{
    public class AuditedEntityFieldDto
    {
        public string FieldName { get; set; }

        public string LocalizedFieldName { get; set; }

        public string OldValue { get; set; }

        public string NewValue { get; set; }
    }
}