namespace _Dtos.Shared.Inputs
{
    public class PagingRequestDto
    {
        public const int DefaultPageSize = 10;
        public const int MaxPageSize = 100;

        public int Page { get; set; }

        public int PageSize { get; set; }

        public PagingRequestDto(int page, int pageSize)
        {
            Page = page;
            PageSize = pageSize;
        }

        public PagingRequestDto()
        {
            Page = 0;
            PageSize = MaxPageSize;
        }

        public PagingRequestDto(int page)
        {
            Page = page;
            PageSize = MaxPageSize;
        }
    }
}