using _Common.Configurations;

using MailKit.Net.Smtp;
using MailKit.Security;

using Microsoft.Extensions.Options;

namespace _Services.Internal.Implementations
{
    public class MailKitSmtpBuilder : IMailKitSmtpBuilder
    {
        private readonly SmtpConfig _smtpEmailConfig;

        public MailKitSmtpBuilder(IOptions<SmtpConfig> config)
        {
            _smtpEmailConfig = config.Value;
        }

        public virtual SmtpClient Build()
        {
            var client = new SmtpClient();

            try
            {
                ConfigureClient(client);
                return client;
            }
            catch
            {
                client.Dispose();
                throw;
            }
        }

        protected virtual void ConfigureClient(SmtpClient client)
        {
            client.Connect(
                _smtpEmailConfig.Host,
                _smtpEmailConfig.Port,
                GetSecureSocketOption()
            );

            client.Authenticate(
                _smtpEmailConfig.Username,
                _smtpEmailConfig.Password
            );
        }

        protected virtual SecureSocketOptions GetSecureSocketOption()
        {
            return _smtpEmailConfig.UseSSL
                ? SecureSocketOptions.SslOnConnect
                : SecureSocketOptions.StartTlsWhenAvailable;
        }
    }
}