using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using _Abstractions.Services.AD;
using _Common.Runtime.Session;
using _Dtos.AD;
using _Dtos.AD.InputDtos;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;
using _Infrastructure.ApiControllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace HawaDDS.Controllers
{
    [Authorize]
    public class UserController : ApiControllerBase
    {
        private readonly IUserService _userService;
        private readonly IBysSession _sesionService;

        public UserController(IUserService userService, IBysSession sesionService)
        {
            _userService = userService;
            _sesionService = sesionService;
        }

        /// <summary>
        /// Chi tiết thông tin người dùng
        /// </summary>
        [HttpGet("user/{userId}")]
        [SwaggerResponse(200, "", typeof(IPagedResultDto<UserDto>))]
        public async Task<IActionResult> Get([FromRoute] int userId)
        {
            var userDto = await _userService.GetUserAsync(userId);

            return Success(userDto);
        }

        /// <summary>
        /// Chi tiết thông tin người dùng hiện tại
        /// </summary>
        [HttpGet("user/me")]
        [SwaggerResponse(200, "", typeof(IPagedResultDto<UserDto>))]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userDto = await _userService.GetUserAsync(_sesionService.UserId);

            return Success(userDto);
        }

        /// <summary>
        /// chỉnh sửa thông tin người dùng
        /// </summary>
        [HttpPost("user/update")]
        [SwaggerResponse(200, "", typeof(IPagedResultDto<UserDto>))]
        public async Task<IActionResult> Update([FromBody] EditUserDto dto)
        {
            var userDto = await _userService.UpdateUserAsync(dto);

            return Success(userDto);
        }

        /// <summary>
        /// Cập nhật ảnh đại diện cho người dùng
        /// </summary>
        [HttpPost("user/{userId}/updateavatar")]
        public async Task<IActionResult> UpdateAvatarForUser(int userId, [FromForm] EditUserAvatarDto dto)
        {
            var result = await _userService.UpdateUserAvatarAsync(userId, dto);

            return Success(result);
        }

        /// <summary>
        /// Danh sách user (tìm kiếm theo tên,email,sdt,cmnd, lọc và sorting)
        /// </summary>
        [HttpGet("user/filter/{page:int}/{pageSize:int}")]
        [SwaggerResponse(200, "", typeof(IPagedResultDto<ShortUserDto>))]
        public async Task<IActionResult> Filter(
            [FromRoute] int page,
            [FromRoute] int pageSize,
            [FromQuery] string searchTerm,
            [FromQuery] string type,
            [FromQuery] int? stateProvinceID,
            [FromQuery] int? districtID,
            [FromQuery] int? communeID,
            [FromQuery] string status,
            [FromQuery] string sorting)
        {
            var result = await _userService.FilterUsersAsync(
                new PagingAndSortingRequestDto
                {
                    Page = page,
                    PageSize = pageSize,
                    Sorting = sorting
                },
                new FilterUsersDto
                {
                    Type = type,
                    StateProvinceID = stateProvinceID,
                    DistrictID = districtID,
                    CommuneID = communeID,
                    SearchTerm = searchTerm,
                    Status = status
                });

            return Success(result);
        }

        /// <summary>
        /// Xóa user
        /// </summary>
        [HttpGet("user/{userId}/delete")]
        public async Task<IActionResult> Delete(int userId)
        {
            await _userService.DeleteUserAsync(userId);

            return Success();
        }

        /// <summary>
        /// Xóa nhiều user
        /// </summary>
        [HttpPost("user/multidelete")]
        public async Task<IActionResult> MultiDelete(IdentitiesDto userIds)
        {
            await _userService.DeleteUsersAsync(userIds);

            return Success();
        }

        /// <summary>
        /// Tạo mới user
        /// </summary>
        [HttpPost("user/create")]
        [SwaggerResponse(200, "", typeof(UserDto))]
        public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
        {
            var result = await _userService.CreateUserAsync(dto);

            return Success(result);
        }

        /// <summary>
        /// Check email tạo user
        /// </summary>
        [HttpPost("user/checkexistemail")]
        [AllowAnonymous]
        [SwaggerResponse(200, "", typeof(bool))]
        public async Task<IActionResult> Check([FromBody] CheckExistEmailDto dto)
        {
            var result = await _userService.CheckEmailAsync(dto);

            return Success(result);
        }
    }
}
