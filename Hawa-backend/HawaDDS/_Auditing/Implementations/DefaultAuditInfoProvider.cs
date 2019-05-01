using _Auditing.Interfaces;
using _Common.Extensions;

namespace _Auditing.Implementations
{
    /// <summary>
    /// Default implementation of <see cref="IAuditInfoProvider" />.
    /// </summary>
    public class DefaultAuditInfoProvider : IAuditInfoProvider
    {
        public IClientInfoProvider ClientInfoProvider { get; set; }

        public DefaultAuditInfoProvider(IClientInfoProvider clientInfoProvider)
        {
            ClientInfoProvider = clientInfoProvider;
        }

        public virtual void Fill(AuditInfo auditInfo)
        {
            if (auditInfo.ClientIpAddress.IsNullOrEmpty())
            {
                auditInfo.ClientIpAddress = ClientInfoProvider.ClientIpAddress;
            }

            if (auditInfo.BrowserInfo.IsNullOrEmpty())
            {
                auditInfo.BrowserInfo = ClientInfoProvider.BrowserInfo;
            }

            if (auditInfo.ClientName.IsNullOrEmpty())
            {
                auditInfo.ClientName = ClientInfoProvider.ComputerName;
            }
        }
    }
}