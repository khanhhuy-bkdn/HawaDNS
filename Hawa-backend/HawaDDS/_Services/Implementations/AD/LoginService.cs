using System.Collections.Generic;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;

using _Abstractions.Services.AD;
using _Common;
using _Common.Exceptions;
using _Common.Helpers;
using _Common.Runtime.Security;
using _Common.Runtime.Session;
using _Constants.EntityStatuses;
using _Dtos.AD.InputDtos;
using _Dtos.ServiceResults;
using _Entities.AD;
using _EntityFrameworkCore.UnitOfWork;
using _Services.Implementations.AD.Helpers;
using _Services.Internal;

using Hangfire;

namespace _Services.Implementations.AD
{
    public class LoginService : ILoginService
    {
        private readonly ISendEmailService _sendEmailService;
        private readonly IDataProtectorUserTokenService _dataProtectorUserTokenService;
        private readonly IUnitOfWork _unitOfWork;
        public readonly IBysSession _bysSession;
        public readonly IMessageService _messageService;

        private IRepository<ADUser> _loginRepository => _unitOfWork.GetRepository<ADUser>();

        public LoginService(
            IUnitOfWork unitOfWork,
            ISendEmailService sendEmailService,
            IDataProtectorUserTokenService dataProtectorUserTokenService,
            IBysSession bysSession,
            IMessageService messageService)
        {
            _unitOfWork = unitOfWork;
            _sendEmailService = sendEmailService;
            _dataProtectorUserTokenService = dataProtectorUserTokenService;
            _bysSession = bysSession;
            _messageService = messageService;
        }

        public async Task<LoginResult> LoginAsync(LoginDto dto)
        {
            Guard.NotNullOrWhiteSpace(dto.UserNameOrEmailAddress, nameof(dto.UserNameOrEmailAddress));
            Guard.NotNullOrWhiteSpace(dto.Password, nameof(dto.Password));

            var userToVerify = await GetLoginByUserNameOrEmailAddressAsync(dto.UserNameOrEmailAddress);

            if (userToVerify == null)
            {
                return new LoginResult(LoginResultType.InvalidUserNameOrPassword);
            }

            if (!LoginHelper.CheckPassword(dto.Password, userToVerify.ADUserPassword))
            {
                return new LoginResult(LoginResultType.InvalidUserNameOrPassword);
            }

            if (userToVerify.ADUserStatus == UserStatus.NotValidatedEmail)
            {
                return new LoginResult(LoginResultType.UserIsNotEmailConfirm);
            }

            if (userToVerify.ADUserStatus == UserStatus.Inactive)
            {
                return new LoginResult(LoginResultType.UserLockout);
            }

            //if (!userToVerify.ADLoginIsVerify)
            //{
            //    return new LoginResult(LoginResultType.UserIsNotVerifyByAdmin);
            //}

            var claimIdentity = GenerateClaimsIdentity(userToVerify);

            return new LoginResult(claimIdentity);
        }

        public async Task LogoutAsync()
        {
            //await _signInManager.SignOutAsync();
        }

        public async Task SetResetPasswordActiveCodeAndSendEmail(ForgotPasswordDto dto)
        {
            var user = await GetLoginByEmailAsync(dto.Email);

            if (user == null)
            {
                throw new BusinessException("Địa chỉ email không tồn tại trong hệ thống.");
            }

            var token = await _dataProtectorUserTokenService.GenerateResetPasswordTokenAsync(user.Id);

            BackgroundJob.Enqueue(() => _messageService.SendMailResetPasswordUserAsync(user, token));
        }

        public async Task<ServiceResult> ValidateResetPasswordActiveCodeAsync(ValidateActiceCodeDto dto)
        {
            var user = await GetLoginByEmailAsync(dto.Email);

            if (user == null)
            {
                throw new BusinessException("Địa chỉ email không tồn tại trong hệ thống.");
            }

            await CheckTokenExistAsync(dto.Token);

            if (!_dataProtectorUserTokenService.ValidateResetPasswordToken(user.Id, dto.Token))
            {
                return ServiceResult.Failed();
            }

            return ServiceResult<string>.Success(dto.Token);
        }

