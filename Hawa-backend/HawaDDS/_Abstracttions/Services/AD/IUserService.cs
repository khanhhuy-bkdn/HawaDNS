using System.Threading.Tasks;

using _Dtos.AD;
using _Dtos.AD.InputDtos;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;

namespace _Abstractions.Services.AD
{
    public interface IUserService
    {
        Task<UserDto> CreateUserAsync(CreateUserDto dto);

        Task<UserDto> GetUserAsync(int userId);

        Task<UserDto> UpdateUserAsync(EditUserDto dto);

        Task<ImageUrlDto> UpdateUserAvatarAsync(int userId, EditUserAvatarDto dto);

        Task<IPagedResultDto<ShortUserDto>> FilterUsersAsync(PagingAndSortingRequestDto pagingAndSortingRequestDto, FilterUsersDto filter);

        Task DeleteUserAsync(int userId);

        Task DeleteUsersAsync(IdentitiesDto dto);

        Task VerifyUserAsync(VerifyUserDto dto);

        Task ConfirmAccount(int accountId);

        Task<bool> CheckEmailAsync(CheckExistEmailDto dto);

        Task SendMailVerifyUserAsync(string email);
    }
}