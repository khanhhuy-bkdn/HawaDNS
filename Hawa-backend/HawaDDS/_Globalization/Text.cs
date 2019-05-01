using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml;

namespace _Globalization
{
    public static class Text
    {
        private const string TestFrom = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        private const string TestTo = "âḃčđêƒğĥĩĵķĺṁńőƥɋŕşťũѷŵχŷȥÂḂČĐÊƑĞĤĨĴĶĹṀŃŐƤɊŔŞŤŨѶŴΧŶȤ";

        private static readonly string DefaultLanguageCode = "default";
        private static readonly Dictionary<string, Dictionary<string, string>> AllStringsByLanguage;

        private static readonly Dictionary<char, char> TestReplace;

        static Text()
        {
            TestReplace = Enumerable.Range(0, TestFrom.Length).ToDictionary(x => TestFrom[x], x => TestTo[x]);

            AllStringsByLanguage = new Dictionary<string, Dictionary<string, string>>();
            ReadAllLanguageFilesFromResources();
        }

        private static void ReadAllLanguageFilesFromResources()
        {
            const string FilePrefix = "_Globalization";
            const string FilePostfix = ".xml";

            var assembly = typeof(Messages).Assembly;

            var languageFiles = assembly
                .GetManifestResourceNames()
                .Where(x => x.StartsWith(FilePrefix, StringComparison.InvariantCultureIgnoreCase) && x.EndsWith(FilePostfix, StringComparison.InvariantCultureIgnoreCase))
                .OrderBy(x => x);

            foreach (var languageFile in languageFiles)
            {
                var doc = new XmlDocument();
                using (var stream = assembly.GetManifestResourceStream(languageFile))
                {
                    doc.Load(stream);
                }

                var parts = languageFile.Substring(FilePrefix.Length, languageFile.Length - FilePrefix.Length - FilePostfix.Length).Split('-');
                var prefix = parts[1];

                var languages = doc.SelectNodes("/languages/language");
                foreach (XmlNode language in languages)
                {
                    var languageCode = language.Attributes["id"].Value;
                    ReadLanguage(prefix, languageCode, language.ChildNodes);
                }
            }
        }

        private static void ReadLanguage(string prefix, string languageCode, XmlNodeList childNodes)
        {
            Dictionary<string, string> strings;
            if (!AllStringsByLanguage.TryGetValue(languageCode, out strings))
            {
                strings = new Dictionary<string, string>();
                AllStringsByLanguage[languageCode] = strings;
            }

            ReadNodes(strings, prefix, childNodes);
        }

        private static void ReadNodes(Dictionary<string, string> strings, string path, XmlNodeList childNodes)
        {
            foreach (XmlNode node in childNodes)
            {
                var name = node.Name;
                var currentPath = path + "." + name;
                var innerNodes = node.SelectNodes("*");

                if (innerNodes.Count > 0)
                {
                    ReadNodes(strings, currentPath, innerNodes);
                }
                else
                {
                    strings[currentPath] = ParseFormatString(node.InnerText);
                }
            }
        }

        private static string ParseFormatString(string value)
        {
            bool hasEscapedBraces = false;
            bool hasFormatStrings = false;

            var replace = Regex.Replace(
                value,
                @"{(\d+)(:([a-zA-Z]+))?}",
                m =>
                {
                    int startIndex = m.Groups[0].Index;
                    if (startIndex > 0 && value[startIndex - 1] == '{')
                    {
                        hasEscapedBraces = true;
                        return m.Groups[0].Value;
                    }

                    hasFormatStrings = true;
                    return "{" + int.Parse(m.Groups[1].Value) + "}";
                });

            return hasEscapedBraces && !hasFormatStrings ? replace.Replace("{{", "{").Replace("}}", "}") : replace;
        }

