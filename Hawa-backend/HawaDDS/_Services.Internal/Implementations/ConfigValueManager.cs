using System;
using System.Linq;
using System.Threading.Tasks;

using _Common.Helpers;
using _Common.Runtime.Caching;
using _Dtos.Shared;
using _Entities.AD;
using _EntityFrameworkCore.UnitOfWork;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace _Services.Internal.Implementations
{
    public class ConfigValueManager : IConfigValueManager
    {
        private const int CacheExpirationDays = 1;

        private readonly IUnitOfWork _unitOfWork;
        private readonly IRepository<ADConfigValue> _configValueRepository;
        private readonly IMemoryCache _cache;

        public ConfigValueManager(IUnitOfWork unitOfWork, IMemoryCache cache)
        {
            _unitOfWork = unitOfWork;
            _cache = cache;
            _configValueRepository = _unitOfWork.GetRepository<ADConfigValue>();
        }

        private async Task<ADConfigValue[]> AllConfigValuesAsync()
        {
            return await _cache.GetOrCreateAsync(
                BysCacheNames.ConfigValues,
                async entry =>
                {
                    entry.SlidingExpiration = TimeSpan.FromDays(CacheExpirationDays);
                    return await GetConfigKeyGroupsFromDbAsync();
                });
        }

        private async Task<ADConfigValue[]> GetConfigKeyGroupsFromDbAsync()
        {
            return await _configValueRepository.GetAll().ToArrayAsync();
        }

        public async Task<DictionaryItemDto[]> ConfigKeysByGroupAsync(string groupName)
        {
            return await _configValueRepository
                .GetAll()
                .Where(x => x.ADConfigKeyGroup == groupName)
                .OrderBy(x => x.ADConfigValueSortOrder)
                .Select(
                    x => new DictionaryItemDto
                    {
                        Key = x.ADConfigKeyValue,
                        Code = x.ADConfigText,
                    })
                .ToArrayAsync();
        }

        public string GetOrNull(string configKey)
        {
            var all = AsyncHelper.RunSync(AllConfigValuesAsync);

            return all.FirstOrDefault(x => x.ADConfigKey == configKey)?.ADConfigText;
        }

        public string GetOrNull<T>(string configKeyValue)
        {
            var all = AsyncHelper.RunSync(AllConfigValuesAsync);

            return all.FirstOrDefault(x => x.ADConfigKeyGroup == typeof(T).Name && x.ADConfigKeyValue == configKeyValue)?.ADConfigText;
        }
    }
}