using System.Threading.Tasks;

using _Dtos.GE.InputDto;

namespace _Abstractions.Services.GE
{
    public interface ICommuneService
    {
        Task EditCommuneLocationAsync(EditCommuneLocationDto dto);
    }
}