        private async Task CheckTokenExistAsync(string token)
        {
            var userToken = await _unitOfWork.GetRepository<ADUserToken>()
                .GetFirstOrDefaultAsync(x => x.ADUserTokenValue == token);

            if (userToken == null)
            {
                throw new BusinessException("Token không tồn tại");
            }
        }

        public async Task<ServiceResult> ResetPasswordWithTokenAsync(ResetPasswordDto dto)
        {
            var user = await GetLoginByEmailAsync(dto.Email);

            if (user == null)
            {
                throw new EntityNotFoundException();
            }

            await CheckTokenExistAsync(dto.Token);

            if (!_dataProtectorUserTokenService.ValidateResetPasswordToken(user.Id, dto.Token))
            {
                return ServiceResult.Failed(new ServiceError("InvalidResetPasswordToken", "Invalid token"));
            }

            user.ADUserPassword = LoginHelper.EncryptPassword(dto.Password);
            await _loginRepository.UpdateAsync(user);

            await _dataProtectorUserTokenService.DeleteTokenAsync(dto.Token);

            await _unitOfWork.CompleteAsync();

            return ServiceResult.Success;
        }

        public async Task<string> ResetPasswordByAdminAsync(int userId)
        {
            var login = await _unitOfWork.GetRepository<ADUser>()
                .GetAsync(userId);

            if (login == null)
            {
                throw new EntityNotFoundException();
            }

            int newPassword = RandomHelper.GetRandom(100000, 999999);

            var userFormDb = await _unitOfWork.GetRepository<ADUser>().GetAsync(userId);

            login.ADUserPassword = LoginHelper.EncryptPassword(newPassword.ToString());
            await _unitOfWork.GetRepository<ADUser>().UpdateAsync(login);
            await _unitOfWork.CompleteAsync();

            BackgroundJob.Enqueue(() => _sendEmailService.SendNewPasswordAsync(userFormDb.ADUserEmail, newPassword.ToString()));

            return newPassword.ToString();
        }

        public async Task<ServiceResult> ChangePasswordAsync(ChangePasswordDto dto)
        {
            var loginFromDb = await _unitOfWork.GetRepository<ADUser>().GetAsync(_bysSession.UserId);
            if (LoginHelper.EncryptPassword(dto.OldPassword) != loginFromDb.ADUserPassword)
            {
                throw new BusinessException("Mật khẩu cũ không chính xác!");
            }

            loginFromDb.ADUserPassword = LoginHelper.EncryptPassword(dto.NewPassword);
            await _unitOfWork.GetRepository<ADUser>().UpdateAsync(loginFromDb);
            await _unitOfWork.CompleteAsync();

            BackgroundJob.Enqueue(() => _sendEmailService.SendNewPasswordAsync(loginFromDb.ADUserEmail, dto.NewPassword));
            return ServiceResult.Success;
        }

        private ClaimsIdentity GenerateClaimsIdentity(ADUser user)
        {
            var userClaims = new List<Claim>
            {
                new Claim(BysClaimTypes.UserId, user.Id.ToString()),
                new Claim(BysClaimTypes.UserName, user.ADUserEmail),

                new Claim(BysClaimTypes.Role, user.ADUserRole),
            };

            return new ClaimsIdentity(new GenericIdentity(user.ADUserEmail, "Token"), userClaims);
        }

        private async Task<ADUser> GetLoginByUserNameOrEmailAddressAsync(string userNameOrEmailAddress)
        {
            return await _loginRepository.GetFirstOrDefaultAsync(x => x.ADUserEmail == userNameOrEmailAddress);
        }

        private async Task<ADUser> GetLoginByEmailAsync(string email)
        {
            return await _loginRepository.GetFirstOrDefaultAsync(x => x.ADUserEmail == email);
        }
    }
}