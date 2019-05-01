using System;

namespace _Entities.Interfaces
{
    public interface ICreatedDateAuditableEntity
    {
        DateTime? AACreatedDate { get; set; }
    }
}