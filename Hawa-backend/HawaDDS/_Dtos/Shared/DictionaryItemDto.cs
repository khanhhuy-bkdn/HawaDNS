namespace _Dtos.Shared
{
    public class DictionaryItemDto : DictionaryItemDto<string>
    {
        public DictionaryItemDto()
        {
        }

        public DictionaryItemDto(string key, string code) : base(key, code)
        {
        }

        public DictionaryItemDto(string key, string code, string text) : base(key, code)
        {
            Text = text;
        }
    }

    public class DictionaryItemDto<TKey> : DictionaryItemDto<TKey, string>
    {
        public DictionaryItemDto()
        {
        }

        public DictionaryItemDto(TKey key, string code) : base(key, code)
        {
        }
    }

    public class DictionaryItemDto<TKey, TValue>
    {
        public TKey Key { get; set; }

        public TValue Code { get; set; }

        public string Text { get; set; }

        public DictionaryItemDto()
        {
        }

        public DictionaryItemDto(TKey key, TValue code)
        {
            Key = key;
            Code = code;
        }
    }
}