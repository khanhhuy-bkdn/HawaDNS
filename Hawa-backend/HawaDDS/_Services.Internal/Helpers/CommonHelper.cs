using System.Linq;

using _Common.Extensions;
using _Dtos.Shared;

using Microsoft.AspNetCore.Http;

namespace _Services.Internal.Helpers
{
    public static class CommonHelper
    {
        public static string ToFullName(string firstName, string lastName)
        {
            return new[]
            {
                firstName,
                lastName
            }.JoinNotEmpty(" ");
        }

        public static FileDescription ToFileDescription(this IFormFile file)
        {
            return file == null
                ? null
                : new FileDescription
                {
                    FileName = file.FileName,
                    Data = file.OpenReadStream().GetAllBytes(),
                    ContentType = file.ContentType
                };
        }

        public static bool IsImageFile(this FileDescription image)
        {
            if (image == null)
            {
                return false;
            }

            var imageContenType = new[] { "image/jpg", "image/jpeg", "image/pjpeg", "image/gif", "image/x-png", "image/png" };

            return imageContenType.Contains(image.ContentType.ToLower());
        }
    }
}