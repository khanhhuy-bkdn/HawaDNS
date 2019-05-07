using System.Threading.Tasks;

using _Abstractions.Services.AD;
using _Dtos.AD;
using _Dtos.AD.InputDtos;
using _Infrastructure.ApiControllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Swashbuckle.AspNetCore.Annotations;

namespace HawaDDS.Controllers
{
    public class AccountController : ApiControllerBase
    {
        private readonly IUserService _userService;

        public AccountController(IUserService userService)
        {
            _userService = userService;
        }

        /// <summary>
        /// Đăng kí tài khoản
        /// </summary>
        [HttpPost("account/register")]
        [AllowAnonymous]
        [SwaggerResponse(200, "Account created", typeof(UserDto))]
        public async Task<IActionResult> Register([FromBody] CreateUserDto dto)
        {
            var userDto = await _userService.CreateUserAsync(dto);

            return Success(userDto);
        }

        /// <summary>
        /// Gui mail active code
        /// </summary>
        [HttpGet("account/sendactivecode")]
        [AllowAnonymous]
        [SwaggerResponse(200)]
        public async Task<IActionResult> Verify([FromQuery] string email)
        {
            await _userService.SendMailVerifyUserAsync(email);

            return Success();
        }

        /// <summary>
        /// Xác thực tài khoản
        /// </summary>
        [HttpPost("account/verify")]
        [AllowAnonymous]
        [SwaggerResponse(200)]
        public async Task<IActionResult> Verify([FromBody] VerifyUserDto dto)
        {
            await _userService.VerifyUserAsync(dto);

            return Success();
        }

        /// <summary>
        /// Xác thực tài khoản bởi admin
        /// </summary>
        [HttpPost("account/{accountId}/confirm")]
        [AllowAnonymous]
        [SwaggerResponse(200)]
        public async Task<IActionResult> Confirm([FromRoute] int accountId)
        {
            await _userService.ConfirmAccount(accountId);

            return Success();
        }
    }
}