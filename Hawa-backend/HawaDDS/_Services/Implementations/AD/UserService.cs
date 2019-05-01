using System.Linq;
using System.Threading.Tasks;

using _Abstractions.Services.AD;
using _Common.Exceptions;
using _Common.Extensions;
using _Common.Helpers;
using _Common.Runtime.Session;
using _Constants;
using _Constants.EntityStatuses;
using _Dtos.AD;
using _Dtos.AD.InputDtos;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;
using _Entities.AD;
using _EntityFrameworkCore.Helpers.Linq;
using _EntityFrameworkCore.UnitOfWork;
using _Services.ConvertHelpers;
using _Services.Implementations.AD.Helpers;
using _Services.Internal;
using _Services.Internal.Helpers;
using _Services.Internal.Helpers.PagedResult;

using Hangfire;

using Microsoft.EntityFrameworkCore;

namespace _Services.Implementations.AD
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IStorageProvider _storageProvider;
        private readonly IMessageService _messageService;
        private readonly IDataProtectorUserTokenService _dataProtectorUserTokenService;
        private readonly IBysSession _bysSession;

        private IRepository<ADUser> _userRepository => _unitOfWork.GetRepository<ADUser>();

        public UserService(
            IUnitOfWork unitOfWork,
            IStorageProvider storageProvider,
            IMessageService messageService,
            IDataProtectorUserTokenService dataProtectorUserTokenService,
            IBysSession bysSession)
        {
            _unitOfWork = unitOfWork;
            _storageProvider = storageProvider;
            _messageService = messageService;
            _dataProtectorUserTokenService = dataProtectorUserTokenService;
            _bysSession = bysSession;
        }

        public async Task<UserDto> CreateUserAsync(CreateUserDto dto)
        {
            CheckDuplicateUser(dto.Email);
            var userDtoToCreate = dto.ToADUserEntity();
            var newUser = await _userRepository.InsertAsync(userDtoToCreate);

            await _unitOfWork.CompleteAsync();

            if (_bysSession.GetUserId() > 0)
            {
                BackgroundJob.Enqueue(() => SendMailAnnouncePasswordUserAsync(dto.Email));
            }
            else
            {
                BackgroundJob.Enqueue(() => SendMailVerifyUserAsync(dto.Email));
            }

            return await GetUserAsync(newUser.Id);
        }

        public async Task<UserDto> GetUserAsync(int userId)
        {
            var userFromDb = await _userRepository.GetAllIncluding(x => x.GEStateProvince, x => x.GEDistrict, x => x.GECommune)
                .FirstOrDefaultAsync(x => x.Id == userId);

            return userFromDb.ToUserDto();
        }

        public async Task<UserDto> UpdateUserAsync(EditUserDto dto)
        {
            CheckDuplicateUser(dto.Email, dto.Id);

            var userFromDb = await _userRepository.GetAsync(dto.Id);
            UpdateUserDto(userFromDb, dto);

            await _userRepository.UpdateAsync(userFromDb);

            await _unitOfWork.CompleteAsync();

            return await GetUserAsync(userFromDb.Id);
        }

        public async Task<ImageUrlDto> UpdateUserAvatarAsync(int userId, EditUserAvatarDto dto)
        {
            var userFromDb = await _userRepository.GetAsync(userId);

            if (dto.ImageFiles.IsNullOrEmpty())
            {
                userFromDb.ADUserAvatarFileName = string.Empty;
            }
            else
            {
                userFromDb.ADUserAvatarFileName = ImageUrlHelper.NewImageFileName();

                _storageProvider.CreateImage(ImageUrlHelper.GetFileGuid(userFromDb.ADUserAvatarFileName).GetValueOrDefault(), dto.ImageFiles.First());
            }

            await _userRepository.UpdateAsync(userFromDb);

            await _unitOfWork.CompleteAsync();

            return ImageUrlHelper.ToImageUrl(ImageUrlHelper.GetFileGuid(userFromDb.ADUserAvatarFileName).GetValueOrDefault());
        }

        public async Task<IPagedResultDto<ShortUserDto>> FilterUsersAsync(PagingAndSortingRequestDto pagingAndSortingRequestDto, FilterUsersDto filter)
        {
            var query = GetFilterUsersQuery(filter);

            return await query.ApplySorting(pagingAndSortingRequestDto).GetPagedResultAsync(pagingAndSortingRequestDto.Page, pagingAndSortingRequestDto.PageSize, x => x.ToShortUserDto());
        }

        public async Task DeleteUserAsync(int userId)
        {
            var userToDelete = await _userRepository.GetAsync(userId);
            userToDelete.ADUserStatus = UserStatus.Inactive;
            await _userRepository.UpdateAsync(userToDelete);
            await _unitOfWork.CompleteAsync();
        }

        public async Task DeleteUsersAsync(IdentitiesDto dto)
        {
            if (dto == null)
            {
                return;
            }

            foreach (var i in dto.Ids)
            {
                await DeleteUserAsync(i);
            }
        }

        public async Task SendMailVerifyUserAsync(string email)
        {
            var user = await _unitOfWork.GetRepository<ADUser>()
                .GetAll()
                .FirstOrDefaultAsync(x => x.ADUserEmail == email);

            if (user == null)
            {
                throw new BusinessException("Không tìm thấy tài khoản!!!");
            }

            if (user.ADUserStatus != UserStatus.NotValidatedEmail)
            {
                throw new AccountAlreadyVerifyException("Tài khoản đã được xác thực!!!");
            }

            var code = await _dataProtectorUserTokenService.GenerateVerifyUserTokenAsync(user.Id);

            BackgroundJob.Enqueue(() => _messageService.SendMailVerifyUserAsync(user, code));
        }

        public async Task SendMailAnnouncePasswordUserAsync(string email)
        {
            var user = await _unitOfWork.GetRepository<ADUser>()
                .GetAll()
                .FirstOrDefaultAsync(x => x.ADUserEmail == email);

            if (user == null)
            {
                throw new BusinessException("Không tìm thấy tài khoản!!!");
            }

            var code = await _dataProtectorUserTokenService.GenerateVerifyUserTokenAsync(user.Id);

            var password = RandomHelper.GetRandomString(6);

            user.ADUserPassword = LoginHelper.EncryptPassword(password);

            await _unitOfWork.CompleteAsync();

            BackgroundJob.Enqueue(() => _messageService.SendMailSetPasswordUserAsync(user, password, code));
        }

        public async Task ConfirmAccount(int accountId)
        {
            var userFromDb = await _unitOfWork.GetRepository<ADUser>().GetAsync(accountId);
            userFromDb.ADUserStatus = UserStatus.Active;

            await _unitOfWork.GetRepository<ADUser>().UpdateAsync(userFromDb);

            await _unitOfWork.CompleteAsync();
        }

        public async Task<bool> CheckEmailAsync(CheckExistEmailDto dto)
        {
            var user = await _unitOfWork.GetRepository<ADUser>().GetFirstOrDefaultAsync(x => x.ADUserEmail == dto.Email);
            return user != null;
        }

        public async Task VerifyUserAsync(VerifyUserDto dto)
        {
            var user = await _unitOfWork.GetRepository<ADUser>().GetFirstOrDefaultAsync(x => x.ADUserEmail == dto.Email);

            if (user == null)
            {
                throw new BusinessException("Không tìm thấy email!!!");
            }

            if (user.ADUserStatus != UserStatus.NotValidatedEmail)
            {
                throw new AccountAlreadyVerifyException("Tài khoản đã được xác thực!!!");
            }

            if (_dataProtectorUserTokenService.ValidateVerifyUserToken(user.Id, dto.ActiveToken))
            {
                user.ADUserStatus = UserStatus.Active;

                await _unitOfWork.GetRepository<ADUser>().UpdateAsync(user);

                await _dataProtectorUserTokenService.DeleteTokenAsync(dto.ActiveToken);

                await _unitOfWork.CompleteAsync();
            }
            else
            {
                throw new VerifyAccountFailedException("Tài khoản xác thực lỗi.");
            }
        }

        private void CheckDuplicateUser(string email, int excludeId = 0)
        {
            var existUser = _userRepository.GetFirstOrDefault(x => x.ADUserEmail == email);

            if (existUser != null && existUser.Id != excludeId)
            {
                throw new DuplicateUserEmailException("Email đăng nhập trùng với user khác!");
            }
        }

        private static void UpdateUserDto(ADUser entity, EditUserDto dto)
        {
            if (entity == null)
            {
                throw new EntityNotFoundException();
            }

            entity.ADUserOrganizationName = dto.OrganizationName;
            entity.ADUserAcronymName = dto.AcronymName;
            entity.ADUserTaxNumber = dto.TaxNumber;
            entity.ADUserPhone = dto.Phone;
            entity.ADUserFax = dto.Fax;
            entity.ADUserWebsite = dto.Website;
            entity.ADUserRepresentative = dto.Representative;
            entity.ADUserHouseNumber = dto.HouseNumber;
            entity.ADUserAddress = dto.Address;
            entity.ADUserIdentityCard = dto.IdentityCard;
            entity.ADUserType = dto.Type;
            entity.FK_GEStateProvinceID = dto.StateProvinceID;
            entity.FK_GEDistrictID = dto.DistrictID;
            entity.FK_GECommuneID = dto.CommuneID;
            entity.ADUserEmail = dto.Email;
            entity.ADUserStatus = dto.Status;
            entity.ADUserEvaluate = dto.Evaluate;
            entity.ADUserAvatarFileName = dto.Avatar.IsNullOrEmpty() ? string.Empty : dto.Avatar + CommonConstants.DefaultImageExtension;
        }

        private IQueryable<ADUser> GetFilterUsersQuery(FilterUsersDto filter)
        {
            return _userRepository.GetAll()
                .Include(x => x.GEDistrict)
                .Include(x => x.GECommune)
                .Include(x => x.GEStateProvince)
                .SearchByFields(
                    filter.SearchTerm,
                    x => x.ADUserOrganizationName,
                    x => x.ADUserAcronymName,
                    x => x.ADUserRepresentative,
                    x => x.ADUserPhone,
                    x => x.ADUserIdentityCard,
                    x => x.ADUserEmail)
                .WhereIf(!filter.Type.IsNullOrWhiteSpace(), x => x.ADUserType == filter.Type)
                .WhereIf(filter.StateProvinceID.HasValue, x => x.FK_GEStateProvinceID == filter.StateProvinceID)
                .WhereIf(filter.DistrictID.HasValue, x => x.FK_GEDistrictID == filter.DistrictID)
                .WhereIf(filter.CommuneID.HasValue, x => x.FK_GECommuneID == filter.CommuneID)
                .WhereIf(!filter.Status.IsNullOrWhiteSpace(), x => x.ADUserStatus == filter.Status);
        }
    }
}