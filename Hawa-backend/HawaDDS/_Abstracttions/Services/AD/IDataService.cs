using _Dtos.AP;
using _Dtos.Shared;

namespace _Abstractions.Services.AD
{
    public interface IDataService
    {
        DictionaryItemDto[] VNStateProvinces();

        DictionaryItemDto[] VNStateProvincesShow();

        DictionaryItemDto[] Districts(string stateProvinceCode);

        DictionaryItemDto[] Communes(string districtCode);

        DictionaryItemDto[] LandUseCerts();

        ActorTypeDto[] ActorTypes();

        DictionaryItemDto[] ContactTypes();

        DictionaryItemDto[] UserTypes();

        DictionaryItemDto[] UserStatuses();

        DictionaryItemDto[] ContactStatuses();

        DictionaryItemDto[] ForestCerts();

        DictionaryItemDto[] ForestPlotReliabilities();

        DictionaryItemDto[] Compartments();

        DictionaryItemDto[] ActorRoles();

        DictionaryItemDto[] Compartments(int communeId);

        DictionaryItemDto[] SubCompartments(int compartmentId);

        DictionaryItemDto[] Plots(int subCompartmentId);
    }
}