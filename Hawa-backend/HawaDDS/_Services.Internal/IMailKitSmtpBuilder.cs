using MailKit.Net.Smtp;

namespace _Services.Internal
{
    public interface IMailKitSmtpBuilder
    {
        SmtpClient Build();
    }
}