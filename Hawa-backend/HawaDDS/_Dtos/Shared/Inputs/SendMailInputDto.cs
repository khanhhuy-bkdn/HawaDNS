using System.ComponentModel.DataAnnotations;

using _Common.Extensions;

using Microsoft.AspNetCore.Http;

namespace _Dtos.Shared.Inputs
{
    public class SendMailInputDto
    {
        [Required] public int BidOpportunityId { get; set; }

        public string Subject { get; set; }

        [Required] public string[] RecipientEmails { get; set; }

        public string[] CcEmails { get; set; }

        public string[] BccEmails { get; set; }

        public string Content { get; set; }

        public IFormFile[] AttachmentFiles { get; set; }

        public static SendEmailInput ToSendEmailInput(SendMailInputDto input)
        {
            return new SendEmailInput
            {
                BidOpportunityId = input.BidOpportunityId,
                RecipientEmails = input.RecipientEmails,
                CcEmails = input.CcEmails,
                BccEmails = input.BccEmails,
                Content = input.Content,
                Subject = input.Subject,
                AttachmentFiles = input.AttachmentFiles.ConvertArray(
                    x => new FileDescription
                    {
                        Data = x.OpenReadStream().GetAllBytes(),
                        FileName = x.FileName,
                        ContentType = x.ContentType,
                    })
            };
        }

        public bool IsAgain { get; set; } = false;
    }
}