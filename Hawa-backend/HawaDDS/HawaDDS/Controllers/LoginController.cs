using _Abstractions.Services.AD;
using _Common;
using _Dtos.AD.InputDtos;
using _Dtos.ServiceResults;
using _Infrastructure.ApiControllers;
using _Infrastructure.ApiResults;
using _Infrastructure.Filters;
using _Abstractions.Services.AD;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HawaDDS.Controllers
{
    public class LoginController: ApiControllerBase
    {
        private readonly ILoginService _loginService;
        private readonly ITokenService _tokenService;

        public LoginController(ITokenService tokenService, ILoginService loginService)
        {
            _tokenService = tokenService;
            _loginService = loginService;
        }

        /// <summary>
        /// Đăng nhập mobile
        /// </summary>
        [HttpPost("loginmobile")]
        [AllowAnonymous]
        [ModelValidationFilter]
        public async Task<IActionResult> LoginMobile([FromBody] LoginDto dto)
        {
            var loginResult = await _loginService.LoginAsync(dto);

            switch (loginResult.Result)
            {
                case LoginResultType.InvalidUserNameOrPassword:
                    return BadRequest(ApiErrorCodes.UserLoginInvalidUserNameOrPassword, "Invalid username or password");

                case LoginResultType.UserLockout:
                    return BadRequest(ApiErrorCodes.UserLoginIsNotActive, "User login is logout");

                case LoginResultType.UserIsNotEmailConfirm:
                    return BadRequest(ApiErrorCodes.NotValidatedEmail, "User login is not email confirm");

                case LoginResultType.UserIsNotVerifyByAdmin:
                    return BadRequest(ApiErrorCodes.UserLoginIsNotActive, "User login is not verify by admin");

                case LoginResultType.Success:
                    var jwtToken = await _tokenService.RequestTokenAsync(loginResult.Identity, ApplicationType.Mobile);
                    return Success(jwtToken);

                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        /// <summary>
        /// Đăng nhập Web
        /// </summary>
        [HttpPost("loginweb")]
        [AllowAnonymous]
        [ModelValidationFilter]
        public async Task<IActionResult> LoginWeb([FromBody] LoginDto dto)
        {
            var loginResult = await _loginService.LoginAsync(dto);

            switch (loginResult.Result)
            {
                case LoginResultType.InvalidUserNameOrPassword:
                    return BadRequest(ApiErrorCodes.UserLoginInvalidUserNameOrPassword, "Invalid username or password");

                case LoginResultType.UserLockout:
                    return BadRequest(ApiErrorCodes.UserLoginIsNotActive, "User login is logout");

                case LoginResultType.UserIsNotEmailConfirm:
                    return BadRequest(ApiErrorCodes.NotValidatedEmail, "User login is not email confirm");

                case LoginResultType.UserIsNotVerifyByAdmin:
                    return BadRequest(ApiErrorCodes.UserLoginIsNotActive, "User login is not verify by admin");

                case LoginResultType.Success:
                    var jwtToken = await _tokenService.RequestTokenAsync(loginResult.Identity, ApplicationType.Web);
                    return Success(jwtToken);

                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        /// <summary>
        /// Đăng xuất
        /// </summary>
        [HttpPost("logout")]
        [AllowAnonymous]
        public async Task<IActionResult> Logout()
        {
            await _loginService.LogoutAsync();

            return Success();
        }

        /// <summary>
        /// Quên mật khẩu, gửi mail reset mật khẩu
        /// </summary>
        [HttpPost("password/forgot")]
        [AllowAnonymous]
        [ModelValidationFilter]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            await _loginService.SetResetPasswordActiveCodeAndSendEmail(dto);

            return Success();
        }

        /// <summary>
        /// Xác thực active code
        /// </summary>
        [HttpPost("password/validateactivecode")]
        [AllowAnonymous]
        [ModelValidationFilter]
        public async Task<IActionResult> ValidateActiveCode([FromBody] ValidateActiceCodeDto dto)
        {
            var result = await _loginService.ValidateResetPasswordActiveCodeAsync(dto);

            if (!result.Succeeded)
            {
                return BadRequest(ApiErrorCodes.ResetPasswordActiveCodeIsIncorrect, "Reset password active code is incorrect.");
            }

            return Success(((ServiceResult<string>)result).Result);
        }

        /// <summary>
        /// Reset mật khẩu 
        /// </summary>
        [HttpPost("password/reset")]
        [AllowAnonymous]
        [ModelValidationFilter]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var result = await _loginService.ResetPasswordWithTokenAsync(dto);

            if (!result.Succeeded)
            {
                return BadRequest(result);
            }

            return Success();
        }

        /// <summary>
        /// Reset mật khẩu bởi admin
        /// </summary>
        [HttpPost("{userId}/password/reset")]
        [ModelValidationFilter]
        [SwaggerResponse(200, "", typeof(string))]
        public async Task<IActionResult> ResetPasswordByAdmin([FromRoute] int userId)
        {
            var result = await _loginService.ResetPasswordByAdminAsync(userId);

            return Success(result);
        }

        /// <summary>
        /// Thay đổi mật khẩu 
        /// </summary>
        [HttpPost("me/password/change")]
        [ModelValidationFilter]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var result = await _loginService.ChangePasswordAsync(dto);

            if (!result.Succeeded)
            {
                return BadRequest(result);
            }

            return Success();
        }
    }
}
