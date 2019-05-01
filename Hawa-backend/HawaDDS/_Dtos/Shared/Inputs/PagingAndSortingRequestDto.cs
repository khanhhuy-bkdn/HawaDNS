using System;

namespace _Dtos.Shared.Inputs
{
    [Serializable]
    public class PagingAndSortingRequestDto : PagingRequestDto, ISortingRequestDto
    {
        public virtual string Sorting { get; set; }

        public PagingAndSortingRequestDto()
        {
        }

        public PagingAndSortingRequestDto(int page, int pageSize)
        {
            Page = page;
            PageSize = pageSize;
        }
    }
}