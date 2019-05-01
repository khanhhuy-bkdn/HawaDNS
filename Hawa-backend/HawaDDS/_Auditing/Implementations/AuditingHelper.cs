using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

using _Auditing.Interfaces;
using _Common.Extensions;
using _Common.Runtime.Session;
using _Common.Timing;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;

namespace _Auditing.Implementations
{
    public class AuditingHelper : IAuditingHelper
    {
        public ILogger Logger { get; set; }

        public IBysSession BysSession { get; set; }

        public IAuditingStore AuditingStore { get; set; }

        private readonly IAuditInfoProvider _auditInfoProvider;
        private readonly IAuditingConfiguration _configuration;

        private readonly IAuditSerializer _auditSerializer;

        public AuditingHelper(
            IAuditInfoProvider auditInfoProvider,
            IAuditingStore auditingStore,
            IAuditingConfiguration configuration,
            IBysSession bysSession,
            IAuditSerializer auditSerializer)
        {
            _auditInfoProvider = auditInfoProvider;
            _configuration = configuration;
            _auditSerializer = auditSerializer;

            BysSession = bysSession;
            Logger = NullLogger.Instance;
            AuditingStore = auditingStore;
        }

        public bool ShouldSaveAudit(MethodInfo methodInfo, bool defaultValue = false)
        {
            if (!_configuration.IsEnabled)
            {
                return false;
            }

            if (!_configuration.IsEnabledForAnonymousUsers && (BysSession?.GetUserId() == null))
            {
                return false;
            }

            if (methodInfo == null)
            {
                return false;
            }

            if (!methodInfo.IsPublic)
            {
                return false;
            }

            if (methodInfo.IsDefined(typeof(AuditedAttribute), true))
            {
                return true;
            }

            if (methodInfo.IsDefined(typeof(DisableAuditingAttribute), true))
            {
                return false;
            }

            if (methodInfo.IsDefined(typeof(HttpPostAttribute), true))
            {
                return true;
            }

            var classType = methodInfo.DeclaringType;
            if (classType != null)
            {
                if (classType.GetTypeInfo().IsDefined(typeof(AuditedAttribute), true))
                {
                    return true;
                }

                if (classType.GetTypeInfo().IsDefined(typeof(DisableAuditingAttribute), true))
                {
                    return false;
                }

                if (_configuration.Selectors.Any(selector => selector.Predicate(classType)))
                {
                    return true;
                }
            }

            return defaultValue;
        }

        public AuditInfo CreateAuditInfo(Type type, MethodInfo method, object[] arguments)
        {
            return CreateAuditInfo(type, method, CreateArgumentsDictionary(method, arguments));
        }

        public AuditInfo CreateAuditInfo(Type type, MethodInfo method, IDictionary<string, object> arguments)
        {
            var auditInfo = new AuditInfo
            {
                UserId = BysSession.GetUserId(),
                ServiceName = type != null
                    ? type.FullName
                    : "",
                MethodName = method.Name,
                Parameters = ConvertArgumentsToJson(arguments),
                ExecutionTime = Clock.Now
            };

            try
            {
                _auditInfoProvider.Fill(auditInfo);
            }
            catch (Exception ex)
            {
                Logger.LogWarning(ex.ToString(), ex);
            }

            return auditInfo;
        }

        public void Save(AuditInfo auditInfo)
        {
            AuditingStore.Save(auditInfo);
        }

        public async Task SaveAsync(AuditInfo auditInfo)
        {
            await AuditingStore.SaveAsync(auditInfo);
        }

        private string ConvertArgumentsToJson(IDictionary<string, object> arguments)
        {
            try
            {
                if (arguments.IsNullOrEmpty())
                {
                    return "{}";
                }

                var dictionary = new Dictionary<string, object>();

                foreach (var argument in arguments)
                {
                    if (argument.Value != null && _configuration.IgnoredTypes.Any(t => t.IsInstanceOfType(argument.Value)))
                    {
                        dictionary[argument.Key] = null;
                    }
                    else
                    {
                        dictionary[argument.Key] = argument.Value;
                    }
                }

                return _auditSerializer.Serialize(dictionary);
            }
            catch (Exception ex)
            {
                Logger.LogWarning(ex.ToString(), ex);
                return "{}";
            }
        }

        private static Dictionary<string, object> CreateArgumentsDictionary(MethodInfo method, object[] arguments)
        {
            var parameters = method.GetParameters();
            var dictionary = new Dictionary<string, object>();

            for (var i = 0; i < parameters.Length; i++)
            {
                dictionary[parameters[i].Name] = arguments[i];
            }

            return dictionary;
        }
    }
}