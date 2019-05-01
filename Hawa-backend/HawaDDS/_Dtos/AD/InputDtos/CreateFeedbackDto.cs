namespace _Dtos.AD.InputDtos
{
    public class CreateFeedbackDto
    {
        public bool IsLike { get; set; }

        public string Content { get; set; }

        public int? UserId { get; set; }
    }
}