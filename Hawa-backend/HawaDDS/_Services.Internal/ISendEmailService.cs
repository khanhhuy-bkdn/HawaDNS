using System.Threading.Tasks;

namespace _Services.Internal
{
    public interface ISendEmailService
    {
        Task SendResetPasswordActiveCode(string email, string activeCode);

        Task SendNewPasswordAsync(string email, string password);
    }
}