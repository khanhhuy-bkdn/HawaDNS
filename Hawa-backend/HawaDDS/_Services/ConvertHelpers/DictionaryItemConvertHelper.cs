using _Common.Dependency;
using _Dtos.Shared;
using _Entities.AP;
using _Entities.AR;
using _Entities.GE;
using _Entities.IC;
using _Services.Internal;

namespace _Services.ConvertHelpers
{
    public static class DictionaryItemConvertHelper
    {
        public static DictionaryItemDto ToDictionaryItemDto<T>(this string value)
        {
            return value == null
                ? null
                : new DictionaryItemDto
                {
                    Key = value,
                    Code = value,
                    Text = SingletonDependency<IConfigValueManager>.Instance.GetOrNull<T>(value) ?? value
                };
        }

        public static DictionaryItemDto ToDictionaryItemDto(this string value, string type)
        {
            return type == null
                ? null
                : new DictionaryItemDto
                {
                    Key = value,
                    Code = value,
                    Text = SingletonDependency<IConfigValueManager>.Instance.GetOrNull(type + value) ?? value
                };
        }

        public static DictionaryItemDto ToDictionaryItemDto(this GEStateProvince value)
        {
            return value == null
                ? null
                : new DictionaryItemDto
                {
                    Key = value.Id.ToString(),
                    Code = value.GEStateProvinceCode,
                    Text = value.GEStateProvinceName
                };
        }

        public static DictionaryItemDto ToDictionaryItemDto(this GEDistrict value)
        {
            return value == null
                ? null
                : new DictionaryItemDto
                {
                    Key = value.Id.ToString(),
                    Code = value.GEDistrictCode,
                    Text = value.GEDistrictName
                };
        }

        public static DictionaryItemDto ToDictionaryItemDto(this GECommune value)
        {
            return value == null
                ? null
                : new DictionaryItemDto
                {
                    Key = value.Id.ToString(),
                    Code = value.GECommuneCode,
                    Text = value.GECommuneName
                };
        }

        public static DictionaryItemDto ToDictionaryItemDto(this ARContactType value)
        {
            return value == null
                ? null
                : new DictionaryItemDto
                {
                    Key = value.Id.ToString(),
                    Code = value.ARContactTypeCode,
                    Text = value.ARContactTypeName
                };
        }

        public static DictionaryItemDto ToDictionaryItemDto(this GECompartment value)
        {
            return value == null
                ? null
                : new DictionaryItemDto
                {
                    Key = value.Id.ToString(),
                    Code = value.GECompartmentCode,
                    Text = value.GECompartmentName
                };
        }

        public static DictionaryItemDto ToDictionaryItemDto(this GESubCompartment value)
        {
            return value == null
                ? null
                : new DictionaryItemDto
                {
                    Key = value.Id.ToString(),
                    Code = value.GESubCompartmentCode,
                    Text = value.GESubCompartmentName
                };
        }

        public static DictionaryItemDto ToDictionaryItemDto(this ICForestCert value)
        {
            return value == null
                ? null
                : new DictionaryItemDto
                {
                    Key = value.Id.ToString(),
                    Code = value.ICForestCertCode,
                    Text = value.ICForestCertName
                };
        }

        public static DictionaryItemDto ToDictionaryItemDto(this GEPeoplesCommittee value)
        {
            return value == null
                ? null
                : new DictionaryItemDto
                {
                    Key = value.Id.ToString(),
                    Code = value.GEPeoplesCommitteeName,
                    Text = value.GEPeoplesCommitteeAddress + "-" + value.GEPeoplesCommitteePhone
                };
        }

        public static DictionaryItemDto ToDictionaryItemDto(this APRole value)
        {
            return value == null
                ? null
                : new DictionaryItemDto
                {
                    Key = value.Id.ToString(),
                    Code = value.APRoleCode,
                    Text = value.APRoleName
                };
        }

        public static DictionaryItemDto ToDictionaryItemDto(this ICLandUseCert value)
        {
            return value == null
                ? null
                : new DictionaryItemDto
                {
                    Key = value.Id.ToString(),
                    Code = value.ICLandUseCertCode,
                    Text = value.ICLandUseCertName
                };
        }
    }
}