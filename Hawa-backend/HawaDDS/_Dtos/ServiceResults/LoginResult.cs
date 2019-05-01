using System.Security.Claims;

using _Common;

namespace _Dtos.ServiceResults
{
    public class LoginResult
    {
        public LoginResultType Result { get; private set; }

        public ClaimsIdentity Identity { get; private set; }

        public LoginResult(LoginResultType result)
        {
            Result = result;
        }

        public LoginResult(ClaimsIdentity identity)
            : this(LoginResultType.Success)
        {
            Identity = identity;
        }
    }
}