using System.Collections.Generic;
using System.Linq;

namespace _Dtos.ServiceResults
{
    public class ServiceResult
    {
        private ServiceError[] errors = { };

        public bool Succeeded { get; protected set; }

        public static ServiceResult Success { get; } = new ServiceResult
        {
            Succeeded = true
        };

        public IEnumerable<ServiceError> Errors => errors;

        public static ServiceResult Failed(params ServiceError[] errors)
        {
            var result = new ServiceResult
            {
                Succeeded = false
            };
            if (errors != null)
            {
                result.errors = result.errors.Concat(errors).ToArray();
            }

            return result;
        }

        public override string ToString()
        {
            return Succeeded ? "Succeeded" : string.Format("{0} : {1}", "Failed", string.Join(",", errors.Select(x => x.Code)));
        }
    }
}