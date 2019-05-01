namespace _Dtos.AD
{
    public class FeedbackDto
    {
        public bool IsLike { get; set; }

        public long Date { get; set; }

        public string Content { get; set; }

        public ShortUserDto User { get; set; }

        public int Id { get; set; }
    }
}