﻿using System.Threading.Tasks;

using _Auditing.Implementations;

namespace _Auditing.Interfaces
{
    /// <summary>
    /// This interface should be implemented by vendors to
    /// make auditing working.
    /// Default implementation is <see cref="SimpleLogAuditingStore"/>.
    /// </summary>
    public interface IAuditingStore
    {
        /// <summary>
        /// Should save audits to a persistent store.
        /// </summary>
        /// <param name="auditInfo">Audit informations</param>
        Task SaveAsync(AuditInfo auditInfo);
    }
}