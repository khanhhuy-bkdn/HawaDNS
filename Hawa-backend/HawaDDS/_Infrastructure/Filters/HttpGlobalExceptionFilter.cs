using System;
using System.Net;
using System.Net.Http;

using _Common.Exceptions;
using _Common.Extensions;
using _Infrastructure.ApiResults;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;

namespace _Infrastructure.Filters
{
    public class HttpGlobalExceptionFilter : IExceptionFilter
    {
        private readonly ILogger<HttpGlobalExceptionFilter> logger;

        public HttpGlobalExceptionFilter(ILogger<HttpGlobalExceptionFilter> logger)
        {
            this.logger = logger;
        }

        public void OnException(ExceptionContext context)
        {
            var exception = context.Exception;

            logger.LogError(
                new EventId(context.Exception.HResult),
                context.Exception,
                context.Exception.Message);

            if (context.Exception.GetType() == typeof(BusinessException) || context.Exception.GetType().BaseType == typeof(BusinessException))
            {
                // handle bussiness exception
                var json = new ApiErrorResult
                {
                    Success = false,
                    ErrorCode = context.Exception.GetType().Name,
                    ErrorMessage = context.Exception.Message,
                };

                // Result asigned to a result object but in destiny the response is empty. This is a known bug of .net core 1.1
                //It will be fixed in .net core 1.1.2. See https://github.com/aspnet/Mvc/issues/5594 for more information
                context.Result = new BadRequestObjectResult(json);
                context.WithNotification("error", string.Empty, json.ErrorMessage);

                context.HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            }
            else
            {
                // if it's not one of the expected exception, set it to 500
                var code = HttpStatusCode.InternalServerError;

                //TODO:Mapping if (exception is NotFoundExe) code = HttpStatusCode.NotFound;
                switch (exception)
                {
                    case EntityNotFoundException _:
                        code = HttpStatusCode.NotFound;
                        break;
                    case ArgumentNullException _:
                        code = HttpStatusCode.BadRequest;
                        break;
                    case InvalidArgumentException _:
                        code = HttpStatusCode.BadRequest;
                        break;
                    case HttpRequestException _:
                        code = HttpStatusCode.BadRequest;
                        break;
                    case UnauthorizedAccessException _:
                        code = HttpStatusCode.Unauthorized;
                        break;
                }

                // Result asigned to a result object but in destiny the response is empty. This is a known bug of .net core 1.1
                // It will be fixed in .net core 1.1.2. See https://github.com/aspnet/Mvc/issues/5594 for more information
                context.Result = new ObjectResult(
                    new ApiErrorResult
                    {
                        Success = false,
                        ErrorCode = code.ToString(),
                        ErrorMessage = exception.InnerException != null ? exception.InnerException.Message : exception.Message,
                        TechnicalLog = exception.GetExceptionTechnicalInfo(),
                    });

                context.WithNotification("error", string.Empty, "Đã có lỗi xảy ra. Vui lòng thử lại sau.");

                context.HttpContext.Response.StatusCode = (int)code;
            }

            context.ExceptionHandled = true;
        }
    }
}