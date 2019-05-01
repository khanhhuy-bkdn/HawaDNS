namespace _Dtos.ServiceResults
{
    public class ServiceResult<T> : ServiceResult

    {
        public T Result { get; set; }

        public static ServiceResult<T> Success(T result)
        {
            return new ServiceResult<T>
            {
                Succeeded = true,
                Result = result,
            };
        }
    }
}