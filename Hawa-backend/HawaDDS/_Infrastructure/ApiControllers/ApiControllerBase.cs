using System.Linq;
using System.Net;
using System.Net.Mime;
using System.Web;
using _Common.Exceptions;
using _Dtos.ServiceResults;
using _Dtos.Shared;
using _Infrastructure.ApiResults;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace _Infrastructure.ApiControllers
{
    [Produces("application/json")]
    [Route("api/hawa")]
    [Authorize]
    public class ApiControllerBase : ControllerBase
    {
        protected BadRequestObjectResult BadRequest(ApiErrorCodes code)
        {
            return BadRequest(
                new ApiErrorResult
                {
                    Success = false,
                    ErrorCode = code.ToString(),
                    ErrorMessage = code.ToString(),
                });
        }

        protected BadRequestObjectResult BadRequest(ApiErrorCodes code, string message)
        {
            return BadRequest(
                new ApiErrorResult
                {
                    Success = false,
                    ErrorCode = code.ToString(),
                    ErrorMessage = message,
                });
        }

        protected BadRequestObjectResult BadRequest(ServiceResult serviceResult)
        {
            var error = serviceResult.Errors.FirstOrDefault() ?? new ServiceError();

            return BadRequest(
                new ApiErrorResult
                {
                    Success = false,
                    ErrorCode = error.Code,
                    ErrorMessage = error.Description,
                });
        }

        protected BadRequestObjectResult BadRequest(string message)
        {
            return BadRequest(
                new ApiErrorResult
                {
                    Success = false,
                    ErrorCode = ApiErrorCodes.Failed.ToString(),
                    ErrorMessage = message,
                });
        }

        public override NotFoundObjectResult NotFound(object value)
        {
            return new NotFoundObjectResult(
                new ApiErrorResult
                {
                    Success = false,
                    ErrorCode = ApiErrorCodes.ObjectNotFound.ToString(),
                    ErrorMessage = $"Object with id = {value} not found",
                });
        }

        protected OkObjectResult Success(object result)
        {
            return new OkObjectResult(
                new ApiSuccessResult
                {
                    Success = true,
                    Result = result,
                });
        }

        protected OkObjectResult Success()
        {
            return new OkObjectResult(
                new ApiResult
                {
                    Success = true,
                });
        }

        protected FileResult AttachmentResult(FileDescription file)
        {
            // We can have record in database, but no actual file in file storage
            if (file.Data == null)
            {
                throw new BusinessException("File doesn't exits");
            }

            var contentDisposition = new ContentDisposition
            {
                FileName = HttpUtility.UrlEncode(file.FileName),
                Inline = false
            };

            Response.Headers.Add("BYS-Content-Disposition", contentDisposition.ToString());

            return File(file.Data, file.ContentType, file.FileName);
        }

        protected ContentResult HtmlContentResult(string htmlString)
        {
            return new ContentResult
            {
                ContentType = "text/html",
                StatusCode = (int)HttpStatusCode.OK,
                Content = htmlString,
            };
        }
    }
}