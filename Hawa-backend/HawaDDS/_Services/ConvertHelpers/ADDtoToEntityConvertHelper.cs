using _Common.Extensions;
using _Constants;
using _Constants.EntityStatuses;
using _Dtos.AD.InputDtos;
using _Entities.AD;
using _Services.Implementations.AD.Helpers;

namespace _Services.ConvertHelpers
{
    public static class ADDtoToEntityConvertHelper
    {
        public static ADUser ToADUserEntity(this CreateUserDto dto)
        {
            return new ADUser
            {
                ADUserOrganizationName = dto.OrganizationName,
                ADUserAcronymName = dto.AcronymName,
                ADUserTaxNumber = dto.TaxNumber,
                ADUserPhone = dto.Phone,
                ADUserFax = dto.Fax,
                ADUserWebsite = dto.Website,
                ADUserRepresentative = dto.Representative,
                ADUserHouseNumber = dto.HouseNumber,
                ADUserAddress = dto.Address,
                ADUserIdentityCard = dto.IdentityCard,
                ADUserType = dto.Type,
                FK_GEStateProvinceID = dto.StateProvinceID,
                FK_GECommuneID = dto.CommuneID,
                FK_GEDistrictID = dto.DistrictID,
                ADUserEmail = dto.Email,
                ADUserAvatarFileName = dto.Avatar.IsNullOrEmpty() ? string.Empty : dto.Avatar + CommonConstants.DefaultImageExtension,
                ADUserStatus = UserStatus.NotValidatedEmail,
                ADUserEvaluate = dto.Evaluate,
                ADUserPassword = dto.Password.IsNullOrEmpty() ? string.Empty : LoginHelper.EncryptPassword(dto.Password),
                ADUserRole = "Buyer"
            };
        }
    }
}