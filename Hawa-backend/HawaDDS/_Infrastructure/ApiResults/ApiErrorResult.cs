namespace _Infrastructure.ApiResults
{
    public class ApiErrorResult : ApiResult
    {
        public string ErrorCode { get; set; }

        public string ErrorMessage { get; set; }

        public string TechnicalLog { get; internal set; }
    }
}