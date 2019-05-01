using System;

using _Dtos.Shared;

namespace _Abstractions.Services
{
    public interface IImageService
    {
        ImageUrlDto UploadImage(FileDescription imageFile);

        void DeleteImage(Guid guid);

        ImageUrlDto GetImageUrl(Guid guid);
    }
}