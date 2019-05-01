using System.Threading.Tasks;

using _Dtos.AR;
using _Dtos.AR.InputDtos;
using _Dtos.Shared;
using _Dtos.Shared.Inputs;

namespace _Abstractions.Services.AR
{
    public interface IContactService
    {
        Task<ContactDto> CreateContactAsync(CreateContactDto dto);

        Task<ContactDto> GetContactAsync(int contactId);

        Task<CommuneContactInfoDto> GetCommuneContactInfoAsync(PagingRequestDto pagingAndSortingRequestDto, int communeId);

        Task<IPagedResultDto<SummaryCommuneContactDto>> GetSummaryCommuneContactAsync(PagingRequestDto pagingAndSortingRequestDto, LocationFilterDto locationFilter);

        Task<ContactDto> UpdateContactAsync(EditContactDto dto);

        Task DeleteAsync(int contactId);

        Task MultiDeleteAsync(IdentitiesDto contactIds);

        Task<IPagedResultDto<ShortContactDto>> GetContactsOfCommuneAsync(PagingRequestDto pagingAndSortingRequestDto, FilterContactsOfCommuneDto filter);

        Task ChangeStatusAsync(ChangeContactStatusDto dto);

        Task<IPagedResultDto<ShortContactDto>> FilterForestContactsAsync(PagingAndSortingRequestDto pagingAndSortingRequestDto, FilterContactsDto filter);
    }
}