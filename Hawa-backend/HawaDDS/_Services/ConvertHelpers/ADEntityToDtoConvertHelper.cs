using _Constants.EntityStatuses;
using _Constants.EntityTypes;
using _Dtos.AD;
using _Entities.AD;
using _Services.Internal.Helpers;

namespace _Services.ConvertHelpers
{
    public static class ADEntityToDtoConvertHelper
    {
        public static UserDto ToUserDto(this ADUser entity)
        {
            return entity == null
                ? null
                : new UserDto
                {
                    Id = entity.Id,
                    Email = entity.ADUserEmail,
                    Type = entity.ADUserType.ToDictionaryItemDto<UserType>(),
                    OrganizationName = entity.ADUserOrganizationName,
                    AcronymName = entity.ADUserAcronymName,
                    TaxNumber = entity.ADUserTaxNumber,
                    Fax = entity.ADUserFax,
                    Website = entity.ADUserWebsite,
                    Representative = entity.ADUserRepresentative,
                    HouseNumber = entity.ADUserHouseNumber,
                    Address = entity.ADUserAddress,
                    IdentityCard = entity.ADUserIdentityCard,
                    StateProvince = entity.GEStateProvince.ToDictionaryItemDto(),
                    District = entity.GEDistrict.ToDictionaryItemDto(),
                    Commune = entity.GECommune.ToDictionaryItemDto(),
                    Avatar = entity.ADUserAvatarFileName.ToImageUrl(),
                    Evaluate = entity.ADUserEvaluate,
                    Status = entity.ADUserStatus.ToDictionaryItemDto<UserStatus>(),
                    Phone = entity.ADUserPhone
                };
        }

        public static ShortUserDto ToShortUserDto(this ADUser entity)
        {
            return entity == null
                ? null
                : new ShortUserDto
                {
                    Id = entity.Id,
                    Email = entity.ADUserEmail,
                    Type = entity.ADUserType.ToDictionaryItemDto<UserType>(),
                    OrganizationName = entity.ADUserOrganizationName,
                    AcronymName = entity.ADUserAcronymName,
                    StateProvince = entity.GEStateProvince.ToDictionaryItemDto(),
                    District = entity.GEDistrict.ToDictionaryItemDto(),
                    Commune = entity.GECommune.ToDictionaryItemDto(),
                    Phone = entity.ADUserPhone,
                    Status = entity.ADUserStatus.ToDictionaryItemDto<UserStatus>(),
                    Avatar = entity.ADUserAvatarFileName.ToImageUrl()
                };
        }
    }
}