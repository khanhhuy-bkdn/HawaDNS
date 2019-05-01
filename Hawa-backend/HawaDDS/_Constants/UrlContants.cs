namespace _Constants
{
    public static class UrlContants
    {
        public const string VerifyUserUrlFormat = "/auth/sign-up/notification?email={0}&activeToken={1}";
        public const string ResetPasswordUserUrlFormat = "/auth/sign-in/change-pass?email={0}&activeToken={1}";
    }
}