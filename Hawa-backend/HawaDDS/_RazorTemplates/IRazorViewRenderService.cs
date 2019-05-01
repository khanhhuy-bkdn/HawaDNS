using System.Threading.Tasks;

namespace _RazorTemplates
{
    public interface IRazorViewRenderService
    {
        Task<string> RenderToStringAsync(string viewName);

        Task<string> RenderToStringAsync<TModel>(string viewName, TModel model);

        string RenderToString<TModel>(string viewPath, TModel model);

        string RenderToString(string viewPath);
    }
}