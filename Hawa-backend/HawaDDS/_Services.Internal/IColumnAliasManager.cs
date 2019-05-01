using System.Threading.Tasks;

using _Entities.AA;

namespace _Services.Internal
{
    public interface IColumnAliasManager
    {
        Task<string> GetOrNull(string fieldName);

        Task<AAColumnAlia[]> GetAllValuesAsync();
    }
}