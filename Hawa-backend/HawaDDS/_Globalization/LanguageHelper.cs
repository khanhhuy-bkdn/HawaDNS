using System;
using System.Collections.Generic;

namespace _Globalization
{
    public class LanguageHelper<TValue>
    {
        private readonly Dictionary<string, TValue> cachedValues = new Dictionary<string, TValue>();
        private readonly Func<TValue> initForLanguageFunc;
        private readonly object lockObject = new object();

        public LanguageHelper(Func<TValue> initForLanguageFunc)
        {
            this.initForLanguageFunc = initForLanguageFunc;
        }

        public TValue Get()
        {
            var languageCode = Text.ContextLanguageCode;

            TValue result;
            if (!cachedValues.TryGetValue(languageCode, out result))
            {
                lock (lockObject)
                {
                    if (!cachedValues.TryGetValue(languageCode, out result))
                    {
                        result = initForLanguageFunc();
                        cachedValues.Add(languageCode, result);
                    }
                }
            }

            return result;
        }
    }
}