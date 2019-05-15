using System;
using System.IO;
using System.Net.Mail;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

using _Common.Configurations;
using _Common.Exceptions;
using _Common.Extensions;
using _Dtos.Shared;

using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

using MimeKit;

using SmtpClient = MailKit.Net.Smtp.SmtpClient;

namespace _Services.Internal.Implementations
{
    /// <summary>
    /// This class can be used as base to implement <see cref="IEmailSender"/>.
    /// </summary>
    public abstract class EmailSenderBase : IEmailSender
    {
        public const string DefaultFromAddress = "huy.nguyen@bys.vn";
        public const string DefaultFromDisplayName = "Khanh Huy";

        private readonly SmtpConfig _config;

        protected EmailSenderBase(IOptions<SmtpConfig> config)
        {
            _config = config.Value;
        }

        public async Task SendEmailAsync(
            string recipientName,
            string recipientEmail,
            string subject,
            string body,
            SmtpConfig config = null,
            bool isHtml = true)
        {
            var from = new MailboxAddress(_config.Name, _config.EmailAddress);
            var to = new MailboxAddress(recipientName, recipientEmail);

            await SendEmailAsync(from, new[] { to }, subject, body, config, isHtml, new FileDescription[] { });
        }

        public async Task SendEmailAsync(
            string recipientName,
            string recipientEmail,
            IFormFile[] attachmentFiles,
            string subject,
            string body,
            SmtpConfig config = null,
            bool isHtml = true)
        {
            var from = new MailboxAddress(_config.Name, _config.EmailAddress);
            var to = new MailboxAddress(recipientName, recipientEmail);

            MimeMessage message = new MimeMessage();

            message.From.Add(from);
            message.To.Add(to);
            message.Subject = subject;

            var builder = new BodyBuilder
            {
                HtmlBody = body
            };

            if (!attachmentFiles.IsNullOrEmpty())
            {
                foreach (var attachmentFile in attachmentFiles)
                {
                    builder.Attachments.Add(
                        new MimePart
                        {
                            Content = new MimeContent(attachmentFile.OpenReadStream()),
                            ContentDisposition = new ContentDisposition(ContentDisposition.Attachment),
                            ContentTransferEncoding = ContentEncoding.Base64,
                            FileName = attachmentFile.FileName
                        });
                }
            }

            message.Body = builder.ToMessageBody();

            try
            {
                if (config == null)
                    config = _config;

                using (var client = new SmtpClient())
                {
                    if (!config.UseSSL)
                        client.ServerCertificateValidationCallback = (object sender2, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors) => true;

                    await client.ConnectAsync(config.Host, config.Port, config.UseSSL).ConfigureAwait(false);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");

                    if (!string.IsNullOrWhiteSpace(config.Username))
                        await client.AuthenticateAsync(config.Username, config.Password).ConfigureAwait(false);

                    await client.SendAsync(message).ConfigureAwait(false);
                    await client.DisconnectAsync(true).ConfigureAwait(false);
                }
            }
            catch (Exception)
            {
                throw new SendEmailException();
            }
        }

        public async Task SendEmailAsync(
            string recipientName,
            string recipientEmail,
            FileDescription[] attachmentFiles,
            string subject,
            string body,
            SmtpConfig config = null,
            bool isHtml = true)
        {
            var from = new MailboxAddress(_config.Name, _config.EmailAddress);
            var to = new MailboxAddress(recipientName, recipientEmail);

            MimeMessage message = new MimeMessage();

            message.From.Add(from);
            message.To.Add(to);
            message.Subject = subject;

            var builder = new BodyBuilder
            {
                HtmlBody = body
            };

            if (!attachmentFiles.IsNullOrEmpty())
            {
                foreach (var attachmentFile in attachmentFiles)
                {
                    builder.Attachments.Add(
                        new MimePart
                        {
                            Content = new MimeContent(new MemoryStream(attachmentFile.Data)),
                            ContentDisposition = new ContentDisposition(ContentDisposition.Attachment),
                            ContentTransferEncoding = ContentEncoding.Base64,
                            FileName = attachmentFile.FileName
                        });
                }
            }

            message.Body = builder.ToMessageBody();

            try
            {
                if (config == null)
                    config = _config;

                using (var client = new SmtpClient())
                {
                    if (!config.UseSSL)
                        client.ServerCertificateValidationCallback = (object sender2, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors) => true;

                    await client.ConnectAsync(config.Host, config.Port, config.UseSSL).ConfigureAwait(false);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");

                    if (!string.IsNullOrWhiteSpace(config.Username))
                        await client.AuthenticateAsync(config.Username, config.Password).ConfigureAwait(false);

                    await client.SendAsync(message).ConfigureAwait(false);
                    await client.DisconnectAsync(true).ConfigureAwait(false);
                }
            }
            catch (Exception e)
            {
                throw new SendEmailException();
            }
        }

