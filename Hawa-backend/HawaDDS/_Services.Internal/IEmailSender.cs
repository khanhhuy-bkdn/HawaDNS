using System.Net.Mail;
using System.Threading.Tasks;

using _Common.Configurations;
using _Dtos.Shared;

using Microsoft.AspNetCore.Http;

using MimeKit;

namespace _Services.Internal
{
    public interface IEmailSender
    {
        Task SendEmailAsync(
            MailboxAddress sender,
            MailboxAddress[] recipients,
            string subject,
            string body,
            SmtpConfig config = null,
            bool isHtml = true,
            IFormFile[] attachments = null);

        Task SendEmailAsync(
            MailboxAddress sender,
            MailboxAddress[] recipients,
            string subject,
            string body,
            SmtpConfig config = null,
            bool isHtml = true,
            FileDescription[] attachments = null);

        Task SendEmailAsync(
            string recipientName,
            string recipientEmail,
            string subject,
            string body,
            SmtpConfig config = null,
            bool isHtml = true);

        Task SendEmailAsync(
            string recipientName,
            string recipientEmail,
            IFormFile[] attachmentFiles,
            string subject,
            string body,
            SmtpConfig config = null,
            bool isHtml = true);

        Task SendEmailAsync(
            string recipientName,
            string recipientEmail,
            FileDescription[] attachmentFiles,
            string subject,
            string body,
            SmtpConfig config = null,
            bool isHtml = true);

        Task SendEmailAsync(
            string senderName,
            string senderEmail,
            string recipientName,
            string recipientEmail,
            string subject,
            string body,
            SmtpConfig config = null,
            bool isHtml = true,
            IFormFile[] attachments = null);

        Task SendEmailAsync(
            string senderName,
            string senderEmail,
            string recipientName,
            string recipientEmail,
            string subject,
            string body,
            SmtpConfig config = null,
            bool isHtml = true,
            FileDescription[] attachments = null);

        /// <summary>
        /// Sends an email.
        /// </summary>
        Task SendAsync(string to, string subject, string body, bool isBodyHtml = true);

        /// <summary>
        /// Sends an email.
        /// </summary>
        void Send(string to, string subject, string body, bool isBodyHtml = true);

        /// <summary>
        /// Sends an email.
        /// </summary>
        Task SendAsync(string from, string to, string subject, string body, bool isBodyHtml = true);

        /// <summary>
        /// Sends an email.
        /// </summary>
        void Send(string from, string to, string subject, string body, bool isBodyHtml = true);

        /// <summary>
        /// Sends an email.
        /// </summary>
        /// <param name="mail">Mail to be sent</param>
        /// <param name="normalize">
        /// Should normalize email?
        /// If true, it sets sender address/name if it's not set before and makes mail encoding UTF-8. 
        /// </param>
        void Send(MailMessage mail, bool normalize = true);

        /// <summary>
        /// Sends an email.
        /// </summary>
        /// <param name="mail">Mail to be sent</param>
        /// <param name="normalize">
        /// Should normalize email?
        /// If true, it sets sender address/name if it's not set before and makes mail encoding UTF-8. 
        /// </param>
        Task SendAsync(MailMessage mail, bool normalize = true);
    }
}