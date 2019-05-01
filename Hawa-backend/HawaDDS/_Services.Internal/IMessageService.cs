using System.Threading.Tasks;

using _Entities.AD;

namespace _Services.Internal
{
    public interface IMessageService
    {
        Task SendMailVerifyUserAsync(ADUser email, string code);

        Task SendMailSetPasswordUserAsync(ADUser email, string password, string code);

        Task SendMailResetPasswordUserAsync(ADUser email, string code);
    }
}