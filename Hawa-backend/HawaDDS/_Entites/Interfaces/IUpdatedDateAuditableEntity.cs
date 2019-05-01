using System;

namespace _Entities.Interfaces
{
    public interface IUpdatedDateAuditableEntity
    {
        DateTime? AAUpdatedDate { get; set; }
    }
}