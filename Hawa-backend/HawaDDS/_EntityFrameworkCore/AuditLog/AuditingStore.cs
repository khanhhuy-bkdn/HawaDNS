using System.Threading.Tasks;

using _Auditing;
using _Auditing.Interfaces;
using _EntityFrameworkCore.UnitOfWork;

namespace _EntityFrameworkCore.AuditLog
{
    public class AuditingStore : IAuditingStore
    {
        private readonly IUnitOfWork _unitOfWork;

        /// <summary>
        /// Creates  a new <see cref="AuditingStore"/>.
        /// </summary>
        public AuditingStore(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public virtual async Task SaveAsync(AuditInfo auditInfo)
        {
            await _unitOfWork.GetRepository<ADAuditLog>().InsertAsync(ADAuditLog.CreateFromAuditInfo(auditInfo));

            await _unitOfWork.CompleteAsync();
        }
    }
}