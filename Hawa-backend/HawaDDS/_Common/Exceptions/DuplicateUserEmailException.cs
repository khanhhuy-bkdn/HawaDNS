using System;

namespace _Common.Exceptions
{
    public class DuplicateUserEmailException : Exception
    {
        public DuplicateUserEmailException() : base("Duplicate user email")
        {
        }

        public DuplicateUserEmailException(string errorMessage) : base(errorMessage)
        {
        }
    }
}