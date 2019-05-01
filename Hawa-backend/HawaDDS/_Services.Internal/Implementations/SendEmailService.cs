using System.Threading.Tasks;

namespace _Services.Internal.Implementations
{
    public class SendEmailService : ISendEmailService
    {
        private IEmailSender _emailSender;

        public SendEmailService(IEmailSender emailSender)
        {
            _emailSender = emailSender;
        }

        public async Task SendResetPasswordActiveCode(string email, string activeCode)
        {
            await _emailSender.SendEmailAsync(email, email, "Yêu cầu đặt lại mật khẩu", $"Mã đặt lại mật khẩu của bạn là {activeCode}");
        }

        public async Task SendNewPasswordAsync(string email, string password)
        {
            await _emailSender.SendEmailAsync(email, email, "Thay đổi mật khẩu", $"Mật khẩu của bạn đã được thay đổi thành {password}");
        }
    }
}