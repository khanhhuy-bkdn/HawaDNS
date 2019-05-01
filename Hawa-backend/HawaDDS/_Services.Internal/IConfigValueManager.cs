using System.Threading.Tasks;

using _Dtos.Shared;

namespace _Services.Internal
{
    public interface IConfigValueManager
    {
        Task<DictionaryItemDto[]> ConfigKeysByGroupAsync(string groupName);

        string GetOrNull(string configKey);

        string GetOrNull<T>(string configKeyValue);
    }
}