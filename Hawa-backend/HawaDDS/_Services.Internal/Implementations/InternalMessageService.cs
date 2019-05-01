using System.Threading.Tasks;

using _EntityFrameworkCore.UnitOfWork;
using _RazorTemplates;

namespace _Services.Internal.Implementations
{
    public class InternalMessageService : IInternalMessageService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEmailSender _emailSender;
        private readonly IRazorViewRenderService _razorViewRenderService;

        public InternalMessageService(
            IUnitOfWork unitOfWork,
            IRazorViewRenderService razorViewRenderService,
            IEmailSender emailSender)
        {
            _unitOfWork = unitOfWork;
            _razorViewRenderService = razorViewRenderService;
            _emailSender = emailSender;
        }

        private async Task<string> BuildTemplate<TModel>(string name, TModel model)
        {
            return await _razorViewRenderService.RenderToStringAsync(name, model);
        }
    }
}