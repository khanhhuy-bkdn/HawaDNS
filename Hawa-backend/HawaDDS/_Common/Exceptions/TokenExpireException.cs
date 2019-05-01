namespace _Common.Exceptions
{
    public class TokenExpireException : BusinessException
    {
        public TokenExpireException()
        {
        }

        public TokenExpireException(string errorMessage) : base(errorMessage)
        {
        }
    }
}