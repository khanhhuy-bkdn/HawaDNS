using System;

namespace Bys.Entities.Interfaces
{
    public interface ICreatedDateAuditableEntity
    {
        DateTime? AACreatedDate { get; set; }
    }
}