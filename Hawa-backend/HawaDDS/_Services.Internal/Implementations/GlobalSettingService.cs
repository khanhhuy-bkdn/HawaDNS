using Microsoft.Extensions.Configuration;

namespace _Services.Internal.Implementations
{
    public class GlobalSettingService : IGlobalSettingService
    {
        public GlobalSettingService(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        private IConfiguration Configuration { get; }

        public string GetSiteDomainUrl()
        {
            return Configuration.GetValue<string>("SiteDomainWww");
        }
    }
}