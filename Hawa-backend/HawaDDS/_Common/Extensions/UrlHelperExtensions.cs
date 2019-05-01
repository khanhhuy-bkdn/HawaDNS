using _Common.Configurations;
using _Common.Dependency;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace _Common.Extensions
{
    /// <summary>
    /// <see cref="IUrlHelper"/> extension methods.
    /// </summary>
    public static class UrlHelperExtensions
    {
        /// <summary>
        /// Generates a fully qualified URL to an action method by using the specified action name, controller name and
        /// route values.
        /// </summary>
        /// <param name="url">The URL helper.</param>
        /// <param name="actionName">The name of the action method.</param>
        /// <param name="controllerName">The name of the controller.</param>
        /// <param name="routeValues">The route values.</param>
        /// <returns>The absolute URL.</returns>
        public static string AbsoluteAction(
            this IUrlHelper url,
            string actionName,
            string controllerName,
            object routeValues = null) =>
            url.Action(actionName, controllerName, routeValues, url.ActionContext.HttpContext.Request.Scheme);

        /// <summary>
        /// Generates a fully qualified URL to the specified content by using the specified content path. Converts a
        /// virtual (relative) path to an application absolute path.
        /// </summary>
        /// <param name="url">The URL helper.</param>
        /// <param name="contentPath">The content path.</param>
        /// <returns>The absolute URL.</returns>
        public static string AbsoluteContent(
            this IUrlHelper url,
            string contentPath)
        {
            return SingletonDependency<IOptions<FileStorageConfig>>.Instance.Value.Host + url.Content(contentPath);
        }

        /// <summary>
        /// Generates a fully qualified URL to the specified route by using the route name and route values.
        /// </summary>
        /// <param name="url">The URL helper.</param>
        /// <param name="routeName">Name of the route.</param>
        /// <param name="routeValues">The route values.</param>
        /// <returns>The absolute URL.</returns>
        public static string AbsoluteRouteUrl(
            this IUrlHelper url,
            string routeName,
            object routeValues = null) =>
            url.RouteUrl(routeName, routeValues, url.ActionContext.HttpContext.Request.Scheme);
    }
}