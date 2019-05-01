using System.Threading.Tasks;

namespace _Services.Internal
{
    public interface IDataProtectorUserTokenService
    {
        int GenerateResetPasswordActiveCode(int userId);

        bool ValidateResetPasswordActiveCode(int userId, int activeCode);

        Task<string> GenerateResetPasswordTokenAsync(int userId);

        bool ValidateResetPasswordToken(int userId, string token);

        Task<string> GenerateVerifyUserTokenAsync(int userId);

        bool ValidateVerifyUserToken(int userId, string token);

        Task DeleteTokenAsync(string token);
    }
}