        public async Task SendEmailAsync(
            string senderName,
            string senderEmail,
            string recipientName,
            string recipientEmail,
            string subject,
            string body,
            SmtpConfig config = null,
            bool isHtml = true,
            IFormFile[] attachments = null)
        {
            var from = new MailboxAddress(senderName, senderEmail);
            var to = new MailboxAddress(recipientName, recipientEmail);

            await SendEmailAsync(from, new[] { to }, subject, body, config, isHtml, attachments);
        }

        public async Task SendEmailAsync(
            string senderName,
            string senderEmail,
            string recipientName,
            string recipientEmail,
            string subject,
            string body,
            SmtpConfig config = null,
            bool isHtml = true,
            FileDescription[] attachments = null)
        {
            var from = new MailboxAddress(senderName, senderEmail);
            var to = new MailboxAddress(recipientName, recipientEmail);

            await SendEmailAsync(from, new[] { to }, subject, body, config, isHtml, attachments);
        }

        public async Task SendEmailAsync(
            MailboxAddress sender,
            MailboxAddress[] recipients,
            string subject,
            string body,
            SmtpConfig config = null,
            bool isHtml = true,
            IFormFile[] attachmentFiles = null)
        {
            MimeMessage message = new MimeMessage();

            message.From.Add(sender);
            message.To.AddRange(recipients);
            message.Subject = subject;

            var builder = new BodyBuilder
            {
                HtmlBody = body
            };

            if (!attachmentFiles.IsNullOrEmpty())
            {
                foreach (var attachmentFile in attachmentFiles)
                {
                    builder.Attachments.Add(
                        new MimePart
                        {
                            Content = new MimeContent(attachmentFile.OpenReadStream(), ContentEncoding.Default),
                            ContentDisposition = new ContentDisposition(ContentDisposition.Attachment),
                            ContentTransferEncoding = ContentEncoding.Base64,
                            FileName = attachmentFile.FileName
                        });
                }
            }

            message.Body = builder.ToMessageBody();

            try
            {
                if (config == null)
                    config = _config;

                using (var client = new SmtpClient())
                {
                    if (!config.UseSSL)
                        client.ServerCertificateValidationCallback = (object sender2, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors) => true;

                    await client.ConnectAsync(config.Host, config.Port, config.UseSSL).ConfigureAwait(false);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");

                    if (!string.IsNullOrWhiteSpace(config.Username))
                        await client.AuthenticateAsync(config.Username, config.Password).ConfigureAwait(false);

                    await client.SendAsync(message).ConfigureAwait(false);
                    await client.DisconnectAsync(true).ConfigureAwait(false);
                }
            }
            catch (Exception)
            {
                throw new SendEmailException();
            }
        }

