using System;
using System.Collections.Generic;
using System.Linq;

namespace _Common.Extensions
{
    public static class EnumrableExtensions
    {
        public static TResult[] ConvertArray<TSource, TResult>(this IEnumerable<TSource> items, Func<TSource, TResult> toResult)
        {
            return items == null ? EmptyArray<TResult>.Instance : items.Select(toResult).ToArray();
        }

        public static TSource[] CreateArrayIfNotAndAdd<TSource>(this IEnumerable<TSource> source, TSource value)
        {
            return source == null ? Enumerable.Empty<TSource>().Append(value).ToArray() : source.Append(value).ToArray();
        }

        public static TResult[] CreateArray<TResult>(params TResult[] values)
        {
            return values.ConvertArray(x => x);
        }

        public static IEnumerable<TSource> DistinctBy<TSource, TKey>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector)
        {
            var seenKeys = new HashSet<TKey>();
            foreach (var element in source)
            {
                if (seenKeys.Add(keySelector(element)))
                {
                    yield return element;
                }
            }
        }

        public static IEnumerable<TSource> DistinctBy<TSource, TKey>(this IEnumerable<TSource> source, params Func<TSource, TKey>[] keySelectors)
        {
            var seenKeysTable = keySelectors.ToDictionary(x => x, x => new HashSet<TKey>());

            foreach (var element in source)
            {
                var flag = true;
                bool[] flags = keySelectors.ConvertArray(x => true);
                int index = 0;
                foreach (var (keySelector, hashSet) in seenKeysTable)
                {
                    flags[index] = hashSet.Add(keySelector(element));
                    index++;
                }

                if (!flags.All(x => x))
                {
                    yield return element;
                }
            }
        }

        public static bool HasDuplicates<TSource, TKey>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector)
        {
            var seenKeys = new HashSet<TKey>();
            foreach (var element in source)
            {
                if (!seenKeys.Add(keySelector(element)))
                {
                    return true;
                }
            }

            return false;
        }

        public static bool IsNullOrEmpty<T>(this IEnumerable<T> source)
        {
            return source == null || !source.Any();
        }

        public static TSource[] EmptyIfNull<TSource>(this IEnumerable<TSource> source)
        {
            return source == null ? EmptyArray<TSource>.Instance : source.ToArray();
        }
    }
}