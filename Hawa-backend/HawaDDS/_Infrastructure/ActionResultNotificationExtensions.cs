using Microsoft.AspNetCore.Mvc;

namespace _Infrastructure
{
    public static class ActionResultNotificationExtensions
    {
        public static IActionResult WithSuccess(this IActionResult result, string title, string body)
        {
            return Notification(result, "success", title, body);
        }

        public static IActionResult WithSuccess(this IActionResult result, string body)
        {
            return WithSuccess(result, string.Empty, body);
        }

        public static IActionResult WithInfo(this IActionResult result, string title, string body)
        {
            return Notification(result, "info", title, body);
        }

        public static IActionResult WithInfo(this IActionResult result, string body)
        {
            return result.WithInfo(string.Empty, body);
        }

        public static IActionResult WithAlert(this IActionResult result, string title, string body)
        {
            return Notification(result, "alert", title, body);
        }

        public static IActionResult WithAlert(this IActionResult result, string body)
        {
            return result.WithAlert(string.Empty, body);
        }

        public static IActionResult WithWarning(this IActionResult result, string title, string body)
        {
            return Notification(result, "warn", title, body);
        }

        public static IActionResult WithWarning(this IActionResult result, string body)
        {
            return result.WithWarning(string.Empty, body);
        }

        public static IActionResult WithError(this IActionResult result, string title, string body)
        {
            return Notification(result, "error", title, body);
        }

        public static IActionResult WithError(this IActionResult result, string body)
        {
            return result.WithError(string.Empty, body);
        }

        private static IActionResult Notification(IActionResult result, string type, string title, string body)
        {
            return new NotificationDecoratorResult(result, type, title, body);
        }
    }
}