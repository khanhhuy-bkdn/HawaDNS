namespace _Common.Exceptions
{
    public class VerifyAccountFailedException : BusinessException
    {
        public VerifyAccountFailedException()
        {
        }

        public VerifyAccountFailedException(string errorMessage) : base(errorMessage)
        {
        }
    }
}
