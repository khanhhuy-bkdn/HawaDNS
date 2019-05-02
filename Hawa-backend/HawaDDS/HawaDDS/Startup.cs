using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using _Common.Dependency;
using _Infrastructure.ContainerConfigs;
using _RazorTemplates;
using Hangfire;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.PlatformAbstractions;
using Swashbuckle.AspNetCore.Swagger;

namespace HawaDDS
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            CoreServicesInstaller.ConfigureCoreServices(services, Configuration);
            AuthServicesInstaller.ConfigureServicesAuth(services, Configuration);
            ApplicationServicesInstaller.ConfigureApplicationServices(services, Configuration);

            ServiceLocator.SetLocatorProvider(services.BuildServiceProvider);

            services.AddMvcCore()
                .AddApiExplorer();

            // Add the embedded file provider
            var viewAssembly = typeof(RazorViewRenderService).GetTypeInfo().Assembly;
            var fileProvider = new EmbeddedFileProvider(viewAssembly);
            services.Configure<RazorViewEngineOptions>(
                options =>
                {
                    options.FileProviders.Add(fileProvider);
                });

            services.AddHangfire(
                config =>
                    config.UseSqlServerStorage(Configuration["ConnectionStrings:ErpConnection"]));

            services.Configure<FormOptions>(options =>
            {
                options.MultipartBodyLengthLimit = 52428800;
            });

            // Register the Swagger generator, defining one or more Swagger documents
            services.AddSwaggerGen(
                c =>
                {
                    c.EnableAnnotations();
                    c.DescribeAllEnumsAsStrings();
                    c.SwaggerDoc(
                        "v1",
                        new Info
                        {
                            Title = "HAWA API",
                            Version = "v1",
                            Description = "ASP.NET Core Web API 2",
                            TermsOfService = "None",
                            Contact = new Contact
                            {
                                Name = "Vo Duc Phuong",
                                Email = "phuong.vo@bys.vn",
                                Url = "phuong.vo@bys.vn"
                            },
                            License = new License
                            {
                                Name = "Copyright by BYS JSC",
                                Url = "https://wwww.bys.vn"
                            }
                        });

                    c.OrderActionsBy((apiDesc) => $"{apiDesc.ActionDescriptor.RouteValues["controller"]}_{apiDesc.HttpMethod}");

                    var filePath = Path.Combine(PlatformServices.Default.Application.ApplicationBasePath, "HawaDDS.xml");
                    c.IncludeXmlComments(filePath);
                });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
                app.UseDeveloperExceptionPage();

            // Configure Cors
            app.UseCors(
                builder => builder
                    .AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .WithExposedHeaders("Content-Disposition"));

            app.UseAuthentication();

            // Configure localization
            var supportedCultures = new List<CultureInfo>
            {
                new CultureInfo("vi"),
            };
            var options = new RequestLocalizationOptions
            {
                DefaultRequestCulture = new RequestCulture("vi-VN"),
                SupportedCultures = supportedCultures,
                SupportedUICultures = supportedCultures
            };

            app.UseRequestLocalization(options);

            app.UseStaticFiles();

            app.UseStaticFiles(
                new StaticFileOptions
                {
                    FileProvider = new PhysicalFileProvider(Configuration.GetValue<string>("FileStorageConfig:ImageAbsolutePhysicalPath")),
                    RequestPath = new PathString(Configuration.GetValue<string>("FileStorageConfig:ImageRelativeRequestPath")),
                });

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger(
                c =>
                {
                });

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(
                c =>
                {
                    c.DocumentTitle = "HAWA API Document";
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1");
                });

            app.UseMvc();

            app.UseHangfireDashboard();
            app.UseHangfireServer();
        }
        //public void ConfigureServices(IServiceCollection services)
        //{
        //    services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
        //}

        //// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        //public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        //{
        //    if (env.IsDevelopment())
        //    {
        //        app.UseDeveloperExceptionPage();
        //    }
        //    else
        //    {
        //        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        //        app.UseHsts();
        //    }

        //    app.UseHttpsRedirection();
        //    app.UseMvc();
        //}
    }
}
