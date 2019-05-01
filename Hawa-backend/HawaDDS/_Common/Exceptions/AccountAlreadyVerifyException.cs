namespace _Common.Exceptions
{
    public class AccountAlreadyVerifyException : BusinessException
    {
        public AccountAlreadyVerifyException()
        {
        }

        public AccountAlreadyVerifyException(string errorMessage) : base(errorMessage)
        {
        }
    }
}
