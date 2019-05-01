using System.Threading.Tasks;

using _Common;
using _Common.Exceptions;
using _Constants;
using _Dtos.Shared;
using _Entities.AD;
using _EntityFrameworkCore.UnitOfWork;
using _Globalization;
using _RazorTemplates;
using _RazorTemplates.ViewModels;

namespace _Services.Internal.Implementations
{
    public class MessageService : IMessageService
    {
        private readonly IEmailSender _emailSender;
        private readonly IGlobalSettingService _globalSettingService;
        private readonly IRazorViewRenderService _razorViewRenderService;

        public MessageService(
            IUnitOfWork unitOfWork,
            IGlobalSettingService goGlobalSettingService,
            IRazorViewRenderService razorViewRenderService,
            IEmailSender emailSender)
        {
            _globalSettingService = goGlobalSettingService;
            _razorViewRenderService = razorViewRenderService;
            _emailSender = emailSender;
        }

        public async Task SendMailSetPasswordUserAsync(ADUser user, string password, string code)
        {
            await SendMailAccount(
                user,
                password,
                _globalSettingService.GetSiteDomainUrl() + string.Format(UrlContants.VerifyUserUrlFormat, user.ADUserEmail, code),
                "SendMailSetPasswordUser.cshtml",
                Messages.Global.Mail.Subject.ThongBaoMatKhau);
        }

        public async Task SendMailVerifyUserAsync(ADUser user, string code)
        {
            await SendMailAccount(
                user,
                string.Empty,
                _globalSettingService.GetSiteDomainUrl() + string.Format(UrlContants.VerifyUserUrlFormat, user.ADUserEmail, code),
                "SendMailVerifyUser.cshtml",
                Messages.Global.Mail.Subject.XacNhanDangKyTaiKhoanThanhCong);
        }

        private async Task SendMailAccount(
            ADUser user,
            string password,
            string url,
            string templateFile,
            string subject)
        {
            var model = new SendMailVerifyUserViewModel
            {
                Name = user.ADUserOrganizationName,
                Email = user.ADUserEmail,
                GotoUrl = url,
                Password = password
            };

            var body = await BuildTemplate(templateFile, model);

            try
            {
                await _emailSender.SendEmailAsync(
                    user.ADUserOrganizationName,
                    user.ADUserEmail,
                    EmptyArray<FileDescription>.Instance,
                    subject,
                    body);
            }
            catch (SendEmailException)
            {
            }
        }

        private async Task<string> BuildTemplate<TModel>(string name, TModel model)
        {
            return await _razorViewRenderService.RenderToStringAsync(name, model);
        }

        public async Task SendMailResetPasswordUserAsync(ADUser user, string code)
        {
            await SendMailAccount(
                user,
                string.Empty,
                _globalSettingService.GetSiteDomainUrl() + string.Format(UrlContants.ResetPasswordUserUrlFormat, user.ADUserEmail, code),
                "SendMailResetPasswordUser.cshtml",
                Messages.Global.Mail.Subject.YeuCauDatLaiMatKhau);
        }
    }
}