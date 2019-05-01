using System;

using _Abstractions.Services;
using _Common.Exceptions;
using _Dtos.Shared;
using _Services.Internal;
using _Services.Internal.Helpers;

namespace _Services.Implementations
{
    public class ImageService : IImageService
    {
        private IStorageProvider _storageProvider;

        public ImageService(IStorageProvider storageProvider)
        {
            _storageProvider = storageProvider;
        }

        public ImageUrlDto UploadImage(FileDescription imageFile)
        {
            if (!imageFile.IsImageFile())
            {
                throw new BusinessException("Your Upload is not a Images!");
            }

            var fileName = ImageUrlHelper.NewImageFileName();

            _storageProvider.CreateImage(ImageUrlHelper.GetFileGuid(fileName).GetValueOrDefault(), imageFile.Data);

            return ImageUrlHelper.ToImageUrl(fileName);
        }

        public void DeleteImage(Guid guid)
        {
            _storageProvider.DeleteImage(guid);
        }

        public ImageUrlDto GetImageUrl(Guid guid)
        {
            return ImageUrlHelper.ToImageUrl(guid);
        }
    }
}