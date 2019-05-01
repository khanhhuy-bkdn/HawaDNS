using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace _EntityFrameworkCore.Audits
{
    public interface IAuditHelper
    {
        void ApplyBysConcepts(EntityEntry entry);
    }
}