using _Abstractions.Services;
using _Abstractions.Services.AD;
using _Auditing.Implementations;
using _Auditing.Interfaces;
using _Common.Authorization;
using _Common.Runtime.Session;
using _EntityFrameworkCore.AuditLog;
using _EntityFrameworkCore.Audits;
using _EntityFrameworkCore.EntityHistory;
using _RazorTemplates;
using _Services.Implementations;
using _Services.Implementations.AD;
using _Services.Implementations.AP;
using _Services.Implementations.AR;
using _Services.Implementations.GE;
using _Services.Implementations.IC;
using _Services.Internal;
using _Services.Internal.Implementations;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace _Infrastructure.ContainerConfigs
{
    public static class ApplicationServicesInstaller
    {
        public static void ConfigureApplicationServices(IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IBysSession, BysSession>();
            services.AddScoped<IAuditingHelper, AuditingHelper>();
            services.AddScoped<IAuditHelper, AuditHelper>();
            services.AddScoped<IAuditingStore, AuditingStore>();
            services.AddScoped<IEntityHistoryHelper, EntityHistoryHelper>();
            services.AddScoped<IAuditInfoProvider, DefaultAuditInfoProvider>();
            services.AddScoped<IAuditingConfiguration, AuditingConfiguration>();
            services.AddScoped<IAuditSerializer, JsonNetAuditSerializer>();
            services.AddScoped<IClientInfoProvider, HttpContextClientInfoProvider>();

            services.AddDataProtection();
            services.AddSingleton<IDataProtectorUserTokenService, DataProtectorUserTokenService>();

            services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services
                .AddSingleton<IActionContextAccessor, ActionContextAccessor>()
                .AddSingleton(
                    x => x
                        .GetRequiredService<IUrlHelperFactory>()
                        .GetUrlHelper(x.GetRequiredService<IActionContextAccessor>().ActionContext));

            services.AddSingleton<ITokenService, JwtTokenService>();
            services.AddTransient<IMailKitSmtpBuilder, MailKitSmtpBuilder>();
            services.AddScoped<IRazorViewRenderService, RazorViewRenderService>();
            services.AddTransient<IInternalMessageService, InternalMessageService>();
            services.AddTransient<INotificationService, NotificationService>();

            services.AddTransient<IEmailSender, MailKitEmailSender>();
            services.AddTransient<IStorageProvider, FileSystemStorageProvider>();
            services.AddTransient<IPermissionChecker, PermissionChecker>();

            services.AddTransient<IDictionaryDataService, DictionaryDataService>();
            services.AddTransient<IDataService, DataService>();
            services.AddTransient<ILoginService, LoginService>();
        }
    }
}