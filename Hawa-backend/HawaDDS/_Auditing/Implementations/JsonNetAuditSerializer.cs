using _Auditing.Interfaces;

using Newtonsoft.Json;

namespace _Auditing.Implementations
{
    public class JsonNetAuditSerializer : IAuditSerializer
    {
        private readonly IAuditingConfiguration _configuration;

        public JsonNetAuditSerializer(IAuditingConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string Serialize(object obj)
        {
            var options = new JsonSerializerSettings
            {
                ContractResolver = new AuditingContractResolver(_configuration.IgnoredTypes)
            };

            return JsonConvert.SerializeObject(obj, options);
        }
    }
}