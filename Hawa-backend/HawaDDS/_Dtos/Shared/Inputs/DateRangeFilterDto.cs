using System;

using _Common.Helpers;

namespace _Dtos.Shared.Inputs
{
    public class DateRangeFilterDto
    {
        public DateRangeFilterDto(long? fromDate, long? toDate)
        {
            FromDate = fromDate.FromUnixTimeStamp();
            ToDate = toDate.FromUnixTimeStamp();
        }

        public DateTime? FromDate { get; set; }

        public DateTime? ToDate { get; set; }
    }
}