using _Abstractions.Services.AD;
using _EntityFrameworkCore.UnitOfWork;
using _Services.Internal;

namespace _Services.Implementations.AD
{
    public class DictionaryDataService : IDictionaryDataService
    {
        private readonly IConfigValueManager _configValueManager;
        private readonly IUnitOfWork _unitOfWork;

        public DictionaryDataService(IConfigValueManager configValueManager, IUnitOfWork unitOfWork)
        {
            _configValueManager = configValueManager;
            _unitOfWork = unitOfWork;
        }
    }
}