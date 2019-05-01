using _Dtos.GE;
using _Entities.GE;

namespace _Services.ConvertHelpers
{
    public static class GEEntityToDtoConvertHelper
    {
        public static ForestProtectionDepartmentDto ToForestProtectionDepartmentDto(this GEForestProtectionDepartment entity)
        {
            return entity == null
                ? null
                : new ForestProtectionDepartmentDto
                {
                    Id = entity.Id,
                    Name = entity.GEForestProtectionDepartmentName,
                    Phone = entity.GEForestProtectionDepartmentPhone,
                    StateProvince = entity.GEStateProvince.ToDictionaryItemDto(),
                    District = entity.GEDistrict.ToDictionaryItemDto()
                };
        }
    }
}