        public static string ContextLanguageCode
        {
            get
            {
                //var context = HttpContext.Current;
                //if (context != null)
                //{
                //    var code = (string)context.Items["LanguageCode"];
                //    if (code != null)
                //    {
                //        return code;
                //    }
                //}
                return "default";
            }

            set
            {
                //var context = HttpContext.Current;
                //if (context != null)
                //{
                //    context.Items["LanguageCode"] = value;
                //}
                //else
                //{
                //    // TODO: Warn
                //}
            }
        }

        public static string GetText<T>(this T model, string key)
        {
            return Get(typeof(T).FullName + "." + key);
        }

        public static string Get(string key)
        {
            return Get(key, ContextLanguageCode);
        }

        private static string Get(string key, string languageCode)
        {
            if (languageCode == "test")
            {
                return ReplaceTestMode(Get(key, DefaultLanguageCode));
            }

            Dictionary<string, string> strings;
            if (!AllStringsByLanguage.TryGetValue(languageCode, out strings))
            {
                if (languageCode != DefaultLanguageCode)
                {
                    return Get(key, Fallback(languageCode));
                }

                return languageCode + "|" + key;
            }

            string value;
            if (strings.TryGetValue(key, out value))
            {
                return value;
            }

            if (languageCode != DefaultLanguageCode)
            {
                return Get(key, Fallback(languageCode));
            }

            return "[[" + key + "]]";
        }

        // For tests only
        internal static string GetWithoutFallbackOrNull(string key, string languageCode)
        {
            Dictionary<string, string> strings;
            if (AllStringsByLanguage.TryGetValue(languageCode, out strings))
            {
                string value;
                if (strings.TryGetValue(key, out value))
                {
                    return value;
                }
            }

            return null;
        }

        // For tests only, will fail for non-existing languageCode
        internal static string[] GetKeysWithoutFallback(string languageCode)
        {
            return AllStringsByLanguage[languageCode].Keys.ToArray();
        }

        private static string Fallback(string languageCode)
        {
            return DefaultLanguageCode;
        }

        private static string ReplaceTestMode(string val)
        {
            if (val.StartsWith("[[") && val.EndsWith("]]"))
            {
                return val;
            }

            var sb = new StringBuilder(val);

            int curlyBracketsCount = 0;

            for (int i = 0; i < sb.Length; i++)
            {
                char currentChar = sb[i];
                char previousChar = i == 0 ? (char)0 : sb[i - 1];

                if (currentChar == '{')
                {
                    if (previousChar == '{')
                    {
                        curlyBracketsCount--;
                    }
                    else
                    {
                        curlyBracketsCount++;
                    }
                }
                else if (currentChar == '}')
                {
                    if (previousChar == '}')
                    {
                        curlyBracketsCount++;
                    }
                    else
                    {
                        curlyBracketsCount--;
                    }
                }
                else if (currentChar == '<')
                {
                    var tag = GetTag(sb, i + 1);
                    if (IsHtmlTag(tag))
                    {
                        i += tag.Length + 1;
                    }
                }
                else if (curlyBracketsCount == 0)
                {
                    if (currentChar == 'n' && previousChar == '\\')
                    {
                        continue;
                    }

                    char replace;
                    if (TestReplace.TryGetValue(currentChar, out replace))
                    {
                        sb[i] = replace;
                    }
                }
            }

            return sb.ToString();
        }

        private static string GetTag(StringBuilder sb, int i)
        {
            int len = 0;
            while (i + len < sb.Length)
            {
                if (sb[i + len] == '>')
                {
                    return sb.ToString().Substring(i, len);
                }

                len++;
            }

            return string.Empty;
        }

        private static bool IsHtmlTag(string tag)
        {
            switch (tag.ToLowerInvariant())
            {
                case "p":
                case "/p":
                case "li":
                case "/li":
                case "ul":
                case "/ul":
                case "strong":
                case "/strong":
                case "br":
                case "br/":
                case "br /":
                    return true;

                default:
                    return false;
            }
        }
    }
}