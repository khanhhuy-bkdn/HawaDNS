using System;

using _Common.Runtime.Security;

namespace _Services.Implementations.AD.Helpers
{
    public static class GMCLoginHelper
    {
        public static string EncryptPassword(string passsword)
        {
            return GMCSecurity.Instance.Encrypt(passsword);
        }

        public static bool CheckPassword(string passwordToVerify, string encryptedPassword)
        {
            return EncryptPassword(passwordToVerify).Equals(encryptedPassword, StringComparison.InvariantCulture);
        }
    }
}