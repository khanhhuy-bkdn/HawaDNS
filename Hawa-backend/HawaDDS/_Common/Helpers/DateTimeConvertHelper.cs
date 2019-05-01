using System;
using System.Linq;

using _Common.Extensions;

namespace _Common.Helpers
{
    public static class DateTimeConvertHelper
    {
        public const long EpochTicks = 621355968000000000;
        public const long TicksPeriod = 10000000;
        public const long TicksPeriodMs = 10000;

        public static readonly DateTime Epoch = new DateTime(EpochTicks, DateTimeKind.Utc);

        public static long ToMilliSecondsTimestamp(this DateTime date)
        {
            long ts = (date.Ticks - EpochTicks) / TicksPeriodMs;
            return ts;
        }

        public static long ToMilliSecondsTimestamp(this DateTime? date)
        {
            return date == null ? 0 : ToMilliSecondsTimestamp(date);
        }

        public static long ToSecondsTimestamp(this DateTime date)
        {
            if (date.Year == 9999)
            {
                return 0;
            }

            long ts = (date.Ticks - EpochTicks) / TicksPeriod;
            return ts;
        }

        public static DateTime LocalToUtcTime(this DateTime date)
        {
            return TimeZoneInfo.ConvertTimeBySystemTimeZoneId(date, TimeZoneInfo.Local.Id, TimeZoneInfo.Utc.Id);
        }

        public static DateTime UtcToLocalTime(this DateTime date)
        {
            return TimeZoneInfo.ConvertTimeBySystemTimeZoneId(date, TimeZoneInfo.Utc.Id, TimeZoneInfo.Local.Id);
        }

        public static long ToSecondsTimestamp(this DateTime? date)
        {
            return date == null ? 0 : (date.Value.Ticks - EpochTicks) / TicksPeriod;
        }

        public static long ToRoundedSecondsTimestamp(this DateTime date, long factor)
        {
            return (ToSecondsTimestamp(date) / factor) * factor;
        }

        public static DateTime FromUnixTimeStamp(this long unixTimeStamp)
        {
            return Epoch.AddSeconds(unixTimeStamp);
        }

        public static DateTime? FromUnixTimeStamp(this long? unixTimeStamp)
        {
            return unixTimeStamp > 0 ? FromUnixTimeStamp(unixTimeStamp.Value) : (DateTime?)null;
        }

        public static DateTime[] GetWorkingDates(DateTime? fromDate, DateTime? toDate)
        {
            if (!fromDate.HasValue || !toDate.HasValue)
            {
                return EmptyArray<DateTime>.Instance;
            }

            return Enumerable.Range(0, 1 + toDate.Value.Subtract(fromDate.Value).Days).ConvertArray(x => fromDate.Value.AddDays(x));
        }

        public static string ConvertToShortDateString(this long dateTime)
        {
            string day = dateTime.FromUnixTimeStamp().Day.ToString();

            string month;

            switch (dateTime.FromUnixTimeStamp().Month)
            {
                case 1:
                    month = "Jan";
                    break;
                case 2:
                    month = "Feb";
                    break;
                case 3:
                    month = "Mar";
                    break;
                case 4:
                    month = "Apr";
                    break;
                case 5:
                    month = "May";
                    break;
                case 6:
                    month = "Jun";
                    break;
                case 7:
                    month = "Jul";
                    break;
                case 8:
                    month = "Aug";
                    break;
                case 9:
                    month = "Sep";
                    break;
                case 10:
                    month = "Oct";
                    break;
                case 11:
                    month = "Nov";
                    break;
                case 12:
                    month = "Dec";
                    break;
                default:
                    month = null;
                    break;
            }

            int year = dateTime.FromUnixTimeStamp().Year % 100;

            return day + "-" + month + "-" + year.ToString();
        }
    }
}