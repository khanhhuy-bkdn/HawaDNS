using System.Threading.Tasks;

using _Auditing.Interfaces;

using Serilog;

namespace _Auditing.Implementations
{
    /// <summary>
    /// Implements <see cref="IAuditingStore"/> to simply write audits to logs.
    /// </summary>
    public class SimpleLogAuditingStore : IAuditingStore
    {
        /// <summary>
        /// Singleton instance.
        /// </summary>
        public static SimpleLogAuditingStore Instance { get; } = new SimpleLogAuditingStore();

        public ILogger Logger { get; set; }

        public SimpleLogAuditingStore()
        {
            Logger = Log.Logger;
        }

        public Task SaveAsync(AuditInfo auditInfo)
        {
            if (auditInfo.Exception == null)
            {
                Logger.Information(auditInfo.ToString());
            }
            else
            {
                Logger.Information(auditInfo.ToString());
            }

            return Task.FromResult(0);
        }
    }
}