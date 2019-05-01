using System;

using _Auditing.Interfaces;

using Microsoft.AspNetCore.Http;

using Serilog;

namespace _Auditing.Implementations
{
    public class HttpContextClientInfoProvider : IClientInfoProvider
    {
        public string BrowserInfo => GetBrowserInfo();

        public string ClientIpAddress => GetClientIpAddress();

        public string ComputerName => GetComputerName();

        public ILogger Logger { get; set; }

        private readonly IHttpContextAccessor _httpContextAccessor;

        private readonly HttpContext _httpContext;

        /// <summary>
        /// Creates a new <see cref="HttpContextClientInfoProvider"/>.
        /// </summary>
        public HttpContextClientInfoProvider(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _httpContext = httpContextAccessor.HttpContext;

            Logger = Log.Logger;
        }

        protected virtual string GetBrowserInfo()
        {
            var httpContext = _httpContextAccessor.HttpContext ?? _httpContext;
            return httpContext?.Request?.Headers?["User-Agent"];
        }

        protected virtual string GetClientIpAddress()
        {
            try
            {
                var httpContext = _httpContextAccessor.HttpContext ?? _httpContext;
                return httpContext?.Connection?.RemoteIpAddress?.ToString();
            }
            catch (Exception ex)
            {
                Logger.Warning(ex.ToString());
            }

            return null;
        }

        protected virtual string GetComputerName()
        {
            return null; //TODO: Implement!
        }
    }
}