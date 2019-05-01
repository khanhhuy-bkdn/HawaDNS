using System.Threading.Tasks;

using _Dtos.AD.InputDtos;
using _Dtos.ServiceResults;

namespace _Abstractions.Services.AD
{
    public interface ILoginService
    {
        Task<LoginResult> LoginAsync(LoginDto dto);

        Task LogoutAsync();

        Task SetResetPasswordActiveCodeAndSendEmail(ForgotPasswordDto dto);

        Task<ServiceResult> ValidateResetPasswordActiveCodeAsync(ValidateActiceCodeDto dto);

        Task<ServiceResult> ResetPasswordWithTokenAsync(ResetPasswordDto dto);

        Task<string> ResetPasswordByAdminAsync(int userId);

        Task<ServiceResult> ChangePasswordAsync(ChangePasswordDto dto);
    }
}