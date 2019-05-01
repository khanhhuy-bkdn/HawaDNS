namespace _Common.Exceptions
{
    public class DuplicateEmployeeException : BusinessException
    {
        public DuplicateEmployeeException()
        {
        }

        public DuplicateEmployeeException(string errorMessage) : base(errorMessage)
        {
        }
    }
}