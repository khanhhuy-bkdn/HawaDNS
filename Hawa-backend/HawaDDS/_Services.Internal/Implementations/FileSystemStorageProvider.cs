using System;
using System.IO;
using System.Threading.Tasks;

using _Common.Configurations;
using _Constants;

using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace _Services.Internal.Implementations
{
    public class FileSystemStorageProvider : IStorageProvider
    {
        private readonly FileStorageConfig _config;

        public FileSystemStorageProvider(IConfiguration configuration, IOptions<FileStorageConfig> config)
        {
            Configuration = configuration;
            _config = config.Value;
        }

        public IConfiguration Configuration { get; }

        public void CreateImage(Guid id, IFormFile formFile)
        {
            CreateLargeImage(id, formFile);
            CreateThumbImage(id, formFile);
        }

        public void CreateImage(Guid id, byte[] formFile)
        {
            CreateLargeImage(id, formFile);
            CreateThumbImage(id, formFile);
        }

        private void CreateLargeImage(Guid id, IFormFile formFile)
        {
            var filePath = GetLargeImageFilePath(id);

            using (var fs = new FileStream(filePath, FileMode.OpenOrCreate))
            {
                formFile.CopyTo(fs);
            }
        }

        private void CreateThumbImage(Guid id, IFormFile formFile)
        {
            var filePath = GetThumbImageFilePath(id);

            using (var fs = new FileStream(filePath, FileMode.OpenOrCreate))
            {
                formFile.CopyTo(fs);
            }

            //ImageResizeHelper.ResizeToThumbSize(filePath);
        }

        private void CreateLargeImage(Guid id, byte[] fileData)
        {
            var filePath = GetLargeImageFilePath(id);

            using (var fs = new FileStream(filePath, FileMode.OpenOrCreate))
            {
                fs.Write(fileData, 0, fileData.Length);
            }
        }

        private void CreateThumbImage(Guid id, byte[] fileData)
        {
            var filePath = GetThumbImageFilePath(id);

            using (var fs = new FileStream(filePath, FileMode.OpenOrCreate))
            {
                fs.Write(fileData, 0, fileData.Length);
            }

            //ImageResizeHelper.ResizeToThumbSize(filePath);
        }

        public void Create(Guid id, byte[] data)
        {
            var fileName = GetDocumentFilePath(id);
            using (var fileStream = new FileStream(fileName, FileMode.Create, FileAccess.Write))
            {
                fileStream.Write(data, 0, data.Length);
            }
        }

        public void Create(Guid id, IFormFile formFile)
        {
            var fileName = GetDocumentFilePath(id);
            using (var fs = new FileStream(fileName, FileMode.OpenOrCreate))
            {
                formFile.CopyTo(fs);
            }
        }

        public void Create(string filePath, IFormFile formFile)
        {
            var fileName = GetDocumentFilePath(filePath);
            using (var fs = new FileStream(fileName, FileMode.OpenOrCreate))
            {
                formFile.CopyTo(fs);
            }
        }

        public void Create(string filePath, byte[] data)
        {
            var fileName = GetDocumentFilePath(filePath);
            using (var fileStream = new FileStream(fileName, FileMode.OpenOrCreate))
            {
                fileStream.Write(data, 0, data.Length);
            }
        }

        public void Create(Guid id, string data)
        {
            var fileName = GetDocumentFilePath(id);
            File.WriteAllText(fileName, data);
        }

        public void Create(Guid id, Stream stream)
        {
            var fileName = GetDocumentFilePath(id);
            using (var fs = new FileStream(fileName, FileMode.OpenOrCreate))
            {
                stream.CopyTo(fs);
            }
        }

        public void Append(Guid id, byte[] data)
        {
            var fileName = GetDocumentFilePath(id);
            using (var fileStream = new FileStream(fileName, FileMode.Append, FileAccess.Write))
            {
                fileStream.Write(data, 0, data.Length);
            }
        }

        public void Overwrite(Guid id, byte[] data)
        {
            Create(id, data);
        }

        public byte[] Read(Guid id)
        {
            var filename = GetDocumentFilePath(id);
            return File.Exists(filename) ? File.ReadAllBytes(filename) : null;
        }

        public async Task<byte[]> ReadAsync(string id)
        {
            var filename = GetDocumentFilePath(id);
            return File.Exists(filename) ? await File.ReadAllBytesAsync(filename) : null;
        }

        public string ReadText(Guid id)
        {
            var filename = GetDocumentFilePath(id);
            return File.Exists(filename) ? File.ReadAllText(filename) : null;
        }

        public Stream ReadStream(Guid id)
        {
            var filename = GetDocumentFilePath(id);
            return File.Exists(filename) ? new FileStream(filename, FileMode.Open, FileAccess.Read, FileShare.Read) : null;
        }

        public Stream WriteStream(Guid id)
        {
            var fileName = GetDocumentFilePath(id);
            return new FileStream(fileName, FileMode.OpenOrCreate);
        }

        public bool Delete(Guid id)
        {
            var fileName = GetDocumentFilePath(id);
            if (File.Exists(fileName))
            {
                File.Delete(fileName);
                return true;
            }

            return false;
        }

        public bool DeleteImage(Guid id)
        {
            var largeImageFilePath = GetLargeImageFilePath(id);
            var thumbImageFilePath = GetThumbImageFilePath(id);
            if (File.Exists(largeImageFilePath) && File.Exists(thumbImageFilePath))
            {
                File.Delete(largeImageFilePath);
                File.Delete(thumbImageFilePath);
                return true;
            }

            return false;
        }

        public bool Delete(string id)
        {
            var fileName = GetDocumentFilePath(id);
            if (File.Exists(fileName))
            {
                File.Delete(fileName);
                return true;
            }

            return false;
        }

        private string GetLargeImageFilePath(Guid id)
        {
            if (string.IsNullOrWhiteSpace(_config.LargeImageAbsolutePhysicalPath))
            {
                throw new Exception("File storage not configured");
            }

            if (!Directory.Exists(_config.LargeImageAbsolutePhysicalPath))
            {
                Directory.CreateDirectory(_config.LargeImageAbsolutePhysicalPath);
            }

            return Path.Combine(_config.LargeImageAbsolutePhysicalPath, id + CommonConstants.DefaultImageExtension);
        }

        private string GetThumbImageFilePath(Guid id)
        {
            if (string.IsNullOrWhiteSpace(_config.ThumbImageAbsolutePhysicalPath))
            {
                throw new Exception("File storage not configured");
            }

            if (!Directory.Exists(_config.ThumbImageAbsolutePhysicalPath))
            {
                Directory.CreateDirectory(_config.ThumbImageAbsolutePhysicalPath);
            }

            return Path.Combine(_config.ThumbImageAbsolutePhysicalPath, id + CommonConstants.DefaultImageExtension);
        }

        private string GetDocumentFilePath(string fileName)
        {
            if (string.IsNullOrWhiteSpace(_config.DocumentAbsolutePhysicalPath))
            {
                throw new Exception("File storage not configured");
            }

            var filePath = Path.Combine(_config.DocumentAbsolutePhysicalPath, fileName);

            var directory = Path.GetDirectoryName(filePath);

            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            return filePath;
        }

        private string GetDocumentFilePath(Guid id)
        {
            return GetDocumentFilePath(id.ToString());
        }
    }
}