        public async Task SendEmailAsync(
            MailboxAddress sender,
            MailboxAddress[] recipients,
            string subject,
            string body,
            SmtpConfig config = null,
            bool isHtml = true,
            FileDescription[] attachmentFiles = null)
        {
            MimeMessage message = new MimeMessage();

            message.From.Add(sender);
            message.To.AddRange(recipients);
            message.Subject = subject;

            var builder = new BodyBuilder
            {
                HtmlBody = body
            };

            if (!attachmentFiles.IsNullOrEmpty())
            {
                foreach (var attachmentFile in attachmentFiles)
                {
                    builder.Attachments.Add(
                        new MimePart
                        {
                            Content = new MimeContent(new MemoryStream(attachmentFile.Data), ContentEncoding.Default),
                            ContentDisposition = new ContentDisposition(ContentDisposition.Attachment),
                            ContentTransferEncoding = ContentEncoding.Base64,
                            FileName = attachmentFile.FileName
                        });
                }
            }

            message.Body = builder.ToMessageBody();

            try
            {
                if (config == null)
                    config = _config;

                using (var client = new SmtpClient())
                {
                    if (!config.UseSSL)
                        client.ServerCertificateValidationCallback = (object sender2, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors) => true;

                    await client.ConnectAsync(config.Host, config.Port, config.UseSSL).ConfigureAwait(false);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");

                    if (!string.IsNullOrWhiteSpace(config.Username))
                        await client.AuthenticateAsync(config.Username, config.Password).ConfigureAwait(false);

                    await client.SendAsync(message).ConfigureAwait(false);
                    await client.DisconnectAsync(true).ConfigureAwait(false);
                }
            }
            catch (Exception)
            {
                throw new SendEmailException();
            }
        }

        public virtual async Task SendAsync(string to, string subject, string body, bool isBodyHtml = true)
        {
            await SendAsync(
                new MailMessage
                {
                    To =
                    {
                        to
                    },
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = isBodyHtml
                });
        }

        public virtual void Send(string to, string subject, string body, bool isBodyHtml = true)
        {
            Send(
                new MailMessage
                {
                    To =
                    {
                        to
                    },
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = isBodyHtml
                });
        }

        public virtual async Task SendAsync(string from, string to, string subject, string body, bool isBodyHtml = true)
        {
            await SendAsync(
                new MailMessage(from, to, subject, body)
                {
                    IsBodyHtml = isBodyHtml
                });
        }

        public virtual void Send(string from, string to, string subject, string body, bool isBodyHtml = true)
        {
            Send(
                new MailMessage(from, to, subject, body)
                {
                    IsBodyHtml = isBodyHtml
                });
        }

        public virtual async Task SendAsync(MailMessage mail, bool normalize = true)
        {
            if (normalize)
            {
                NormalizeMail(mail);
            }

            await SendEmailAsync(mail);
        }

        public virtual void Send(MailMessage mail, bool normalize = true)
        {
            if (normalize)
            {
                NormalizeMail(mail);
            }

            SendEmail(mail);
        }

        /// <summary>
        /// Should implement this method to send email in derived classes.
        /// </summary>
        /// <param name="mail">Mail to be sent</param>
        protected abstract Task SendEmailAsync(MailMessage mail);

        /// <summary>
        /// Should implement this method to send email in derived classes.
        /// </summary>
        /// <param name="mail">Mail to be sent</param>
        protected abstract void SendEmail(MailMessage mail);

        /// <summary>
        /// Normalizes given email.
        /// Fills <see cref="MailMessage.From"/> if it's not filled before.
        /// Sets encodings to UTF8 if they are not set before.
        /// </summary>
        /// <param name="mail">Mail to be normalized</param>
        protected virtual void NormalizeMail(MailMessage mail)
        {
            if (mail.From == null || mail.From.Address.IsNullOrEmpty())
            {
                mail.From = new MailAddress(
                    DefaultFromAddress,
                    DefaultFromDisplayName,
                    Encoding.UTF8
                );
            }

            if (mail.HeadersEncoding == null)
            {
                mail.HeadersEncoding = Encoding.UTF8;
            }

            if (mail.SubjectEncoding == null)
            {
                mail.SubjectEncoding = Encoding.UTF8;
            }

            if (mail.BodyEncoding == null)
            {
                mail.BodyEncoding = Encoding.UTF8;
            }
        }
    }
}