using System;
using System.Linq;
using System.Threading.Tasks;

using _Common.Extensions;
using _Common.Runtime.Caching;
using _Entities.AA;
using _EntityFrameworkCore.Helpers.Linq;
using _EntityFrameworkCore.UnitOfWork;

using Microsoft.Extensions.Caching.Memory;

namespace _Services.Internal.Implementations
{
    public class ColumnAliasManager : IColumnAliasManager
    {
        private const int CacheExpirationDays = 1;

        private readonly IUnitOfWork _unitOfWork;
        private readonly IRepository<AAColumnAlia> _columnAliaRepository;
        private readonly IMemoryCache _cache;

        public ColumnAliasManager(IUnitOfWork unitOfWork, IMemoryCache cache)
        {
            _unitOfWork = unitOfWork;
            _cache = cache;
            _columnAliaRepository = _unitOfWork.GetRepository<AAColumnAlia>();
        }

        public async Task<string> GetOrNull(string columnName)
        {
            return (await GetAllValuesAsync()).FirstOrDefault(x => x.AAColumnAliasName == columnName).IfNotNull(x => x.AAColumnAliasCaption);
        }

        public async Task<AAColumnAlia[]> GetAllValuesAsync()
        {
            return await _cache.GetOrCreateAsync(
                BysCacheNames.ColumnAlias,
                async entry =>
                {
                    entry.SlidingExpiration = TimeSpan.FromDays(CacheExpirationDays);

                    return await GetAllValuesFromDbAsync();
                });
        }

        private async Task<AAColumnAlia[]> GetAllValuesFromDbAsync()
        {
            return await _columnAliaRepository
                .GetAll()
                .MakeQueryToDatabaseAsync();
        }
    }
}