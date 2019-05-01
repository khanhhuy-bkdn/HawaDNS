using System;
using System.Diagnostics;
using System.Threading.Tasks;

using _Auditing.Interfaces;
using _Common.Extensions;

using Microsoft.AspNetCore.Mvc.Filters;

namespace _Infrastructure.Filters
{
    public class AuditActionFilter : IAsyncActionFilter
    {
        private readonly IAuditingHelper _auditingHelper;

        public AuditActionFilter(IAuditingHelper auditingHelper)
        {
            _auditingHelper = auditingHelper;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            if (!ShouldSaveAudit(context))
            {
                await next();
                return;
            }


            var auditInfo = _auditingHelper.CreateAuditInfo(
                context.ActionDescriptor.AsControllerActionDescriptor().ControllerTypeInfo.AsType(),
                context.ActionDescriptor.AsControllerActionDescriptor().MethodInfo,
                context.ActionArguments
            );

            var stopwatch = Stopwatch.StartNew();

            try
            {
                var result = await next();
                if (result.Exception != null && !result.ExceptionHandled)
                {
                    auditInfo.Exception = result.Exception;
                }
            }
            catch (Exception ex)
            {
                auditInfo.Exception = ex;
                throw;
            }
            finally
            {
                stopwatch.Stop();
                auditInfo.ExecutionDuration = Convert.ToInt32(stopwatch.Elapsed.TotalMilliseconds);
                await _auditingHelper.SaveAsync(auditInfo);
            }
        }

        private bool ShouldSaveAudit(ActionExecutingContext actionContext)
        {
            return
                   actionContext.ActionDescriptor.IsControllerAction() &&
                   _auditingHelper.ShouldSaveAudit(actionContext.ActionDescriptor.GetMethodInfo(), true);
        }
    }
}
