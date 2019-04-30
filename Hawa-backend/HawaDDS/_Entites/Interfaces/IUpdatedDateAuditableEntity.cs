using System;

namespace Bys.Entities.Interfaces
{
    public interface IUpdatedDateAuditableEntity
    {
        DateTime? AAUpdatedDate { get; set; }
    }
}