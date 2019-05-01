namespace _Dtos.Shared.Email
{
    public class EmailDetailDto : IEntityDto
    {
        public int BranchId { get; set; }

        public string From { get; set; }

        public SendEmailResultDto[] To { get; set; }

        public string Subject { get; set; }

        public long SentDate { get; set; }

        public string Content { get; set; }

        public bool IsImportant { get; set; }

        public bool IsSuccess { get; set; }

        public EmailAttatchmentDto[] EmailAttatchments { get; set; }
    }
}