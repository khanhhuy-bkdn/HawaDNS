using System;
using System.Text.RegularExpressions;

namespace _Common.Extensions
{
    public static class NumberExtentions
    {
        public static decimal ToDecimal(this double? value)
        {
            return value == null ? 0 : ToDecimal(value.Value);
        }

        public static decimal ToDecimal(this double value)
        {
            return (decimal)Math.Round(value, 3, MidpointRounding.AwayFromZero);
        }

        public static decimal ToDividendNumber(this decimal value)
        {
            return value == 0 ? 1 : value;
        }

        public static decimal ToDividendNumber(this decimal? value)
        {
            return ToDividendNumber(value.GetValueOrDefault());
        }

        public static decimal RoundTo(this decimal? value, int decimals)
        {
            return value.GetValueOrDefault().RoundTo(decimals);
        }

        public static decimal RoundTo(this decimal value, int decimals)
        {
            return Math.Round(value, decimals, MidpointRounding.AwayFromZero);
        }

        public static bool IsNumber(this string pText)
        {
            Regex regex = new Regex(@"^[-+]?[0-9]*\.?[0-9]+$");
            return regex.IsMatch(pText);
        }
    }
}