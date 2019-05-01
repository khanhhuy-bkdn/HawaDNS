using System;
using System.Collections.Generic;
using System.Globalization;
using System.Reflection;

using _Common.Configurations;
using _Common.Scheduling;
using _EntityFrameworkCore.Contexts;
using _EntityFrameworkCore.UnitOfWork;
using _Infrastructure.Filters;
using _RazorTemplates;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;

namespace _Infrastructure.ContainerConfigs
{
    public static class CoreServicesInstaller
    {
        public static void ConfigureCoreServices(IServiceCollection services, IConfiguration configuration)
        {
            services.AddMvc(
                    options =>
                    {
                        options.Filters.Add(typeof(HttpGlobalExceptionFilter));
                        options.Filters.Add(typeof(AuditActionFilter));
                    }
                )
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1)
                .AddRazorOptions(
                    options =>
                    {
                        var viewAssembly = typeof(RazorViewRenderService).GetTypeInfo().Assembly;
                        var fileProvider = new EmbeddedFileProvider(viewAssembly);
                        options.FileProviders.Add(fileProvider);
                    });

            services.AddDbContext<ErpDbContext>(
                options =>
                {
                    options.UseSqlServer(
                            configuration["ConnectionStrings:ErpConnection"],
                            b => b.MigrationsAssembly("_EntityFrameworkCore").UseRowNumberForPaging())

                        //.ConfigureWarnings(warnings => warnings.Throw(RelationalEventId.QueryClientEvaluationWarning));
                        ;
                });

            services.AddUnitOfWork<ErpDbContext>();

            services.Configure<SmtpConfig>(configuration.GetSection(nameof(SmtpConfig)));
            services.Configure<TokenLifespanExpire>(configuration.GetSection(nameof(TokenLifespanExpire)));
            services.Configure<FileStorageConfig>(configuration.GetSection(nameof(FileStorageConfig)));

            // Register localization
            services.AddLocalization();

            services.AddScoped<ModelValidationFilterAttribute>();

            services.AddMemoryCache();

            services.Configure<RequestLocalizationOptions>(
                options =>
                {
                    var supportedCultures = new List<CultureInfo>
                    {
                        new CultureInfo("vi-VN"),
                        new CultureInfo("vi"),
                    };

                    options.DefaultRequestCulture = new RequestCulture("en-US");
                    options.SupportedCultures = supportedCultures;
                    options.SupportedUICultures = supportedCultures;
                });

            // Add cors
            services.AddCors();

            // Add scheduled tasks &scheduler
            //services.AddSingleton<IScheduledTask, QuoteOfTheDayTask>();

            services.AddScheduler(
                (sender, args) =>
                {
                    Console.Write(args.Exception.Message);
                    args.SetObserved();
                });
        }
    }
}