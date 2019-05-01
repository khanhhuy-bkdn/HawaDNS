namespace _Common.Exceptions
{
    public class DuplicateCustomerTelException : BusinessException
    {
        public DuplicateCustomerTelException()
        {
        }

        public DuplicateCustomerTelException(string errorMessage) : base(errorMessage)
        {
        }
    }
}