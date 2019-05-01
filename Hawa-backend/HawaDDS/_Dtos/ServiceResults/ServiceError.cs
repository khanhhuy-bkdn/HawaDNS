namespace _Dtos.ServiceResults
{
    public class ServiceError
    {
        public string Code { get; set; }

        public string Description { get; set; }

        public ServiceError(string code, string description)
        {
            Code = code;
            Description = description;
        }

        public ServiceError()
        {
        }
    }
}