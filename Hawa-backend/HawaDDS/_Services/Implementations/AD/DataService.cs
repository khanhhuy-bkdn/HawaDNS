using System.Linq;

using _Abstractions.Services.AD;
using _Common.Helpers;
using _Constants;
using _Constants.EntityStatuses;
using _Constants.EntityTypes;
using _Dtos.AP;
using _Dtos.Shared;
using _Entities.AP;
using _Entities.AR;
using _Entities.GE;
using _Entities.IC;
using _EntityFrameworkCore.Helpers.Linq;
using _EntityFrameworkCore.UnitOfWork;
using _Services.ConvertHelpers;
using _Services.Internal;

namespace _Services.Implementations.AD
{
    public class DataService : IDataService
    {
        private readonly IConfigValueManager _configValueManager;
        private readonly IUnitOfWork _unitOfWork;

        public DataService(IUnitOfWork unitOfWork, IConfigValueManager configValueManager)
        {
            _unitOfWork = unitOfWork;
            _configValueManager = configValueManager;
        }

        public DictionaryItemDto[] VNStateProvinces()
        {
            return _unitOfWork.GetRepository<GEStateProvince>()
                .GetAll()
                .Where(x => x.GECountryCode == CommonConstants.VNCountryCode)
                .OrderBy(x => x.GEStateProvinceName)
                .Select(
                    x => new DictionaryItemDto
                    {
                        Key = x.Id.ToString(),
                        Code = x.GEStateProvinceCode,
                        Text = x.GEStateProvinceName
                    })
                .MakeQueryToDatabase();
        }

        public DictionaryItemDto[] Districts(string stateProvinceCode)
        {
            return _unitOfWork.GetRepository<GEDistrict>()
                .GetAll()
                .Where(x => x.GEStateProvinceCode == stateProvinceCode)
                .OrderBy(x => x.GEDistrictName)
                .Select(
                    x => new DictionaryItemDto
                    {
                        Key = x.Id.ToString(),
                        Code = x.GEDistrictCode,
                        Text = x.GEDistrictName
                    })
                .MakeQueryToDatabase();
        }

        public DictionaryItemDto[] Communes(string districtCode)
        {
            return _unitOfWork.GetRepository<GECommune>()
                .GetAll()
                .Where(x => x.GEDistrictCode == districtCode)
                .OrderBy(x => x.GECommuneName)
                .Select(
                    x => new DictionaryItemDto
                    {
                        Key = x.Id.ToString(),
                        Code = x.GECommuneCode,
                        Text = x.GECommuneName
                    })
                .MakeQueryToDatabase();
        }

        public DictionaryItemDto[] LandUseCerts()
        {
            return _unitOfWork.GetRepository<ICLandUseCert>()
                .GetAll()
                .Select(
                    x => new DictionaryItemDto
                    {
                        Key = x.Id.ToString(),
                        Code = x.ICLandUseCertCode,
                        Text = x.ICLandUseCertName
                    })
                .MakeQueryToDatabase();
        }

        public ActorTypeDto[] ActorTypes()
        {
            return _unitOfWork.GetRepository<APActorType>()
                .GetAll()
                .Select(
                    x => new ActorTypeDto
                    {
                        Id = x.Id,
                        Code = x.APActorTypeCode,
                        Name = x.APActorTypeName,
                        AcronymName = x.APActorTypeAcronymName
                    })
                .MakeQueryToDatabase();
        }

        public DictionaryItemDto[] ContactTypes()
        {
            return _unitOfWork.GetRepository<ARContactType>()
                .GetAll()
                .Select(
                    x => new DictionaryItemDto
                    {
                        Key = x.Id.ToString(),
                        Code = x.ARContactTypeCode,
                        Text = x.ARContactTypeName
                    })
                .MakeQueryToDatabase();
        }

        public DictionaryItemDto[] UserTypes()
        {
            return AsyncHelper.RunSync(() => _configValueManager.ConfigKeysByGroupAsync(nameof(UserType)));
        }

        public DictionaryItemDto[] UserStatuses()
        {
            return AsyncHelper.RunSync(() => _configValueManager.ConfigKeysByGroupAsync(nameof(UserStatus)));
        }

        public DictionaryItemDto[] ContactStatuses()
        {
            return AsyncHelper.RunSync(() => _configValueManager.ConfigKeysByGroupAsync(nameof(ContactStatus)));
        }

        public DictionaryItemDto[] ForestCerts()
        {
            return _unitOfWork.GetRepository<ICForestCert>()
                .GetAll()
                .Select(
                    x => new DictionaryItemDto
                    {
                        Key = x.Id.ToString(),
                        Code = x.ICForestCertCode,
                        Text = x.ICForestCertName
                    })
                .MakeQueryToDatabase();
        }

        public DictionaryItemDto[] ForestPlotReliabilities()
        {
            return AsyncHelper.RunSync(() => _configValueManager.ConfigKeysByGroupAsync(nameof(ForestPlotReliability)));
        }

        public DictionaryItemDto[] Compartments()
        {
            return _unitOfWork.GetRepository<GECompartment>()
                .GetAll()
                .Select(
                    x => new DictionaryItemDto
                    {
                        Key = x.Id.ToString(),
                        Code = x.GECompartmentCode,
                        Text = x.GECompartmentName
                    })
                .MakeQueryToDatabase();
        }

        public DictionaryItemDto[] ActorRoles()
        {
            return _unitOfWork.GetRepository<APRole>()
                .GetAll()
                .Select(
                    x => x.ToDictionaryItemDto())
                .MakeQueryToDatabase();
        }

        public DictionaryItemDto[] Compartments(int communeId)
        {
            return _unitOfWork.GetRepository<GECompartment>()
                .GetAll()
                .Where(x => x.FK_GECommuneID == communeId)
                .Select(
                    x => new DictionaryItemDto
                    {
                        Key = x.Id.ToString(),
                        Code = x.GECompartmentCode,
                        Text = x.GECompartmentName
                    })
                .MakeQueryToDatabase();
        }

        public DictionaryItemDto[] SubCompartments(int compartmentId)
        {
            return _unitOfWork.GetRepository<GESubCompartment>()
                .GetAll()
                .Where(x => x.FK_GECompartmentID == compartmentId)
                .Select(
                    x => new DictionaryItemDto
                    {
                        Key = x.Id.ToString(),
                        Code = x.GESubCompartmentCode,
                        Text = x.GESubCompartmentName
                    })
                .MakeQueryToDatabase();
        }

        public DictionaryItemDto[] Plots(int subCompartmentId)
        {
            return _unitOfWork.GetRepository<ICForestPlot>()
                .GetAll()
                .Where(x => x.FK_GESubCompartmentID == subCompartmentId)
                .Select(
                    x => new DictionaryItemDto
                    {
                        Code = x.GEPlotCode
                    })
                .MakeQueryToDatabase();
        }

        public DictionaryItemDto[] VNStateProvincesShow()
        {
            return _unitOfWork.GetRepository<GEStateProvince>()
                .GetAll()
                .Where(x => x.GECountryCode == CommonConstants.VNCountryCode && !x.GEStateProvinceIsHidden.GetValueOrDefault())
                .OrderBy(x => x.GEStateProvinceName)
                .Select(
                    x => new DictionaryItemDto
                    {
                        Key = x.Id.ToString(),
                        Code = x.GEStateProvinceCode,
                        Text = x.GEStateProvinceName
                    })
                .MakeQueryToDatabase();
        }
    }
}